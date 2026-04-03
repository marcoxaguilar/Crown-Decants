// ============================================
// Crown Decants — Main JavaScript
// Dynamic Shopify Storefront API Integration
// ============================================

// ---- Config ----
var SHOPIFY_DOMAIN = 'talltinescents.myshopify.com';
var STOREFRONT_TOKEN = '7f7426fc7ebaa1103ab450a1185656e3';
var API_VERSION = '2024-01';

// ---- Sticky nav ----
window.addEventListener('scroll', function() {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
});

// ---- Mobile menu ----
function toggleMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
}
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    }
  });
});

// ---- FAQ toggle ----
function toggleFaq(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

// ---- Newsletter ----
var form = document.getElementById('newsletterForm');
var formMessage = document.getElementById('formMessage');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('subEmail').value.trim();
    if (!email) return;
    var subject = encodeURIComponent('New Crown Decants Subscriber');
    var body = encodeURIComponent('New subscriber email: ' + email + '\n\nThis person signed up via the Crown Decants website newsletter form and is expecting their 10% off code.');
    window.open('mailto:crowndecants1@gmail.com?subject=' + subject + '&body=' + body, '_self');
    formMessage.textContent = '\u2713 You\u2019re in! Check your inbox for your 10% off code.';
    formMessage.style.color = '#C9A84C';
    formMessage.style.display = 'block';
    document.getElementById('subEmail').value = '';
  });
}

// ---- Scroll reveal ----
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });


// ============================================
// DYNAMIC PRODUCT LOADING FROM SHOPIFY
// ============================================

(function() {
  var GRAPHQL_URL = 'https://' + SHOPIFY_DOMAIN + '/api/' + API_VERSION + '/graphql.json';
  var BUY_BUTTON_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

  // Brand mapping for cleaner display
  var brandMap = {
    'afnan': 'Afnan',
    'azzaro': 'Azzaro',
    'baccarat': 'Maison Francis Kurkdjian',
    'burberry': 'Burberry',
    'by the fireplace': 'Maison Margiela',
    'creed': 'Creed',
    'dior': 'Dior',
    'gucci': 'Gucci',
    'mont blanc': 'Montblanc',
    'montblanc': 'Montblanc',
    'mystery': 'Crown Decants',
    'paco': 'Paco Rabanne',
    'polo': 'Ralph Lauren',
    'ralph': 'Ralph Lauren',
    'stronger': 'Armani',
    'versace': 'Versace',
    'ysl': 'Yves Saint Laurent'
  };

  function getBrand(title) {
    var titleLower = title.toLowerCase();
    var keys = Object.keys(brandMap);
    for (var i = 0; i < keys.length; i++) {
      if (titleLower.indexOf(keys[i]) !== -1) {
        return brandMap[keys[i]];
      }
    }
    return 'Crown Decants';
  }

  function getLowestPrice(variants) {
    var lowest = Infinity;
    for (var i = 0; i < variants.length; i++) {
      var price = parseFloat(variants[i].node.price.amount);
      if (price < lowest) lowest = price;
    }
    return lowest;
  }

  function formatPrice(variants) {
    var lowest = getLowestPrice(variants);
    if (variants.length > 1) {
      return 'From $' + lowest.toFixed(2) + ' <span>USD</span>';
    }
    return '$' + lowest.toFixed(2) + ' <span>USD</span>';
  }

  // Fetch all products from Storefront API
  function fetchProducts() {
    var query = '{ products(first: 100, sortKey: BEST_SELLING) { edges { node { id title handle availableForSale priceRange { minVariantPrice { amount currencyCode } } variants(first: 20) { edges { node { id title price { amount currencyCode } availableForSale } } } images(first: 1) { edges { node { url altText } } } } } } }';

    return fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query: query })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.errors) {
        console.error('Shopify API errors:', data.errors);
        return [];
      }
      return data.data.products.edges.map(function(edge) { return edge.node; });
    });
  }

  // Render product cards into the grid
  function renderProducts(products) {
    var grid = document.getElementById('products-grid');
    if (!grid) return;

    // Clear loading state
    grid.innerHTML = '';

    products.forEach(function(product) {
      var imageUrl = '';
      var imageAlt = product.title;
      if (product.images.edges.length > 0) {
        imageUrl = product.images.edges[0].node.url;
        imageAlt = product.images.edges[0].node.altText || product.title;
      }

      var brand = getBrand(product.title);
      var displayName = product.title;
      // Add "Decant" if not already in title
      if (displayName.toLowerCase().indexOf('decant') === -1 && displayName.toLowerCase().indexOf('bundle') === -1) {
        displayName += ' Decant';
      }

      var priceHtml = formatPrice(product.variants.edges);
      var isSoldOut = !product.availableForSale;

      var card = document.createElement('div');
      card.className = 'product-card reveal';
      card.setAttribute('data-handle', product.handle);

      card.innerHTML =
        '<div class="product-img">' +
          (imageUrl ? '<img src="' + imageUrl + '&width=533" alt="' + imageAlt + '" class="product-img-photo" loading="lazy">' : '') +
          (isSoldOut ? '<div class="product-badge" style="background:#C62828;">Sold Out</div>' : '') +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-brand">' + brand + '</div>' +
          '<div class="product-name">' + displayName + '</div>' +
          '<div id="buy-button-' + product.handle + '" class="buy-button-container"></div>' +
        '</div>';

      grid.appendChild(card);

      // Trigger reveal animation with a slight delay
      setTimeout(function() {
        card.classList.add('visible');
      }, 50);
    });

    // After rendering cards, initialize Buy Buttons
    initBuyButtons(products);
  }

  // Initialize Shopify Buy Buttons for all rendered products
  function initBuyButtons(products) {
    function doInit() {
      var client = ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: STOREFRONT_TOKEN
      });

      ShopifyBuy.UI.onReady(client).then(function(ui) {
        var productConfig = {
          variantId: 'all',
          width: '100%',
          contents: { img: false, title: false, price: true, options: true, button: true, quantity: false, description: false },
          styles: {
            product: { 'text-align': 'left', 'margin-top': '0', 'padding': '0' },
            price: {
              'font-family': '"DM Sans", sans-serif',
              'font-size': '15px',
              'font-weight': '600',
              'color': '#1A1A1A',
              'margin-bottom': '6px'
            },
            compareAt: {
              'font-family': '"DM Sans", sans-serif',
              'font-size': '12px',
              'color': '#999',
              'text-decoration': 'line-through',
              'margin-left': '6px'
            },
            button: {
              'background-color': '#C9A84C', 'color': '#0A0A0A',
              'font-family': '"DM Sans", sans-serif', 'font-size': '11px', 'font-weight': '700',
              'letter-spacing': '2px', 'text-transform': 'uppercase',
              'padding': '10px 20px', 'border-radius': '0', 'width': '100%', 'margin-top': '4px',
              ':hover': { 'background-color': '#9A7B2E' },
              ':focus': { 'background-color': '#9A7B2E' }
            },
            options: { 'font-family': '"DM Sans", sans-serif', 'font-size': '12px', 'color': '#555' },
            select: { 'font-family': '"DM Sans", sans-serif', 'font-size': '12px', 'padding': '6px 8px', 'border': '1px solid rgba(0,0,0,0.12)', 'border-radius': '0' },
            label: { 'font-family': '"DM Sans", sans-serif', 'font-size': '10px', 'letter-spacing': '1px', 'text-transform': 'uppercase', 'color': '#999' }
          },
          text: { button: 'ADD TO CART', outOfStock: 'SOLD OUT', unavailable: 'UNAVAILABLE' },
          googleFonts: ['DM Sans']
        };

        var cartConfig = {
          styles: {
            button: {
              'background-color': '#C9A84C', 'color': '#0A0A0A',
              'font-family': '"DM Sans", sans-serif', 'font-size': '13px', 'font-weight': '700',
              'letter-spacing': '2px', 'border-radius': '0',
              ':hover': { 'background-color': '#9A7B2E' },
              ':focus': { 'background-color': '#9A7B2E' }
            },
            title: { 'font-family': '"Playfair Display", serif', 'font-size': '22px', 'font-weight': '700', 'color': '#1A1A1A' },
            header: { 'color': '#1A1A1A' },
            lineItems: { 'font-family': '"DM Sans", sans-serif', 'color': '#555' },
            subtotalText: { 'font-family': '"DM Sans", sans-serif', 'color': '#1A1A1A' },
            subtotal: { 'font-family': '"DM Sans", sans-serif', 'color': '#1A1A1A' },
            notice: { 'font-family': '"DM Sans", sans-serif', 'color': '#555' },
            currency: { 'font-family': '"DM Sans", sans-serif', 'color': '#1A1A1A' },
            close: { 'color': '#1A1A1A', ':hover': { 'color': '#C9A84C' } },
            cart: { 'background-color': '#FAF8F3' },
            footer: { 'background-color': '#FAF8F3' },
            empty: { 'font-family': '"DM Sans", sans-serif', 'color': '#999' }
          },
          text: { title: 'Your Cart', button: 'CHECKOUT', empty: 'Your cart is empty.', notice: 'Shipping and taxes calculated at checkout.' },
          popup: false
        };

        var toggleConfig = {
          styles: {
            toggle: {
              'background-color': '#C9A84C', 'border-radius': '50%', 'padding': '12px',
              ':hover': { 'background-color': '#9A7B2E' },
              ':focus': { 'background-color': '#9A7B2E' }
            },
            count: { 'font-family': '"DM Sans", sans-serif', 'font-size': '12px', 'font-weight': '700' },
            iconPath: { 'fill': '#0A0A0A' }
          }
        };

        products.forEach(function(product) {
          var node = document.getElementById('buy-button-' + product.handle);
          if (node) {
            ui.createComponent('product', {
              handle: product.handle,
              node: node,
              moneyFormat: '%24%7B%7Bamount%7D%7D',
              options: {
                product: productConfig,
                cart: cartConfig,
                toggle: toggleConfig
              }
            });
          }
        });
      });
    }

    // Load Buy Button script if not already loaded
    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      doInit();
    } else {
      var script = document.createElement('script');
      script.async = true;
      script.src = BUY_BUTTON_URL;
      script.onload = doInit;
      document.head.appendChild(script);
    }
  }

  // ---- Kick it off ----
  fetchProducts()
    .then(function(products) {
      if (products.length > 0) {
        renderProducts(products);
      } else {
        // Fallback: show error message
        var grid = document.getElementById('products-grid');
        if (grid) {
          grid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:60px 20px; color:var(--light-gray); font-size:14px;">Unable to load products. Please try refreshing the page.</p>';
        }
      }
    })
    .catch(function(err) {
      console.error('Failed to fetch products:', err);
      var grid = document.getElementById('products-grid');
      if (grid) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:60px 20px; color:var(--light-gray); font-size:14px;">Unable to load products. Please try refreshing the page.</p>';
      }
    });

})();

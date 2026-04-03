// ============================================
// Crown Decants — Main JavaScript
// ============================================

// Sticky nav shadow
window.addEventListener('scroll', function() {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
function toggleMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
}

// Close mobile menu when a nav link is clicked
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

// FAQ toggle
function toggleFaq(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

// Newsletter
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

// Scroll reveal
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });


// ============================================
// Shopify Buy Button Integration
// ============================================
(function() {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  var SHOPIFY_DOMAIN = 'talltinescents.myshopify.com';
  var STOREFRONT_TOKEN = '7f7426fc7ebaa1103ab450a1185656e3';

  var productHandles = [
    'dior-sauvage-edt',
    'baccarat-rouge-540',
    'creed-green-irish-tweed',
    'versace-eros-edt',
    'azzaro-the-most-wanted-edp',
    'stronger-with-you-intensely',
    'afnan-9pm-night-out',
    'afnan-collectors-addition',
    'burberry-hero',
    'by-the-fireplace',
    'creed-viking-cologne',
    'gucci-flora-gorgeous-magnolia',
    'mont-blanc-explorer-edp',
    'montblanc-explorer-platinum',
    'montblanc-explorer-ultra-blue',
    'paco-rabanne-invictus-victory-edp',
    'polo-67',
    'polo-green',
    'polo-red',
    'ralph-s-club-edp',
    'versace-dylan-purple',
    'versace-eros-energy',
    'versace-eros-flame',
    'versace-pour-homme',
    'ysl-l-homme',
    'ysl-myself-edp',
    'ysl-myslf-l-absolu',
    'ysl-saint-laurent-edp',
    'polo-by-ralph-lauren-edt-bundle-pack',
    'mystery-bundle'
  ];

  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: STOREFRONT_TOKEN
    });

    ShopifyBuy.UI.onReady(client).then(function(ui) {
      var productConfig = {
        variantId: 'all',
        width: '100%',
        contents: { img: false, title: false, price: false, options: true, button: true, quantity: false, description: false },
        styles: {
          product: { 'text-align': 'left', 'margin-top': '0', 'padding': '0' },
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

      productHandles.forEach(function(handle) {
        var node = document.getElementById('buy-button-' + handle);
        if (node) {
          ui.createComponent('product', {
            handle: handle,
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

  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    ShopifyBuyInit();
  } else {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
})();

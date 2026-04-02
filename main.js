// Sticky nav shadow
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
});

// FAQ toggle
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// Newsletter — sends directly to crowndecants1@gmail.com
const form = document.getElementById('newsletterForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('subEmail').value.trim();
  if (!email) return;

  const subject = encodeURIComponent('New Crown Decants Subscriber');
  const body = encodeURIComponent('New subscriber email: ' + email + '\n\nThis person signed up via the Crown Decants website newsletter form and is expecting their 10% off code.');
  window.open('mailto:crowndecants1@gmail.com?subject=' + subject + '&body=' + body, '_self');

  formMessage.textContent = '\u2713 You\u2019re in! Check your inbox for your 10% off code.';
  formMessage.style.color = '#C9A84C';
  formMessage.style.display = 'block';
  document.getElementById('subEmail').value = '';
});


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

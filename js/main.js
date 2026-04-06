/* ============================================
   Tribeless GH Heritage LBG — Main JS
   ============================================ */

// ── Navbar scroll effect ──────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile hamburger ──────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    })
  );
}

// ── Active nav link ───────────────────────────
(function markActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Hero background slideshow ─────────────────
(function heroSlideshow() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const images = [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1600&q=80',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=80',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1600&q=80',
  ];
  let idx = 0;
  heroBg.style.backgroundImage = `url('${images[0]}')`;
  setInterval(() => {
    idx = (idx + 1) % images.length;
    heroBg.style.backgroundImage = `url('${images[idx]}')`;
  }, 6000);
})();

// ── Counter animation ─────────────────────────
function animateCounters() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ── Intersection Observer for animations ─────
const ioOptions = { threshold: 0.15 };
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      if (entry.target.classList.contains('stats-trigger')) animateCounters();
      io.unobserve(entry.target);
    }
  });
}, ioOptions);

document.querySelectorAll(
  '.initiative-card, .team-card, .why-card, .about-grid, .stats-trigger'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(
    '.initiative-card, .team-card, .why-card, .about-grid, .stats-trigger'
  ).forEach(el => el.classList.add('animate-in'));
});

document.head.insertAdjacentHTML('beforeend', `<style>
  .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
</style>`);

// ── Donate modal ──────────────────────────────
const modal        = document.getElementById('donateModal');
const modalOverlay = document.getElementById('donateOverlay');
const modalClose   = document.getElementById('modalClose');

function openDonate() {
  if (modalOverlay) modalOverlay.classList.add('open');
}
function closeDonate() {
  if (modalOverlay) modalOverlay.classList.remove('open');
}

document.querySelectorAll('[data-donate]').forEach(btn =>
  btn.addEventListener('click', e => { e.preventDefault(); openDonate(); })
);
if (modalClose) modalClose.addEventListener('click', closeDonate);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeDonate();
  });
}

// ── Donate amount selector ────────────────────
document.querySelectorAll('.donate-amt').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.donate-amt').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const inp = document.querySelector('.donate-custom input');
    if (inp) inp.value = this.dataset.amount || '';
  });
});

// ── Donate form submit (MTN MoMo) ─────────────
const donateForm = document.getElementById('donateForm');
if (donateForm) {
  const MTN_MOMO_NUMBER = '0247302554';
  const MTN_MERCHANT_ID = '606904';

  function getDonateAmount() {
    const amountInput =
      donateForm.querySelector('.donate-custom-input') ||
      donateForm.querySelector('input[type="number"]');
    const amount = Number(amountInput ? amountInput.value : 0);
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  async function copyPaymentDetails(amount) {
    const details = [
      'Tribeless GH Heritage Donation',
      `Amount: GHS ${amount.toFixed(2)}`,
      `MTN Number: ${MTN_MOMO_NUMBER}`,
      `Merchant ID: ${MTN_MERCHANT_ID}`,
    ].join('\n');

    if (!navigator.clipboard || !window.isSecureContext) return false;
    try {
      await navigator.clipboard.writeText(details);
      return true;
    } catch {
      return false;
    }
  }

  function openMomoUssd() {
    // On mobile devices this opens dialer with *170# pre-filled.
    window.location.href = 'tel:*170%23';
  }

  donateForm.addEventListener('submit', e => {
    e.preventDefault();
    const amount = getDonateAmount();
    if (!amount) {
      showNotification('Please enter a valid donation amount.');
      return;
    }

    const submitBtn = donateForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Preparing MTN MoMo...';
    }

    copyPaymentDetails(amount).then(copied => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Pay with MTN MoMo';
      }

      closeDonate();

      const message = copied
        ? `Payment details copied. Dial *170#, choose Merchant Pay, use ID ${MTN_MERCHANT_ID}, then pay GHS ${amount.toFixed(2)}.`
        : `Dial *170#, choose Merchant Pay, use ID ${MTN_MERCHANT_ID}, then pay GHS ${amount.toFixed(2)} to complete your donation.`;
      showNotification(message);

      // Small delay ensures toast appears before dialer navigation.
      setTimeout(openMomoUssd, 180);
    });
  });
}

// ── Contact form ──────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showNotification('Message sent! We\'ll get back to you soon.');
    contactForm.reset();
  });
}

// ── Notification toast ────────────────────────
function showNotification(msg) {
  let n = document.querySelector('.notification');
  if (!n) {
    n = document.createElement('div');
    n.className = 'notification';
    document.body.appendChild(n);
  }
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 4000);
}

// ── Keyboard: ESC closes modal ────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDonate();
});

// ── Smooth image loading with fallback ───────
document.querySelectorAll('img[data-src]').forEach(img => {
  const src = img.dataset.src;
  const tmp = new Image();
  tmp.onload = () => { img.src = src; img.classList.add('loaded'); };
  tmp.onerror = () => { img.style.display = 'none'; };
  tmp.src = src;
});

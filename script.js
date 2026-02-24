/* ============================================
   YUAN CARLO M. CHIN — Portfolio Script
   ============================================ */

/* ── Theme ── */
const applyTheme = (t) => {
  document.documentElement.setAttribute('data-theme', t);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.textContent = t === 'dark' ? '☀' : '◐';
    b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
};

const toggleTheme = () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
};

// Init theme on load
applyTheme(localStorage.getItem('theme') || 'light');
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

/* ── Scroll Progress ── */
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  prog.style.width = (window.scrollY / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

/* ── Active Nav on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ── Mobile Drawer ── */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');

const closeDrawer = () => {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
};

hamburger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close drawer links
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* ── Reveal on Scroll ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Skill Bars ── */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-fill').forEach(b => skillObs.observe(b));

/* ── Modals ── */
const openModal = (id) => {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus the close button for accessibility
  const closeBtn = m.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
};

const closeModal = (id) => {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
};

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => {
    if (e.target === o) {
      o.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(o => {
      o.classList.remove('open');
      document.body.style.overflow = '';
    });
    closeDrawer();
  }
});

// Expose to HTML onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;

/* ── Contact Form ── */
const form = document.getElementById('contact-form');

if (form) {
  const showErr = (id, msg) => {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    const inp = document.getElementById(id.replace('-err', ''));
    if (inp) inp.style.borderColor = '#c0392b';
  };

  const clearErr = (input) => {
    const err = document.getElementById(input.id + '-err');
    if (err) err.style.display = 'none';
    input.style.borderColor = '';
  };

  form.querySelectorAll('input, textarea').forEach(i => {
    i.addEventListener('input', () => clearErr(i));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const n = document.getElementById('name');
    const em = document.getElementById('email');
    const msg = document.getElementById('message');

    if (!n.value.trim()) {
      showErr('name-err', 'Please enter your name.');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) {
      showErr('email-err', 'Please enter a valid email address.');
      valid = false;
    }
    if (msg.value.trim().length < 10) {
      showErr('msg-err', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        document.getElementById('form-success').classList.add('show');
      }, 1200);
    }
  });
}

/* ── Typing Animation ── */
(() => {
  const roles = ['Web Developer', 'UI / UX Designer'];
  const el = document.getElementById('typed-role');
  if (!el) return;

  const typeSpeed = 80;   // ms per character when typing
  const deleteSpeed = 40;   // ms per character when deleting
  const pauseAfter = 2000; // pause after fully typed
  const pauseBefore = 500;  // pause before typing next word

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      // Typing
      charIndex++;
      el.textContent = current.substring(0, charIndex);

      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        isDeleting = true;
        setTimeout(tick, pauseAfter);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      // Deleting
      charIndex--;
      el.textContent = current.substring(0, charIndex);

      if (charIndex === 0) {
        // Finished deleting — move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, pauseBefore);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  // Start typing once the hero section is visible
  const heroRole = el.closest('.hero-role');
  if (heroRole) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(tick, 400); // small delay after reveal animation
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(heroRole);
  } else {
    tick();
  }
})();


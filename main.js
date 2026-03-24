/* ======================================================
   main.js — Academia Super Série v3
   Scroll-Scrub Video · Three.js Hero · Magnetic Buttons
   Stagger Reveals · Counters · Form · Spotlight Cards
   ====================================================== */

'use strict';

/* ────────────────────────────────────────────
   0. UTILS
   ──────────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function lerp(a, b, t) { return a + (b - a) * t; }

/* ────────────────────────────────────────────
   1. SCROLL PROGRESS BAR
   ──────────────────────────────────────────── */
const progressBar = $('#progress-bar');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar && max > 0) {
    progressBar.style.width = (window.scrollY / max * 100) + '%';
  }
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ────────────────────────────────────────────
   2. NAV — scroll class + active link
   ──────────────────────────────────────────── */
const navbar = $('#navbar');
const navAs  = $$('.nav-links a');
const sections = $$('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navAs.forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + current);
  });
}, { passive: true });

/* ────────────────────────────────────────────
   3. HERO STAGGER ENTRANCE
   ──────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Small delay so the browser paints first
  requestAnimationFrame(() => {
    $$('.stagger-1,.stagger-2,.stagger-3,.stagger-4,.stagger-5,.stagger-6').forEach(el => {
      el.classList.add('in');
    });
  });
});

/* ────────────────────────────────────────────
   5. VIDEO SHOWCASE — section #estrutura plays automatically (autoplay loop)
      No scroll-scrub needed.
   ──────────────────────────────────────────── */

/* ────────────────────────────────────────────
   6. SCROLL REVEAL (IntersectionObserver)
   ──────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

$$('.fade-up').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  revealObs.observe(el);
});

/* ────────────────────────────────────────────
   7. ANIMATED COUNTERS
   ──────────────────────────────────────────── */
function animCount(el, target, dec, dur = 1600) {
  let start = null;
  const suffix = el.nextElementSibling?.classList.contains('hstat-suf')
    ? el.nextElementSibling.textContent : '';
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    const v = target * e;
    el.textContent = dec ? v.toFixed(dec) : Math.round(v);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

let countersRun = false;
const counterObs = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting && !countersRun) {
    countersRun = true;
    $$('.hstat-num').forEach((el, i) => {
      const t = parseFloat(el.dataset.target);
      const d = parseInt(el.dataset.dec || '0');
      setTimeout(() => animCount(el, t, d), i * 120);
    });
  }
}, { threshold: 0.5 });

const heroStats = $('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

/* ────────────────────────────────────────────
   8. SPOTLIGHT BORDER CARDS
   ──────────────────────────────────────────── */
$$('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const my = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
    card.style.setProperty('--mx', mx);
    card.style.setProperty('--my', my);
  });
});

/* ────────────────────────────────────────────
   9. MAGNETIC BUTTONS (MOTION_INTENSITY 6)
   ──────────────────────────────────────────── */
$$('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ────────────────────────────────────────────
   10. MODAL CARD TILT (replaces bento-card)
   ──────────────────────────────────────────── */
$$('.modal-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ────────────────────────────────────────────
   11. MOBILE MENU
   ──────────────────────────────────────────── */
const hamburger = $('#hamburger');
const navLinks  = $('#navLinks');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ────────────────────────────────────────────
   12. SMOOTH SCROLL (navbar offset)
   ──────────────────────────────────────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const tgt = document.querySelector(a.getAttribute('href'));
    if (!tgt) return;
    e.preventDefault();
    const offset = (navbar?.offsetHeight || 72) + 16;
    window.scrollTo({ top: tgt.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────
   13. TOAST
   ──────────────────────────────────────────── */
function showToast(msg, duration = 3800) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ────────────────────────────────────────────
   14. CONTACT FORM — Validation + WhatsApp
   ──────────────────────────────────────────── */
const form = $('#contato-form');
if (form) {
  function setError(id, msg) {
    const input = $('#' + id);
    const err   = $('#err-' + id.replace('f-',''));
    if (!input || !err) return;
    if (msg) { input.classList.add('invalid'); err.textContent = msg; }
    else      { input.classList.remove('invalid'); err.textContent = ''; }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name  = $('#f-name').value.trim();
    const tel   = $('#f-tel').value.trim();
    const modal = $('#f-modal').value;

    if (!name)  { setError('f-name', 'Por favor, insira seu nome.'); valid = false; }
    else          setError('f-name', '');
    if (!tel)   { setError('f-tel',  'Por favor, insira seu WhatsApp.'); valid = false; }
    else          setError('f-tel',  '');
    if (!modal) { setError('f-modal','Selecione uma modalidade.'); valid = false; }
    else          setError('f-modal','');

    if (!valid) { showToast('Por favor, preencha todos os campos.'); return; }

    const msg = encodeURIComponent(
      `Olá! 👋 Meu nome é *${name}* e tenho interesse em *${modal}*.\nMeu contato: ${tel}`
    );
    showToast('Abrindo WhatsApp...');
    setTimeout(() => window.open(`https://wa.me/5567926491116?text=${msg}`, '_blank'), 900);
  });

  /* Clear error on focus */
  ['f-name','f-tel','f-modal'].forEach(id => {
    const el = $('#' + id);
    if (el) el.addEventListener('input', () => setError(id, ''));
  });
}

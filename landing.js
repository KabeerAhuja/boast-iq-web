/* Boast IQ landing — interactions */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Nav: scroll state ===== */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== Scroll-triggered stat counters ===== */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    if (el.dataset.done === '1') return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }
    const duration = 1100;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ===== Features vertical tabs (hover-driven with crossfade) ===== */
  const featTabs = document.querySelectorAll('.feat-tab');
  const featImgs = document.querySelectorAll('.feat-img');
  const activateFeat = (tab) => {
    const target = tab.dataset.feat;
    if (tab.classList.contains('active')) return;
    featTabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    featImgs.forEach((img) => {
      img.classList.toggle('active', img.dataset.feat === target);
    });
  };
  featTabs.forEach((tab) => {
    tab.addEventListener('mouseenter', () => activateFeat(tab));
    tab.addEventListener('focus', () => activateFeat(tab));
    tab.addEventListener('click', () => activateFeat(tab));
  });

  /* ===== FAQ: ensure only one open at a time (subtle nicety) ===== */
  const details = document.querySelectorAll('.faq-list details');
  details.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        details.forEach((other) => {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  /* ===== Pricing: Monthly/Yearly billing toggle ===== */
  (function () {
    const toggle = document.getElementById('plan-toggle');
    if (!toggle) return;
    const amountEl = document.getElementById('player-price-amount');
    const unitEl = document.getElementById('player-price-unit');
    const cta = document.getElementById('player-cta');
    const PLANS = {
      monthly: { amount: '$35', unit: '/mo' },
      annual:  { amount: '$25', unit: '/mo' },
    };
    toggle.querySelectorAll('.plan-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const plan = btn.dataset.plan === 'annual' ? 'annual' : 'monthly';
        toggle.querySelectorAll('.plan-toggle-btn').forEach((b) =>
          b.classList.toggle('active', b === btn));
        const p = PLANS[plan];
        if (amountEl) amountEl.textContent = p.amount;
        if (unitEl) unitEl.textContent = p.unit;
        if (cta) cta.href = 'https://app.boast-iq.com/?checkout&plan=' + plan;
      });
    });
  })();

  /* ===== Smooth-scroll offset for sticky nav anchors ===== */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky header ---- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Stat counters ---- */
  const stats = document.querySelectorAll('.stat');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const numEl = el.querySelector('.counter');
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      numEl.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(el => statIo.observe(el));
  } else {
    stats.forEach(el => { el.querySelector('.counter').textContent = el.dataset.count; });
  }

  /* ---- Contact form (envoi réel via FormSubmit.co) ---- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'Merci de compléter les champs obligatoires.';
        note.classList.remove('is-success');
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      note.textContent = 'Envoi en cours…';
      note.classList.remove('is-success');

      const action = form.getAttribute('action').replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
      fetch(action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then((res) => { if (!res.ok) throw new Error('network'); return res.json(); })
        .then((data) => {
          if (data && data.success === 'false') throw new Error(data.message || 'pending');
          note.textContent = 'Merci ! Votre message a bien été envoyé — nous revenons vers vous rapidement.';
          note.classList.add('is-success');
          form.reset();
        })
        .catch(() => {
          note.textContent = "L'envoi a échoué. Vous pouvez nous appeler au 06 64 43 86 01 ou écrire à contact@christophefu.com.";
          note.classList.remove('is-success');
        })
        .finally(() => { submitBtn.disabled = false; });
    });
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

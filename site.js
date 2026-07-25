(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
  }

  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dots = [...carousel.querySelectorAll('.dot')];
    let index = 0;
    let interval;
    let startX = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.classList.toggle('active', i === index); slide.setAttribute('aria-hidden', String(i !== index)); });
      dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); dot.setAttribute('aria-selected', String(i === index)); });
    };
    const stop = () => clearInterval(interval);
    const start = () => { stop(); if (!reducedMotion) interval = setInterval(() => show(index + 1), 4500); };
    carousel.querySelectorAll('[data-carousel]').forEach((button) => button.addEventListener('click', () => { show(index + (button.dataset.carousel === 'next' ? 1 : -1)); start(); }));
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    carousel.addEventListener('mouseenter', stop); carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop); carousel.addEventListener('focusout', start);
    carousel.addEventListener('touchstart', (event) => { startX = event.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (event) => { const delta = event.changedTouches[0].screenX - startX; if (Math.abs(delta) > 45) show(index + (delta < 0 ? 1 : -1)); }, { passive: true });
    start();
  }

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const { name, email, message } = form.elements;
      const subject = encodeURIComponent(`Portfolio message from ${name.value}`);
      const body = encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`);
      status.textContent = 'Your email app will open with your message ready to send.';
      status.className = 'form-status success show';
      window.location.href = `mailto:chitisonx@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();

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

  const certCarousel = document.querySelector('.cert-carousel');
  if (certCarousel) {
    const track = certCarousel.querySelector('.cert-track');
    const dots = certCarousel.querySelector('.cert-dots');
    const emptyMessage = certCarousel.querySelector('.cert-empty');
    const filters = [...document.querySelectorAll('[data-cert-filter]')];
    const controls = [...certCarousel.querySelectorAll('[data-cert-direction]')];

    // Add future credentials here; filtering and carousel controls update automatically.
    const certifications = [
      { title: 'HTML Certification', organization: 'Independent coursework', category: 'Web Development', issueDate: '2026', credentialUrl: 'Assets/icons8-html-96.png', image: 'Assets/icons8-html-96.png', description: 'Semantic HTML, document structure, forms, and accessible page foundations.' },
      { title: 'CSS Certification', organization: 'Independent coursework', category: 'Web Development', issueDate: '2026', credentialUrl: 'Assets/icons8-css-96.png', image: 'Assets/icons8-css-96.png', description: 'Modern CSS styling, layouts, responsive design, and visual presentation.' },
      { title: 'JavaScript Certification', organization: 'Codedex', category: 'Web Development', issueDate: 'February 26, 2026', credentialUrl: 'Assets/IMG_5228.jpeg', image: 'Assets/IMG_5228.jpeg', description: 'JavaScript fundamentals, loops, arrays, functions, objects, HTML, and CSS.' },
      { title: 'Responsive Web Design Certification', organization: 'freeCodeCamp', category: 'Web Development', issueDate: 'February 17, 2026 · ~300 hours', credentialUrl: 'https://freecodecamp.org/certification/xavierchitison/responsive-web-design', image: 'Assets/Csscert copy.png', description: 'Responsive design, HTML, CSS, and accessible web development.' },
      { title: 'Programming Foundations with Python', organization: 'CodeSignal', category: 'Programming', issueDate: 'November 19, 2025', credentialUrl: 'Assets/Python1.pdf', image: 'Assets/Python2.jpg', description: 'General programming, algorithms, and Python foundations.' }
    ];
    let index = 0;
    let timer;
    let startX = 0;
    let visibleCertifications = certifications;
    let renderVersion = 0;
    const createSlide = (certification) => {
      const external = certification.credentialUrl.startsWith('http');
      return `<div class="cert-slide"><article class="card cert-card"><img src="${certification.image}" alt="${certification.title} badge" loading="lazy"><div class="cert-body"><p class="eyebrow">${certification.organization}</p><h3>${certification.title}</h3><p class="meta">Earned ${certification.issueDate}</p><p>${certification.description}</p><a class="button secondary" href="${certification.credentialUrl}" target="_blank"${external ? ' rel="noopener noreferrer"' : ''}>View credential</a></div></article></div>`;
    };
    const render = (category) => {
      visibleCertifications = category === 'All' ? certifications : certifications.filter((certification) => certification.category === category);
      index = 0;
      const currentRender = ++renderVersion;
      track.classList.add('is-changing');
      window.setTimeout(() => {
        if (currentRender !== renderVersion) return;
        track.innerHTML = visibleCertifications.map(createSlide).join('');
        track.classList.toggle('is-single', visibleCertifications.length === 1);
        emptyMessage.hidden = visibleCertifications.length !== 0;
        controls.forEach((control) => { control.disabled = visibleCertifications.length < 2; });
        track.classList.remove('is-changing');
        update();
      }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160);
    };
    const drawDots = () => {
      dots.innerHTML = '';
      Array.from({ length: getMaxIndex() + 1 }, (_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button'; dot.className = `cert-dot${i === index ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Show certification set ${i + 1}`);
        dot.addEventListener('click', () => { index = i; update(); restart(); });
        dots.append(dot);
      });
    };
    const getSlidesPerView = () => matchMedia('(min-width: 1024px)').matches ? 3 : 1;
    const getMaxIndex = () => Math.max(0, visibleCertifications.length - getSlidesPerView());
    const update = () => {
      const slides = [...track.querySelectorAll('.cert-slide')];
      if (!slides.length) { track.style.transform = 'translateX(0)'; dots.innerHTML = ''; return; }
      index = Math.min(Math.max(index, 0), getMaxIndex());
      track.style.transform = `translateX(-${index * slides[0].offsetWidth}px)`;
      drawDots();
    };
    const move = (amount) => {
      const positions = getMaxIndex() + 1;
      index = (index + amount + positions) % positions;
      update();
    };
    const stop = () => clearInterval(timer);
    const restart = () => { stop(); if (visibleCertifications.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => move(1), 5000); };
    controls.forEach((button) => button.addEventListener('click', () => { move(button.dataset.certDirection === 'next' ? 1 : -1); restart(); }));
    certCarousel.addEventListener('mouseenter', stop); certCarousel.addEventListener('mouseleave', restart);
    certCarousel.addEventListener('keydown', (event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); restart(); } });
    certCarousel.addEventListener('touchstart', (event) => { startX = event.changedTouches[0].screenX; }, { passive: true });
    certCarousel.addEventListener('touchend', (event) => { const delta = event.changedTouches[0].screenX - startX; if (Math.abs(delta) > 45) { move(delta < 0 ? 1 : -1); restart(); } }, { passive: true });
    filters.forEach((filter) => filter.addEventListener('click', () => {
      const category = filter.dataset.certFilter;
      filters.forEach((item) => { item.classList.toggle('active', item === filter); item.setAttribute('aria-pressed', String(item === filter)); });
      stop(); render(category); restart();
    }));
    window.addEventListener('resize', update); render('All'); restart();
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

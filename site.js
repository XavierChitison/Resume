(() => {
  const brand = document.querySelector('.brand');
  if (brand) {
    const name = 'Xavier';
    const word = document.createElement('span');
    word.className = 'brand-word';
    word.setAttribute('aria-hidden', 'true');
    [...name].forEach((letter, index) => {
      const character = document.createElement('span');
      character.className = 'brand-letter';
      character.style.setProperty('--letter-delay', `${index * 75}ms`);
      character.textContent = letter;
      word.append(character);
    });
    const accent = document.createElement('span');
    accent.className = 'brand-accent';
    accent.setAttribute('aria-hidden', 'true');
    accent.textContent = '.';
    const idea = document.createElement('span');
    idea.className = 'brand-idea';
    idea.setAttribute('aria-hidden', 'true');
    idea.innerHTML = `
      <svg class="brand-bulb" viewBox="0 0 32 32" focusable="false">
        <g class="bulb-rays">
          <path d="M16 2v3M6.1 6.1l2.2 2.2M25.9 6.1l-2.2 2.2M2 16h3M27 16h3"/>
        </g>
        <path class="bulb-glass" d="M23.5 15.1c0 2.8-1.5 4.7-3.4 6.3-.7.6-1.1 1.4-1.1 2.3h-6c0-.9-.4-1.7-1.1-2.3-1.9-1.6-3.4-3.5-3.4-6.3a7.5 7.5 0 0 1 15 0Z"/>
        <path class="bulb-filament" d="m13 16 3 3 3-3M16 19v4"/>
        <path class="bulb-base" d="M13 24h6M13.8 27h4.4"/>
      </svg>`;
    brand.replaceChildren(word, accent, idea);
    brand.setAttribute('aria-label', 'Xavier — Home');
    brand.classList.add('brand-ready');
  }

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

  const aboutCarousel = document.querySelector('[data-about-carousel]');
  if (aboutCarousel) {
    const aboutSlides = [
      { src: 'Assets/Headershot1-web.jpg', alt: 'Xavier Chitison professional portrait', caption: 'Focused on building, learning, and growing.', position: 'position-center' },
      { src: 'Assets/Headershot2.jpg', alt: 'Xavier Chitison professional headshot in a black suit', caption: 'Bringing focus and professionalism to every opportunity.', position: 'position-center' },
      { src: 'Assets/Headershot3-web.jpg', alt: 'Xavier Chitison portfolio headshot', caption: 'A professional approach to every opportunity.', position: 'position-left' },
      { src: 'Assets/Headershot4-web.jpg', alt: 'Xavier Chitison professional photo at graduation', caption: 'Curiosity and creativity in action.', position: 'position-left' },
      { src: 'Assets/Headershot5.jpg', alt: 'Xavier Chitison receiving recognition at graduation', caption: 'Ready to collaborate and solve meaningful problems.', position: 'position-right' },
      { src: 'Assets/Headershot6-web.jpg', alt: 'Xavier Chitison with technology mentors', caption: 'Continuing to learn through every challenge.', position: 'position-far-right' },
      { src: 'Assets/Headershot7-web.jpg', alt: 'Xavier Chitison professional classroom portrait', caption: 'Building toward a career in software development.', position: 'position-lower' }
    ];
    const viewport = aboutCarousel.querySelector('.carousel-viewport');
    const dotWrap = aboutCarousel.querySelector('.dot-wrap');
    viewport.innerHTML = aboutSlides.map((slide, index) => `
      <figure class="carousel-slide${index === 0 ? ' active' : ''}" aria-hidden="${index !== 0}">
        <img class="slide-image ${slide.position}" src="${slide.src}" alt="${slide.alt}"${index === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
        <figcaption>${slide.caption}</figcaption>
      </figure>`).join('');
    dotWrap.innerHTML = aboutSlides.map((slide, index) =>
      `<button class="dot${index === 0 ? ' active' : ''}" type="button" role="tab" aria-selected="${index === 0}" aria-label="Show photo ${index + 1}: ${slide.alt}"></button>`
    ).join('');
  }

  const carousel = document.querySelector('.carousel');
  if (carousel) {
    let slides = [...carousel.querySelectorAll('.carousel-slide')];
    let dots = [...carousel.querySelectorAll('.dot')];
    const controls = carousel.querySelector('.carousel-controls');
    const dotWrap = carousel.querySelector('.dot-wrap');
    let index = 0;
    let interval;
    let startX = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = (next) => {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.classList.toggle('active', i === index); slide.setAttribute('aria-hidden', String(i !== index)); });
      dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); dot.setAttribute('aria-selected', String(i === index)); });
    };
    const stop = () => clearInterval(interval);
    const start = () => { stop(); if (slides.length > 1 && !reducedMotion) interval = setInterval(() => show(index + 1), 4500); };
    if (controls) controls.hidden = slides.length < 2;
    carousel.querySelectorAll('[data-carousel]').forEach((button) => button.addEventListener('click', () => { show(index + (button.dataset.carousel === 'next' ? 1 : -1)); start(); }));
    if (dotWrap) dotWrap.addEventListener('click', (event) => {
      const dot = event.target.closest('.dot');
      if (!dot || !dotWrap.contains(dot)) return;
      show(dots.indexOf(dot));
      start();
    });
    slides.forEach((slide) => {
      const image = slide.querySelector('img');
      let errorHandled = false;
      const handleError = () => {
        if (errorHandled) return;
        errorHandled = true;
        const failedPath = image.getAttribute('src');
        console.error(`Failed to load slideshow image: ${failedPath}`);
        const failedIndex = slides.indexOf(slide);
        slide.remove();
        dots[failedIndex]?.remove();
        if (failedIndex < index) index -= 1;
        slides = [...carousel.querySelectorAll('.carousel-slide')];
        dots = [...carousel.querySelectorAll('.dot')];
        index = Math.min(index, Math.max(0, slides.length - 1));
        if (controls) controls.hidden = slides.length < 2;
        show(index);
        start();
      };
      image.addEventListener('error', handleError, { once: true });
      if (image.complete && image.naturalWidth === 0) queueMicrotask(handleError);
    });
    carousel.addEventListener('mouseenter', stop); carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop); carousel.addEventListener('focusout', start);
    carousel.addEventListener('keydown', (event) => {
      if (slides.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
        start();
      }
    });
    carousel.addEventListener('touchstart', (event) => { startX = event.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (event) => { const delta = event.changedTouches[0].screenX - startX; if (Math.abs(delta) > 45) show(index + (delta < 0 ? 1 : -1)); }, { passive: true });
    start();
  }

  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  if (testimonialCarousel) {
    // Add future testimonials here; controls and autoplay enable automatically.
    const testimonials = [
      {
        name: 'Patrick Danko',
        role: 'Whitehall Yearling High School Engineering Teacher',
        organization: 'Whitehall Yearling High School',
        quote: 'Xavier is a motivated and hardworking software engineering student who consistently demonstrates curiosity, dedication, and a strong willingness to learn. He takes initiative, asks the right questions, and strives to improve with every project he works on. Xavier brings a positive attitude, solid technical skills, and a growth mindset to every challenge. Any team would benefit from his determination, adaptability, and drive to succeed.',
        image: 'Assets/Testimony.PNG',
        imageAlt: 'Patrick Danko, Whitehall Yearling High School Engineering Teacher',
        logo: null
      }
    ];
    const track = testimonialCarousel.querySelector('.testimonial-track');
    const controls = testimonialCarousel.querySelector('.testimonial-controls');
    const dots = testimonialCarousel.querySelector('.testimonial-dots');
    const directionButtons = [...testimonialCarousel.querySelectorAll('[data-testimonial-direction]')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer;
    let startX = 0;

    const render = () => {
      const testimonial = testimonials[index];
      track.innerHTML = `
        <article class="testimonial-card" aria-label="Testimonial ${index + 1} of ${testimonials.length}">
          <i class="fa-solid fa-quote-left testimonial-quote-icon" aria-hidden="true"></i>
          <blockquote><p>“${testimonial.quote}”</p></blockquote>
          <footer class="testimonial-person">
            <img src="${testimonial.image}" alt="${testimonial.imageAlt}" loading="lazy">
            <div>
              <cite>${testimonial.name}</cite>
              <p>${testimonial.role}</p>
            </div>
          </footer>
        </article>`;
      dots.innerHTML = testimonials.map((item, dotIndex) =>
        `<button class="dot${dotIndex === index ? ' active' : ''}" type="button" role="tab" aria-selected="${dotIndex === index}" aria-label="Show testimonial ${dotIndex + 1} from ${item.name}" data-testimonial-index="${dotIndex}"></button>`
      ).join('');
      dots.querySelectorAll('[data-testimonial-index]').forEach((dot) => {
        dot.addEventListener('click', () => {
          show(Number(dot.dataset.testimonialIndex));
          restart();
        });
      });
    };
    const show = (next) => {
      index = (next + testimonials.length) % testimonials.length;
      track.classList.add('is-changing');
      window.setTimeout(() => {
        render();
        track.classList.remove('is-changing');
      }, reducedMotion ? 0 : 180);
    };
    const stop = () => clearInterval(timer);
    const restart = () => {
      stop();
      if (testimonials.length > 1 && !reducedMotion) {
        timer = setInterval(() => show(index + 1), 7000);
      }
    };

    controls.hidden = testimonials.length < 2;
    directionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        show(index + (button.dataset.testimonialDirection === 'next' ? 1 : -1));
        restart();
      });
    });
    testimonialCarousel.addEventListener('mouseenter', stop);
    testimonialCarousel.addEventListener('mouseleave', restart);
    testimonialCarousel.addEventListener('focusin', stop);
    testimonialCarousel.addEventListener('focusout', restart);
    testimonialCarousel.addEventListener('keydown', (event) => {
      if (testimonials.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
        restart();
      }
    });
    testimonialCarousel.addEventListener('touchstart', (event) => {
      startX = event.changedTouches[0].screenX;
    }, { passive: true });
    testimonialCarousel.addEventListener('touchend', (event) => {
      const delta = event.changedTouches[0].screenX - startX;
      if (testimonials.length > 1 && Math.abs(delta) > 45) {
        show(index + (delta < 0 ? 1 : -1));
        restart();
      }
    }, { passive: true });
    render();
    restart();
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
      { title: 'The Origins I: HTML', category: 'Web Development', image: 'Assets/Htmlcert.jpeg', issuer: 'Codédex', date: 'February 1, 2026', credentialUrl: 'Assets/Htmlcert.jpeg', description: 'Essential HTML elements, attributes, forms, and semantic markup.', altText: 'Codédex The Origins I HTML certificate awarded to Xavier Chitison' },
      { title: 'The Origins II: CSS', category: 'Web Development', image: 'Assets/CSSCert.jpg', issuer: 'Codédex', date: 'February 13, 2026', credentialUrl: 'Assets/CSSCert.jpg', description: 'CSS selectors, properties, the box model, and layout fundamentals.', altText: 'Codédex The Origins II CSS certificate awarded to Xavier Chitison' },
      { title: 'The Origins III: JavaScript', category: 'Web Development', image: 'Assets/JavaScriptCert.jpeg', issuer: 'Codédex', date: 'February 26, 2026', credentialUrl: 'Assets/JavaScriptCert.jpeg', description: 'JavaScript variables, conditionals, loops, arrays, functions, objects, and HTML/CSS integration.', altText: 'Codédex The Origins III JavaScript certificate awarded to Xavier Chitison' },
      { title: 'Introduction to HTML', category: 'Web Development', image: 'Assets/Htmlcert2.jpg', issuer: 'CodeSignal', date: 'November 19, 2025', credentialUrl: 'Assets/Htmlcert2.jpg', description: 'HTML, CSS, and web browser fundamentals from a front-end engineering learning path.', altText: 'CodeSignal Introduction to HTML certificate awarded to Xavier Chitison' },
      { title: 'Legacy Responsive Web Design V8', category: 'Web Development', image: 'Assets/ResponsiveCert.png', issuer: 'freeCodeCamp', date: 'February 17, 2026 · approximately 300 hours', credentialUrl: 'https://freecodecamp.org/certification/xavierchitison/responsive-web-design', description: 'Responsive web design and accessible front-end development.', altText: 'freeCodeCamp Legacy Responsive Web Design V8 certification awarded to Xavier Chitison' },
      { title: 'The Legend of Python', category: 'Programming', image: 'Assets/Pythoncert1.pdf', issuer: 'Codédex', date: 'January 25, 2026', credentialUrl: 'Assets/Pythoncert1.pdf', description: 'Python fundamentals including variables, control flow, loops, lists, functions, classes, objects, and modules.', altText: 'Codédex The Legend of Python certificate awarded to Xavier Chitison' },
      { title: 'Programming Foundations with Python', category: 'Programming', image: 'Assets/Pythoncert2.jpg', issuer: 'CodeSignal', date: 'November 19, 2025', credentialUrl: 'Assets/Pythoncert2.jpg', description: 'General programming concepts and algorithms using Python.', altText: 'CodeSignal Programming Foundations with Python certificate awarded to Xavier Chitison' },
      { title: 'Fundamentals of Machine Learning and Artificial Intelligence', category: 'Cloud & AI', image: 'Assets/Ai.jpeg', issuer: 'AWS Training & Certification', date: 'November 19, 2025', credentialUrl: 'Assets/Ai.jpeg', description: 'Foundational concepts in machine learning and artificial intelligence.', altText: 'AWS Fundamentals of Machine Learning and Artificial Intelligence completion certificate awarded to Xavier Chitison' },
      { title: 'Solutions Architecture Job Simulation', category: 'Cloud & AI', image: 'Assets/Solutionscert.jpeg', issuer: 'AWS and Forage', date: 'November 23, 2025', credentialUrl: 'Assets/Solutionscert.jpeg', description: 'Designing a simple, scalable hosting architecture.', altText: 'AWS and Forage Solutions Architecture Job Simulation certificate awarded to Xavier Chitison' },
      { title: 'Software Engineering Job Simulation', category: 'Software Engineering', image: 'Assets/Softwarecert.jpeg', issuer: 'Forage', date: 'November 23, 2025', credentialUrl: 'Assets/Softwarecert.jpeg', description: 'Practical software engineering tasks involving data-model creation and implementation.', altText: 'Forage Software Engineering Job Simulation certificate awarded to Xavier Chitison' },
      { title: 'Customer Service Foundations', category: 'Professional Skills', image: 'Assets/Linkedincert.jpeg', issuer: 'LinkedIn Learning', date: 'November 22, 2025', credentialUrl: 'Assets/Linkedincert.jpeg', description: 'Customer support and customer service foundations.', altText: 'LinkedIn Learning Customer Service Foundations certificate completed by Xavier Chitison' }
    ];
    let index = 0;
    let timer;
    let startX = 0;
    let visibleCertifications = certifications;
    let renderVersion = 0;
    const createSlide = (certification) => {
      const external = certification.credentialUrl.startsWith('http');
      const media = certification.image.endsWith('.pdf')
        ? `<object data="${certification.image}#page=1&view=FitH" type="application/pdf" aria-label="${certification.altText}"><a href="${certification.image}">View ${certification.title}</a></object>`
        : `<img src="${certification.image}" alt="${certification.altText}" loading="lazy">`;
      return `<div class="cert-slide"><article class="card cert-card">${media}<div class="cert-body"><p class="eyebrow">${certification.issuer}</p><h3>${certification.title}</h3><p class="meta">Earned ${certification.date}</p><p>${certification.description}</p><a class="button secondary" href="${certification.credentialUrl}" target="_blank"${external ? ' rel="noopener noreferrer"' : ''}>View credential</a></div></article></div>`;
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

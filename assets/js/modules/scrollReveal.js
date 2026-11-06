export function initScrollReveal() {
  const splitRevealLine = (line) => {
    if (line.dataset.splitReady === '1') return;

    const target = line.querySelector('em') || line;
    const raw = (target.textContent || '').replace(/\s+/g, ' ').trim();
    if (!raw) return;

    const words = raw.split(' ');
    target.innerHTML = words.map((word, i) => {
      const tail = i < words.length - 1 ? '<span class="reveal-space"> </span>' : '';
      return `<span class="reveal-word"><span class="reveal-word-inner">${word}</span></span>${tail}`;
    }).join('');

    line.dataset.splitReady = '1';
  };

  // Section titles: cinematic per-word text reveal.
  document.querySelectorAll('.s-title .reveal-line, .contact-title .reveal-line').forEach((line) => {
    splitRevealLine(line);

    const title = line.closest('.s-title');
    const words = line.querySelectorAll('.reveal-word-inner');
    if (!words.length) return;

    if (title) title.classList.add('is-kinetic-title');
    gsap.set(words, {
      yPercent: 120,
      rotateX: -65,
      opacity: 0,
      transformOrigin: '50% 100%',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: line,
        start: 'top 86%',
        end: 'top 42%',
        scrub: 0.6,
      },
    });

    tl.to(line, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.5,
      ease: 'power2.out',
    }, 0)
      .to(words, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      }, 0.02);
  });

  const sectionStoriesEnabled =
    window.matchMedia('(min-width: 769px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fallback (mobile/reduced-motion): light shared title movement.
  if (!sectionStoriesEnabled) {
    document.querySelectorAll('.section .s-title, .section .contact-title').forEach((title) => {
      const section = title.closest('.section');
      if (!section) return;

      gsap.fromTo(title,
        { yPercent: 0, scale: 1, filter: 'none' },
        {
          yPercent: -8,
          scale: 1.012,
          filter: 'none',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        }
      );
    });
  }

  // Desktop cinematic balanced: each section gets a distinct scroll-scrubbed story.
  if (sectionStoriesEnabled) {
    const createSectionStory = ({
      sectionId,
      titleSelector,
      mainSelector,
      itemSelector,
      extraSelector,
      triggerStart = 'top 84%',
      triggerEnd = 'top 24%',
      mainDriftY = -28,
      mainFrom = { y: 80, opacity: 0, scale: 0.94 },
      itemFrom = { y: 64, opacity: 0, scale: 0.9, rotateX: -10, transformOrigin: '50% 100%' },
      extraFrom = { y: 48, opacity: 0 },
      mainTo = {},
      itemTo = {},
      extraTo = {},
      itemStagger = 0.08,
    }) => {
      const section = document.querySelector(sectionId);
      if (!section) return;

      const container = section.querySelector('.container');
      const title = section.querySelector(titleSelector);
      const label = section.querySelector('.s-label');
      const main = mainSelector ? section.querySelector(mainSelector) : null;
      const items = itemSelector ? section.querySelectorAll(itemSelector) : [];
      const extras = extraSelector ? section.querySelectorAll(extraSelector) : [];

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section,
          start: triggerStart,
          end: triggerEnd,
          scrub: 0.75,
        },
      });

      if (label) {
        tl.fromTo(label,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
        0);
      }

      if (title) {
        tl.fromTo(title,
          { y: 44, opacity: 0.15, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55 },
        0.02);
      }

      if (main) {
        tl.fromTo(main, mainFrom, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.85,
          ...mainTo,
        }, 0.05);
      }

      if (items.length) {
        tl.fromTo(items, itemFrom, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.75,
          stagger: itemStagger,
          ...itemTo,
        }, 0.12);
      }

      if (extras.length) {
        tl.fromTo(extras, extraFrom, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.68,
          stagger: 0.06,
          ...extraTo,
        }, 0.15);
      }

      // Smooth continuous parallax drift on the container wrapper (no property conflict with children)
      if (container) {
        gsap.fromTo(container,
          { y: 18 },
          {
            y: mainDriftY,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          }
        );
      }
    };

    createSectionStory({
      sectionId: '#about',
      titleSelector: '.s-title',
      mainSelector: '.about-layout',
      itemSelector: '.about-right .spec-card',
      extraSelector: '.about-left .reveal-p',
      triggerStart: 'top 82%',
      triggerEnd: 'top 38%',
      mainDriftY: -28,
      mainFrom: { x: -48, y: 90, opacity: 0, scale: 0.92 },
      itemFrom: { x: 84, y: 44, opacity: 0, scale: 0.9, rotateY: -14, transformOrigin: '100% 50%' },
      extraFrom: { y: 54, opacity: 0 },
      itemStagger: 0.09,
    });

    createSectionStory({
      sectionId: '#skills',
      titleSelector: '.s-title',
      mainSelector: '.skills-layout',
      itemSelector: '.skill-cat',
      triggerStart: 'top 82%',
      triggerEnd: 'top 38%',
      mainDriftY: -30,
      mainFrom: { y: 96, opacity: 0, scale: 0.9 },
      itemFrom: { y: 96, opacity: 0, scale: 0.84, rotateX: -16, transformOrigin: '50% 100%' },
      itemStagger: 0.09,
    });

    createSectionStory({
      sectionId: '#projects',
      titleSelector: '.s-title',
      mainSelector: '.proj-scroll-wrapper',
      extraSelector: '.proj-progress',
      triggerStart: 'top 82%',
      triggerEnd: 'top 38%',
      mainDriftY: -26,
      mainFrom: { x: 96, y: 76, opacity: 0, scale: 0.92 },
      extraFrom: { scaleX: 0.08, opacity: 0.18, transformOrigin: '0% 50%' },
      extraTo: { scaleX: 1, opacity: 1 },
    });

    createSectionStory({
      sectionId: '#experience',
      titleSelector: '.s-title',
      mainSelector: '.exp-list',
      itemSelector: '.exp-item',
      triggerStart: 'top 82%',
      triggerEnd: 'top 36%',
      mainDriftY: -28,
      mainFrom: { y: 80, opacity: 0, scale: 0.94 },
      itemFrom: {
        x: (_, i) => (i % 2 === 0 ? -76 : 76),
        y: 36,
        opacity: 0,
        scale: 0.92,
      },
      itemStagger: 0.1,
    });

    createSectionStory({
      sectionId: '#certifications',
      titleSelector: '.s-title',
      mainSelector: '.certs-list',
      itemSelector: '.cert-item',
      triggerStart: 'top 82%',
      triggerEnd: 'top 36%',
      mainDriftY: -28,
      mainFrom: { y: 80, opacity: 0, scale: 0.94 },
      itemFrom: {
        x: (_, i) => (i % 2 === 0 ? -84 : 84),
        y: 32,
        opacity: 0,
        scale: 0.92,
      },
      itemStagger: 0.075,
    });

    createSectionStory({
      sectionId: '#contact',
      titleSelector: '.contact-title',
      mainSelector: '.contact-links',
      itemSelector: '.c-link',
      extraSelector: '.contact-sub',
      triggerStart: 'top 88%',
      triggerEnd: 'top 55%',
      mainDriftY: -20,
      mainFrom: { y: 72, opacity: 0, scale: 0.92 },
      itemFrom: { y: 84, opacity: 0, scale: 0.86 },
      extraFrom: { y: 52, opacity: 0 },
      itemStagger: 0.1,
    });
  }

  // Fallback paragraph reveal for mobile/reduced-motion mode.
  if (!sectionStoriesEnabled) {
    document.querySelectorAll('.reveal-p').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay: (i % 3) * 0.07,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  // Strong words pulse in as sections appear.
  document.querySelectorAll('.reveal-p strong').forEach((el) => {
    gsap.fromTo(el,
      {
        color: 'rgb(240, 237, 230)',
        textShadow: '0 0 0 rgba(100,255,218,0)',
      },
      {
        color: '#bfffee',
        textShadow: '0 0 16px rgba(100,255,218,0.35)',
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Fallback card reveal for mobile/reduced-motion mode.
  if (!sectionStoriesEnabled) {
    document.querySelectorAll('.section').forEach((section) => {
      const cards = section.querySelectorAll('.reveal-card');
      if (!cards.length) return;

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          toggleActions: 'play none none none',
        },
      });
    });
  }
}

export function initCounters() {
  document.querySelectorAll('.h-stat-n[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const obj    = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate() {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
  });
}

export function initSmoothAnchors() {
  const NAV_HEIGHT = 72;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

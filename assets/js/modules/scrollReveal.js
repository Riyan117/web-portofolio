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
      yPercent: 130,
      rotateX: -78,
      opacity: 0,
      filter: 'blur(10px)',
      transformOrigin: '50% 100%',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: line,
        start: 'top 87%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(line, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.78,
      ease: 'power3.out',
    }, 0)
      .to(words, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.02,
        stagger: 0.065,
        ease: 'expo.out',
      }, 0.03);
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

  // Desktop cinematic balanced: each section gets a distinct scroll story.
  if (sectionStoriesEnabled) {
    const createSectionStory = ({
      sectionId,
      titleSelector,
      mainSelector,
      itemSelector,
      extraSelector,
      triggerStart = 'top 88%',
      titleDriftY = -20,
      mainDriftX = 0,
      mainDriftY = -26,
      itemDriftY = -14,
      extraDriftY = -10,
      mainFrom = { y: 120, opacity: 0, scale: 0.9, filter: 'blur(8px)' },
      itemFrom = { y: 96, opacity: 0, scale: 0.86, rotateX: -14, transformOrigin: '50% 100%' },
      extraFrom = { y: 64, opacity: 0 },
      mainTo = {},
      itemTo = {},
      extraTo = {},
      itemStagger = 0.08,
    }) => {
      const section = document.querySelector(sectionId);
      if (!section) return;

      const title = section.querySelector(titleSelector);
      const label = section.querySelector('.s-label');
      const main = mainSelector ? section.querySelector(mainSelector) : null;
      const items = itemSelector ? section.querySelectorAll(itemSelector) : [];
      const extras = extraSelector ? section.querySelectorAll(extraSelector) : [];

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });

      if (main) {
        tl.fromTo(main, mainFrom, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          filter: 'none',
          duration: 1.08,
          ...mainTo,
        }, 0);
      }

      if (items.length) {
        tl.fromTo(items, itemFrom, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          filter: 'none',
          duration: 0.94,
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
          filter: 'none',
          duration: 0.84,
          stagger: 0.06,
          ...extraTo,
        }, 0.16);
      }

      if (title) {
        tl.fromTo(title,
          { y: 56, opacity: 0.06, scale: 0.985, filter: 'none' },
          { y: 0, opacity: 1, scale: 1, duration: 0.72 },
        0.02);
      }

      if (label) {
        tl.fromTo(label,
          { y: 22, opacity: 0.08, filter: 'none' },
          { y: 0, opacity: 1, duration: 0.66 },
        0.04);
      }

      ScrollTrigger.create({
        trigger: section,
        start: triggerStart,
        end: 'bottom 22%',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });

      if (main) {
        gsap.to(main, {
          x: mainDriftX,
          y: mainDriftY,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom top',
            scrub: 1.25,
          },
        });
      }

      if (items.length) {
        gsap.to(items, {
          y: (_, i) => itemDriftY - ((i % 3) * 3),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom top',
            scrub: 1.15,
          },
        });
      }

      if (extras.length) {
        gsap.to(extras, {
          y: extraDriftY,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom top',
            scrub: 1.1,
          },
        });
      }

      if (title) {
        gsap.to(title, {
          y: titleDriftY,
          scale: 1.02,
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom top',
            scrub: 1.1,
          },
        });
      }

      if (label) {
        gsap.to(label, {
          y: titleDriftY * 0.45,
          opacity: 0.86,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom top',
            scrub: 1.1,
          },
        });
      }
    };

    createSectionStory({
      sectionId: '#about',
      titleSelector: '.s-title',
      mainSelector: '.about-layout',
      itemSelector: '.about-right .spec-card',
      extraSelector: '.about-left .reveal-p',
      triggerStart: 'top 96%',
      titleDriftY: -14,
      mainDriftY: -24,
      itemDriftY: -16,
      extraDriftY: -12,
      mainFrom: { x: -54, y: 132, opacity: 0, scale: 0.9, filter: 'blur(8px)' },
      itemFrom: { x: 130, y: 42, opacity: 0, rotateY: -16, transformOrigin: '100% 50%' },
      extraFrom: { y: 76, opacity: 0 },
      itemStagger: 0.08,
    });

    createSectionStory({
      sectionId: '#skills',
      titleSelector: '.s-title',
      mainSelector: '.skills-layout',
      itemSelector: '.skill-cat',
      triggerStart: 'top 96%',
      titleDriftY: -16,
      mainDriftY: -28,
      itemDriftY: -20,
      mainFrom: { y: 142, opacity: 0, scale: 0.88, rotateX: -12, filter: 'blur(7px)' },
      itemFrom: { y: 148, opacity: 0, scale: 0.8, rotateX: -20, transformOrigin: '50% 100%' },
      itemStagger: 0.085,
    });

    createSectionStory({
      sectionId: '#projects',
      titleSelector: '.s-title',
      mainSelector: '.proj-scroll-wrapper',
      extraSelector: '.proj-progress',
      triggerStart: 'top 96%',
      titleDriftY: -18,
      mainDriftX: -44,
      mainDriftY: -22,
      extraDriftY: -6,
      mainFrom: { x: 122, y: 96, opacity: 0, scale: 0.9, filter: 'brightness(0.62) blur(6px)' },
      extraFrom: { scaleX: 0.08, opacity: 0.18, transformOrigin: '0% 50%' },
      extraTo: { scaleX: 1, opacity: 1 },
      mainTo: { filter: 'brightness(1)' },
    });

    createSectionStory({
      sectionId: '#certifications',
      titleSelector: '.s-title',
      mainSelector: '.certs-list',
      itemSelector: '.cert-item',
      triggerStart: 'top 96%',
      titleDriftY: -16,
      mainDriftY: -26,
      itemDriftY: -14,
      mainFrom: { y: 92, opacity: 0, filter: 'blur(6px)' },
      itemFrom: {
        x: (_, i) => (i % 2 === 0 ? -96 : 96),
        y: 24,
        opacity: 0,
      },
      itemStagger: 0.06,
    });

    createSectionStory({
      sectionId: '#contact',
      titleSelector: '.contact-title',
      mainSelector: '.contact-links',
      itemSelector: '.c-link',
      extraSelector: '.contact-sub',
      triggerStart: 'top 96%',
      titleDriftY: -20,
      mainDriftY: -22,
      itemDriftY: -18,
      extraDriftY: -10,
      mainFrom: { y: 92, opacity: 0, scale: 0.9 },
      itemFrom: { y: 122, opacity: 0, scale: 0.82 },
      extraFrom: { y: 74, opacity: 0 },
      itemStagger: 0.09,
    });
  }

  // Fallback paragraph reveal for mobile/reduced-motion mode.
  if (!sectionStoriesEnabled) {
    document.querySelectorAll('.reveal-p').forEach((el, i) => {
      gsap.set(el, { filter: 'blur(8px)' });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.95,
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

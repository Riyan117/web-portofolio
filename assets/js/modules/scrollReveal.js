export function initScrollReveal() {
  // Title lines — clip-path wipe up from bottom
  document.querySelectorAll('.reveal-line').forEach((el) => {
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Paragraphs — slight stagger per group of 3
  document.querySelectorAll('.reveal-p').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out',
      delay: (i % 3) * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 89%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Cards — staggered per section
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

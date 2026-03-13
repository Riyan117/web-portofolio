export function initHero() {
  // Build character spans.
  document.querySelectorAll('.h-line').forEach(line => {
    const text = line.dataset.text;
    line.innerHTML = text.split('').map(ch =>
      ch === ' '
        ? `<span class="h-char">&nbsp;</span>`
        : `<span class="h-char">${ch}</span>`
    ).join('');
  });

  const allChars = gsap.utils.toArray('.h-char');
  gsap.set(allChars, { opacity: 0, y: 14, filter: 'blur(8px)' });

  // Each char fires at: entranceDone + lineOffset + charOffset.
  const waveStagger = 0.08;
  ['#hl1', '#hl2', '#hl3'].forEach((sel, lineIdx) => {
    document.querySelectorAll(`${sel} .h-char`).forEach((ch, i) => {
      ch.style.animationDelay = `${2.5 + lineIdx * 0.4 + i * waveStagger}s`;
    });
  });

  // Intro timeline.
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('#heroBadge', { opacity: 1, y: 0, duration: 0.6, delay: 0.3 })
    .to(allChars, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.4,
      stagger: { each: 0.042, ease: 'none' },
    }, '-=0.2')
    .to('#heroDesc',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('#heroBtns',  { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
    .to('#heroStats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
    .to('#scrollHint',{ opacity: 1,        duration: 0.5 }, '-=0.2');

  // Init scroll story only after intro reaches final visual state.
  tl.eventCallback('onComplete', () => {
    initHeroScrollStory();
  });
}

function initHeroScrollStory() {
  const hero = document.getElementById('hero');
  const caps = document.getElementById('heroCaps');
  if (!hero || !caps || typeof ScrollTrigger === 'undefined') return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(caps, { opacity: 1, y: 0 });
    return;
  }

  const mm = gsap.matchMedia();

  mm.add('(max-width: 768px)', () => {
    gsap.set(caps, { opacity: 1, y: 0 });
  });

  mm.add('(min-width: 769px)', () => {
    hero.classList.add('story-active');

    const chips = gsap.utils.toArray('.qa-chip');
    gsap.set(caps, { opacity: 0, y: 34, scale: 0.96 });
    gsap.set(chips, {
      opacity: 0,
      y: 24,
      filter: 'blur(10px)',
    });

    const storyTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=220%',
        scrub: 0.85,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: [0, 0.33, 0.66, 1],
          duration: { min: 0.12, max: 0.35 },
          ease: 'power1.inOut',
        },
        onLeaveBack: () => {
          // Hard reset to the visible intro state when user scrolls back to top.
          gsap.set('.hero-title', { scale: 1, yPercent: 0, opacity: 1, filter: 'blur(0px)' });
          gsap.set('#heroDesc', { y: 0, opacity: 1, filter: 'blur(0px)' });
          gsap.set('#heroBtns', { y: 0, opacity: 1 });
          gsap.set('#heroStats', { y: 0, opacity: 1 });
          gsap.set('#heroBadge', { y: 0, opacity: 1 });
          gsap.set('#scrollHint', { opacity: 1 });
          gsap.set(caps, { opacity: 0, y: 34, scale: 0.96, filter: 'none' });
          gsap.set(chips, { opacity: 0, y: 24, filter: 'blur(10px)' });
        },
      },
    });

    storyTl
      .fromTo('.hero-title',
        { scale: 1, yPercent: 0, opacity: 1, filter: 'blur(0px)' },
        {
        scale: 1.32,
        yPercent: -36,
        opacity: 0.08,
        filter: 'blur(12px)',
        transformOrigin: '50% 0%',
      }, 0.06)
      .fromTo('#heroDesc',
        { y: 0, opacity: 1, filter: 'blur(0px)' },
        { y: -110, opacity: 0, filter: 'blur(8px)' },
      0.16)
      .fromTo('#heroBtns',
        { y: 0, opacity: 1 },
        { y: -124, opacity: 0 },
      0.18)
      .fromTo('#heroStats',
        { y: 0, opacity: 1 },
        { y: -136, opacity: 0 },
      0.2)
      .fromTo('#heroBadge',
        { y: 0, opacity: 1 },
        { y: -84, opacity: 0.12 },
      0.14)
      .fromTo('#scrollHint',
        { opacity: 1 },
        { opacity: 0 },
      0.14)
      .to(caps, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.26,
        ease: 'power2.out',
      }, 0.4)
      .to(chips, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.08,
        duration: 0.28,
        ease: 'power3.out',
      }, 0.43)
      .to(caps, {
        y: -44,
        scale: 1.03,
        filter: 'drop-shadow(0 10px 22px rgba(100,255,218,0.22))',
      }, 0.72)
      .to('.hero-content', { yPercent: -12 }, 0.76)
      .to('#glow1', { opacity: 0.86, scale: 1.15 }, 0.62)
      .to('#glow2', { opacity: 0.72, scale: 1.08 }, 0.66)
      .to('#decoA', { opacity: 0.32, scale: 0.9 }, 0.64)
      .to('#decoB', { opacity: 0.16, scale: 0.84 }, 0.66);

    return () => {
      hero.classList.remove('story-active');
      storyTl.kill();
    };
  });
}

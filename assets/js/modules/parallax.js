export function initParallax() {
  const heroST = {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.8,
  };

  gsap.to('#glow1', { yPercent: -28, ease: 'none', scrollTrigger: { ...heroST, scrub: 2.5 } });
  gsap.to('#glow2', { yPercent: -18, ease: 'none', scrollTrigger: { ...heroST, scrub: 2   } });
  gsap.to('#decoA', { y: -130,       ease: 'none', scrollTrigger: { ...heroST, scrub: 1.2 } });
  gsap.to('#decoB', { y: -75,        ease: 'none', scrollTrigger: { ...heroST, scrub: 1.8 } });

  gsap.to('#contactBg', {
    xPercent: -14,
    ease: 'none',
    scrollTrigger: {
      trigger: '.s-contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2.2,
    },
  });
}

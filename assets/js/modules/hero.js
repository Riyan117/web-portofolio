export function initHero() {
  // ── Build character spans ──────────────────────────────
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

  // ── Set wave delays before entrance ───────────────────
  // Each char fires at: entranceDone + lineOffset + charOffset
  // animationDuration=2.2s, so wave repeats and each char
  // effectively "travels" through every 2.2s cycle
  const waveStagger = 0.08;
  ['#hl1', '#hl2', '#hl3'].forEach((sel, lineIdx) => {
    document.querySelectorAll(`${sel} .h-char`).forEach((ch, i) => {
      ch.style.animationDelay = `${2.5 + lineIdx * 0.4 + i * waveStagger}s`;
    });
  });

  // ── Entrance timeline ──────────────────────────────────
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

  // ── Post-entrance: sporadic glitch per line ────────────
  tl.eventCallback('onComplete', () => {
    function glitch(id, initialDelay) {
      const fire = () => {
        gsap.timeline()
          .to(id, { x: gsap.utils.random(-5, 5), skewX: gsap.utils.random(-8, 8), duration: 0.05, ease: 'none' })
          .to(id, { x: gsap.utils.random(-4, 4), skewX: gsap.utils.random(-5, 5), duration: 0.05, ease: 'none' })
          .to(id, { x: gsap.utils.random(-6, 6), skewX: 0,                        duration: 0.04, ease: 'none' })
          .to(id, { x: 0, skewX: 0,                                                duration: 0.1,  ease: 'power2.out' })
          .eventCallback('onComplete', () => {
            setTimeout(fire, 2800 + Math.random() * 4000);
          });
      };
      setTimeout(fire, initialDelay);
    }

    glitch('#hl1', 1200);
    glitch('#hl2', 2400);
    glitch('#hl3', 3400);
  });
}

export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
  }, { passive: true });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = document.querySelectorAll(
    'a, button, .proj-card, .spec-card, .cert-row, .skill-cat, .c-link'
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovered'));
  });
}

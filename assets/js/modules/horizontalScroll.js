/**
 * horizontalScroll.js
 * Native CSS overflow-x scroll + mouse drag-to-scroll + progress bar.
 */
export function initHorizontalScroll() {
  const wrapper = document.querySelector('.proj-scroll-wrapper');
  const fill    = document.getElementById('projProgressFill');

  if (!wrapper) return;

  // ── Progress bar ──────────────────────────────────
  const updateProgress = () => {
    if (!fill) return;
    const max = wrapper.scrollWidth - wrapper.clientWidth;
    fill.style.width = max > 0 ? (wrapper.scrollLeft / max * 100) + '%' : '0%';
  };
  wrapper.addEventListener('scroll', updateProgress, { passive: true });

  // ── Drag to scroll (mouse) ─────────────────────────
  let isDragging = false;
  let startX     = 0;
  let scrollStart = 0;

  wrapper.addEventListener('mousedown', (e) => {
    isDragging  = true;
    startX      = e.pageX;
    scrollStart = wrapper.scrollLeft;
    wrapper.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    wrapper.scrollLeft = scrollStart - (e.pageX - startX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    wrapper.classList.remove('is-dragging');
  });
}

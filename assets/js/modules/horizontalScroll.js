/**
 * horizontalScroll.js
 * Automatic horizontal projects carousel + progress bar + active card.
 */
export function initHorizontalScroll() {
  const wrapper = document.querySelector('.proj-scroll-wrapper');
  const fill = document.getElementById('projProgressFill');
  const cards = [...document.querySelectorAll('.proj-card')];

  if (!wrapper) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const getMaxScroll = () => Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
  const getPointerX = (event) => (typeof event.clientX === 'number' ? event.clientX : event.pageX);
  const wheelBoost = window.innerWidth <= 768 ? 2.2 : 3.6;
  const dragBoost = window.innerWidth <= 768 ? 1.7 : 2.35;
  const wheelMinStep = window.innerWidth <= 768 ? 20 : 34;

  const updateProgress = () => {
    if (!fill) return;
    const max = getMaxScroll();
    fill.style.width = max > 0 ? (wrapper.scrollLeft / max * 100) + '%' : '0%';
  };

  const updateActiveCard = () => {
    if (!cards.length) return;

    const viewportCenter = wrapper.scrollLeft + wrapper.clientWidth / 2;
    let closestIndex = 0;
    let closestDist = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = index;
      }
    });

    cards.forEach((card, index) => {
      card.classList.toggle('is-active', index === closestIndex);
    });
  };

  // Build a subtle 3D profile that reacts to auto movement speed.
  const updateCardSpin = (scrollVelocity = 0) => {
    if (!cards.length || !wrapper.classList.contains('is-visible')) return;

    const viewportCenter = wrapper.scrollLeft + wrapper.clientWidth / 2;
    const maxDistance = wrapper.clientWidth * 0.62;
    const intensity = window.innerWidth <= 768 ? 0.72 : 1;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const normalized = clamp((cardCenter - viewportCenter) / maxDistance, -1, 1);
      const focus = 1 - Math.abs(normalized);
      const isActive = card.classList.contains('is-active');
      const isHovered = card.matches(':hover');

      const motionTiltY = clamp(scrollVelocity * -150, -9, 9) * (0.45 + focus * 0.55) * intensity;
      const rotateY = normalized * -20 * intensity + motionTiltY;
      const inertiaSpin = clamp(scrollVelocity * -420, -13, 13) * intensity;
      const rotateZ = (normalized * -4.5 + inertiaSpin) * (0.55 + focus * 0.45);
      const depth = focus * 24 * intensity;
      const lift = -2 - focus * (isActive ? 12 : 7) - (isHovered ? 3.5 : 0);
      const scale = 0.945 + focus * (isActive ? 0.088 : 0.062) + (isHovered ? 0.018 : 0);

      card.style.transform = `translate3d(0, ${lift.toFixed(2)}px, ${depth.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });
  };

  // Batch visual updates in one frame.
  let paintQueued = false;
  let lastTick = performance.now();
  let lastScrollLeft = wrapper.scrollLeft;
  let smoothedVelocity = 0;

  const updateVelocity = () => {
    const now = performance.now();
    const elapsed = Math.max(16, now - lastTick);
    const rawVelocity = (wrapper.scrollLeft - lastScrollLeft) / elapsed;

    smoothedVelocity = smoothedVelocity * 0.8 + rawVelocity * 0.2;
    lastScrollLeft = wrapper.scrollLeft;
    lastTick = now;
  };

  const requestPaint = () => {
    if (paintQueued) return;
    paintQueued = true;

    requestAnimationFrame(() => {
      updateVelocity();
      updateProgress();
      updateActiveCard();
      updateCardSpin(smoothedVelocity);
      paintQueued = false;
    });
  };

  let autoRaf = 0;
  let autoLastTick = 0;
  let autoDirection = 1;
  let enteredViewport = false;
  let contextPaused = false;
  let interactionPauseUntil = 0;
  let autoDriving = false;

  const syncAutoPauseState = (now = performance.now()) => {
    const paused = contextPaused || now < interactionPauseUntil;
    wrapper.classList.toggle('is-auto-paused', paused);
    return paused;
  };

  const setContextPaused = (paused) => {
    contextPaused = paused;
    const isPaused = syncAutoPauseState();
    if (!isPaused) autoLastTick = performance.now();
  };

  const pauseAutoFor = (ms = 1600) => {
    interactionPauseUntil = Math.max(interactionPauseUntil, performance.now() + ms);
    syncAutoPauseState();
  };

  wrapper.addEventListener('scroll', requestPaint, { passive: true });

  const stepAuto = (now) => {
    if (!autoLastTick) autoLastTick = now;
    const elapsed = Math.min(48, Math.max(16, now - autoLastTick));
    autoLastTick = now;

    const autoPaused = syncAutoPauseState(now);

    if (enteredViewport && !autoPaused) {
      const max = getMaxScroll();
      if (max > 0) {
        const speed = window.innerWidth <= 768 ? 0.034 : 0.05; // px/ms
        let next = wrapper.scrollLeft + autoDirection * elapsed * speed;

        if (next >= max) {
          next = max;
          autoDirection = -1;
        } else if (next <= 0) {
          next = 0;
          autoDirection = 1;
        }

        autoDriving = true;
        wrapper.scrollLeft = next;
        autoDriving = false;
        requestPaint();
      }
    }

    autoRaf = requestAnimationFrame(stepAuto);
  };

  const startAuto = () => {
    if (autoRaf) return;
    autoLastTick = performance.now();
    autoRaf = requestAnimationFrame(stepAuto);
  };

  cards.forEach((card, index) => {
    card.style.setProperty('--proj-delay', `${index * 85}ms`);
  });

  wrapper.addEventListener('focusin', () => setContextPaused(true));
  wrapper.addEventListener('focusout', () => {
    if (!wrapper.contains(document.activeElement)) setContextPaused(false);
  });

  // Allow fast manual horizontal control with wheel while keeping page scroll natural at edges.
  wrapper.addEventListener('wheel', (event) => {
    const max = getMaxScroll();
    if (max <= 0) return;

    const useVerticalDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
    const baseDelta = useVerticalDelta ? event.deltaY : event.deltaX;
    if (baseDelta === 0) return;

    // Normalize wheel delta across browsers/devices, then amplify for lighter manual feel.
    const modeScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? wrapper.clientWidth : 1;
    const rawDelta = baseDelta * modeScale * wheelBoost;
    const delta = Math.sign(rawDelta) * Math.max(Math.abs(rawDelta), wheelMinStep);

    const atStart = wrapper.scrollLeft <= 0;
    const atEnd = wrapper.scrollLeft >= max;
    if (useVerticalDelta && ((delta < 0 && atStart) || (delta > 0 && atEnd))) return;

    event.preventDefault();
    wrapper.scrollLeft = clamp(wrapper.scrollLeft + delta, 0, max);
    pauseAutoFor(1400);
    requestPaint();
  }, { passive: false });

  // Mouse drag support for quick manual seek without waiting for auto movement.
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragMoved = false;

  wrapper.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;

    isDragging = true;
    dragMoved = false;
    dragStartX = getPointerX(event);
    dragStartScroll = wrapper.scrollLeft;

    wrapper.classList.add('is-user-interacting');
    pauseAutoFor(1400);
    event.preventDefault();
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const pointerX = getPointerX(event);
    const dragDelta = pointerX - dragStartX;
    if (Math.abs(dragDelta) > 4) dragMoved = true;

    wrapper.scrollLeft = clamp(dragStartScroll - dragDelta * dragBoost, 0, getMaxScroll());
    pauseAutoFor(900);
    requestPaint();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-user-interacting');
    pauseAutoFor(700);
    setTimeout(() => { dragMoved = false; }, 0);
  });

  // Touch interactions should temporarily pause auto movement too.
  wrapper.addEventListener('touchstart', () => pauseAutoFor(1400), { passive: true });
  wrapper.addEventListener('touchmove', () => pauseAutoFor(900), { passive: true });

  wrapper.addEventListener('click', (event) => {
    if (!dragMoved) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  document.addEventListener('visibilitychange', () => {
    setContextPaused(document.hidden);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          enteredViewport = true;
          wrapper.classList.add('is-visible', 'is-auto');
          setContextPaused(false);
          startAuto();
          requestPaint();
          return;
        }

        if (!enteredViewport) return;
        setContextPaused(true);
      });
    }, { threshold: 0.28 });

    observer.observe(wrapper);
  } else {
    enteredViewport = true;
    wrapper.classList.add('is-visible', 'is-auto');
    setContextPaused(false);
    startAuto();
  }

  window.addEventListener('resize', () => {
    wrapper.scrollLeft = clamp(wrapper.scrollLeft, 0, getMaxScroll());
    autoLastTick = performance.now();
    requestPaint();
  }, { passive: true });

  requestPaint();
}

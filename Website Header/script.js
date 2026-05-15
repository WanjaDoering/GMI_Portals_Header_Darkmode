/* ════════════════════════════════════════════════════════════════════════════
   GetMyInvoices Header — Animation + Interaction
   ─ Portal logos orbit along a rectangular path (auto rotate + mouse/touch drag)
   ─ Phone export logos scroll vertically (auto + mouse wheel + drag, pause on hover)
   Shared between index.html (Dark) and index-light.html (Light).
   ════════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Setup: DOM references + initial values ─────────────────────────── */
  const root        = document.documentElement;
  const slots       = [...document.querySelectorAll('.logo-anchor')];
  const startFracs  = slots.map(el => parseFloat(el.style.getPropertyValue('--start-frac')) || 0);
  const orbitHit    = document.querySelector('.orbit-hitzone');
  const phone       = document.querySelector('.phone-content');
  const phoneScroll = document.querySelector('.phone-scroll');

  // Animation durations come from CSS custom properties (see style.css)
  const orbitDuration  = parseFloat(getComputedStyle(root).getPropertyValue('--orbit-duration'))  || 60;
  const scrollDuration = parseFloat(getComputedStyle(root).getPropertyValue('--scroll-duration')) || 16;

  /* ── State ──────────────────────────────────────────────────────────── */
  let rotation   = 0;          // 0..1 — current position in the orbit cycle
  let scrollPos  = 0;          // 0..1 — current position in the scroll cycle
  let phoneHover = false;      // pause auto-scroll while hovered
  let orbitDrag  = false;      // pause auto-orbit while dragging
  let phoneDrag  = false;
  let lastX = 0, lastY = 0;
  let lastT = performance.now();

  /* ── Helper: wrap a number to 0..1 (works for negatives) ────────────── */
  const wrap = v => ((v % 1) + 1) % 1;

  /* ── Render: write current state to the DOM ─────────────────────────── */
  function applyRotation () {
    slots.forEach((el, i) => {
      const pos = wrap(rotation + startFracs[i]);
      el.style.offsetDistance = (pos * 100).toFixed(3) + '%';
    });
  }

  function applyScroll () {
    // 50% offset because the scroll block contains 2× the logos
    // (originals + duplicate set) for the seamless loop.
    phoneScroll.style.transform = `translateY(${(-scrollPos * 50).toFixed(3)}%)`;
  }

  /* ── Main animation loop (requestAnimationFrame) ────────────────────── */
  function tick (t) {
    const dt = (t - lastT) / 1000;  // seconds since previous frame
    lastT = t;

    if (!orbitDrag) {
      rotation = wrap(rotation + dt / orbitDuration);
    }
    if (!phoneHover && !phoneDrag) {
      scrollPos = wrap(scrollPos + dt / scrollDuration);
    }

    applyRotation();
    applyScroll();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ── Orbit drag (mouse + touch) ─────────────────────────────────────── */
  // Sensitivity: dragging 800px equals one full orbit cycle.
  const ORBIT_SENSITIVITY = 800;

  function orbitDragStart (e) {
    orbitDrag = true;
    orbitHit.classList.add('dragging');
    const p = e.touches ? e.touches[0] : e;
    lastX = p.clientX;
    lastY = p.clientY;
    e.preventDefault();
  }
  function orbitDragMove (e) {
    if (!orbitDrag) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - lastX;
    const dy = p.clientY - lastY;
    // Combine horizontal + vertical movement so the user can drag in any direction
    rotation = wrap(rotation + (dx + dy) / ORBIT_SENSITIVITY);
    lastX = p.clientX;
    lastY = p.clientY;
  }
  function orbitDragEnd () {
    orbitDrag = false;
    orbitHit.classList.remove('dragging');
  }

  orbitHit.addEventListener('mousedown',  orbitDragStart);
  orbitHit.addEventListener('touchstart', orbitDragStart, { passive: false });

  /* ── Phone scroll: hover (pause) + wheel + drag ─────────────────────── */
  const SCROLL_WHEEL_SENSITIVITY = 800;   // px of wheel deltaY per full cycle
  const SCROLL_DRAG_SENSITIVITY  = 200;   // px of drag per full cycle (more sensitive)

  phone.addEventListener('mouseenter', () => { phoneHover = true; });
  phone.addEventListener('mouseleave', () => { phoneHover = false; });

  phone.addEventListener('wheel', e => {
    e.preventDefault();
    scrollPos = wrap(scrollPos + e.deltaY / SCROLL_WHEEL_SENSITIVITY);
  }, { passive: false });

  function phoneDragStart (e) {
    phoneDrag = true;
    const p = e.touches ? e.touches[0] : e;
    lastY = p.clientY;
    e.preventDefault();
  }
  function phoneDragMove (e) {
    if (!phoneDrag) return;
    const p = e.touches ? e.touches[0] : e;
    const dy = p.clientY - lastY;
    // Dragging downward scrolls back (content gets "pulled" downward)
    scrollPos = wrap(scrollPos - dy / SCROLL_DRAG_SENSITIVITY);
    lastY = p.clientY;
  }
  function phoneDragEnd () { phoneDrag = false; }

  phone.addEventListener('mousedown',  phoneDragStart);
  phone.addEventListener('touchstart', phoneDragStart, { passive: false });

  /* ── Global move/end listeners ───────────────────────────────────────
     Attached to window so the drag continues to work even when the cursor
     leaves the original element. */
  function combinedMove (e) {
    orbitDragMove(e);
    phoneDragMove(e);
  }
  function combinedEnd () {
    orbitDragEnd();
    phoneDragEnd();
  }
  window.addEventListener('mousemove',  combinedMove);
  window.addEventListener('touchmove',  combinedMove, { passive: true });
  window.addEventListener('mouseup',    combinedEnd);
  window.addEventListener('touchend',   combinedEnd);

})();

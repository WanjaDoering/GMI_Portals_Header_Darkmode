/* ══════════════════════════════════════════════════════════════════════════
   GetMyInvoices Header — JS-Animation + Interaktion
   ─ Logos rotieren auf dem Rechteck-Pfad (auto + Maus-Drag)
   ─ Smartphone-Scroll (auto + Maus-Wheel + Maus-Drag)
   Geteiltes Script für index.html (Dark) und index-light.html (Light).
   ══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Setup ─────────────────────────────────────────────────────────── */
  const root        = document.documentElement;
  const slots       = [...document.querySelectorAll('.logo-anchor')];
  const startFracs  = slots.map(el => parseFloat(el.style.getPropertyValue('--start-frac')) || 0);
  const orbitHit    = document.querySelector('.orbit-hitzone');
  const phone       = document.querySelector('.phone-content');
  const phoneScroll = document.querySelector('.phone-scroll');

  const orbitDuration  = parseFloat(getComputedStyle(root).getPropertyValue('--orbit-duration'))  || 60;
  const scrollDuration = parseFloat(getComputedStyle(root).getPropertyValue('--scroll-duration')) || 16;

  /* ── State ─────────────────────────────────────────────────────────── */
  let rotation   = 0;             // 0..1 — Position im Orbit-Cycle
  let scrollPos  = 0;             // 0..1 — Position im Scroll-Cycle
  let phoneHover = false;
  let orbitDrag  = false;
  let phoneDrag  = false;
  let lastX = 0, lastY = 0;
  let lastT = performance.now();

  /* ── Helper: Wrap auf 0..1 ─────────────────────────────────────────── */
  const wrap = v => ((v % 1) + 1) % 1;

  /* ── Render ────────────────────────────────────────────────────────── */
  function applyRotation () {
    slots.forEach((el, i) => {
      const pos = wrap(rotation + startFracs[i]);
      el.style.offsetDistance = (pos * 100).toFixed(3) + '%';
    });
  }

  function applyScroll () {
    phoneScroll.style.transform = `translateY(${(-scrollPos * 50).toFixed(3)}%)`;
  }

  /* ── Animation-Loop ────────────────────────────────────────────────── */
  function tick (t) {
    const dt = (t - lastT) / 1000;       // Sekunden seit letztem Frame
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

  /* ── Orbit-Drag (Maus + Touch) ─────────────────────────────────────── */
  // Sensitivity: 800px Drag-Strecke = 1 voller Cycle
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
    // Horizontale + vertikale Bewegung kombiniert
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

  /* ── Smartphone-Scroll: Hover + Wheel + Drag ───────────────────────── */
  const SCROLL_WHEEL_SENSITIVITY = 800;     // px deltaY = 1 Cycle
  const SCROLL_DRAG_SENSITIVITY  = 200;     // px Drag = 1 Cycle (sensitiver)

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
    // Drag nach unten scrollt zurück (Inhalt wird nach unten gezogen)
    scrollPos = wrap(scrollPos - dy / SCROLL_DRAG_SENSITIVITY);
    lastY = p.clientY;
  }
  function phoneDragEnd () { phoneDrag = false; }

  phone.addEventListener('mousedown',  phoneDragStart);
  phone.addEventListener('touchstart', phoneDragStart, { passive: false });

  /* ── Globale Move/End-Listener (für Drag-Outside-Container) ────────── */
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

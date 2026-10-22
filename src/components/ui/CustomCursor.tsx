import { useEffect, useRef, useState } from 'react';

/**
 * Liquid glass cursor.
 *
 * - default: glass lens that trails the pointer and stretches along its velocity
 * - hover:   large interactive surfaces get a soft lens with a specular spotlight
 * - morph:   small controls are wrapped iPadOS-style and magnetically pulled toward the pointer
 *            (opt out with [data-no-magnet] on the control or an ancestor)
 * - label:   [data-cursor="Text"] turns the lens into a pill with an iridescent rim
 * - text:    copy turns the lens into a caret sized to the line height
 * - native:  form fields fall back to the system cursor
 *
 * Everything runs in a single rAF loop that writes styles directly (no React re-renders),
 * and the loop sleeps once the cursor has settled.
 */

type Mode = 'default' | 'hover' | 'morph' | 'label' | 'text' | 'native';

type Magnet = {
  el: HTMLElement;
  x: number;
  y: number;
  original: string;
  active: boolean;
};

const INTERACTIVE = '[data-cursor], a[href], button, [role="button"], summary, label[for], [data-magnetic]';
const TEXTUAL = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption';
const NATIVE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

const RING = 34;
const HOVER_RING = 58;
const MORPH_PAD = 6;
const MAGNET_MAX_W = 300;
const MAGNET_MAX_H = 96;
const MAGNET_PULL = 0.2;
const MAGNET_LIMIT = 10;
const TRAIL_LIFE = 420;
const TRAIL_MAX_POINTS = 48;

// Tangerine → magenta → cobalt → mint, matching the bento tile palette
const TRAIL_STOPS: [number, number, number][] = [
  [255, 122, 61],
  [226, 58, 140],
  [62, 91, 255],
  [159, 217, 193],
];

// Frame-rate independent exponential smoothing factor
const ease = (base: number, dt: number) => 1 - Math.pow(1 - base, dt * 60);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function trailColor(t: number, alpha: number) {
  const scaled = t * (TRAIL_STOPS.length - 1);
  const i = Math.min(Math.floor(scaled), TRAIL_STOPS.length - 2);
  const f = scaled - i;
  const a = TRAIL_STOPS[i];
  const b = TRAIL_STOPS[i + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
}

export function CustomCursor() {
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !ring || !dot || !labelEl || !canvas || !ctx) return;

    const html = document.documentElement;
    html.classList.add('has-custom-cursor');

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = reducedQuery.matches;
    const onReducedChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
    };
    reducedQuery.addEventListener('change', onReducedChange);

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100, w: RING, h: RING, r: RING / 2, stretch: 0, angle: 0 };
    let dotScale = 1;
    let mode: Mode = 'default';
    let targetEl: HTMLElement | null = null;
    let rawTarget: Element | null = null;
    let caretHeight = 24;
    let labelWidth = 0;
    let pressed = false;
    let visible = false;
    const trail: { x: number; y: number; t: number }[] = [];
    const magnets = new Map<HTMLElement, Magnet>();

    // Canvas sizing for the ribbon trail
    let dpr = 1;
    let vw = 0;
    let vh = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      root.dataset.mode = next;
    };

    const setVisible = (next: boolean) => {
      visible = next;
      root.dataset.visible = String(next);
    };

    const releaseMagnets = () => {
      magnets.forEach((m) => {
        m.active = false;
      });
    };

    const attachMagnet = (el: HTMLElement) => {
      releaseMagnets();
      const existing = magnets.get(el);
      if (existing) {
        existing.active = true;
        return;
      }
      magnets.set(el, { el, x: 0, y: 0, original: el.style.translate, active: true });
    };

    const classify = (el: Element | null) => {
      if (el === rawTarget) return;
      rawTarget = el;

      let next: Mode = 'default';
      let nextTarget: HTMLElement | null = null;
      let magnetic = false;

      if (el) {
        const interactive = el.closest<HTMLElement>(INTERACTIVE);
        if (el.closest(NATIVE)) {
          next = 'native';
        } else if (interactive) {
          nextTarget = interactive;
          const rect = interactive.getBoundingClientRect();
          const small = rect.width <= MAGNET_MAX_W && rect.height <= MAGNET_MAX_H;
          magnetic = small && !interactive.closest('[data-no-magnet]');
          const label = interactive.dataset.cursor;
          if (label) {
            next = 'label';
            if (labelEl.textContent !== label) {
              labelEl.textContent = label;
              labelWidth = labelEl.offsetWidth;
            }
          } else {
            next = small ? 'morph' : 'hover';
          }
        } else {
          const text = el.closest<HTMLElement>(TEXTUAL);
          if (text) {
            next = 'text';
            const cs = getComputedStyle(text);
            const lh = parseFloat(cs.lineHeight);
            caretHeight = clamp(Number.isNaN(lh) ? parseFloat(cs.fontSize) * 1.2 : lh, 16, 72);
          }
        }
      }

      if (nextTarget !== targetEl) {
        releaseMagnets();
        if (nextTarget && magnetic) attachMagnet(nextTarget);
      }
      targetEl = nextTarget;
      setMode(next);
    };

    const updateMagnets = (dt: number) => {
      const k = ease(0.18, dt);
      magnets.forEach((m, el) => {
        let tx = 0;
        let ty = 0;
        if (m.active && !reduced) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2 - m.x;
          const cy = rect.top + rect.height / 2 - m.y;
          tx = clamp((mouse.x - cx) * MAGNET_PULL, -MAGNET_LIMIT, MAGNET_LIMIT);
          ty = clamp((mouse.y - cy) * MAGNET_PULL, -MAGNET_LIMIT, MAGNET_LIMIT);
        }
        m.x += (tx - m.x) * k;
        m.y += (ty - m.y) * k;
        if (!m.active && Math.abs(m.x) < 0.05 && Math.abs(m.y) < 0.05) {
          el.style.translate = m.original;
          magnets.delete(el);
          return;
        }
        el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
      });
    };

    const drawTrail = (now: number) => {
      ctx.clearRect(0, 0, vw, vh);
      while (trail.length && now - trail[0].t > TRAIL_LIFE) trail.shift();
      if (trail.length < 3) return;

      const night = html.dataset.theme === 'night';
      ctx.globalCompositeOperation = night ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const last = trail.length - 1;
      for (let i = 1; i <= last; i++) {
        const p0 = trail[i - 1];
        const p1 = trail[i];
        const prev = i > 1 ? trail[i - 2] : p0;
        const life = clamp(1 - (now - p1.t) / TRAIL_LIFE, 0, 1);
        const progress = i / last;

        ctx.beginPath();
        ctx.moveTo((prev.x + p0.x) / 2, (prev.y + p0.y) / 2);
        ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
        ctx.strokeStyle = trailColor(1 - progress, life * progress * (night ? 0.9 : 0.65));
        ctx.lineWidth = 0.5 + life * progress * 3.5;
        ctx.stroke();
      }
    };

    let raf = 0;
    let lastFrame = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      updateMagnets(dt);

      let tx = mouse.x;
      let ty = mouse.y;
      let tw = RING;
      let th = RING;
      let tr = RING / 2;
      let follow = 0.24;
      let dotTarget = 1;

      switch (mode) {
        case 'hover':
          tw = th = HOVER_RING;
          tr = HOVER_RING / 2;
          follow = 0.2;
          break;
        case 'morph': {
          if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            const radius = parseFloat(getComputedStyle(targetEl).borderTopLeftRadius) || 12;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            tw = rect.width + MORPH_PAD * 2;
            th = rect.height + MORPH_PAD * 2;
            tr = Math.min(radius + MORPH_PAD, th / 2, tw / 2);
            // A little parallax so the highlight feels attached to the pointer
            tx = cx + (mouse.x - cx) * 0.08;
            ty = cy + (mouse.y - cy) * 0.08;
          }
          follow = 0.26;
          dotTarget = 0;
          break;
        }
        case 'label':
          tw = labelWidth + 32;
          th = 36;
          tr = 18;
          follow = 0.26;
          dotTarget = 0;
          break;
        case 'text':
          tw = 2.5;
          th = caretHeight;
          tr = 1.5;
          follow = 0.38;
          dotTarget = 0;
          break;
        case 'native':
          dotTarget = 0;
          break;
      }

      if (pressed && mode !== 'text') {
        const squeeze = mode === 'morph' ? 0.96 : 0.82;
        tw *= squeeze;
        th *= squeeze;
        tr *= squeeze;
        dotTarget *= 0.5;
      }

      const kp = reduced ? 1 : ease(follow, dt);
      const ks = reduced ? 1 : ease(0.22, dt);
      pos.x += (tx - pos.x) * kp;
      pos.y += (ty - pos.y) * kp;
      pos.w += (tw - pos.w) * ks;
      pos.h += (th - pos.h) * ks;
      pos.r += (tr - pos.r) * ks;
      dotScale += (dotTarget - dotScale) * (reduced ? 1 : ease(0.3, dt));

      // Liquid stretch: the further the lens lags behind, the more it elongates toward the pointer
      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      const dist = Math.hypot(dx, dy);
      const liquid = !reduced && (mode === 'default' || mode === 'hover');
      const targetStretch = liquid ? Math.min(dist / 140, 0.42) : 0;
      pos.stretch += (targetStretch - pos.stretch) * ease(0.3, dt);
      if (dist > 0.5) pos.angle = Math.atan2(dy, dx);

      const left = pos.x - pos.w / 2;
      const top = pos.y - pos.h / 2;
      ring.style.width = `${pos.w}px`;
      ring.style.height = `${pos.h}px`;
      ring.style.borderRadius = `${pos.r}px`;
      // rotate → scale → unrotate stretches along the motion vector without turning the shape
      ring.style.transform =
        `translate3d(${left}px, ${top}px, 0) rotate(${pos.angle}rad) ` +
        `scale(${1 + pos.stretch}, ${1 - pos.stretch * 0.55}) rotate(${-pos.angle}rad)`;
      ring.style.setProperty('--spot-x', `${mouse.x - left}px`);
      ring.style.setProperty('--spot-y', `${mouse.y - top}px`);

      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;

      drawTrail(now);

      const settled =
        trail.length === 0 &&
        magnets.size === 0 &&
        (mode === 'default' || mode === 'text' || mode === 'native') &&
        Math.abs(tx - pos.x) < 0.1 &&
        Math.abs(ty - pos.y) < 0.1 &&
        Math.abs(tw - pos.w) < 0.1 &&
        Math.abs(th - pos.h) < 0.1 &&
        pos.stretch < 0.001 &&
        Math.abs(dotTarget - dotScale) < 0.01;

      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf) return;
      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const spawnRipple = (x: number, y: number) => {
      if (reduced || mode === 'native') return;
      const ripple = document.createElement('span');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      root.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        setVisible(true);
        pos.x = mouse.x;
        pos.y = mouse.y;
        trail.length = 0;
      }
      classify(e.target as Element | null);
      if (!reduced && (mode === 'default' || mode === 'hover')) {
        trail.push({ x: mouse.x, y: mouse.y, t: performance.now() });
        if (trail.length > TRAIL_MAX_POINTS) trail.shift();
      }
      wake();
    };

    const onMouseDown = () => {
      pressed = true;
      wake();
    };

    const onMouseUp = (e: MouseEvent) => {
      pressed = false;
      spawnRipple(e.clientX, e.clientY);
      // A click often opens or swaps UI under a still pointer (modals, menus), so re-hit-test
      window.setTimeout(() => {
        if (!visible) return;
        rawTarget = null;
        classify(document.elementFromPoint(mouse.x, mouse.y));
        wake();
      }, 80);
      wake();
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      setVisible(false);
      rawTarget = null;
      targetEl = null;
      releaseMagnets();
      setMode('default');
      wake();
    };

    // Content moves under a still pointer while scrolling, so re-hit-test
    const onScroll = () => {
      if (!visible) return;
      classify(document.elementFromPoint(mouse.x, mouse.y));
      wake();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', resize);
      reducedQuery.removeEventListener('change', onReducedChange);
      magnets.forEach((m, el) => {
        el.style.translate = m.original;
      });
      magnets.clear();
      html.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor-root" data-mode="default" data-visible="false" aria-hidden="true">
      <canvas ref={canvasRef} className="cursor-trail" />
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-spot" />
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

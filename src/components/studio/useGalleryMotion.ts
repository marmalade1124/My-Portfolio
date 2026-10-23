import { useCallback, useEffect, useRef } from 'react';
import { advanceRing, cardPose, offsetFrom, wrap, type RingState } from './ringPhysics';

export type GalleryView = 'Showcase' | 'List' | 'Slider';
export function useGalleryMotion(view: GalleryView, count: number, enabled: boolean, onActive: (index: number) => void) {
  const viewport = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const state = useRef<RingState>({ position: 0, velocity: 0, target: null, tilt: 0, speed: 0 });
  const runtime = useRef({ view, enabled, reduce: false, radius: 720, scale: 1, dragging: false, lastActive: -1, frame: 0, lastTime: 0 });
  const pointer = useRef({ id: -1, x: 0, y: 0, position: 0, tilt: 0, moved: false });
  const draw = useRef<(time: number) => void>(() => {});
  const wake = useCallback(() => { if (!runtime.current.frame) { runtime.current.lastTime = 0; runtime.current.frame = requestAnimationFrame(time => draw.current(time)); } }, []);
  const select = useCallback((index: number, instant = false) => {
    const s = state.current;
    const target = s.position + offsetFrom(index, s.position, count);
    s.velocity = 0;
    if (instant || runtime.current.reduce) { s.position = target; s.target = null; s.speed = 0; }
    else s.target = target;
    wake();
  }, [count, wake]);
  const move = useCallback((direction: number, instant = false) => select(wrap(Math.round(state.current.target ?? state.current.position) + direction, count), instant), [select, count]);
  const suppressClick = useCallback(() => pointer.current.moved, []);

  useEffect(() => {
    const root = viewport.current; const layer = ring.current;
    if (!root || !layer) return;
    const settings = runtime.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(layer.querySelectorAll<HTMLElement>('.studio-project'));
    const resize = () => {
      const width = root.clientWidth; const height = root.clientHeight;
      const mobile = width < 768;
      const baseRadius = mobile ? 338 : 720;
      settings.scale = Math.min(1, (width - 30) / (baseRadius * 1.08 + 270), height * .76 / 270);
      settings.radius = baseRadius * settings.scale;
      root.style.perspective = `${1100 * Math.max(.55, settings.scale)}px`;
      wake();
    };
    const motionChange = () => { settings.reduce = media.matches; if (settings.reduce) { state.current.position = Math.round(state.current.position); state.current.target = null; state.current.velocity = 0; state.current.speed = 0; state.current.tilt = 0; } wake(); };
    draw.current = time => {
      settings.frame = 0; root.dataset.ready = "true";
      const s = state.current;
      if (!settings.enabled) return;
      const dt = settings.lastTime ? Math.min(3, (time - settings.lastTime) / (1000 / 60)) : 1;
      settings.lastTime = time;
      if (!settings.reduce) advanceRing(s, dt, settings.dragging);
      const centered = wrap(Math.round(s.position), count);
      if (settings.lastActive !== centered) { settings.lastActive = centered; onActive(centered); }
      layer.style.transform = settings.view === 'Showcase' ? `translateZ(${-settings.radius}px) rotateX(${s.tilt}deg)` : '';
      for (let index = 0; index < cards.length; index++) {
        const card = cards[index]!;
        const distance = offsetFrom(index, s.position, count);
        if (settings.view === 'Showcase') {
          card.style.width = `${270 * settings.scale}px`; card.style.height = `${270 * settings.scale}px`;
          card.style.transform = cardPose(index, s, count, settings.radius);
          card.style.opacity = '1';
        } else {
          const size = Math.min(root.clientWidth < 768 ? root.clientWidth * .62 : 340, root.clientHeight * .55);
          card.style.width = `${size}px`; card.style.height = `${size}px`;
          card.style.transform = settings.view === 'List' ? `translate(-50%,-50%) translateY(${distance * (size + 8)}px)` : `translate(-50%,-50%) translateX(${distance * (size + 8)}px)`;
          card.style.opacity = settings.view === 'List' ? String(Math.max(.12, 1 - Math.max(0, Math.abs(distance) - 2.4) * .55)) : '1';
        }
      }
      if (settings.dragging || s.target !== null || Math.abs(s.velocity) > .00003 || Math.abs(s.position - Math.round(s.position)) > .001 || Math.abs(s.speed) > .00001 || Math.abs(s.tilt) > .001) settings.frame = requestAnimationFrame(time => draw.current(time));
    };
    const wheel = (event: WheelEvent) => {
      if (!settings.enabled || (event.target as HTMLElement).closest('.studio-index')) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (settings.reduce) { if (Math.abs(delta) > 3) move(Math.sign(delta), true); return; }
      const s = state.current;
      if (settings.view === 'Showcase') { s.target = null; s.velocity += delta * .00028; }
      else s.target = (s.target ?? s.position) + delta * .0016;
      wake();
    };
    const down = (event: PointerEvent) => {
      if (!settings.enabled || event.button !== 0) return;
      pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, position: state.current.position, tilt: state.current.tilt, moved: false };
      settings.dragging = true; state.current.target = null; state.current.velocity = 0;
    };
    const drag = (event: PointerEvent) => {
      if (!settings.dragging || event.pointerId !== pointer.current.id) return;
      const p = pointer.current; const s = state.current;
      const dx = event.clientX - p.x; const dy = event.clientY - p.y;
      if (Math.hypot(dx, dy) > 6 && !p.moved) { p.moved = true; root.setPointerCapture(event.pointerId); }
      if (settings.reduce) return;
      const delta = settings.view === 'List' ? dy : dx;
      const position = p.position - delta / (275 * Math.max(.4, settings.scale));
      s.velocity = position - s.position; s.position = position;
      if (settings.view === 'Showcase') s.tilt = Math.max(-14, Math.min(14, p.tilt + dy * .18));
      wake();
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointer.current.id) return;
      settings.dragging = false;
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      if (settings.reduce && pointer.current.moved) { const delta = settings.view === 'List' ? event.clientY - pointer.current.y : event.clientX - pointer.current.x; move(delta < 0 ? 1 : -1, true); }
      wake();
    };
    media.addEventListener('change', motionChange); motionChange();
    const observer = new ResizeObserver(resize); observer.observe(root); resize();
    window.addEventListener('wheel', wheel, { passive: false }); root.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', drag); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => {
      cancelAnimationFrame(settings.frame); settings.frame = 0;
      observer.disconnect(); media.removeEventListener('change', motionChange);
      window.removeEventListener('wheel', wheel); root.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', drag); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    };
  }, [count, enabled, move, onActive, wake]);
  useEffect(() => { runtime.current.view = view; runtime.current.enabled = enabled; runtime.current.dragging = false; state.current.velocity = 0; state.current.target = Math.round(state.current.position); wake(); }, [view, enabled, wake]);
  return { viewport, ring, move, select, suppressClick };
}

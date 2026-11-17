import { useLayoutEffect, useRef } from 'react';
import artwork from './rr-opening.svg?raw';
import { createOpeningScene, createOpeningSwap, rrFlightDirection } from './rr-opening';
import './rr-opening.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

export function shouldPlayRROpening() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return location.pathname === '/' && !location.hash &&
    (!navigation || navigation.type === 'navigate') &&
    !matchMedia(reducedMotion).matches &&
    CSS.supports('clip-path', 'path(evenodd, "M 0 0 H 1 V 1 Z")');
}

export function RROpening({ onFinish }: { onFinish: () => void }) {
  const backdrop = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const veil = backdrop.current;
    const flyingMark = mark.current;
    const scene = veil?.querySelector('svg');
    const upper = flyingMark?.querySelector<SVGUseElement>('[href="#rr-opening-left-shape"]');
    const lower = flyingMark?.querySelector<SVGUseElement>('[href="#rr-opening-right-shape"]');
    if (!veil || !flyingMark || !scene || !upper || !lower) {
      onFinish();
      return;
    }

    const construction = createOpeningScene(scene);
    const swap = createOpeningSwap(upper, lower);
    const paper = scene.querySelectorAll('[data-rr-paper], [data-rr-grid]');
    const preference = matchMedia(reducedMotion);
    let width = 0;
    let height = 0;
    let markSize = 0;
    let frame = 0;
    let flying = false;

    function fit() {
      width = veil!.clientWidth;
      height = veil!.clientHeight;
      if (!width || !height) return;
      const density = Math.min(width / 1440, height / 810);
      const sceneWidth = width / density;
      const sceneHeight = height / density;
      const left = (1440 - sceneWidth) / 2;
      const top = (810 - sceneHeight) / 2;
      scene!.setAttribute('viewBox', `${left} ${top} ${sceneWidth} ${sceneHeight}`);
      for (const layer of paper) {
        layer.setAttribute('x', String(left - 350));
        layer.setAttribute('y', String(top - 350));
        layer.setAttribute('width', String(sceneWidth + 700));
        layer.setAttribute('height', String(sceneHeight + 700));
      }
      markSize = 417.34 * density;
      flyingMark!.style.width = `${markSize}px`;
    }

    fit();
    const windowSize = new ResizeObserver(fit);
    windowSize.observe(veil);
    const motionChanged = () => { if (preference.matches) onFinish(); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFinish();
    };
    preference.addEventListener('change', motionChanged);
    window.addEventListener('keydown', escape);

    const start = performance.now();
    const fadeStart = swap.completeAt + .08;
    const fadeDuration = .42;
    const whiteHold = .24;
    const flightStart = fadeStart + fadeDuration + whiteHold;
    const flightDuration = .88;
    const [dx, dy] = rrFlightDirection;
    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const swapTime = elapsed - construction.completeAt;
      const progress = Math.max(0, (swapTime - flightStart) / flightDuration);
      if (progress >= 1) {
        onFinish();
        return;
      }
      if (swapTime >= 0) {
        if (!flying) {
          construction.draw(construction.completeAt);
          construction.launch();
          flyingMark!.style.visibility = 'visible';
          flying = true;
        }
        swap.draw(Math.min(swapTime, swap.completeAt), width, height, markSize / 29.81);
      } else {
        construction.draw(elapsed);
      }
      if (swapTime >= fadeStart) {
        const fade = Math.min(1, (swapTime - fadeStart) / fadeDuration);
        scene!.style.opacity = String(1 - fade * fade * (3 - 2 * fade));
      }
      if (progress > 0) {
        const distance = Math.hypot(width, height);
        const sweep = progress ** 1.6;
        const travel = sweep * distance * 1.55;
        const unit = markSize / 29.81;
        // Inset the curve into the lower R so its arms hide the join with the cutout.
        const left = width / 2 + dx * travel + (81.71 - 79.655 - 3.6) * unit;
        const top = height / 2 + dy * travel + (81.99 - 80 - 3.6) * unit;
        const spread = 1 - (1 - Math.min(1, progress / .25)) ** 3;
        const right = left + (width + 1 - left) * spread;
        const bottom = top + (height + 1 - top) * spread;
        const radius = Math.min(1.85 * unit, right - left, bottom - top);
        const handle = radius * (1.02 / 1.85);
        const corner = `C ${left} ${top + radius - handle} ${left + radius - handle} ${top} ${left + radius} ${top}`;
        veil!.style.clipPath = `path(evenodd, "M 0 0 H ${width} V ${height} H 0 Z M ${left} ${bottom} V ${top + radius} ${corner} H ${right} V ${bottom} Z")`;
        flyingMark!.style.transform = `translate3d(${dx * travel}px, ${dy * travel}px, 0) translate(-50%, -50%)`;
        flyingMark!.style.filter = `blur(${Math.min(4, progress * 5)}px)`;
      }
      frame = requestAnimationFrame(tick);
    }
    construction.draw(0);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      windowSize.disconnect();
      preference.removeEventListener('change', motionChanged);
      window.removeEventListener('keydown', escape);
    };
  }, [onFinish]);

  return (
    <div className="rr-opening">
      <div className="rr-opening__veil" ref={backdrop} aria-hidden="true" dangerouslySetInnerHTML={{ __html: artwork }} />
      <svg className="rr-opening__mark" ref={mark} viewBox="64.75 65.12 29.81 29.76" aria-hidden="true" fill="#1e1e1e">
        <use href="#rr-opening-left-shape" />
        <use href="#rr-opening-right-shape" />
      </svg>
      <button className="rr-opening__skip" type="button" onClick={onFinish}>Skip intro</button>
    </div>
  );
}

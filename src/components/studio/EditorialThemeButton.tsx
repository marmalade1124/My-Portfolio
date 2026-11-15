import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import inkTexture from '@/assets/editorial-ink.webp';

const schemeQuery = '(prefers-color-scheme: dark)';
const themeKey = 'portfolio-theme';
const inkFrames = [
  { size: 0, phase: 0 },
  { size: .14, phase: .55 },
  { size: .44, phase: 1.25 },
  { size: 1.24, phase: 2.15 },
];

function inkContour(x: number, y: number, radius: number, phase: number) {
  const pointCount = 64;
  const points = Array.from({ length: pointCount }, (_, index) => {
    const angle = index * 2 * Math.PI / pointCount;
    const edge = radius * (1 + .08 * Math.sin(5 * angle + phase)
      + .04 * Math.sin(9 * angle - phase) + .016 * Math.cos(17 * angle + phase));
    return { x: x + Math.cos(angle) * edge, y: y + Math.sin(angle) * edge };
  });
  const coordinates = (point: { x: number; y: number }) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  const control = (point: { x: number; y: number }, ahead: { x: number; y: number }, behind: { x: number; y: number }) =>
    coordinates({ x: point.x + (ahead.x - behind.x) / 6, y: point.y + (ahead.y - behind.y) / 6 });
  const at = (index: number) => points[(index + pointCount) % pointCount]!;
  const curves = points.map((point, index) => {
    const next = at(index + 1);
    return `C ${control(point, next, at(index - 1))} ${control(next, point, at(index + 2))} ${coordinates(next)}`;
  });
  return `path("M ${coordinates(at(0))} ${curves.join(' ')} Z")`;
}

export function EditorialThemeButton({ label }: { label: string }) {
  const root = document.documentElement;
  const [dark, setDark] = useState(() => root.dataset.theme === 'dark');
  const override = useRef<boolean | null>(null);
  const active = useRef<ViewTransition | null>(null);
  const texture = useRef<Blob | null>(null);

  useEffect(() => {
    if (!document.startViewTransition) return;
    const request = new AbortController();
    void fetch(inkTexture, { signal: request.signal }).then(response => {
      if (response.ok) return response.blob();
    }).then(blob => {
      if (blob?.size && !request.signal.aborted) texture.current = blob;
    }).catch(() => { /* The clip-path reveal is still available. */ });
    return () => request.abort();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(themeKey);
      if (saved === 'light' || saved === 'dark') override.current = saved === 'dark';
    } catch { /* The toggle works with storage disabled. */ }

    const scheme = matchMedia(schemeQuery);
    const followSystem = () => {
      if (override.current !== null) return;
      root.dataset.theme = scheme.matches ? 'dark' : 'light';
      setDark(scheme.matches);
    };
    scheme.addEventListener('change', followSystem);
    return () => scheme.removeEventListener('change', followSystem);
  }, [root]);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const nextDark = !(override.current ?? (root.dataset.theme === 'dark'));
    const theme = nextDark ? 'dark' : 'light';
    override.current = nextDark;
    try { localStorage.setItem(themeKey, theme); } catch { /* Keep the choice for this page. */ }

    const update = () => {
      root.dataset.theme = theme;
      setDark(nextDark);
    };
    const clearInk = () => {
      delete root.dataset.edInk;
      root.style.removeProperty('--ed-ink-mask');
      inkFrames.forEach((_, index) => root.style.removeProperty(`--ed-ink-${index}`));
    };

    active.current?.skipTransition();
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      active.current = null;
      clearInk();
      update();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.detail ? event.clientX : rect.left + rect.width / 2;
    const y = event.detail ? event.clientY : rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const maskUrl = texture.current && URL.createObjectURL(texture.current);
    if (maskUrl) {
      // The 900 × 800 shader render starts at (690, 90). Scale its reach to the viewport.
      const scale = Math.max(radius / 690, (innerWidth - x) / 210, y / 90);
      root.style.setProperty('--ed-ink-mask', `url("${maskUrl}") ${x - 690 * scale}px ${y - 90 * scale}px / ${900 * scale}px ${800 * scale}px no-repeat`);
      root.dataset.edInk = 'texture';
    } else {
      inkFrames.forEach(({ size, phase }, index) => {
        root.style.setProperty(`--ed-ink-${index}`, inkContour(x, y, radius * size, phase));
      });
      root.dataset.edInk = '';
    }

    const transition = document.startViewTransition(() => {
      if (active.current === transition) flushSync(update);
    });
    active.current = transition;
    const finish = () => {
      if (maskUrl) URL.revokeObjectURL(maskUrl);
      if (active.current !== transition) return;
      active.current = null;
      clearInk();
    };
    void transition.ready.catch(() => {});
    void transition.finished.then(finish, finish);
  }

  return <button type="button" className="ed-theme" aria-label={label} aria-pressed={dark} title={label} onClick={toggle}>
    {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
  </button>;
}

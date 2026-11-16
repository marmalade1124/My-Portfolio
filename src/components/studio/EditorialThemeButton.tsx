import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
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

function inkCutout(x: number, y: number, radius: number, phase: number, width: number, height: number) {
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
  return `path(evenodd, "M 0 0 H ${width} V ${height} H 0 Z M ${coordinates(at(0))} ${curves.join(' ')} Z")`;
}

function makeInkLayer(page: HTMLElement, theme: string) {
  const layer = document.createElement('div');
  layer.className = 'ed-ink-layer';
  layer.dataset.theme = theme;
  layer.inert = true;
  layer.setAttribute('aria-hidden', 'true');

  const copy = page.cloneNode(true) as HTMLElement;
  const originals = [page, ...page.querySelectorAll('*')];
  const copies = [copy, ...copy.querySelectorAll('*')];
  const byOriginal = new Map(originals.map((node, index) => [node, copies[index]!]));
  const byCopy = new Map(copies.map((node, index) => [node, originals[index]!]));
  for (const node of copies) {
    if (!node.id) continue;
    node.setAttribute('data-ink-id', node.id);
    node.removeAttribute('id');
  }
  layer.append(copy);
  const dots = page.querySelector<HTMLCanvasElement>('.ed-dots[data-active]');
  if (dots) (byOriginal.get(dots) as HTMLCanvasElement).getContext('2d')?.drawImage(dots, 0, 0);

  const sync = () => { layer.scrollTop = scrollY; };
  const syncAnimations = (subtree: HTMLElement) => {
    for (const animation of subtree.getAnimations({ subtree: true })) {
      if (!(animation instanceof CSSAnimation) || !(animation.effect instanceof KeyframeEffect)) continue;
      const target = animation.effect.target;
      const original = target && byCopy.get(target)?.getAnimations().find(item =>
        item instanceof CSSAnimation && item.animationName === animation.animationName);
      const time = original?.currentTime ?? animation.effect.getComputedTiming().endTime;
      if (time !== undefined && time !== Infinity) animation.currentTime = time;
      if (original?.playState === 'running' && animation.playState === 'running') {
        const align = () => {
          if (layer.isConnected && original.playState === 'running' && original.startTime !== null && animation.playState === 'running') {
            animation.startTime = original.startTime;
          }
        };
        if (original.pending) void original.ready.then(align, () => {});
        else align();
      }
    }
  };
  const mirrorChanges = new MutationObserver(changes => {
    const changedReels = new Set<HTMLElement>();
    for (const { target, attributeName } of changes) {
      const node = target as Element;
      const mirror = byOriginal.get(node);
      if (!mirror || !attributeName) continue;
      const value = node.getAttribute(attributeName);
      if (value === null) mirror.removeAttribute(attributeName);
      else mirror.setAttribute(attributeName, value);
      if (attributeName !== 'style' && mirror instanceof HTMLElement) changedReels.add(mirror);
    }
    changedReels.forEach(syncAnimations);
  });
  const show = () => {
    document.body.append(layer);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    mirrorChanges.observe(page, { subtree: true, attributeFilter: ['style', 'data-playing', 'data-paused'] });
    syncAnimations(copy);

    for (const video of page.querySelectorAll('video')) {
      const mirror = byOriginal.get(video) as HTMLVideoElement;
      if (!video.currentSrc) continue;
      mirror.muted = true;
      mirror.currentTime = video.currentTime;
      if (!video.paused) void mirror.play().catch(() => {});
    }
  };
  const decodeVisibleImages = () => Promise.all([...page.querySelectorAll('img')].flatMap(image => {
    if (!image.complete || !image.naturalWidth) return [];
    const { top, right, bottom, left, width, height } = image.getBoundingClientRect();
    if (!width || !height || top >= innerHeight || bottom <= 0 || left >= innerWidth || right <= 0) return [];
    const mirror = byOriginal.get(image);
    if (!(mirror instanceof HTMLImageElement)) return [];
    mirror.loading = 'eager';
    return [mirror.decode().catch(() => {})];
  }));
  const remove = () => {
    mirrorChanges.disconnect();
    window.removeEventListener('scroll', sync);
    layer.remove();
  };
  return { layer, show, remove, decodeVisibleImages };
}

export function EditorialThemeButton({ label, routeKey }: { label: string; routeKey: string }) {
  const root = document.documentElement;
  const [dark, setDark] = useState(() => root.dataset.theme === 'dark');
  const override = useRef<boolean | null>(null);
  const active = useRef<(() => string | undefined) | null>(null);
  const texture = useRef<Blob | null>(null);
  const supportsTexture = CSS.supports('mask-composite', 'subtract');

  useLayoutEffect(() => () => { active.current?.(); }, [routeKey]);

  useEffect(() => {
    if (!supportsTexture) return;
    const request = new AbortController();
    void fetch(inkTexture, { signal: request.signal }).then(response => {
      if (response.ok) return response.blob();
    }).then(blob => {
      if (blob?.size && !request.signal.aborted) texture.current = blob;
    }).catch(() => { /* The clip-path reveal is still available. */ });
    return () => request.abort();
  }, [supportsTexture]);

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
    const outgoingTheme = active.current?.() ?? root.dataset.theme ?? 'light';
    const page = event.currentTarget.closest<HTMLElement>('.ed-site');
    const canReveal = texture.current || CSS.supports('clip-path', 'path(evenodd, "M 0 0 H 1 V 1 Z")');
    if (theme === outgoingTheme || !page || !canReveal || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.detail ? event.clientX : rect.left + rect.width / 2;
    const y = event.detail ? event.clientY : rect.top + rect.height / 2;
    const width = root.clientWidth;
    const height = root.clientHeight;
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    const maskUrl = texture.current && URL.createObjectURL(texture.current);
    const { layer, show, remove, decodeVisibleImages } = makeInkLayer(page, outgoingTheme);
    const finish = () => {
      if (active.current !== finish) return;
      active.current = null;
      remove();
      if (maskUrl) URL.revokeObjectURL(maskUrl);
      delete root.dataset.edInk;
      if (layer.hasAttribute('data-ed-ink')) return;
      if (override.current === nextDark) update();
      return outgoingTheme;
    };
    const play = (url: string | null) => {
      if (active.current !== finish) return;
      root.dataset.edInk = '';
      if (url) {
        // The 900 × 800 shader render starts at (690, 90). Scale its reach to the viewport.
        const scale = Math.max(radius / 690, (width - x) / 210, y / 90);
        layer.style.setProperty('--ed-ink-mask', `url("${url}") ${x - 690 * scale}px ${y - 90 * scale}px / ${900 * scale}px ${800 * scale}px no-repeat`);
        layer.dataset.edInk = 'texture';
      } else {
        inkFrames.forEach(({ size, phase }, index) => {
          layer.style.setProperty(`--ed-ink-${index}`, inkCutout(x, y, radius * size, phase, width, height));
        });
        layer.dataset.edInk = 'contour';
      }
      update();
      void Promise.all(layer.getAnimations().map(animation => animation.finished)).then(finish, finish);
    };

    active.current = finish;
    show();
    const startScroll = scrollY;
    const decodeMask = async () => {
      if (!maskUrl) return null;
      const image = new Image();
      image.src = maskUrl;
      return image.decode().then(() => maskUrl, () => null);
    };
    // Keep the live page visible until the outgoing copy and the mask can paint together.
    void Promise.all([decodeMask(), decodeVisibleImages()]).then(async ([url]) => {
      if (active.current !== finish) return;
      if (startScroll !== scrollY) await decodeVisibleImages();
      play(url);
    });
  }

  return <button type="button" className="ed-theme" aria-label={label} aria-pressed={dark} title={label} onClick={toggle}>
    {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
  </button>;
}

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Atom, Box, Check, Code2, Database, Figma, GitBranch, Maximize2, Pause, Play, Triangle } from 'lucide-react';
import { ImageLightboxModal } from '@/components/ui/ImageLightboxModal';
import { BUSINESS_OFFER, EDUCATION, EXPERIENCE, PERSONAL, PROJECTS } from '@/lib/data';
import { ProductStory, storyKey } from './ProductMotion';
import { projectPath } from '@/lib/seo';
import { DOCUMENTS } from '@/components/ui/ResumeModal';
import { WRITING, writingPath } from '@/lib/editorial-writing';
import { CaseNarration, ChapterRail, EditorialArticle } from './EditorialChapters';
import { EditorialLab, hasProjectLab } from './EditorialLab';
import { EditorialThemeButton } from './EditorialThemeButton';
import rrPattern from './rr-pattern.svg?no-inline';
import { editorialPath, filipinoPath, localizedPath, FILIPINO } from '@/lib/editorial-language';
import './editorial.css';

const sections = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/media', label: 'Film & Media' },
];
const englishHeroWords = ['Developer', '&', 'Designer'];
const expertise = ['Web applications', 'Windows tools', '3D CAD', 'Product design', 'Hardware systems', 'Creative production'];
const mediaProjects = PROJECTS.filter(item => item.tag === 'media');
const studySections = [
  ['problem', 'Problem'], ['decision', 'Design decision'], ['result', 'Result'], ['limitations', 'Limitations'],
] as const;
const aboutImages = ['/portrait.png', '/images/video-10.png', '/images/cad/enclosure.png', '/projects/collegium-hero.png'];
const aboutImageCaptions = ['Raziel Salamat', 'UM Tagum College graduation film', 'Electronics enclosure CAD study', 'The Collegium newsroom'];

function RRMark() {
  return <svg aria-hidden="true" width="1em" height="1em" viewBox="64.75 65.12 29.81 29.76" fill="currentColor">
    <path d="M84.59,66.97v3.25c.02,1.02-.81,1.86-1.83,1.86l-9.16.04c-1.02,0-1.85.84-1.85,1.86l.04,9.15c0,1.02-.82,1.86-1.85,1.86h-3.25c-1.02.02-1.86-.81-1.86-1.83l-.07-16.11c0-1.02.82-1.86,1.85-1.86l16.12-.07c1.02,0,1.86.82,1.86,1.85Z" />
    <path d="M94.55,76.84v3.25c.02,1.02-.81,1.86-1.83,1.86l-9.16.04c-1.02,0-1.85.84-1.85,1.86l.04,9.15c0,1.02-.82,1.86-1.85,1.86h-3.25c-1.02.02-1.86-.81-1.86-1.83l-.07-16.11c0-1.02.82-1.86,1.85-1.86l16.12-.07c1.02,0,1.86.82,1.86,1.85Z" />
  </svg>;
}

const cleanPath = (path: string) => path.replace(/\/+$/, '') || '/';
const anchorFor = (hash: string) => {
  const id = hash === '#work' ? 'projects' : hash.slice(1);
  const anchor = document.getElementById(id);
  if (anchor || !id.startsWith('preview-')) return anchor;
  const reel = document.getElementById('desktop-screens');
  return reel?.dataset.previewAnchors?.split(' ').includes(id) ? reel : null;
};

function useLiveReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function EmailLink() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  return <a className="ed-email" href={`mailto:${PERSONAL.email}`} aria-label={`Copy email ${PERSONAL.email}`} onClick={event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !navigator.clipboard) return;
    event.preventDefault();
    void navigator.clipboard.writeText(PERSONAL.email).then(() => setCopied(true), () => { location.href = `mailto:${PERSONAL.email}`; });
  }}>
    <span data-copied={copied || undefined}>{PERSONAL.email}</span>
    <span role="status">{copied && <><Check size={13} aria-hidden="true" /> Copied</>}</span>
  </a>;
}

function WeightText({ text }: { text: string }) {
  return <>
    <span className="ed-weight-measure">{text}</span>
    <span className="ed-weight-ink" aria-hidden="true">
      {Array.from(text, (letter, index) => <span key={index}>{letter}</span>)}
    </span>
  </>;
}

function TypeTrail({ words, filipino, play }: { words: readonly string[]; filipino: boolean; play: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = heading.current;
    if (!play || !title) return;
    let waiting = true;

    const align = () => {
      const range = document.createRange();
      for (const word of title.children) {
        const text = word.querySelector('.ed-weight-measure')?.firstChild;
        if (!text) continue;
        const left = word.getBoundingClientRect().left;
        let top = 0;
        word.querySelectorAll<HTMLElement>('.ed-type-letters > span').forEach((letter, index) => {
          range.setStart(text, index);
          range.setEnd(text, index + 1);
          const box = range.getBoundingClientRect();
          if (index === 0) top = box.top;
          letter.style.left = `${box.left - left}px`;
          letter.style.top = `${box.top - top}px`;
        });
      }
    };

    const start = (loaded: boolean) => {
      if (!waiting) return;
      waiting = false;
      clearTimeout(deadline);
      // Keep the chosen face through the handoff if the web font arrives late.
      title.toggleAttribute('data-trail-fallback', !loaded);
      align();
      title.dataset.trail = 'playing';
      window.addEventListener('resize', align);
    };

    const deadline = window.setTimeout(() => start(false), 800);
    void document.fonts.load('500 1em "General Sans"', words.join(' ').toUpperCase()).then(
      faces => start(faces.length > 0), () => start(false),
    );
    return () => {
      waiting = false;
      clearTimeout(deadline);
      window.removeEventListener('resize', align);
      title.removeAttribute('data-trail-fallback');
    };
  }, [play, words]);

  return <h1 ref={heading} className={filipino ? 'ed-word-reveal' : 'ed-word-reveal ed-type-trail'}
    data-trail={play ? 'pending' : undefined} aria-label={words.join(' ')}>
    {words.map((word, wordIndex) => <span key={word} aria-hidden="true">
      <span className={filipino ? undefined : 'ed-weight-word'}>{filipino ? word : <WeightText text={word} />}</span>
      {play && <span className="ed-type-letters">
        {Array.from(word, (letter, index) => <span key={index} data-letter={letter}
          style={{ '--letter-delay': `${(words.slice(0, wordIndex).join('').length + index) * 21}ms` } as CSSProperties}>{letter}</span>)}
      </span>}
    </span>)}
  </h1>;
}

function useWeightHover(homePath: string | null) {
  const intro = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = intro.current;
    if (!homePath || !section) return;
    const media = matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    const active = new Set<HTMLElement>();
    let frame = 0;

    const clear = () => {
      cancelAnimationFrame(frame);
      for (const word of active) delete word.dataset.weightActive;
      active.clear();
    };

    const move = (event: PointerEvent) => {
      const block = (event.target as Element).closest('.ed-type-trail, .ed-intro > p');
      if (!media.matches || event.pointerType === 'touch' || !block || !section.contains(block)) {
        clear();
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const radius = parseFloat(getComputedStyle(block).fontSize) * 1.55;
        const range = document.createRange();
        const updates: { word: HTMLElement; letters: { letter: HTMLElement; x: number; strength: number }[] }[] = [];

        // Read the original text positions before writing any variable weights.
        for (const word of block.querySelectorAll<HTMLElement>('.ed-weight-word')) {
          const box = word.getBoundingClientRect();
          if (event.clientX < box.left - radius || event.clientX > box.right + radius ||
              event.clientY < box.top - radius || event.clientY > box.bottom + radius ||
              getComputedStyle(word).pointerEvents === 'none') continue;
          const text = word.querySelector('.ed-weight-measure')?.firstChild;
          if (!text?.textContent) continue;
          let offset = 0;
          const letters = Array.from(word.querySelectorAll<HTMLElement>('.ed-weight-ink > span'), letter => {
            range.setStart(text, offset);
            offset += letter.textContent?.length ?? 0;
            range.setEnd(text, offset);
            const bounds = range.getBoundingClientRect();
            const distance = Math.hypot(event.clientX - (bounds.left + bounds.width / 2), event.clientY - (box.top + box.height / 2));
            const proximity = Math.max(0, 1 - distance / radius);
            return { letter, x: bounds.left - box.left, strength: proximity ** 2 * (3 - 2 * proximity) };
          });
          if (letters.some(({ strength }) => strength > 0)) updates.push({ word, letters });
        }

        for (const word of active) {
          if (updates.some(update => update.word === word)) continue;
          delete word.dataset.weightActive;
          active.delete(word);
        }
        for (const { word, letters } of updates) {
          for (const { letter, x, strength } of letters) {
            letter.style.left = `${x}px`;
            letter.style.setProperty('--weight-strength', strength.toFixed(3));
          }
          word.dataset.weightActive = '';
          active.add(word);
        }
      });
    };

    section.addEventListener('pointermove', move);
    section.addEventListener('pointerleave', clear);
    media.addEventListener('change', clear);
    window.addEventListener('resize', clear);
    return () => {
      clear();
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', clear);
      media.removeEventListener('change', clear);
      window.removeEventListener('resize', clear);
    };
  }, [homePath]);

  return intro;
}

function BioWords({ text, start = 0 }: { text: string; start?: number }) {
  return text.split(' ').map((word, index) => <span className="ed-bio-word ed-weight-word" key={index}
    style={{ '--word-delay': `${450 + (start + index) * 35}ms` } as CSSProperties}><WeightText text={word} />{' '}</span>);
}
const phoneScreens = new Set([
  '/projects/twentyfour-camera.png',
  '/projects/twentyfour-roll.png',
  '/projects/lapcat-app-home.png',
  '/projects/lapcat-app-profile.png',
  '/projects/okuru-mobile.png',
  '/projects/hitoshii-group.png',
  '/projects/hitoshii-summary.png',
]);
const stack = [
  { label: 'Design', tools: [{ name: 'Figma', icon: Figma }, { name: 'Fusion 360', icon: Box }] },
  { label: 'Development', tools: [{ name: 'React', icon: Atom }, { name: 'TypeScript', mark: 'TS' }, { name: 'Tailwind CSS', icon: Code2 }, { name: 'Flutter', mark: 'F' }, { name: '.NET', mark: 'N' }] },
  { label: 'Backend', tools: [{ name: 'Supabase', icon: Database }] },
  { label: 'AI tools', tools: [{ name: 'ChatGPT', mark: 'AI' }, { name: 'Codex', icon: Code2 }] },
  { label: 'Version control & deployment', tools: [{ name: 'GitHub', icon: GitBranch }, { name: 'Vercel', icon: Triangle }] },
] as const;
const portraitProject = { id: 'portrait', num: '', title: 'Raziel Salamat', category: 'Portrait', tag: 'media', year: '', description: '', role: '', techStack: [], images: ['/portrait.png'] } as const;
const sideProjects = PROJECTS.filter(item => ['viewportlab', 'mdx-readme', 'arduino-visualizer'].includes(item.id));
const featured = [
  { id: 'twentyfour', cover: '/projects/twentyfour-camera.png', tone: 'amber', portrait: true, caption: 'A shared camera for events, with a timed reveal.' },
  { id: 'picolor', tone: 'blue', caption: 'Pick a color and build a palette around it.' },
  { id: 'quoter', tone: 'stone' },
  { id: 'hitoshii', tone: 'stone', caption: 'A launch site for an Android app that splits shared expenses.' },
  { id: 'lapcat-app', tone: 'green', portrait: true },
  { id: 'lapcat-website', tone: 'blue' },
  { id: 'the-collegium', tone: 'blue' },
  { id: 'okuru', cover: '/projects/okuru-mobile.png', tone: 'amber', portrait: true },
] as const;

const palettes = [
  { name: 'Clay', colors: ['#f7eee6', '#e5b68c', '#a7472d', '#55251a'] },
  { name: 'Forest', colors: ['#edf2e8', '#becfb1', '#537452', '#243b2c'] },
  { name: 'Ink', colors: ['#e9edf6', '#b7c9e7', '#4d6ba4', '#24334f'] },
];

function PaletteDemo() {
  const [palette, setPalette] = useState(palettes[0]!);
  return <section className="ed-demo" id="palette-demo" aria-label="Palette preview">
    <div><h2>Explore a palette</h2><p>An interactive sample inspired by the PiColor palette workflow.</p></div>
    <div className="ed-palette-controls" role="group" aria-label="Sample palettes">
      {palettes.map(item => <button key={item.name} type="button" aria-pressed={palette === item} onClick={() => setPalette(item)}>{item.name}</button>)}
    </div>
    <div className="ed-swatches" aria-live="polite">
      {palette.colors.map((color, index) => <div key={index} style={{ backgroundColor: color, color: index < 2 ? '#141413' : '#fff' }}><span>{color}</span></div>)}
    </div>
  </section>;
}

function CoverClip({ clip, title }: { clip: string; title: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const manual = useRef(false);
  useEffect(() => {
    const element = video.current;
    const card = element?.closest('article');
    if (!element || !card) return;
    const preferences = matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
    const stop = () => { manual.current = false; element.pause(); };
    const start = () => {
      if (!preferences.matches || manual.current) return;
      if (!element.src) element.src = `/motion/${clip}.mp4`;
      void element.play().catch(stop);
    };
    card.addEventListener('pointerenter', start);
    const leave = () => { if (!manual.current) stop(); };
    card.addEventListener('pointerleave', leave);
    const observer = new IntersectionObserver(([entry]) => { if (!entry?.isIntersecting) stop(); });
    observer.observe(card);
    preferences.addEventListener('change', stop);
    document.addEventListener('visibilitychange', stop);
    return () => {
      stop();
      card.removeEventListener('pointerenter', start);
      card.removeEventListener('pointerleave', leave);
      observer.disconnect();
      preferences.removeEventListener('change', stop);
      document.removeEventListener('visibilitychange', stop);
    };
  }, [clip]);
  return <>
    <video className="ed-cover-clip" ref={video} muted loop playsInline preload="none" aria-hidden="true" data-playing={playing || undefined} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button className="ed-cover-play" type="button" aria-label={`${playing ? 'Pause' : 'Play'} ${title} preview`} onClick={() => {
      const element = video.current;
      if (!element) return;
      manual.current = true;
      if (!element.paused) element.pause();
      else {
        if (!element.src) element.src = `/motion/${clip}.mp4`;
        void element.play().catch(() => setPlaying(false));
      }
    }}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
  </>;
}

function LogoField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useLiveReducedMotion();
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context || reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const spacing = 50;
    const stampSize = 6;
    const image = new Image();
    const stamp = document.createElement('canvas');
    const stampContext = stamp.getContext('2d');
    if (!stampContext) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let cursor: { x: number; y: number } | null = null;
    let press = { x: 0, y: 0, from: 0, to: 0, start: 0, duration: 1 };
    const strengthAt = (time: number) => {
      const progress = Math.min(1, Math.max(0, (time - press.start) / press.duration));
      const eased = 1 - (1 - progress) ** (press.to ? 2 : 3);
      return press.from + (press.to - press.from) * eased;
    };
    const offset = (distance: number, radius: number) => {
      const weight = Math.max(0, 1 - distance / radius);
      return distance > 0 ? weight * weight * (3 - 2 * weight) / distance : 0;
    };
    const render = (time: number) => {
      frame = 0;
      const pull = strengthAt(time) * 16;
      context.clearRect(0, 0, width, height);
      for (let y = -(scrollY % spacing); y <= height + 1; y += spacing) {
        for (let x = 0; x <= width + 1; x += spacing) {
          let dx = 0;
          let dy = 0;
          if (cursor) {
            const push = offset(Math.hypot(x - cursor.x, y - cursor.y), 300) * 12.5;
            dx = (x - cursor.x) * push;
            dy = (y - cursor.y) * push;
          }
          if (pull) {
            const attraction = offset(Math.hypot(x - press.x, y - press.y), 375) * pull;
            dx -= (x - press.x) * attraction;
            dy -= (y - press.y) * attraction;
          }
          context.drawImage(stamp, x + dx - stampSize / 2, y + dy - stampSize / 2, stampSize, stampSize);
        }
      }
      const inkDots = document.querySelector<HTMLCanvasElement>('.ed-ink-layer .ed-dots');
      if (inkDots) {
        if (inkDots.width !== element.width || inkDots.height !== element.height) {
          inkDots.width = element.width;
          inkDots.height = element.height;
        }
        const inkContext = inkDots.getContext('2d');
        inkContext?.clearRect(0, 0, inkDots.width, inkDots.height);
        inkContext?.drawImage(element, 0, 0);
      }
      if (time - press.start < press.duration) schedule();
    };
    const schedule = () => { if (!frame && element.hasAttribute('data-active')) frame = requestAnimationFrame(render); };
    const resize = () => {
      if (!element.hasAttribute('data-active')) return;
      width = element.clientWidth;
      height = element.clientHeight;
      const scale = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(width * scale);
      element.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const crop = (spacing - stampSize) / 2;
      stamp.width = stamp.height = Math.round(stampSize * scale);
      stampContext.drawImage(image, crop, crop, stampSize, stampSize, 0, 0, stamp.width, stamp.height);
      schedule();
    };
    const activate = () => {
      element.dataset.active = '';
      resize();
      cancelAnimationFrame(frame);
      render(performance.now());
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cursor = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const leave = () => { cursor = null; schedule(); };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      const start = performance.now();
      press = { x: event.clientX, y: event.clientY, from: strengthAt(start), to: 1, start, duration: 250 };
      schedule();
    };
    const up = () => {
      if (press.to === 0) return;
      const start = performance.now();
      press = { ...press, from: strengthAt(start), to: 0, start, duration: 600 };
      schedule();
    };

    image.addEventListener('load', activate);
    image.src = rrPattern;
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    document.addEventListener('visibilitychange', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      image.removeEventListener('load', activate);
      delete element.dataset.active;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
      document.removeEventListener('visibilitychange', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);
  return <canvas className="ed-dots" ref={canvas} aria-hidden="true" />;
}

function ProjectShowreel({ screens, onSelect, desktop = false }: { screens: { src: string; index: number; caption: string }[]; onSelect: (index: number) => void; desktop?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: .15 });
  const reduced = useLiveReducedMotion();
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => { if (inView) setStarted(true); }, [inView]);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const tileCount = 9 * 7;
  const centerTile = Math.floor(tileCount / 2);
  const firstScreen = screens[0];
  if (!firstScreen) return null;

  const playing = started && !reduced ? '' : undefined;
  const still = paused || !inView || hidden ? '' : undefined;
  const columns = 9;
  const rowCount = 5;
  const centerOffset = Math.floor(columns * rowCount / 2) % screens.length;
  const rows = !desktop || reduced ? [[firstScreen]] : Array.from({ length: rowCount }, (_, row) =>
    Array.from({ length: columns }, (_, column) =>
      screens[(row * columns + column + screens.length - centerOffset) % screens.length] ?? firstScreen
    )
  );

  return <figure className={desktop ? 'ed-showreel ed-desktop-reel' : 'ed-showreel ed-phone-reel'} id={desktop ? 'desktop-screens' : 'app-screens'}
    data-preview-anchors={desktop ? screens.map(({ index }) => `preview-${index + 1}`).join(' ') : undefined}>
    {desktop ? <div ref={stage} className="ed-desktop-stage" aria-hidden="true">
      <div className="ed-desktop-camera" data-playing={playing} data-paused={still}>
        {rows.map((row, rowIndex) => <div key={rowIndex} className="ed-desktop-lane">
          {row.map(({ src }, columnIndex) => <div className="ed-desktop-window" key={columnIndex}>
            <img src={src} alt="" loading="eager" decoding="async" />
          </div>)}
        </div>)}
      </div>
    </div> : <div ref={stage} className="ed-reel-stage" aria-hidden="true">
      <div className="ed-reel-grid" data-playing={playing} data-paused={still}>
        <div className="ed-reel-surround">
          {Array.from({ length: tileCount }, (_, index) => index === centerTile ? <div key={index} /> : (
            <div className="ed-reel-screen" key={index}>
              <img src={(screens[index % screens.length] ?? firstScreen).src} alt="" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="ed-reel-screen ed-reel-hero">
          <img src={firstScreen.src} alt="" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>}
    <figcaption>
      <span>{desktop ? 'Desktop screen showreel' : 'App screen showreel'}</span>
      <div className="ed-reel-controls">
        {screens.map(({ src, index, caption }, position) => (
          <button key={src} type="button" aria-label={`Enlarge ${caption}`} title={caption} onClick={() => onSelect(index)}>Screen {position + 1}</button>
        ))}
        {!reduced && <button type="button" onClick={() => setPaused(value => !value)}>{paused ? 'Resume reel' : 'Pause reel'}</button>}
      </div>
    </figcaption>
  </figure>;
}

export function EditorialPortfolio() {
  const [route, setRoute] = useState(() => ({ path: cleanPath(location.pathname), hash: location.hash, internal: false, fade: false, scroll: undefined as number | undefined }));
  const filipino = filipinoPath(route.path);
  const path = editorialPath(route.path);
  const href = (destination: string) => localizedPath(destination, filipino);
  const project = PROJECTS.find(item => projectPath(item) === path);
  const articleIndex = WRITING.findIndex(item => writingPath(item.slug) === path);
  const article = WRITING[articleIndex];
  const missing = !project && !article && !['/', '/about', '/media'].includes(path);
  const reelScreens = project?.images?.flatMap((src, index) => phoneScreens.has(src)
    ? [{ src, index, caption: project.imageCaptions?.[index] ?? `screen ${index + 1}` }]
    : []) ?? [];
  const home = path === '/';
  const weightHover = useWeightHover(home ? route.path : null);
  const about = path === '/about';
  const media = path === '/media';
  const heroWords = filipino ? FILIPINO.role : englishHeroWords;
  const intro = filipino ? FILIPINO.intro : ['I’m Raziel Salamat, a', 'computer engineering student and developer', 'building web apps, Windows tools, and CAD prototypes.'] as const;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const internalEntry = navigation?.type === 'navigate' && document.referrer.startsWith(location.origin + '/');
  const internalVisit = route.internal || internalEntry;
  const [zoom, setZoom] = useState<number | null>(null);
  const outgoing = useRef<Animation | null>(null);
  const reduced = useLiveReducedMotion();
  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const restore = (event: PopStateEvent) => {
      outgoing.current?.cancel();
      setZoom(null);
      setRoute({ path: cleanPath(location.pathname), hash: location.hash || event.state?.portfolioAnchor || '', internal: true, fade: false, scroll: event.state?.portfolioScroll });
    };
    const persistScroll = () => {
      history.replaceState({ ...history.state, portfolioScroll: scrollY }, '');
    };
    window.addEventListener('popstate', restore);
    window.addEventListener('pagehide', persistScroll);
    return () => {
      history.scrollRestoration = previousRestoration;
      window.removeEventListener('popstate', restore);
      window.removeEventListener('pagehide', persistScroll);
    };
  }, []);
  useLayoutEffect(() => {
    const anchor = anchorFor(route.hash);
    if (route.internal) {
      const main = document.getElementById('content');
      if (main) {
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
      }
      if (!anchor) window.scrollTo({ top: route.scroll ?? 0, behavior: 'instant' });
    }
    if (route.scroll !== undefined && !location.hash) {
      window.scrollTo({ top: route.scroll, behavior: 'instant' });
      return;
    }
    anchor?.scrollIntoView({ behavior: 'instant' });
  }, [route]);
  useEffect(() => {
    document.documentElement.lang = filipino ? 'fil' : 'en';
    document.title = about ? `${filipino ? FILIPINO.nav[2] : 'About'} | Raziel Salamat` : media ? `${filipino ? FILIPINO.nav[3] : 'Film & Media'} | Raziel Salamat`
      : project ? `${project.title} | Raziel Salamat` : article ? `${filipino ? FILIPINO.writing[articleIndex]?.[0] : article.title} | Raziel Salamat` : home ? 'Raziel Salamat | Developer & CAD Designer' : 'Page not found | Raziel Salamat';
  }, [about, article, articleIndex, filipino, home, media, project]);
  const navigate = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as Element).closest('a');
    if (!link || link.target || link.hasAttribute('download') || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    url.pathname = cleanPath(url.pathname);
    const destination = editorialPath(url.pathname);
    const toProject = PROJECTS.some(item => projectPath(item) === destination);
    const toArticle = WRITING.some(item => writingPath(item.slug) === destination);
    if (!toProject && !toArticle && !['/', '/about', '/media'].includes(destination)) return;
    const homeSection = destination === '/' && ['#projects', '#work', '#writing', '#top'].includes(url.hash);
    if (url.pathname === route.path) {
      outgoing.current?.cancel();
      if (homeSection) {
        event.preventDefault();
        history.replaceState(history.state, '', href('/'));
        anchorFor(url.hash)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
      } else if (!url.hash) event.preventDefault();
      return;
    }
    event.preventDefault();
    const main = document.getElementById('content');
    const opacity = main ? getComputedStyle(main).opacity : '1';
    outgoing.current?.cancel();
    const toEditorialPage = destination === '/about' || destination === '/media';
    const fade = (toProject || project || toArticle || article || toEditorialPage || (about || media) && destination === '/')
      && !reduced && !!main?.animate;
    const open = () => {
      history.replaceState({ ...history.state, portfolioScroll: scrollY }, '');
      history.pushState(homeSection ? { portfolioAnchor: url.hash } : null, '', homeSection ? url.pathname : url);
      setZoom(null);
      setRoute({ path: url.pathname, hash: url.hash, internal: true, fade, scroll: undefined });
    };
    if (fade && main) {
      const animation = main.animate([{ opacity }, { opacity: 0 }], {
        duration: 160, easing: 'cubic-bezier(.33,.56,.67,.9)', fill: 'forwards',
      });
      outgoing.current = animation;
      void animation.finished.then(() => {
        if (outgoing.current !== animation) return;
        outgoing.current = null;
        open();
      }, () => {});
    } else {
      open();
    }
  };
  const nextFeatured = project ? featured.findIndex(item => item.id === project.id) : -1;
  const next = project && (nextFeatured >= 0
    ? PROJECTS.find(item => item.id === featured[(nextFeatured + 1) % featured.length]?.id)
    : PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length]);
  const projectImages = project?.images ?? (project?.coverImage ? [project.coverImage] : []);
  const desktopScreens = projectImages.flatMap((src, index) => project?.desktopScreens?.includes(index)
    ? [{ src, index, caption: project.imageCaptions?.[index] ?? `screen ${index + 1}` }]
    : []);
  const isReelScreen = (src: string, index: number) => phoneScreens.has(src) || project?.desktopScreens?.includes(index);
  const nextClip = next && storyKey(next.id);
  const chapters = project ? [
    { id: 'overview', label: 'Overview' },
    ...(desktopScreens.length ? [{ id: 'desktop-screens', label: 'Desktop screen showreel' }] : []),
    ...(project.id === 'picolor' ? [{ id: 'palette-demo', label: 'Palette demo' }] : []),
    ...(project.caseStudy ? [{ id: 'narration', label: 'Narration' }] : []),
    ...(storyKey(project.id) ? [{ id: 'workflow', label: 'Workflow' }] : []),
    ...(hasProjectLab(project.id) ? [{ id: 'project-lab', label: 'Interactive example' }] : []),
    ...projectImages.flatMap((src, index) => isReelScreen(src, index) ? [] : [{ id: `preview-${index + 1}`, label: project.imageCaptions?.[index] ?? `Preview ${index + 1}` }]),
    ...(reelScreens.length ? [{ id: 'app-screens', label: 'App screen showreel' }] : []),
    ...(project.lead ? [{ id: 'project-details', label: 'Project details' }] : []),
    ...(project.caseStudy ? studySections.map(([id, label]) => ({ id, label })) : []),
  ] : [];
  const reveal = reduced ? {} : {
    initial: { opacity: .9, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .16 },
    transition: { duration: .26, ease: 'easeOut' as const },
  };
  const renderPreview = (src: string, index: number) => {
    const caption = project?.imageCaptions?.[index];
    const image = <img src={src} alt={caption ?? `${project?.title} preview ${index + 1}`} loading={index ? 'lazy' : 'eager'} decoding="async" />;
    return <motion.figure key={src} id={`preview-${index + 1}`} {...reveal}>
      <button className="ed-zoom" type="button" aria-label={`Enlarge preview ${index + 1}`} onClick={() => setZoom(index)}>
        {image}
        <span aria-hidden="true"><Maximize2 size={16} /></span>
      </button>
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>;
  };
  if (missing) return <div className="ed-site ed-error" onClick={navigate}><main id="content"><p>404</p><h1>{filipino ? 'Hindi makita ang pahina' : 'Page not found'}</h1><a className="ed-action" href={href('/')}>{filipino ? 'Bumalik sa portfolio' : 'Back to portfolio'} <ArrowUpRight size={16} /></a></main></div>;

  return <div className="ed-site" id="top" onClick={navigate} data-internal-visit={internalVisit || undefined} data-page-fade={route.fade || undefined} data-locale={filipino ? 'fil' : undefined}>
    <LogoField />
    <a className="ed-skip" href="#content">Skip to content</a>
    <header className="ed-nav" data-enter={!internalEntry || undefined}>
      <nav aria-label="Main navigation">
        <a href={href(home ? '/#top' : '/')}>
          <RRMark />
          Raziel Salamat
        </a>
        {sections.map(({ href: destination, label }, index) => <a key={destination} href={href(destination)} aria-current={path === destination || (article && label === 'Writing') ? 'page' : undefined}>{filipino ? FILIPINO.nav[index] : label}</a>)}
      </nav>
      <div className="ed-nav-options">
        <a className="ed-language" href={path} hrefLang="en" lang="en" aria-current={!filipino ? 'true' : undefined} aria-label="English">EN</a>
        <EditorialThemeButton label={filipino ? 'Madilim na tema' : 'Dark mode'} routeKey={route.path} />
        <a className="ed-available" href={`mailto:${PERSONAL.email}`}>{filipino ? 'Bukas sa trabaho' : 'Open to work'}</a>
      </div>
    </header>

    <div className="ed-route" key={`page:${route.path}`}>
    {home ? <main id="content">
      <section className="ed-hero" data-home-enter={!route.hash || undefined} aria-label="Introduction">

        <div className="ed-hero-content" ref={weightHover}>
          <TypeTrail words={heroWords} filipino={filipino} play={!filipino && !reduced && !route.hash} />
          <div className="ed-hero-meta"><EmailLink /><span>{filipino ? 'Nasa Tagum City,' : 'Based in Tagum City,'}<br />{filipino ? 'Pilipinas' : 'Philippines'}</span></div>
          <div className="ed-intro">
            <p><BioWords text={intro[0]} /><strong><BioWords text={intro[1]} start={intro[0].split(' ').length} /></strong><BioWords text={intro[2]} start={intro[0].split(' ').length + intro[1].split(' ').length} /></p>
            <div><h2>{filipino ? 'Mga kasanayan' : 'Expertise'}</h2><ul>{(filipino ? FILIPINO.expertise : expertise).map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </div>
      </section>
      <section className="ed-band" id="projects">
        <h2 className="ed-section-title">{filipino ? <>Mga piling<br />gawa</> : <>Selected<br />work</>}</h2>
        <div className="ed-grid">
          {featured.map(spec => {
            const item = PROJECTS.find(project => project.id === spec.id)!;
            const portrait = 'portrait' in spec;
            const clip = storyKey(item.id);
            const image = <img src={('cover' in spec ? spec.cover : item.coverImage) ?? item.images?.[0]} alt="" loading="lazy" decoding="async" />;
            return <motion.article key={item.id} data-portrait={portrait} {...reveal}>
              <div className="ed-card-title"><h3><a className="ed-card-link" href={href(projectPath(item))}>{item.title}</a></h3><span>{filipino && FILIPINO.projectLeads[item.id] || ('caption' in spec ? spec.caption : item.role)}</span></div>
              <div className="ed-cover" data-tone={spec.tone}>
                {portrait ? <div className="ed-cover-phone">{image}</div> : image}
                {clip && <CoverClip clip={clip} title={item.title} />}
              </div>
              <div className="ed-card-meta"><span>{item.category}</span><span>View <ArrowUpRight size={13} /></span></div>
            </motion.article>;
          })}
        </div>
      </section>
      <section className="ed-band" aria-labelledby="side-title">
        <div className="ed-section-heading"><h2 className="ed-section-title" id="side-title">{filipino ? <>Iba pang<br />ginagawa ko</> : <>Things I make<br />on the side</>}</h2><small>{filipino ? 'Iba pang proyekto' : 'Side projects'}</small></div>
        <ul className="ed-index">{sideProjects.map((item, index) => <li key={item.id}>
          <a href={item.liveUrl ?? item.githubUrl ?? href(projectPath(item))} target={item.liveUrl || item.githubUrl ? '_blank' : undefined} rel="noreferrer"><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{filipino ? FILIPINO.projectLeads[item.id] ?? item.lead : item.lead}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
      <section className="ed-band" id="writing">
        <div className="ed-section-heading"><h2 className="ed-section-title">{filipino ? 'Mga sulatin' : 'Writing'}</h2><small>{filipino ? 'Mga tala sa disenyo at engineering' : 'Notes on design and engineering'}</small></div>
        <ul className="ed-index">{WRITING.map((item, index) => <li key={item.slug}>
          <a href={href(writingPath(item.slug))}><span>{String(index + 1).padStart(2, '0')}</span><strong>{filipino ? FILIPINO.writing[index]?.[0] : item.title}</strong><span>{filipino ? FILIPINO.writing[index]?.[1] : item.summary}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
      <section className="ed-band" id="index">
        <details><summary className="ed-section-title">{filipino ? 'Lahat ng proyekto' : 'Project index'}</summary>
        <ul className="ed-index">{PROJECTS.map((item, index) => <li key={item.id}>
          <a href={href(projectPath(item))}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.category}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul></details>
      </section>
    </main> : about ? <main key={route.path} className="ed-band ed-case ed-about" id="content">
        <span className="ed-eyebrow">{filipino ? FILIPINO.nav[2] : 'About'}</span>
        <h1 className="ed-page-title">{filipino ? FILIPINO.about[0] : 'I’m Raziel, a developer and designer in Tagum City.'}</h1>
        <div className="ed-about-bio ed-prose">
          <p>{filipino ? FILIPINO.about[1] : 'I’m a computer engineering student building web apps, Windows tools, and CAD prototypes.'}</p>
          <p>{filipino ? FILIPINO.about[2] : 'My work at Code & Craft spans graphic design, CAD and prototyping. I also work behind the camera, from filming and editing to helping run live campus productions.'}</p>
          <p>{filipino ? FILIPINO.about[3] : BUSINESS_OFFER}</p>
        </div>
        <button className="ed-zoom ed-portrait-trigger" type="button" aria-label="Enlarge portrait" onClick={() => setZoom(0)}>
          <span className="ed-portrait-collage">{aboutImages.slice(1).map((src, index) => <img src={src} key={src} alt={aboutImageCaptions[index + 1]} loading="lazy" decoding="async" />)}<img className="ed-portrait" src="/portrait.png" alt="Raziel Salamat" decoding="async" /></span>
          <span aria-hidden="true"><Maximize2 size={16} /></span>
        </button>
        <section className="ed-prose"><h2>{filipino ? 'Karanasan' : 'Career'}</h2>{EXPERIENCE.map(item => <div className="ed-career-row" key={item.id}><span className="ed-career-mark" aria-hidden="true">{item.company === 'CODE&CRAFT' ? 'CC' : 'UM'}</span><span><strong>{item.company}</strong><span lang="en">{item.role}</span></span><time lang="en">{item.period}</time></div>)}
        <h2>{filipino ? 'Mga teknolohiyang ginagamit' : 'Tech stack'}</h2>
        <dl className="ed-tech-stack">{stack.map(group => <div key={group.label}>
          <dt>{group.label}</dt>
          <dd><ul>{group.tools.map(tool => <li key={tool.name}>
            {'icon' in tool ? <tool.icon size={16} aria-hidden="true" /> : <span aria-hidden="true" className="ed-tech-mark">{tool.mark}</span>}
            {tool.name}
          </li>)}</ul></dd>
        </div>)}</dl>
        <p>{EDUCATION[0]?.degree} · Expected graduation 2027</p>
        <div className="ed-document-links"><a href={DOCUMENTS.resume.url}>View résumé <ArrowUpRight size={16} /></a><a href={DOCUMENTS.resume.url} download={DOCUMENTS.resume.filename}>Download résumé</a><a href={DOCUMENTS.portfolio.url}>Portfolio PDF <ArrowUpRight size={16} /></a></div>
        </section>
    </main> : media ? <main key={route.path} className="ed-band ed-case" id="content">
      <div className="ed-media-kicker"><span className="ed-eyebrow">{filipino ? FILIPINO.nav[3] : 'Film & Media'}</span><span>{mediaProjects.length} {filipino ? 'proyekto' : 'projects'}</span></div>
      <h1 className="ed-page-title">{filipino ? 'Nagtatrabaho rin ako sa likod ng kamera.' : 'I also work behind the camera.'}</h1>
      <p className="ed-case-lead">{filipino ? 'Mga piling gawa sa produksiyon, pag-edit, at cinematography.' : 'Selected production, editing, and cinematography work.'}</p>
      <div className="ed-media">{[0, 1].map(lane => <div className="ed-media-lane" key={lane}>{mediaProjects.filter((_, index) => index % 2 === lane).map(item => <motion.a className="ed-card" key={item.id} href={href(projectPath(item))} {...reveal}>
        <div className="ed-cover"><img src={item.coverImage ?? item.images?.[0]} alt="" loading="lazy" decoding="async" /></div>
        <div className="ed-card-meta"><span>{item.title}</span><span>View <ArrowUpRight size={13} /></span></div>
      </motion.a>)}</div>)}</div>
    </main> : article ? <EditorialArticle key={route.path} article={article} filipino={filipino} /> : project ? <main key={route.path} id="content" className="ed-case ed-band ed-project" lang="en">
      <div id="overview">
      <div className="ed-case-kicker"><span>{project.num} / {PROJECTS.length} · Case study</span><span>{project.category}</span></div>
      <h1 className="ed-project-title" aria-label={project.title}>
        {project.title.split(' ').map((word, wordIndex) => <span key={wordIndex} className="ed-project-word" aria-hidden="true">
          {Array.from(word).map((letter, index) => <span key={index} style={{ '--letter-delay': `${((wordIndex * 62 + index * 137) % 380)}ms` } as CSSProperties}>{letter}</span>)}
        </span>)}
      </h1>
      <div className="ed-project-overview"><p className="ed-case-lead" lang={filipino && FILIPINO.projectLeads[project.id] ? 'fil' : undefined}>{filipino && FILIPINO.projectLeads[project.id] || project.lead || project.description}</p>
      <dl className="ed-case-meta"><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Category</dt><dd>{project.category}</dd></div><div><dt>Technology</dt><dd>{project.techStack.join(' · ')}</dd></div></dl>
      </div><div className="ed-case-links">{[
        [project.liveUrl, project.liveLabel ?? 'Visit project'],
        [project.githubUrl, 'Source code'],
        [project.videoUrl, 'Watch video'],
      ].map(([url, label]) => url && <a key={url} href={url} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} /></a>)}</div>
      </div>
      {chapters.length > 1 && <ChapterRail chapters={chapters} />}
      {desktopScreens.length > 0 && <ProjectShowreel desktop screens={desktopScreens} onSelect={setZoom} />}
      {project.id === 'picolor' && <PaletteDemo />}
      {project.caseStudy && <CaseNarration chapters={studySections.map(([id, title]) => ({ title, text: project.caseStudy![id] }))} />}
      {storyKey(project.id) && <div id="workflow"><ProductStory id={project.id} /></div>}
      {hasProjectLab(project.id) && <EditorialLab project={project} />}
      {projectImages.map((src, index) =>
        !isReelScreen(src, index) && renderPreview(src, index)
      )}
      {reelScreens.length > 0 && <ProjectShowreel key={project.id} screens={reelScreens} onSelect={setZoom} />}
      {project.lead && <section className="ed-case-notes" id="project-details" aria-label="Project details">
        <h2>Project details</h2>
        <p>{project.description}</p>
      </section>}
      {project.caseStudy && <section className="ed-case-notes" id="notes">
        <h2>{project.caseStudy.status}</h2>
        {studySections.map(([key, label]) => <section id={key} key={key}><h3>{label}</h3><p>{project.caseStudy![key]}</p></section>)}
      </section>}
      {next && <article className="ed-next">
        <span>Next project</span><div><a className="ed-card-link" href={href(projectPath(next))}>{next.title} <ArrowUpRight /></a><small>{next.lead}</small></div>
        {(next.coverImage ?? next.images?.[0]) && <div className="ed-cover"><img src={next.coverImage ?? next.images?.[0]} alt="" loading="lazy" decoding="async" />{nextClip && <CoverClip clip={nextClip} title={next.title} />}</div>}
      </article>}
    </main> : null}
    </div>

    <footer className="ed-footer ed-band" id="contact" data-case-footer={!!project || undefined}>
      <div>{project ? <a href={href('/#projects')}>{filipino ? '← Lahat ng gawa' : '← All work'}</a> : <nav aria-label="Social links"><a href={PERSONAL.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={PERSONAL.socials.github} target="_blank" rel="noreferrer">GitHub</a><a href={DOCUMENTS.resume.url}>Résumé</a></nav>}<EmailLink /></div>
      {!project && <motion.p className="ed-footer-wordmark" initial={reduced ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={reduced ? { duration: 0 } : { opacity: { duration: .9 }, y: { duration: 1.1 }, ease: [.19, 1, .22, 1] }}>
        <RRMark />
        <span>Raziel Salamat</span>
      </motion.p>}
    </footer>
    {(about || project) && <ImageLightboxModal key={`gallery:${route.path}`} appearance="editorial" project={about ? { ...portraitProject, techStack: [], images: aboutImages, imageCaptions: aboutImageCaptions } : project ?? null} currentImageIndex={zoom ?? 0} isOpen={zoom !== null} onClose={() => setZoom(null)} onSelectImage={setZoom} />}
  </div>;
}

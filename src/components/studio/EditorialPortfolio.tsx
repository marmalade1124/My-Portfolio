import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Atom, Box, Code2, Database, Figma, GitBranch, Maximize2, Triangle } from 'lucide-react';
import { ImageLightboxModal } from '@/components/ui/ImageLightboxModal';
import { BUSINESS_OFFER, EDUCATION, EXPERIENCE, PERSONAL, PROJECTS } from '@/lib/data';
import { ProductStory, storyKey } from './ProductMotion';
import { projectPath } from '@/lib/seo';
import { DOCUMENTS } from '@/components/ui/ResumeModal';
import './editorial.css';

const sections = [
  { href: '/#work', label: 'Projects' },
  { href: '/#writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/media', label: 'Film & Media' },
];
const expertise = ['Web applications', 'Windows tools', '3D CAD', 'Product design', 'Hardware systems', 'Creative production'];
const stack = [
  { label: 'Design', tools: [{ name: 'Figma', icon: Figma }, { name: 'Fusion 360', icon: Box }] },
  { label: 'Development', tools: [{ name: 'React', icon: Atom }, { name: 'TypeScript', mark: 'TS' }, { name: 'Tailwind CSS', icon: Code2 }, { name: 'Flutter', mark: 'F' }, { name: '.NET', mark: 'N' }] },
  { label: 'Backend', tools: [{ name: 'Supabase', icon: Database }] },
  { label: 'Version control & deployment', tools: [{ name: 'GitHub', icon: GitBranch }, { name: 'Vercel', icon: Triangle }] },
] as const;
const portraitProject = { id: 'portrait', num: '', title: 'Raziel Salamat', category: 'Portrait', tag: 'media', year: '', description: '', role: '', techStack: [], images: ['/portrait.png'] } as const;
const sideProjects = PROJECTS.filter(item => ['viewportlab', 'mdx-readme', 'arduino-visualizer'].includes(item.id));
const featured = [
  { id: 'twentyfour', cover: '/projects/twentyfour-camera.png', tone: 'amber', portrait: true, caption: 'A shared camera for events, with a timed reveal.' },
  { id: 'picolor', tone: 'blue', caption: 'Pick a color and build a palette around it.' },
  { id: 'quoter', tone: 'stone' },
  { id: 'hitoshii', tone: 'green', portrait: true },
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
  return <section className="ed-demo" aria-label="Palette preview">
    <div><h2>Explore a palette</h2><p>An interactive sample inspired by the PiColor palette workflow.</p></div>
    <div className="ed-palette-controls" role="group" aria-label="Sample palettes">
      {palettes.map(item => <button key={item.name} type="button" aria-pressed={palette === item} onClick={() => setPalette(item)}>{item.name}</button>)}
    </div>
    <div className="ed-swatches" aria-live="polite">
      {palette.colors.map((color, index) => <div key={index} style={{ backgroundColor: color, color: index < 2 ? '#141413' : '#fff' }}><span>{color}</span></div>)}
    </div>
  </section>;
}

function CoverClip({ clip }: { clip: string }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    const card = element?.closest('a');
    if (!element || !card) return;
    const preferences = matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
    const stop = () => { element.pause(); delete element.dataset.playing; };
    const start = () => {
      if (!preferences.matches) return;
      if (!element.src) element.src = `/motion/${clip}.mp4`;
      void element.play().catch(stop);
    };
    card.addEventListener('pointerenter', start);
    card.addEventListener('pointerleave', stop);
    preferences.addEventListener('change', stop);
    document.addEventListener('visibilitychange', stop);
    return () => {
      stop();
      card.removeEventListener('pointerenter', start);
      card.removeEventListener('pointerleave', stop);
      preferences.removeEventListener('change', stop);
      document.removeEventListener('visibilitychange', stop);
    };
  }, [clip]);
  return <video className="ed-cover-clip" ref={video} muted loop playsInline preload="none" aria-hidden="true" onPlaying={event => { event.currentTarget.dataset.playing = ''; }} />;
}

function DotField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context || reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const spacing = 50;
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
      context.beginPath();
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
          context.moveTo(x + dx + 1, y + dy);
          context.arc(x + dx, y + dy, 1, 0, 2 * Math.PI);
        }
      }
      context.fill();
      if (time - press.start < press.duration) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const resize = () => {
      width = element.clientWidth;
      height = element.clientHeight;
      const scale = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(width * scale);
      element.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.fillStyle = 'rgb(50 50 50 / .35)';
      schedule();
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

    element.dataset.active = '';
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      delete element.dataset.active;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);
  return <canvas className="ed-dots" ref={canvas} aria-hidden="true" />;
}

export function EditorialPortfolio() {
  const [route, setRoute] = useState(() => ({ path: location.pathname, hash: location.hash, internal: false, fade: false }));
  const project = PROJECTS.find(item => projectPath(item) === route.path);
  const home = route.path === '/';
  const about = route.path === '/about';
  const media = route.path === '/media';
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const internalVisit = route.internal || (navigation?.type === 'navigate' && document.referrer.startsWith(location.origin + '/'));
  const [zoom, setZoom] = useState<number | null>(null);
  const outgoing = useRef<Animation | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const restore = () => {
      outgoing.current?.cancel();
      setRoute(previous => previous.path === location.pathname
        ? previous : { path: location.pathname, hash: location.hash, internal: true, fade: false });
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  useLayoutEffect(() => {
    const anchor = document.getElementById(route.hash.slice(1));
    if (route.internal) {
      const main = document.getElementById('content');
      if (main) {
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
      }
      if (!anchor) window.scrollTo({ top: 0, behavior: 'instant' });
    }
    anchor?.scrollIntoView({ behavior: 'instant' });
  }, [route]);
  useEffect(() => {
    document.title = about ? 'About | Raziel Salamat' : media ? 'Film & Media | Raziel Salamat'
      : project ? `${project.title} | Raziel Salamat` : home ? 'Raziel Salamat | Developer & CAD Designer' : 'Project not found | Raziel Salamat';
  }, [about, home, media, project]);
  const navigate = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as Element).closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === route.path) {
      outgoing.current?.cancel();
      if (!url.hash) event.preventDefault();
      return;
    }
    event.preventDefault();
    const main = document.getElementById('content');
    const opacity = main ? getComputedStyle(main).opacity : '1';
    outgoing.current?.cancel();
    const homeSection = url.pathname === '/' && (url.hash === '#work' || url.hash === '#writing');
    const fade = (about || media) && (url.pathname === '/about' || url.pathname === '/media' || homeSection)
      && !reduced && !!main?.animate;
    const open = () => {
      history.pushState(null, '', url);
      setRoute({ path: url.pathname, hash: url.hash, internal: true, fade });
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
  const next = project && PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
  const reveal = reduced ? {} : {
    initial: { opacity: .9, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .16 },
    transition: { duration: .26, ease: 'easeOut' as const },
  };
  return <div className="ed-site" id="top" data-internal-visit={internalVisit || undefined} data-page-fade={route.fade || undefined}>
    <DotField />
    <a className="ed-skip" href="#content">Skip to content</a>
    <header className="ed-nav">
      <nav aria-label="Main navigation" onClick={navigate}>
        <a href={home ? '#top' : '/'}>Raziel Salamat</a>
        {sections.map(({ href, label }) => <a key={href} href={href} aria-current={route.path === href ? 'page' : undefined}>{label}</a>)}
      </nav>
      <a className="ed-available" href={`mailto:${PERSONAL.email}`}>Open to work</a>
    </header>

    {home ? <main id="content">
      <section className="ed-hero" aria-label="Introduction">

        <div className="ed-hero-content">
          <h1 className="ed-word-reveal" aria-label="Developer & Designer">
            {['Developer', '&', 'Designer'].map(word => <span key={word} aria-hidden="true"><span>{word}</span></span>)}
          </h1>
          <div className="ed-hero-meta"><a href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</a><span>Based in Tagum City,<br />Philippines</span></div>
          <div className="ed-intro">
            <p>I’m Raziel Salamat, a <strong>computer engineering student and developer</strong> building web apps, Windows tools, and CAD prototypes.</p>
            <div><h2>Expertise</h2><ul>{expertise.map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </div>
      </section>
      <section className="ed-band" id="work">
        <h2 className="ed-section-title">Selected<br />work</h2>
        <div className="ed-grid">
          {featured.map(spec => {
            const item = PROJECTS.find(project => project.id === spec.id)!;
            const portrait = 'portrait' in spec;
            const clip = !portrait && storyKey(item.id);
            const image = <img src={('cover' in spec ? spec.cover : item.coverImage) ?? item.images?.[0]} alt="" loading="lazy" decoding="async" />;
            return <motion.article key={item.id} data-portrait={portrait} {...reveal}>
            <a href={projectPath(item)} className="ed-card">
              <div className="ed-card-title"><h3>{item.title}</h3><span>{'caption' in spec ? spec.caption : item.role}</span></div>
              <div className="ed-cover" data-tone={spec.tone}>
                {portrait ? <div className="ed-cover-phone">{image}</div> : image}
                {clip && <CoverClip clip={clip} />}
              </div>
              <div className="ed-card-meta"><span>{item.category}</span><span>View <ArrowUpRight size={13} /></span></div>
            </a>
            </motion.article>;
          })}
        </div>
      </section>
      <section className="ed-band" aria-labelledby="side-title">
        <h2 className="ed-section-title" id="side-title">Things I make<br />on the side</h2>
        <ul className="ed-index">{sideProjects.map((item, index) => <li key={item.id}>
          <a href={projectPath(item)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.category}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
      <section className="ed-band" id="writing">
        <h2 className="ed-section-title">Writing</h2>
        <ul className="ed-index">{PROJECTS.filter(item => item.caseStudy).map((item, index) => <li key={item.id}>
          <a href={`${projectPath(item)}#notes`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.caseStudy?.status}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
      <section className="ed-band" id="index">
        <details><summary className="ed-section-title">Project index</summary>
        <ul className="ed-index">{PROJECTS.map((item, index) => <li key={item.id}>
          <a href={projectPath(item)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.category}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul></details>
      </section>
    </main> : about ? <main key="about" className="ed-band ed-case ed-about" id="content">
        <span className="ed-eyebrow">About</span>
        <h1 className="ed-page-title">I’m Raziel, a developer and designer in Tagum City.</h1>
        <p>I’m a computer engineering student building web apps, Windows tools, and CAD prototypes.</p>
        <button className="ed-zoom ed-portrait-trigger" type="button" aria-label="Enlarge portrait" onClick={() => setZoom(0)}>
          <img className="ed-portrait" src="/portrait.png" alt="Raziel Salamat" />
          <span aria-hidden="true"><Maximize2 size={16} /></span>
        </button>
        <section className="ed-prose"><h2>Career</h2>{EXPERIENCE.map(item => <div className="ed-career-row" key={item.id}><strong>{item.role}</strong><span>{item.company}</span><span>{item.period}</span></div>)}
        <h2>Tech stack</h2>
        <dl className="ed-tech-stack">{stack.map(group => <div key={group.label}>
          <dt>{group.label}</dt>
          <dd><ul>{group.tools.map(tool => <li key={tool.name}>
            {'icon' in tool ? <tool.icon size={16} aria-hidden="true" /> : <span aria-hidden="true" className="ed-tech-mark">{tool.mark}</span>}
            {tool.name}
          </li>)}</ul></dd>
        </div>)}</dl>
        <p>{BUSINESS_OFFER}</p>
        <p>{EDUCATION[0]?.degree} · Expected graduation 2027</p>
        <div className="ed-document-links"><a href={DOCUMENTS.resume.url}>View résumé <ArrowUpRight size={16} /></a><a href={DOCUMENTS.resume.url} download={DOCUMENTS.resume.filename}>Download résumé</a><a href={DOCUMENTS.portfolio.url}>Portfolio PDF <ArrowUpRight size={16} /></a></div>
        </section>
    </main> : media ? <main key="media" className="ed-band ed-case" id="content">
      <span className="ed-eyebrow">Film &amp; Media</span>
      <h1 className="ed-page-title">I also work behind the camera.</h1>
      <p className="ed-case-lead">Selected production, editing, and cinematography work.</p>
      <div className="ed-media">{PROJECTS.filter(item => item.tag === 'media').map(item => <a className="ed-card" key={item.id} href={projectPath(item)}>
        <div className="ed-cover"><img src={item.coverImage ?? item.images?.[0]} alt="" loading="lazy" decoding="async" /></div>
        <div className="ed-card-meta"><span>{item.title}</span><span>View <ArrowUpRight size={13} /></span></div>
      </a>)}</div>
    </main> : project ? <main id="content" className="ed-case ed-band">
      <div className="ed-case-kicker"><span>{project.num} / {PROJECTS.length} · Case study</span><span>{project.category}</span></div>
      <h1>{project.title}</h1>
      <p className="ed-case-lead">{project.description}</p>
      <dl className="ed-case-meta"><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Category</dt><dd>{project.category}</dd></div><div><dt>Technology</dt><dd>{project.techStack.join(' · ')}</dd></div></dl>
      <div className="ed-case-links">{[
        [project.liveUrl, project.liveLabel ?? 'Visit project'],
        [project.githubUrl, 'Source code'],
        [project.videoUrl, 'Watch video'],
      ].map(([url, label]) => url && <a key={url} href={url} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} /></a>)}</div>
      {project.id === 'picolor' && <PaletteDemo />}
      {storyKey(project.id) && <ProductStory id={project.id} />}
      {(project.images?.length ?? 0) > 1 && <details className="ed-case-index">
        <summary>On this page</summary>
        <ol>{project.images?.map((src, index) => <li key={src}><a href={`#preview-${index + 1}`}>{project.imageCaptions?.[index] ?? `Preview ${index + 1}`}</a></li>)}</ol>
      </details>}
      {(project.images ?? (project.coverImage ? [project.coverImage] : [])).map((src, index) => <motion.figure key={src} id={`preview-${index + 1}`} {...reveal}>
        <button className="ed-zoom" type="button" aria-label={`Enlarge preview ${index + 1}`} onClick={() => setZoom(index)}>
          <img src={src} alt={project.imageCaptions?.[index] ?? `${project.title} preview ${index + 1}`} loading={index ? 'lazy' : 'eager'} decoding="async" />
          <span aria-hidden="true"><Maximize2 size={16} /></span>
        </button>
        {project.imageCaptions?.[index] && <figcaption>{project.imageCaptions[index]}</figcaption>}
      </motion.figure>)}
      {project.caseStudy && <section className="ed-case-notes" id="notes">
        <h2>{project.caseStudy.status}</h2>
        {([['Problem', 'problem'], ['Design decision', 'decision'], ['Result', 'result'], ['Limitations', 'limitations']] as const).map(([label, key]) => <div key={key}><h3>{label}</h3><p>{project.caseStudy![key]}</p></div>)}
      </section>}
      {next && <a href={projectPath(next)} className="ed-next">
        <div><span>Next project</span>{next.title} <ArrowUpRight /></div>
        {(next.coverImage ?? next.images?.[0]) && <img src={next.coverImage ?? next.images?.[0]} alt="" loading="lazy" decoding="async" />}
      </a>}
      <a className="ed-back" href="/#work">← All work</a>
    </main> : <main className="ed-band ed-case" id="content"><h1>Project not found</h1><a href="/#index">View project index</a></main>}

    <footer className="ed-footer ed-band" id="contact">
      <div><nav aria-label="Social links"><a href={PERSONAL.socials.linkedin}>LinkedIn</a><a href={PERSONAL.socials.github}>GitHub</a><a href={DOCUMENTS.resume.url}>Résumé</a></nav><a href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</a></div>
      <motion.p {...reveal}>Raziel Salamat</motion.p>
    </footer>
    <ImageLightboxModal project={about ? { ...portraitProject, techStack: [], images: ['/portrait.png'] } : project ?? null} currentImageIndex={zoom ?? 0} isOpen={zoom !== null} onClose={() => setZoom(null)} onSelectImage={setZoom} />
  </div>;
}

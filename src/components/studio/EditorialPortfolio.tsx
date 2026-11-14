import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS_OFFER, EDUCATION, PERSONAL, PROJECTS } from '@/lib/data';
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

function DotField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context || reduced) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    let previous: { x: number; y: number } | null = null;
    const draw = () => {
      frame = 0;
      if (previous) context.clearRect(previous.x - 192, previous.y - 192, 384, 384);
      previous = null;
      if (!pointer) return;
      const bounds = element.getBoundingClientRect();
      const local = { x: pointer.x - bounds.left, y: pointer.y - bounds.top };
      previous = local;
      for (let y = Math.max(0, Math.ceil((local.y - 175) / 50) * 50); y < Math.min(height, local.y + 175); y += 50) {
        for (let x = Math.max(0, Math.ceil((local.x - 175) / 50) * 50); x < Math.min(width, local.x + 175); x += 50) {
          const dx = x - local.x;
          const dy = y - local.y;
          const distance = Math.hypot(dx, dy);
          if (distance >= 175) continue;
          const influence = (1 - distance / 175) ** 2;
          context.fillStyle = `rgba(38, 38, 34, ${influence * .58})`;
          context.beginPath();
          context.arc(x + dx * influence * .35, y + dy * influence * .35, 1 + influence * 2, 0, Math.PI * 2);
          context.fill();
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
      height = element.clientHeight;
      const ratio = Math.min(devicePixelRatio, 2);
      element.width = width * ratio;
      element.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      schedule();
    });
    const host = element.parentElement!;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const leave = () => { pointer = null; schedule(); };
    resize.observe(element);
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);
  return <canvas className="ed-dots" ref={canvas} aria-hidden="true" />;
}

export function EditorialPortfolio() {
  const project = PROJECTS.find(item => projectPath(item) === location.pathname);
  const home = location.pathname === '/';
  const about = location.pathname === '/about';
  const media = location.pathname === '/media';
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const next = project && PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
  const reveal = reduced ? {} : {
    initial: { opacity: .9, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .16 },
    transition: { duration: .26, ease: 'easeOut' as const },
  };
  return <div className="ed-site" id="top">
    <a className="ed-skip" href="#content">Skip to content</a>
    <header className="ed-nav">
      <nav aria-label="Main navigation">
        <a href={home ? '#top' : '/'}>Raziel Salamat</a>
        {sections.map(({ href, label }) => <a key={href} href={href} aria-current={location.pathname === href ? 'page' : undefined}>{label}</a>)}
      </nav>
      <a className="ed-available" href={`mailto:${PERSONAL.email}`}>Open to work</a>
    </header>

    {home ? <main id="content">
      <section className="ed-hero" aria-label="Introduction">
        <DotField />
        <div className="ed-hero-content">
          <motion.h1 initial={reduced ? false : { opacity: .75, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, ease: 'easeOut' }}>Developer &amp; Designer</motion.h1>
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
            const image = <img src={('cover' in spec ? spec.cover : item.coverImage) ?? item.images?.[0]} alt="" loading="lazy" decoding="async" />;
            return <motion.article key={item.id} data-portrait={portrait} {...reveal}>
            <a href={projectPath(item)} className="ed-card">
              <div className="ed-card-title"><h3>{item.title}</h3><span>{'caption' in spec ? spec.caption : item.role}</span></div>
              <div className="ed-cover" data-tone={spec.tone}>
                {portrait ? <div className="ed-cover-phone">{image}</div> : image}
              </div>
              <div className="ed-card-meta"><span>{item.category}</span><span>View <ArrowUpRight size={13} /></span></div>
            </a>
            </motion.article>;
          })}
        </div>
      </section>
      <section className="ed-band" id="writing">
        <h2 className="ed-section-title">Project notes</h2>
        <ul className="ed-index">{PROJECTS.filter(item => item.caseStudy).map((item, index) => <li key={item.id}>
          <a href={`${projectPath(item)}#notes`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.caseStudy?.status}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
      <section className="ed-band" id="index">
        <h2 className="ed-section-title">Project index</h2>
        <ul className="ed-index">{PROJECTS.map((item, index) => <li key={item.id}>
          <a href={projectPath(item)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.category}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
    </main> : about ? <main className="ed-band ed-case ed-about" id="content">
        <h1>About</h1>
        <p>I’m Raziel Salamat, a computer engineering student and developer in Tagum City, Philippines. I build web apps, Windows tools, and CAD prototypes.</p>
        <p>{BUSINESS_OFFER}</p>
        <p>{EDUCATION[0]?.degree} · Expected graduation 2027</p>
        <div className="ed-document-links"><a href={DOCUMENTS.resume.url}>View résumé <ArrowUpRight size={16} /></a><a href={DOCUMENTS.resume.url} download={DOCUMENTS.resume.filename}>Download résumé</a><a href={DOCUMENTS.portfolio.url}>Portfolio PDF <ArrowUpRight size={16} /></a></div>
    </main> : media ? <main className="ed-band ed-case" id="content">
      <h1>Film &amp; Media</h1>
      <p className="ed-case-lead">Selected production, editing, and cinematography work.</p>
      <div className="ed-media">{PROJECTS.filter(item => item.tag === 'media').map(item => <a className="ed-card" key={item.id} href={projectPath(item)}>
        <div className="ed-cover"><img src={item.coverImage ?? item.images?.[0]} alt="" loading="lazy" decoding="async" /></div>
        <div className="ed-card-meta"><span>{item.title}</span><span>View <ArrowUpRight size={13} /></span></div>
      </a>)}</div>
    </main> : project ? <main id="content" className="ed-case ed-band">
      <a className="ed-back" href="/#work">← Selected work</a>
      <h1>{project.title}</h1>
      <div className="ed-case-meta"><span>{project.role}</span><span>{project.category}</span><span>{project.year}</span></div>
      <p className="ed-case-lead">{project.description}</p>
      <div className="ed-case-links">{[
        [project.liveUrl, project.liveLabel ?? 'Visit project'],
        [project.githubUrl, 'Source code'],
        [project.videoUrl, 'Watch video'],
      ].map(([url, label]) => url && <a key={url} href={url} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} /></a>)}</div>
      <p className="ed-stack">{project.techStack.join(' · ')}</p>
      {project.id === 'picolor' && <PaletteDemo />}
      {(project.images?.length ?? 0) > 1 && <details className="ed-case-index">
        <summary>On this page</summary>
        <ol>{project.images?.map((src, index) => <li key={src}><a href={`#preview-${index + 1}`}>{project.imageCaptions?.[index] ?? `Preview ${index + 1}`}</a></li>)}</ol>
      </details>}
      {(project.images ?? (project.coverImage ? [project.coverImage] : [])).map((src, index) => <motion.figure key={src} id={`preview-${index + 1}`} {...reveal}>
        <img src={src} alt={project.imageCaptions?.[index] ?? `${project.title} preview ${index + 1}`} loading={index ? 'lazy' : 'eager'} decoding="async" />
        {project.imageCaptions?.[index] && <figcaption>{project.imageCaptions[index]}</figcaption>}
      </motion.figure>)}
      {project.caseStudy && <section className="ed-case-notes" id="notes">
        <h2>{project.caseStudy.status}</h2>
        {([['Problem', 'problem'], ['Design decision', 'decision'], ['Result', 'result'], ['Limitations', 'limitations']] as const).map(([label, key]) => <div key={key}><h3>{label}</h3><p>{project.caseStudy![key]}</p></div>)}
      </section>}
      {next && <a href={projectPath(next)} className="ed-next"><span>Next project</span>{next.title} <ArrowUpRight /></a>}
    </main> : <main className="ed-band ed-case" id="content"><h1>Project not found</h1><a href="/#index">View project index</a></main>}

    <footer className="ed-footer ed-band" id="contact">
      <div><nav aria-label="Social links"><a href={PERSONAL.socials.linkedin}>LinkedIn</a><a href={PERSONAL.socials.github}>GitHub</a><a href={DOCUMENTS.resume.url}>Résumé</a></nav><a href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</a></div>
      <motion.p {...reveal}>Raziel Salamat</motion.p>
    </footer>
  </div>;
}

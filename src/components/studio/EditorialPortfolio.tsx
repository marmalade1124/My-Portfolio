import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS_OFFER, EDUCATION, PERSONAL, PROJECTS } from '@/lib/data';
import { projectPath } from '@/lib/seo';
import { DOCUMENTS } from '@/components/ui/ResumeModal';
import './editorial.css';

const sections = [
  { id: 'work', label: 'Projects' },
  { id: 'index', label: 'Index' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];
const expertise = ['Web applications', 'Windows tools', '3D CAD', 'Product design', 'Hardware systems', 'Creative production'];

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
    const draw = () => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      if (!pointer) return;
      for (let y = 0; y < height; y += 50) {
        for (let x = 0; x < width; x += 50) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
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
      const bounds = element.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
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
  const reduced = useReducedMotion();
  const next = project && PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
  const reveal = reduced ? {} : {
    initial: { opacity: .65, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .16 },
    transition: { duration: .5, ease: 'easeOut' as const },
  };
  return <div className="ed-site">
    <a className="ed-skip" href="#content">Skip to content</a>
    <header className="ed-nav">
      <nav aria-label="Main navigation">
        <a href="/">Raziel Salamat</a>
        {sections.map(({ id, label }) => <a key={id} href={`${home ? '' : '/'}#${id}`}>{label}</a>)}
      </nav>
      <a className="ed-available" href={`mailto:${PERSONAL.email}`}>Open to work</a>
    </header>

    {home ? <main id="content">
      <section className="ed-hero" aria-label="Introduction">
        <DotField />
        <div className="ed-hero-content">
          <motion.h1 initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>Developer &amp; Designer</motion.h1>
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
          {PROJECTS.slice(0, 8).map(item => <motion.article key={item.id} {...reveal}>
            <a href={projectPath(item)} className="ed-card">
              <div className="ed-card-title"><h3>{item.title}</h3><span>{item.role}</span></div>
              <div className="ed-cover" data-portrait={['hitoshii', 'lapcat-app'].includes(item.id)}>
                <img src={item.coverImage ?? item.images?.[0]} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="ed-card-meta"><span>{item.category}</span><span>View <ArrowUpRight size={13} /></span></div>
            </a>
          </motion.article>)}
        </div>
      </section>
      <section className="ed-band" id="index">
        <h2 className="ed-section-title">Project index</h2>
        <ul className="ed-index">{PROJECTS.map((item, index) => <li key={item.id}>
          <a href={projectPath(item)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><span>{item.category}</span><ArrowUpRight size={16} /></a>
        </li>)}</ul>
      </section>
      <section className="ed-band ed-about" id="about">
        <h2 className="ed-section-title">About</h2>
        <p>{BUSINESS_OFFER}</p>
        <p>{EDUCATION[0]?.degree} · Expected graduation 2027</p>
        <div className="ed-document-links"><a href={DOCUMENTS.resume.url}>View résumé <ArrowUpRight size={16} /></a><a href={DOCUMENTS.resume.url} download={DOCUMENTS.resume.filename}>Download résumé</a><a href={DOCUMENTS.portfolio.url}>Portfolio PDF <ArrowUpRight size={16} /></a></div>
      </section>
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
      {project.caseStudy && <section className="ed-case-notes">
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

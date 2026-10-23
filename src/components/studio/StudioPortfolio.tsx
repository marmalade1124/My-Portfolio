import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { PERSONAL, PROJECTS, EDUCATION, EXPERIENCE, LEADERSHIP, SKILLS, type Project } from '@/lib/data';
import { ResumeModal, DOCUMENTS, type DocumentKind } from '@/components/ui/ResumeModal';
import { ImageLightboxModal } from '@/components/ui/ImageLightboxModal';
import './studio.css';

type View = 'Showcase' | 'List' | 'Slider';
type Panel = 'menu' | 'about' | 'contact' | 'documents' | 'project' | null;
const FEATURED = PROJECTS.slice(0, 6);
const VIEWS: View[] = ['Showcase', 'List', 'Slider'];
const pad = (number: number) => String(number).padStart(2, '0');

function Dialog({ title, children, onClose, opener }: { title: string; children: ReactNode; onClose: () => void; opener: HTMLElement | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = Array.from(ref.current?.querySelectorAll<HTMLElement>('button, a[href], summary, [tabindex="0"]') ?? []);
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); requestAnimationFrame(() => opener?.focus({ preventScroll: true })); };
  }, [onClose, opener]);
  return <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="studio-dialog">
    <header><span>{title}</span><button ref={close} onClick={onClose} aria-label={`Close ${title}`}><X size={20} /> Close</button></header>
    <div className="studio-dialog-body">{children}</div>
  </div>;
}

export function StudioPortfolio() {
  const [view, setView] = useState<View>('Showcase');
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Project>(FEATURED[0]!);
  const [documentKind, setDocumentKind] = useState<DocumentKind | null>(null);
  const [gallery, setGallery] = useState<Project | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const gesture = useRef({ x: 0, dragged: false });
  const wheel = useRef({ at: -Infinity, distance: 0 });
  const lastFocus = useRef<HTMLElement | null>(null);
  const current = FEATURED[active]!;
  const modalOpen = !!panel || !!documentKind || !!gallery;

  const move = (direction: number, keyboard = false) => {
    setInstant(keyboard);
    setActive(index => (index + direction + FEATURED.length) % FEATURED.length);
  };
  const openProject = (project: Project) => { setSelected(project); setPanel('project'); };
  const closePanel = () => setPanel(null);
  const openDocument = (kind: DocumentKind) => { setPanel(null); setDocumentKind(kind); };

  return <div className="studio-root">
    <div className="studio-shell" inert={modalOpen} onFocusCapture={event => { lastFocus.current = event.target as HTMLElement; }}>
      <header className="studio-header">
        <a className="studio-wordmark" href="#" aria-label="Raziel Salamat home" onClick={() => { setView('Showcase'); setActive(0); }}>RΛZIEL</a>
        <nav aria-label="Portfolio views">{VIEWS.map(mode => <button key={mode} aria-pressed={view === mode} onClick={() => { setInstant(true); setView(mode); }}>{mode}</button>)}</nav>
        <button className="studio-menu" onClick={() => setPanel('menu')}>Menu <span>+</span></button>
      </header>
      <main className="studio-main">
        <h1 className="sr-only">Raziel Salamat — software, CAD, and visual storytelling</h1>
        <div className="studio-intro"><span>Independent developer & designer</span><p>I turn ideas into web apps, Windows tools,<br className="studio-desktop" /> and physical concepts. A practice shaped<br className="studio-desktop" /> by engineering, curiosity, and making.</p><button onClick={() => setPanel('about')}>Based in the Philippines ↗</button></div>
        <div className={`studio-gallery studio-view-${view.toLowerCase()} ${instant ? 'studio-instant' : ''}`} aria-label="Selected project gallery" role="region" tabIndex={0}
          onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(1, true); } if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(-1, true); } }}
          onWheel={event => { if (view === 'List') return; wheel.current.distance += event.deltaY + event.deltaX; const now = performance.now(); if (Math.abs(wheel.current.distance) > 70 && now - wheel.current.at > 500) { move(Math.sign(wheel.current.distance)); wheel.current = { at: now, distance: 0 }; } }}
          onPointerDown={event => { gesture.current = { x: event.clientX, dragged: false }; }}
          onPointerUp={event => { const distance = event.clientX - gesture.current.x; if (Math.abs(distance) > 45) { gesture.current.dragged = true; move(distance < 0 ? 1 : -1); } }}>
          {FEATURED.map((project, index) => {
            let offset = (index - active + FEATURED.length) % FEATURED.length;
            if (offset > FEATURED.length / 2) offset -= FEATURED.length;
            const hidden = view === 'Showcase' ? Math.abs(offset) > 2 : view === 'Slider' ? offset !== 0 : Math.abs(offset) > 1;
            return <button key={project.id} className={`studio-project ${offset === 0 ? 'studio-project-active' : ''} studio-project-${project.id}`} style={{ '--offset': offset, '--depth': Math.abs(offset) } as CSSProperties}
              aria-label={`Open ${project.title}`} aria-hidden={hidden} tabIndex={offset === 0 ? 0 : -1} disabled={hidden}
              onClick={event => { if (gesture.current.dragged) { gesture.current.dragged = false; return; } if (offset === 0) openProject(project); else { setInstant(event.detail === 0); setActive(index); } }}>
              <div className="studio-poster">
                <span className="studio-poster-type">{project.tag === 'cad' ? 'FORM / FUNCTION' : project.tag === 'media' ? 'PEOPLE / PERSPECTIVE' : 'DESIGN / DEVELOPMENT'}</span>
                <img src={view === 'Showcase' && project.id === 'twentyfour' ? project.images![1] : project.coverImage} alt={`${project.title} project preview`} draggable={false} loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'} />
                <span className="studio-poster-bottom"><span>{project.title}</span><ArrowUpRight size={14} /></span>
              </div>
            </button>;
          })}
        </div>
        {view === 'List' && <div className="studio-index" role="region" aria-label="All projects" tabIndex={0}><p>PROJECT INDEX / {PROJECTS.length}</p>{PROJECTS.map((project, index) => <button key={project.id} onClick={() => openProject(project)}><span>{pad(index + 1)}</span><span>{project.title}</span><ArrowUpRight size={12} /></button>)}</div>}
        <div className="studio-caption" aria-live="polite"><span>{current.category}</span><button onClick={() => openProject(current)}>{current.title} <ArrowUpRight size={13} /></button><span>{current.role}</span><span>R{pad(active + 1)}</span></div>
        <div className="studio-browse"><button aria-label="Previous project" onClick={event => move(-1, event.detail === 0)}><ArrowLeft size={17} /></button><span>{pad(active + 1)} / {pad(FEATURED.length)}</span><button aria-label="Next project" onClick={event => move(1, event.detail === 0)}><ArrowRight size={17} /></button></div>
      </main>
      <footer className="studio-footer"><button className="studio-talk" onClick={() => setPanel('contact')}>Let's talk <ArrowUpRight size={15} /></button><span className="studio-explore">Drag or scroll to explore <ArrowDown size={12} /></span><span>© {new Date().getFullYear()} Raziel Salamat</span></footer>
    </div>

    {panel && <Dialog opener={lastFocus.current} title={panel === 'project' ? selected.title : panel === 'menu' ? 'Navigation' : panel === 'documents' ? 'Resume & portfolio' : panel === 'about' ? 'About Raziel' : 'Let’s talk'} onClose={closePanel}>
      {panel === 'menu' && <div className="studio-menu-layout"><div className="studio-menu-links"><button onClick={() => { setView('Showcase'); setPanel(null); }}>Selected work <span>01</span></button><button onClick={() => { setView('List'); setPanel(null); }}>Project index <span>02</span></button><button onClick={() => setPanel('about')}>About & experience <span>03</span></button><button onClick={() => setPanel('documents')}>Resume & portfolio <span>04</span></button><button onClick={() => setPanel('contact')}>Get in touch <span>05</span></button></div><aside><p>{PERSONAL.location}<br />Philippines / GMT+8</p><p>Computer Engineering student.<br />Expected graduation 2027.</p><span className="studio-available">Available for opportunities</span></aside></div>}
      {panel === 'about' && <div className="studio-about"><p className="studio-eyebrow">Concept to creation</p><h2>Building between<br />the physical<br /><em>and the digital.</em></h2><p className="studio-lead">I’m Raziel, a developer and CAD designer based in Tagum City. I build web experiences, desktop tools, and engineering concepts—with an eye for how they look and how they work.</p><div className="studio-about-grid"><div><h3>Experience</h3>{EXPERIENCE.map(item => <div className="studio-info-row" key={item.id}><h4>{item.role}</h4><p>{item.company} · {item.period}</p><ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div>)}</div><div><h3>Education</h3>{EDUCATION.map(item => <div className="studio-info-row" key={item.id}><h4>{item.degree}</h4><p>{item.school}<br />{item.period}</p></div>)}<h3>Leadership</h3>{LEADERSHIP.map(item => <div className="studio-info-row" key={item.id}><h4>{item.role}</h4><p>{item.org} · {item.period}</p><p>{item.details}</p></div>)}<h3>Toolkit</h3>{SKILLS.map(item => <div className="studio-info-row" key={item.label}><h4>{item.label}</h4><p>{item.items.join(' / ')}</p></div>)}</div></div><button className="studio-solid" onClick={() => setPanel('documents')}>View resume & portfolio <ArrowUpRight size={16} /></button></div>}
      {panel === 'documents' && <div className="studio-documents"><h2>The short version.<br /><em>The full picture.</em></h2>{(Object.keys(DOCUMENTS) as DocumentKind[]).map(kind => <div key={kind}><h3>{DOCUMENTS[kind].title}</h3><p>{DOCUMENTS[kind].description}</p><span>{DOCUMENTS[kind].pages} pages / {DOCUMENTS[kind].size}</span><button onClick={() => openDocument(kind)}>View {DOCUMENTS[kind].title.toLowerCase()} <ArrowUpRight size={16} /></button><a href={DOCUMENTS[kind].url} download={DOCUMENTS[kind].filename}>Download ↓</a></div>)}</div>}
      {panel === 'contact' && <div className="studio-contact"><p className="studio-eyebrow">Have something in mind?</p><h2>Let’s make<br /><em>something real.</em></h2><a className="studio-email" href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}<ArrowUpRight /></a><p>Open to full-time roles and project collaborations.<br />Tagum City, Philippines / GMT+8</p><div><a href={PERSONAL.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={PERSONAL.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><button onClick={() => setPanel('documents')}>Resume & portfolio ↗</button></div></div>}
      {panel === 'project' && <article className="studio-case"><p className="studio-eyebrow">{selected.category} / {selected.year}</p><h2>{selected.title}</h2><p className="studio-lead">{selected.description}</p><div className="studio-case-meta"><span>{selected.role}</span><span>{selected.techStack.join(' / ')}</span></div>{selected.coverImage && <img src={selected.coverImage} alt={`${selected.title} overview`} />}<div className="studio-case-actions">{selected.liveUrl && <a href={selected.liveUrl} target="_blank" rel="noreferrer">{selected.liveLabel ?? 'Visit project'} ↗</a>}{selected.githubUrl && <a href={selected.githubUrl} target="_blank" rel="noreferrer">Source code ↗</a>}{selected.videoUrl && <a href={selected.videoUrl} target="_blank" rel="noreferrer">Watch film ↗</a>}{selected.coverImage && <button onClick={() => { setPanel(null); setGallery(selected); setImageIndex(0); }}>View gallery ↗</button>}</div>{selected.caseStudy && <><p className="studio-eyebrow">{selected.caseStudy.status}</p><div className="studio-case-copy">{[['The problem',selected.caseStudy.problem],['The approach',selected.caseStudy.decision],['The result',selected.caseStudy.result],['Scope & limitations',selected.caseStudy.limitations]].map(([label,text]) => <div key={label}><h3>{label}</h3><p>{text}</p></div>)}</div>{selected.caseStudy.evidence.map(evidence => <figure key={evidence.image}><img src={evidence.image} alt={evidence.caption} loading="lazy" /><figcaption>{evidence.caption}</figcaption></figure>)}</>}</article>}
    </Dialog>}
    <ResumeModal document={documentKind} onClose={() => setDocumentKind(null)} />
    <ImageLightboxModal project={gallery} isOpen={!!gallery} currentImageIndex={imageIndex} onSelectImage={setImageIndex} onClose={() => setGallery(null)} />
  </div>;
}

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { PERSONAL, PROJECTS, EDUCATION, EXPERIENCE, LEADERSHIP, SKILLS, type Project } from '@/lib/data';
import { ResumeModal, DOCUMENTS, type DocumentKind } from '@/components/ui/ResumeModal';
import { ProjectPage } from './ProjectPage';
import { Certifications } from './Certifications';
import { AnimatedCover } from './ProductMotion';
import { useGalleryMotion, type GalleryView } from './useGalleryMotion';
import './studio.css';

type View = GalleryView;
type Panel = 'menu' | 'about' | 'contact' | 'documents' | 'certifications' | null;
const FEATURED = PROJECTS.slice(0, 7);
const VIEWS: View[] = ['Showcase', 'List', 'Slider'];
const pad = (number: number) => String(number).padStart(2, '0');

function Dialog({ title, children, onClose, opener }: { title: string; children: ReactNode; onClose: () => void; opener: HTMLElement | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return; }
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
  const [coversPaused, setCoversPaused] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [route, setRoute] = useState(() => window.location.pathname);
  const [entering, setEntering] = useState(() => window.location.pathname === '/' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!entering) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const skip = () => { if (media.matches) setEntering(false); };
    media.addEventListener('change', skip);
    return () => media.removeEventListener('change', skip);
  }, [entering]);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [exiting, setExiting] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const routeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectRoute = PROJECTS.find(project => `/work/${project.id}` === route);
  const navigateProject = (project: Project, way: 'next' | 'prev' = 'next', instant = false) => {
    setDirection(way); setKeyboardNav(instant);
    history.pushState({}, '', `/work/${project.id}`); setRoute(window.location.pathname); setExiting(false);
  };
  const home = () => { if (routeTimer.current) clearTimeout(routeTimer.current); history.pushState({}, '', '/'); setRoute('/'); setExiting(false); };
  useEffect(() => { const pop = () => { setKeyboardNav(true); setRoute(window.location.pathname); setPanel(null); }; window.addEventListener('popstate', pop); return () => { window.removeEventListener('popstate', pop); if (routeTimer.current) clearTimeout(routeTimer.current); }; }, []);
  const [documentKind, setDocumentKind] = useState<DocumentKind | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const current = FEATURED[active]!;
  const modalOpen = !!panel || !!documentKind;
  const motion = useGalleryMotion(view, FEATURED.length, !modalOpen && !projectRoute, setActive, entering);
  const move = motion.move;

  const openProject = (project: Project, instant = false) => {
    if (exiting) return;
    if (instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigateProject(project, 'next', true);
    else { setExiting(true); routeTimer.current = setTimeout(() => navigateProject(project), 550); }
  };
  const closePanel = () => setPanel(null);
  const openDocument = (kind: DocumentKind) => { setPanel(null); setDocumentKind(kind); };

  return <div className={`studio-root ${keyboardNav ? 'studio-keyboard' : ''} ${entering ? 'studio-enter' : ''}`}
    onPointerDownCapture={() => setEntering(false)} onWheelCapture={() => setEntering(false)} onKeyDownCapture={() => setEntering(false)} onFocusCapture={() => setEntering(false)}
    onAnimationEndCapture={event => { if (event.animationName === 'studio-arrive-gallery') setEntering(false); }}>
    <div className={`studio-shell ${exiting ? 'studio-exit' : ''}`} inert={modalOpen} onFocusCapture={event => { lastFocus.current = event.target as HTMLElement; }}>
      {projectRoute ? <ProjectPage key={projectRoute.id} project={projectRoute} direction={direction} navigate={navigateProject} home={home} menu={() => setPanel('menu')} /> : route !== '/' ? <div className="studio-not-found"><h1>Project not found.</h1><button onClick={home}>Back to work</button></div> : <>
      <header className="studio-header">
        <a className="studio-wordmark" href="#" aria-label="Raziel Salamat home" onClick={() => { setView('Showcase'); motion.select(0,true); }}>RΛZIEL</a>
        <nav aria-label="Portfolio views">{VIEWS.map(mode => <button key={mode} aria-pressed={view === mode} onClick={() => { setView(mode); }}>{mode}</button>)}</nav>
        <button className="studio-menu" onClick={() => setPanel('menu')}>Menu <span>+</span></button>
      </header>
      <main className="studio-main">
        <h1 className="sr-only">Raziel Salamat — software, CAD, and visual storytelling</h1>
        <div className="studio-intro"><span>Independent developer & designer</span><p>I turn ideas into web apps, Windows tools,<br className="studio-desktop" /> and physical concepts. A practice shaped<br className="studio-desktop" /> by engineering, curiosity, and making.</p><button onClick={() => setPanel('about')}>Based in the Philippines ↗</button></div>
        <div ref={motion.viewport} className={`studio-gallery studio-view-${view.toLowerCase()}`} aria-label="Selected project gallery" role="region" tabIndex={0}
          onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(1, true); } if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(-1, true); } }}>
          <div ref={motion.ring} className="studio-ring">
          {FEATURED.map((project, index) => {
            const centered = index === active;
            return <button key={project.id} className={`studio-project ${centered ? 'studio-project-active' : ''} studio-project-${project.id}`}
              aria-label={`Open ${project.title}`} tabIndex={centered ? 0 : -1}
              onClick={event => { if (motion.suppressClick()) return; if (centered) openProject(project,event.detail === 0); else motion.select(index,event.detail === 0); }}>
              <div className="studio-poster">
                <span className="studio-poster-type">{project.tag === 'cad' ? 'FORM / FUNCTION' : project.tag === 'media' ? 'PEOPLE / PERSPECTIVE' : 'DESIGN / DEVELOPMENT'}</span>
                <img src={project.coverImage} alt={`${project.title} project preview`} draggable={false} loading="eager" />
                <AnimatedCover id={project.id} active={centered && !modalOpen && !exiting && !coversPaused} />
                <span className="studio-poster-bottom"><span>{project.title}</span><ArrowUpRight size={14} /></span>
              </div>
            </button>;
          })}
          </div>
        </div>
        {view === 'List' && <div className="studio-index" role="region" aria-label="All projects" tabIndex={0}><p>PROJECT INDEX / {PROJECTS.length}</p>{PROJECTS.map((project, index) => <button key={project.id} onClick={() => openProject(project)}><span>{pad(index + 1)}</span><span>{project.title}</span><ArrowUpRight size={12} /></button>)}</div>}
        <div className="studio-caption" aria-live="polite"><span>{current.category}</span><button onClick={() => openProject(current)}>{current.title} <ArrowUpRight size={13} /></button><span>{current.role}</span><span>R{pad(active + 1)}</span></div>
        <div className="studio-browse"><button aria-label="Previous project" onClick={event => move(-1, event.detail === 0)}><ArrowLeft size={17} /></button><span>{pad(active + 1)} / {pad(FEATURED.length)}</span><button aria-label="Next project" onClick={event => move(1, event.detail === 0)}><ArrowRight size={17} /></button></div>
      </main>
      <footer className="studio-footer"><button className="studio-talk" onClick={() => setPanel('contact')}>Let's talk <ArrowUpRight size={15} /></button><span className="studio-explore">Drag or scroll to explore <ArrowDown size={12} /></span><button className="studio-motion-toggle" aria-pressed={coversPaused} onClick={() => setCoversPaused(value => !value)}>{coversPaused ? 'Play cover motion' : 'Pause cover motion'}</button><span>© {new Date().getFullYear()} Raziel Salamat</span></footer></>}
    </div>

    {panel && <Dialog opener={lastFocus.current} title={panel === 'menu' ? 'Navigation' : panel === 'documents' ? 'Resume & portfolio' : panel === 'about' ? 'About Raziel' : panel === 'certifications' ? 'Certifications & learning' : 'Let’s talk'} onClose={closePanel}>
      {panel === 'menu' && <div className="studio-menu-layout"><div className="studio-menu-links"><button onClick={() => { home(); setView('Showcase'); setPanel(null); }}>Selected work <span>01</span></button><button onClick={() => { home(); setView('List'); setPanel(null); }}>Project index <span>02</span></button><button onClick={() => setPanel('about')}>About & experience <span>03</span></button><button onClick={() => setPanel('documents')}>Resume & portfolio <span>04</span></button><button onClick={() => setPanel('certifications')}>Certifications & learning <span>05</span></button><button onClick={() => setPanel('contact')}>Get in touch <span>06</span></button></div><aside><p>{PERSONAL.location}<br />Philippines / GMT+8</p><p>Computer Engineering student.<br />Expected graduation 2027.</p><span className="studio-available">Available for opportunities</span></aside></div>}
      {panel === 'about' && <div className="studio-about"><p className="studio-eyebrow">Concept to creation</p><h2>Building between<br />the physical<br /><em>and the digital.</em></h2><p className="studio-lead">I’m Raziel, a developer and CAD designer based in Tagum City. I build web experiences, desktop tools, and engineering concepts—with an eye for how they look and how they work.</p><div className="studio-about-grid"><div><h3>Experience</h3>{EXPERIENCE.map(item => <div className="studio-info-row" key={item.id}><h4>{item.role}</h4><p>{item.company} · {item.period}</p><ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div>)}</div><div><h3>Education</h3>{EDUCATION.map(item => <div className="studio-info-row" key={item.id}><h4>{item.degree}</h4><p>{item.school}<br />{item.period}</p></div>)}<h3>Leadership</h3>{LEADERSHIP.map(item => <div className="studio-info-row" key={item.id}><h4>{item.role}</h4><p>{item.org} · {item.period}</p><p>{item.details}</p></div>)}<h3>Toolkit</h3>{SKILLS.map(item => <div className="studio-info-row" key={item.label}><h4>{item.label}</h4><p>{item.items.join(' / ')}</p></div>)}</div></div><button className="studio-solid" onClick={() => setPanel('documents')}>View resume & portfolio <ArrowUpRight size={16} /></button></div>}
      {panel === 'certifications' && <Certifications />}
      {panel === 'documents' && <div className="studio-documents"><h2>The short version.<br /><em>The full picture.</em></h2>{(Object.keys(DOCUMENTS) as DocumentKind[]).map(kind => <div key={kind}><h3>{DOCUMENTS[kind].title}</h3><p>{DOCUMENTS[kind].description}</p><span>{DOCUMENTS[kind].pages} pages / {DOCUMENTS[kind].size}</span><button onClick={() => openDocument(kind)}>View {DOCUMENTS[kind].title.toLowerCase()} <ArrowUpRight size={16} /></button><a href={DOCUMENTS[kind].url} download={DOCUMENTS[kind].filename}>Download ↓</a></div>)}</div>}
      {panel === 'contact' && <div className="studio-contact-layout"><div className="studio-contact"><p className="studio-eyebrow">Have something in mind?</p><h2>Let’s make<br /><em>something real.</em></h2><a className="studio-email" href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}<ArrowUpRight /></a><p>Open to full-time roles and project collaborations.<br />Tagum City, Philippines / GMT+8</p><div><a href={PERSONAL.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={PERSONAL.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><button onClick={() => setPanel('documents')}>Resume & portfolio ↗</button></div></div><div className="studio-contact-portrait"><img src="/portrait.png" alt="Portrait of Raziel" /></div></div>}
    </Dialog>}
    <ResumeModal document={documentKind} onClose={() => setDocumentKind(null)} />
  </div>;
}

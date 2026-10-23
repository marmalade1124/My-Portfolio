import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PROJECTS, type Project } from '@/lib/data';

export function ProjectPage({ project, direction, navigate, home, menu }: { project: Project; direction: 'next' | 'prev'; navigate: (project: Project, direction?: 'next' | 'prev', instant?: boolean) => void; home: () => void; menu: () => void }) {
  const scroll = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const distance = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const previousLink = useRef<HTMLAnchorElement>(null);
  const nextLink = useRef<HTMLAnchorElement>(null);
  const travel = useRef(0);
  const edge = useRef({ previous: 0, next: 0, locked: false });
  const [mobile, setMobile] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const index = PROJECTS.findIndex(item => item.id === project.id);
  const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]!;
  const next = PROJECTS[(index + 1) % PROJECTS.length]!;
  const images = project.images ?? (project.coverImage ? [project.coverImage] : []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${project.title} — Raziel Salamat`;
    return () => { document.title = previousTitle; };
  }, [project.title]);

  const go = (item: Project, way: 'next' | 'prev' = 'next', instant = false) => {
    if (edge.current.locked) return;
    edge.current.locked = true;
    if (instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigate(item, way, true);
    else { setLeaving(true); timer.current = setTimeout(() => navigate(item, way), 420); }
  };
  useLayoutEffect(() => {
    const root = scroll.current!; const strip = track.current!;
    root.scrollTop = 0;
    root.focus({ preventScroll: true });
    const measure = () => {
      const small = window.matchMedia('(max-width: 767px)').matches;
      setMobile(small);
      travel.current = small ? 0 : Math.max(0, strip.scrollWidth - root.clientWidth);
      distance.current!.style.height = small ? 'auto' : `${root.clientHeight + travel.current}px`;
      strip.style.transform = small ? '' : `translateX(${-Math.min(root.scrollTop, travel.current)}px)`;
      update();
    };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(root); observer.observe(strip);
    function update() {
      const small = window.matchMedia('(max-width: 767px)').matches;
      const limit = small ? root.scrollHeight - root.clientHeight : travel.current;
      const fraction = limit > 0 ? Math.min(1, root.scrollTop / limit) : 0;
      if (!small) strip.style.transform = `translateX(${-Math.min(root.scrollTop, travel.current)}px)`;
      if (progress.current) { progress.current.textContent = `${Math.round(fraction * 100)}%`; progress.current.style.left = `${50 + fraction * 44}%`; }
    };
    root.addEventListener('scroll', update, { passive: true }); update();
    return () => { observer.disconnect(); root.removeEventListener('scroll', update); if (timer.current) clearTimeout(timer.current); };
  }, [project.id]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.querySelector('[role="dialog"]')) home(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [home]);

  return <main className={`project-page ${mobile ? 'project-mobile' : ''} ${leaving ? 'project-leaving' : ''} project-from-${direction}`}>
    <header className="project-header"><a href="/" className="studio-wordmark" onClick={event => { event.preventDefault(); home(); }}>RΛZIEL</a><a ref={previousLink} className="project-previous" href={`/work/${previous.id}`} onClick={event => { event.preventDefault(); go(previous, 'prev', event.detail === 0); }}>Scroll up <span>to previous project</span></a><button onClick={menu}>Menu</button></header>
    <div ref={scroll} className="project-scroll" role="region" tabIndex={0} aria-label={`${project.title} project story`}
      onWheel={event => {
        if (mobile || edge.current.locked) return;
        const root = scroll.current!;
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) root.scrollTop += event.deltaX;
        const delta = event.deltaY + event.deltaX;
        if (delta < 0 && root.scrollTop <= 0) { edge.current.previous = Math.min(2000, edge.current.previous - delta); previousLink.current?.style.setProperty('--fill', `${edge.current.previous / 20}%`); if (edge.current.previous >= 2000) go(previous, 'prev'); }
        else if (delta > 0 && root.scrollTop >= travel.current - 1) { edge.current.next = Math.min(2000, edge.current.next + delta); nextLink.current?.style.setProperty('--fill', `${edge.current.next / 20}%`); if (edge.current.next >= 2000) go(next); }
        else { edge.current.previous = 0; edge.current.next = 0; previousLink.current?.style.setProperty('--fill', '0%'); nextLink.current?.style.setProperty('--fill', '0%'); }
      }}>
      <div ref={distance} className="project-distance"><div className="project-window"><div ref={track} className="project-track">
        <section className="project-introduction"><div><h1>{project.title}</h1><p>{project.description}</p></div><div><h2>Solutions</h2><p>{project.techStack.join(', ')}.</p><p className="project-role">{project.role}</p><div className="project-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{project.liveLabel ?? 'Visit project'} ↗</a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">Source ↗</a>}{project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noreferrer">Watch ↗</a>}</div></div></section>
        {images.map((image, item) => <figure className="project-visual" key={image}><div className="project-image-frame" style={{ backgroundImage: `url("${image}")` }}><img src={image} alt={project.imageCaptions?.[item] ?? `${project.title} image ${item + 1}`} loading={item < 2 ? 'eager' : 'lazy'} onLoad={event => { const img = event.currentTarget; img.parentElement!.dataset.portrait = String(img.naturalHeight > img.naturalWidth); window.dispatchEvent(new Event('resize')); }} /></div><figcaption>{project.imageCaptions?.[item]}</figcaption></figure>)}
        {project.caseStudy && <section className="project-reasoning"><p className="project-status">{project.caseStudy.status}</p>{[['The problem',project.caseStudy.problem],['The approach',project.caseStudy.decision],['The result',project.caseStudy.result],['Scope & limitations',project.caseStudy.limitations]].map(([label,text]) => <div key={label}><h2>{label}</h2><p>{text}</p></div>)}</section>}
        <a ref={nextLink} className="project-next" href={`/work/${next.id}`} onClick={event => { event.preventDefault(); go(next, 'next', event.detail === 0); }}><span>Scroll down to next project</span><strong>{next.title}</strong><ArrowRight size={22} /></a>
      </div></div></div>
    </div>
    <div ref={progress} className="project-progress" aria-label="Project scroll progress">0%</div>
    <button className="project-home" onClick={home}><ArrowLeft size={12} /> All work</button>
    <a className="project-direct-next" href={`/work/${next.id}`} onClick={event => { event.preventDefault(); go(next, 'next', event.detail === 0); }}>Next <ArrowUpRight size={12} /></a>
  </main>;
}

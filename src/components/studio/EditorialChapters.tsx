import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, Square } from 'lucide-react';
import { WRITING, writingPath } from '@/lib/editorial-writing';
import { PROJECTS } from '@/lib/data';
import { projectPath } from '@/lib/seo';
import { FILIPINO, localizedPath } from '@/lib/editorial-language';

export type Chapter = { id: string; label: string };

export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [current, setCurrent] = useState(chapters[0]?.id);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const sections = [...chapters].reverse();
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = window.innerHeight * .36;
        const active = sections.find(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= threshold);
        setCurrent(active?.id ?? chapters[0]?.id);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [chapters]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => { if (!nav.current?.contains(event.target as Node)) setOpen(false); };
    window.addEventListener('pointerdown', dismiss);
    return () => window.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return <nav ref={nav} className="ed-chapter-rail" aria-label="On this page" data-open={open || undefined} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
  }}>
    <button type="button" ref={trigger} aria-expanded={open} aria-controls="chapter-links" onClick={() => setOpen(!open)}>
      <span className="ed-chapter-ticks" aria-hidden="true">{chapters.map(({ id }) => <i key={id} data-current={id === current || undefined} />)}</span>
      <span>On this page</span>
    </button>
    <ol id="chapter-links">{chapters.map(({ id, label }) => <li key={id}><a href={`#${id}`} aria-current={id === current ? 'location' : undefined} onClick={event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setOpen(false);
      const section = document.getElementById(id);
      if (section) {
        if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
        section.tabIndex = -1;
        section.focus({ preventScroll: true });
        section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
    }}>{label}</a></li>)}</ol>
  </nav>;
}

export function CaseNarration({ chapters }: { chapters: { title: string; text: string }[] }) {
  const [chapter, setChapter] = useState(0);
  const [state, setState] = useState<'idle' | 'playing' | 'paused' | 'error'>('idle');
  const generation = useRef(0);
  const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  useEffect(() => () => { generation.current++; if (supported) speechSynthesis.cancel(); }, [supported]);

  const play = (index: number) => {
    const run = ++generation.current;
    speechSynthesis.cancel();
    setChapter(index);
    setState('playing');
    const section = chapters[index]!;
    const message = new SpeechSynthesisUtterance(`${section.title}. ${section.text}`);
    message.lang = 'en';
    message.onend = () => {
      if (generation.current !== run) return;
      if (index + 1 < chapters.length) play(index + 1);
      else { setChapter(0); setState('idle'); }
    };
    message.onerror = () => { if (generation.current === run) setState('error'); };
    speechSynthesis.speak(message);
  };

  return <section className="ed-case-notes ed-narration" id="narration">
    <h2>Listen to this case study</h2>
    {supported && <div className="ed-controls">
      <button type="button" onClick={() => {
        if (state === 'playing') { speechSynthesis.pause(); setState('paused'); }
        else if (state === 'paused') { speechSynthesis.resume(); setState('playing'); }
        else play(chapter);
      }}>{state === 'playing' ? <Pause size={16} /> : <Play size={16} />}{state === 'playing' ? 'Pause narration' : state === 'paused' ? 'Resume narration' : 'Play narration'}</button>
      {(state === 'playing' || state === 'paused') && <button type="button" onClick={() => { generation.current++; speechSynthesis.cancel(); setState('idle'); }}><Square size={14} />Stop</button>}
    </div>}
    {supported && <div className="ed-controls" role="group" aria-label="Narration chapters">{chapters.map(({ title }, index) => <button key={title} type="button" aria-pressed={chapter === index} onClick={() => play(index)}>{title}</button>)}</div>}
    <p role="status">{state === 'error' || !supported ? 'A browser voice is unavailable. Read the transcript below.' : 'Uses your browser’s text-to-speech voice.'}</p>
    <details><summary>Transcript</summary>{chapters.map(({ title, text }) => <p key={title}><strong>{title}.</strong> {text}</p>)}</details>
  </section>;
}

function WritingDemo({ slug }: { slug: string }) {
  const [revision, setRevision] = useState(0);
  const [phase, setPhase] = useState('Export');
  const [dark, setDark] = useState(false);
  const [inspect, setInspect] = useState(false);
  const [layout, setLayout] = useState('List');
  const [options, setOptions] = useState<'instant' | 'fade' | null>(null);
  useEffect(() => {
    if (!revision || slug !== 'keeping-layouts-steady') return;
    setPhase('Preparing export…');
    const done = setTimeout(() => setPhase('Export ready'), 800);
    return () => clearTimeout(done);
  }, [revision, slug]);

  if (slug === 'designing-from-the-workflow') return null;
  return <figure className="ed-writing-demo">
    {slug === 'keeping-layouts-steady' ? <>
      <div className="ed-demo-pair">{['Content width', 'Reserved width'].map((label, index) => <section key={label} data-reserved={index === 1 || undefined}><h3>{label}</h3><div className="ed-demo-actions"><span>{phase}</span><span>Cancel</span></div></section>)}</div>
      <button type="button" className="ed-action" onClick={() => setRevision(value => value + 1)}>Run comparison ↻</button>
      <span className="sr-only" role="status">{phase}</span>
    </> : slug === 'testing-motion-between-pages' ? <>
      <div className="ed-demo-pair">{(['instant', 'fade'] as const).map(mode => <section key={mode}><h3>{mode === 'instant' ? 'Instant swap' : 'Fade between views'}</h3><p key={revision} className={revision && mode === 'fade' ? 'ed-demo-fade' : undefined}>{revision % 2 ? 'Project overview' : 'Project index'}</p><button type="button" className="ed-action" aria-expanded={options === mode} onClick={() => setOptions(options === mode ? null : mode)}>Options</button>{options === mode && <ul>{['Open overview', 'Return to index'].map((label, index) => <li key={label}><button type="button" onClick={() => { setRevision(value => value + (value % 2 === index ? 1 : 2)); setOptions(null); }}>{label}</button></li>)}</ul>}</section>)}</div>
      <button type="button" className="ed-action" onClick={() => setRevision(value => value + 1)}>Replay ↻</button>
    </> : <>
      <div className="ed-controls" aria-label="Sample theme"><button type="button" aria-pressed={!dark} onClick={() => setDark(false)}>Light</button><button type="button" aria-pressed={dark} onClick={() => setDark(true)}>Dark</button><button type="button" aria-pressed={inspect} onClick={() => setInspect(!inspect)}>Inspect roles</button></div>
      <div className="ed-controls" aria-label="Sample layouts">{['List', 'Cards', 'Split'].map(value => <button key={value} type="button" aria-pressed={layout === value} onClick={() => setLayout(value)}>{value}</button>)}</div>
      <section className="ed-demo-theme" data-dark={dark || undefined} data-layout={layout}><h3>Saved palettes</h3><p>Forest</p><p>Ink</p>{inspect && <code>{dark ? 'Surface #171717 · Text #FAFAFA · 17.2:1' : 'Surface #FAFAFA · Text #171717 · 17.2:1'}</code>}</section>
    </>}
    <figcaption>Interactive example with sample content</figcaption>
  </figure>;
}

export function EditorialArticle({ article, filipino }: { article: typeof WRITING[number]; filipino: boolean }) {
  const project = PROJECTS.find(item => item.id === article.project);
  const index = WRITING.indexOf(article);
  const [title, summary] = filipino ? FILIPINO.writing[index] ?? [article.title, article.summary] : [article.title, article.summary];
  const sections = filipino ? FILIPINO.articles[index] ?? article.sections : article.sections;
  return <main className="ed-band ed-case ed-article" id="content">
    <a className="ed-eyebrow" href={localizedPath('/#writing', filipino)}>{filipino ? '← Mga sulatin' : '← Writing'}</a>
    <h1 className="ed-page-title">{title}</h1>
    <p className="ed-case-lead">{summary}</p>
    <div className="ed-prose">
      {sections.map(([heading, body], index) => <section key={heading} id={`section-${index + 1}`}><h2>{heading}</h2><p>{body}</p>{index === 1 && <div lang="en"><WritingDemo slug={article.slug} /></div>}</section>)}
      {project && <p><a className="ed-inline-link" href={localizedPath(projectPath(project), filipino)}>{filipino ? 'Tingnan ang' : 'See'} {project.title} <ArrowUpRight size={15} /></a></p>}
      <nav aria-label={filipino ? 'Iba pang sulatin' : 'More writing'}><h2>{filipino ? 'Iba pang sulatin' : 'More writing'}</h2><ul className="ed-article-links">{WRITING.map((item, position) => item !== article && <li key={item.slug}><a href={localizedPath(writingPath(item.slug), filipino)}>{filipino ? FILIPINO.writing[position]?.[0] : item.title} <ArrowUpRight size={14} /></a></li>)}</ul></nav>
    </div>
  </main>;
}

import { useEffect, useRef, useState } from 'react';

const STORIES = {
  twentyfour: {
    title: 'TwentyFour', accent: '#c7aa69', poster: '/projects/twentyfour-camera.png',
    steps: ['Capture a photo', 'Queue on device', 'Reveal the album'],
    detail: 'The browser queues captures locally during interrupted connections. The shared album opens at the event’s scheduled reveal.',
    caption: '8-second interface story: sample camera → reveal countdown → event homepage. Demo photographs; no photos are captured or uploaded here.',
  },
  picolor: {
    title: '3.14', accent: '#bc5b39', poster: '/projects/picolor-editor.png',
    steps: ['Pick a screen color', 'Edit palette roles', 'Preview & export'],
    detail: 'A sampled color becomes editable interface roles. Preview and pair-specific contrast checks help evaluate the palette before CSS or JSON export.',
    caption: '8-second interface story: color editor → palette studio → interface preview. Screenshots rendered from the native Windows app.',
  },
  lapcat: {
    title: 'Lapcat', accent: '#008f91', poster: '/projects/lapcat-app-home.png',
    steps: ['Choose route points', 'Request walking route', 'Save plan locally'],
    detail: 'Selected points go to the routing service to calculate a walking route. The plan can then be saved on the device; recording is a separate action.',
    caption: '8-second interface story: Home → walking-route planner → profile. Actual browser-preview screens, not a recorded outdoor GPS session.',
  },
};

export function storyKey(id: string) {
  return id === 'lapcat-app' || id === 'lapcat-website' ? 'lapcat' : id === 'twentyfour' || id === 'picolor' ? id : null;
}

function useMotionAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowed(!media.matches && !document.hidden);
    media.addEventListener('change', update); document.addEventListener('visibilitychange', update); update();
    return () => { media.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  return allowed;
}

export function ProductStory({ id }: { id: string }) {
  const key = storyKey(id);
  const video = useRef<HTMLVideoElement>(null);
  const region = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const allowed = useMotionAllowed();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === region.current) {
          setVisible(entry.isIntersecting);
          if (!entry.isIntersecting) setRunning(false);
        }
        if (!entry.isIntersecting) video.current?.pause();
      }
    }, { threshold: .25 });
    if (region.current) observer.observe(region.current);
    if (video.current) observer.observe(video.current);
    const hide = () => { if (document.hidden) { video.current?.pause(); setRunning(false); } };
    document.addEventListener('visibilitychange', hide);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hide); };
  }, []);
  useEffect(() => { if (!running) return; const timer = setTimeout(() => setRunning(false), 8000); return () => clearTimeout(timer); }, [running]);
  if (!key) return null;
  const story = STORIES[key];
  return <section ref={region} className="product-story" aria-label={`${story.title} product story`} style={{ '--product-accent': story.accent } as React.CSSProperties}>
    <div className="product-story-film">
      <p className="product-kicker">IN MOTION / 8 SECONDS</p>
      <h2>A closer look at {story.title}.</h2>
      {failed ? <p role="status">The story could not load. Explore the original screenshots in the gallery.</p> : <video ref={video} controls playsInline preload="none" poster={story.poster} aria-label={`${story.title} eight-second screenshot story`} onError={() => setFailed(true)}>
        <source src={`/motion/${key}.mp4`} type="video/mp4" onError={() => setFailed(true)} />
      </video>}
      <p>{story.caption}</p>
    </div>
    <div className={`product-process ${running && allowed && visible ? 'process-playing' : ''}`}>
      <p className="product-kicker">HOW IT WORKS / ILLUSTRATED</p>
      <h2>From input to outcome.</h2>
      <ol>{story.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}</ol>
      <p>{story.detail}</p>
      <p className="product-process-note">An explanation of the workflow. This diagram does not run the app or send data.</p>
      {allowed && <button type="button" aria-pressed={running} onClick={() => setRunning(value => !value)}>{running ? 'Stop diagram' : 'Play diagram'} <span aria-hidden="true">↗</span></button>}
    </div>
  </section>;
}

import { useState } from 'react';
import type { Project } from '@/lib/data';

const labs = {
  picolor: {
    title: 'Palette roles in context',
    intro: 'Inspect how a theme changes the same interface, from type and radius to surface color.',
    modes: ['Colour', 'Type', 'Radius', 'Effects'],
  },
  quoter: {
    title: 'From a sliced file to a quote',
    intro: 'Compare the imported inputs with the itemized estimate they produce.',
    modes: ['Slicer inputs', 'Itemized quote'],
  },
  'lapcat-app': {
    title: 'Explore a route',
    intro: 'Compare distance, elevation and estimated duration on three illustrative routes.',
    modes: ['Easy loop', 'River route', 'Hill route'],
  },
  hitoshii: {
    title: 'From an expense to a repayment',
    intro: 'See how a reported repayment stays pending until the recipient confirms it.',
    modes: ['Expenses', 'Settle up', 'Activity'],
  },
  okuru: {
    title: 'Find a saved reference',
    intro: 'Filter a sample shared room by the kind of material you want to find.',
    modes: ['All', 'Links', 'Notes', 'Files'],
  },
  twentyfour: {
    title: 'Try the guest flow',
    intro: 'Capture a sample photo and see what guests see before and after the album opens.',
    modes: ['Camera', 'My roll', 'Shared album'],
  },
} as const;

export const hasProjectLab = (id: string): id is keyof typeof labs => Object.prototype.hasOwnProperty.call(labs, id);

const money = (amount: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

export function EditorialLab({ project }: { project: Project }) {
  const [mode, setMode] = useState(0);
  const [dark, setDark] = useState(false);
  const [count, setCount] = useState(0);
  const [settlement, setSettlement] = useState<'open' | 'pending' | 'confirmed'>('open');
  const [revealed, setRevealed] = useState(false);
  const [pace, setPace] = useState(7);
  if (!hasProjectLab(project.id)) return null;
  const lab = labs[project.id];
  const route = [{ km: 2.4, up: 12 }, { km: 5.8, up: 36 }, { km: 8.2, up: 215 }][mode];
  return <section id="project-lab" className="ed-case-notes ed-lab">
    <h2>{lab.title}</h2><p>{lab.intro}</p>
    <div className="ed-controls" aria-label={lab.title}>{lab.modes.map((label, index) => <button key={label} type="button" aria-pressed={index === mode} onClick={() => setMode(index)}>{label}</button>)}</div>
    <div className="ed-lab-stage" data-dark={project.id === 'picolor' ? dark : undefined}>
      {project.id === 'picolor' && <>
        <div className="ed-controls" aria-label="Theme"><button type="button" aria-pressed={!dark} onClick={() => setDark(false)}>Light</button><button type="button" aria-pressed={dark} onClick={() => setDark(true)}>Dark</button></div>
        <h3>Saved palette</h3>
        {mode === 0 && <div className="ed-lab-swatches"><span>{dark ? '#171717' : '#FAFAFA'}<br />Surface</span><span>{dark ? '#FAFAFA' : '#171717'}<br />Text</span><span>#6E885D<br />Accent</span></div>}
        {mode === 1 && <><strong className="ed-lab-type">Heading</strong><p>Body copy. Label. Helper text.</p></>}
        {mode === 2 && <div className="ed-lab-swatches"><span style={{ borderRadius: 4 }}>4 px</span><span style={{ borderRadius: 12 }}>12 px</span><span style={{ borderRadius: 24 }}>24 px</span></div>}
        {mode === 3 && <div className="ed-lab-swatches"><span>Flat surface</span><span style={{ boxShadow: '0 8px 24px #0003' }}>Raised surface</span></div>}
      </>}
      {project.id === 'quoter' && <>
        <label>Pieces <input type="number" min="1" max="8" value={count + 1} onChange={event => setCount(Math.max(0, Math.min(7, Number(event.target.value) - 1)))} /></label>
        <dl>{(mode === 0 ? [['Material per piece', '24 g'], ['Machine time per piece', '42 min'], ['Machine rate', '₱60 / hour']] : [['Material', money(24 * 1.1 * (count + 1))], ['Machine time', money(42 * (count + 1))], ['Total', money(68.4 * (count + 1))]]).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </>}
      {project.id === 'lapcat-app' && route && <>
        <label>Pace <select value={pace} onChange={event => setPace(Number(event.target.value))}><option value="6">6 min/km</option><option value="7">7 min/km</option><option value="9">9 min/km</option></select></label>
        <dl>{[['Distance', `${route.km} km`], ['Elevation gain', `${route.up} m`], ['Estimated duration', `${Math.round(route.km * pace)} min`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </>}
      {project.id === 'hitoshii' && <>
        <h3>{mode === 0 ? 'Dinner for four' : mode === 1 ? 'Your repayment' : 'Group activity'}</h3>
        <p role="status">{mode === 0 ? '₱1,800 paid by Bea · ₱450 per person' : settlement === 'confirmed' ? '₱450 received and confirmed' : settlement === 'pending' ? '₱450 reported · awaiting confirmation' : 'You owe Bea ₱450'}</p>
        {mode === 1 && <button type="button" className="ed-action" onClick={() => setSettlement(settlement === 'open' ? 'pending' : settlement === 'pending' ? 'confirmed' : 'open')}>{settlement === 'open' ? 'Report payment' : settlement === 'pending' ? 'Confirm receipt as Bea' : 'Reset example'}</button>}
      </>}
      {project.id === 'okuru' && <ul className="ed-lab-feed">{[{ title: 'Component accessibility guide', type: 'Links' }, { title: 'Ideas for the next prototype', type: 'Notes' }, { title: 'Project handoff.pdf', type: 'Files' }].filter(item => mode === 0 || lab.modes[mode] === item.type).map(item => <li key={item.title}><strong>{item.title}</strong><small>{item.type}</small></li>)}</ul>}
      {project.id === 'twentyfour' && <>
        <p role="status">{mode === 0 ? `${3 - count} shots remaining` : mode === 1 ? `${count} sample photos in your roll` : revealed ? 'The shared album is open' : 'The shared album is still locked'}</p>
        {(mode === 1 || mode === 2 && revealed) && count > 0 && <img src="/projects/twentyfour-sample-party.jpg" alt="Sample event photograph" />}
        {mode === 0 && <button type="button" className="ed-action" disabled={count >= 3} onClick={() => setCount(count + 1)}>Take sample photo</button>}
        {mode === 2 && <button type="button" className="ed-action" onClick={() => setRevealed(!revealed)}>{revealed ? 'Reset album reveal' : 'Open album as host'}</button>}
      </>}
    </div>
    <p className="ed-lab-caption">Interactive example with sample data</p>
  </section>;
}

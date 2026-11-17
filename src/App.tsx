import { useCallback, useLayoutEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { EditorialPortfolio } from './components/studio/EditorialPortfolio';
import { RROpening, shouldPlayRROpening } from './components/studio/RROpening';

export default function App() {
  const [opening, setOpening] = useState(shouldPlayRROpening);
  const finishOpening = useCallback(() => {
    const transferFocus = document.activeElement?.classList.contains('rr-opening__skip');
    setOpening(false);
    if (transferFocus) requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.ed-nav a')?.focus({ preventScroll: true });
    });
  }, []);
  useLayoutEffect(() => { delete document.documentElement.dataset.portfolioStarting; }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div inert={opening}><EditorialPortfolio /></div>
      {opening && <RROpening onFinish={finishOpening} />}
    </MotionConfig>
  );
}

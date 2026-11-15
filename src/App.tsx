import { useLayoutEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { EditorialPortfolio } from './components/studio/EditorialPortfolio';

export default function App() {
  useLayoutEffect(() => { delete document.documentElement.dataset.portfolioStarting; }, []);
  return <MotionConfig reducedMotion="user"><EditorialPortfolio /></MotionConfig>;
}

import { MotionConfig } from 'motion/react';
import { StudioPortfolio } from './components/studio/StudioPortfolio';

export default function App() {
  return <MotionConfig reducedMotion="user"><StudioPortfolio /></MotionConfig>;
}

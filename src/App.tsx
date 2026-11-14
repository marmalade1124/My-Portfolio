import { MotionConfig } from 'motion/react';
import { EditorialPortfolio } from './components/studio/EditorialPortfolio';

export default function App() {
  return <MotionConfig reducedMotion="user"><EditorialPortfolio /></MotionConfig>;
}

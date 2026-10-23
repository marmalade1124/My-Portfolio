export interface RingState { position: number; velocity: number; target: number | null; tilt: number; speed: number }
export const wrap = (value: number, count: number) => ((value % count) + count) % count;
export const offsetFrom = (index: number, position: number, count: number) => {
  const distance = index - position;
  return distance - count * Math.round(distance / count);
};
export function advanceRing(state: RingState, deltaFrames: number, dragging: boolean) {
  const dt = Math.min(3, Math.max(.1, deltaFrames));
  const previous = state.position;
  if (!dragging) {
    if (state.target !== null) {
      state.position += (state.target - state.position) * (1 - Math.pow(.88, dt));
      state.velocity = 0;
      if (Math.abs(state.target - state.position) < .001) { state.position = state.target; state.target = null; }
    } else {
      state.position += state.velocity * dt;
      state.velocity *= Math.pow(.93, dt);
      if (Math.abs(state.velocity) < .02) state.position += (Math.round(state.position) - state.position) * (1 - Math.pow(.95, dt));
      if (Math.abs(state.velocity) < .00003) state.velocity = 0;
    }
    state.tilt *= Math.pow(.92, dt);
  }
  state.speed += ((dragging ? state.velocity : (state.position - previous) / dt) - state.speed) * (1 - Math.pow(.75, dt));
  if (Math.abs(state.speed) < .00001) state.speed = 0;
  if (Math.abs(state.tilt) < .001) state.tilt = 0;
}
export function cardPose(index: number, state: RingState, count: number, radius: number) {
  const angle = offsetFrom(index, state.position, count) * 360 / count;
  const skew = Math.max(-22, Math.min(22, state.speed * 55));
  const scale = 1 - Math.min(Math.abs(state.speed) * 1.4, .14);
  return `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px) scale(${scale}) skewX(${skew}deg)${Math.abs(angle) > 90 ? ' scaleX(-1)' : ''}`;
}

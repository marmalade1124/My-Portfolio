"use client";

/**
 * @author: @dorianbaffier
 * @description: Pull Cord
 * @version: 1.0.0
 * @date: 2026-10-14
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


const WIDTH = 72;
const HEIGHT = 112;
// Where the cord hangs from.
const ANCHOR = { x: WIDTH / 2, y: 0 };
// The cord is a chain of points joined by fixed-length links.
const LINKS = 12;
const LINK = 4.5;
// Simulation, in px and seconds. A fixed step keeps the chain stable on any
// refresh rate.
const STEP = 1 / 120;
const GRAVITY = 1400;
const DAMPING = 0.992;
// Fastest a link may move in one step. Letting go of a stretched cord would
// otherwise fling it up into the shade.
const MAX_SPEED = 4;
// A cord has a little stiffness: two links apart, points never get closer
// than this, so it bends in curves instead of folding into kinks.
const BEND_MIN = LINK * 1.9;
const BEND_STIFFNESS = 0.8;
const ITERATIONS = 14;
// How far past its length the cord has to be pulled to click the switch,
// and how far it can stretch at all. The stretch flattens out, so it slows
// down instead of stopping at a wall.
const CLICK_PULL = 22;
const MAX_STRETCH = 34;
// Below this movement per step for a while, the chain is at rest and the
// loop stops.
const REST_EPSILON = 0.015;
const REST_STEPS = 24;

function damp(distance: number, max: number) {
  return max * (1 - Math.exp(-distance / max));
}

function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

/**
 * Move points a and b towards `length` apart. A bend constraint only ever
 * pushes apart, and only part of the way each pass: stiff, not rigid.
 */
function relax(
  chain: { xs: Float64Array; ys: Float64Array; held: number },
  a: number,
  b: number,
  length: number,
  bend: boolean
) {
  const { xs, ys, held } = chain;
  const aFixed = a === 0 || a === held;
  const bFixed = b === held;
  if (aFixed && bFixed) {
    return;
  }
  const dx = xs[b]! - xs[a]!;
  const dy = ys[b]! - ys[a]!;
  const dist = Math.hypot(dx, dy) || 0.0001;
  if (bend && dist >= length) {
    return;
  }
  const diff = ((dist - length) / dist) * (bend ? BEND_STIFFNESS : 1);
  let wa = 0.5;
  if (aFixed) {
    wa = 0;
  } else if (bFixed) {
    wa = 1;
  }
  xs[a] = xs[a]! + dx * diff * wa;
  ys[a] = ys[a]! + dy * diff * wa;
  xs[b] = xs[b]! - dx * diff * (1 - wa);
  ys[b] = ys[b]! - dy * diff * (1 - wa);
}

/** A smooth curve through the chain's points. */
function cordPath(xs: Float64Array, ys: Float64Array) {
  let d = `M${xs[0]!.toFixed(2)} ${ys[0]!.toFixed(2)}`;
  for (let i = 1; i < xs.length - 1; i++) {
    const mx = (xs[i]! + xs[i + 1]!) / 2;
    const my = (ys[i]! + ys[i + 1]!) / 2;
    d += ` Q${xs[i]!.toFixed(2)} ${ys[i]!.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const n = xs.length - 1;
  d += ` L${xs[n]!.toFixed(2)} ${ys[n]!.toFixed(2)}`;
  return d;
}

function restingChain() {
  const xs = new Float64Array(LINKS + 1);
  const ys = new Float64Array(LINKS + 1);
  for (let i = 0; i <= LINKS; i++) {
    xs[i] = ANCHOR.x;
    ys[i] = ANCHOR.y + i * LINK;
  }
  return { xs, ys };
}

const REST = restingChain();
const REST_PATH = cordPath(REST.xs, REST.ys);

export interface PullCordProps {
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, origin: { x: number; y: number }) => void;
  /** Accessible name of the switch. */
  label?: string;
  className?: string;
}

export default function PullCord({
  checked: checkedProp,
  defaultChecked = true,
  onCheckedChange,
  label = "Desk lamp",
  className,
}: PullCordProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = checkedProp ?? internal;
  const [grabbing, setGrabbing] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGGElement>(null);

  const sim = useRef({
    xs: Float64Array.from(REST.xs),
    ys: Float64Array.from(REST.ys),
    pxs: Float64Array.from(REST.xs),
    pys: Float64Array.from(REST.ys),
    raf: 0,
    last: 0,
    carry: 0,
    still: 0,
    // The link being held, and where the hand is holding it.
    held: -1,
    targetX: 0,
    targetY: 0,
    offsetX: 0,
    offsetY: 0,
    pointerId: -1,
    armed: true,
    reduceMotion: false,
  });

  // Read from pointer handlers, which outlive the render they came from.
  const latest = useRef<{ checked: boolean; toggle: (next: boolean) => void }>({
    checked,
    toggle: () => undefined,
  });
  const toggle = useCallback(
    (next: boolean) => {
      if (checkedProp === undefined) {
        setInternal(next);
      }
      const bead = beadRef.current?.getBoundingClientRect();
      if (bead) onCheckedChange?.(next, { x: bead.left + bead.width / 2, y: bead.top + bead.height / 2 });
    },
    [checkedProp, onCheckedChange]
  );
  latest.current = { checked, toggle };

  const draw = useCallback(() => {
    const { xs, ys } = sim.current;
    const d = cordPath(xs, ys);
    cordRef.current?.setAttribute("d", d);
    const n = LINKS;
    const angle =
      (Math.atan2(xs[n]! - xs[n - 1]!, ys[n]! - ys[n - 1]!) * 180) / Math.PI;
    beadRef.current?.setAttribute(
      "transform",
      `translate(${xs[n]!.toFixed(2)} ${ys[n]!.toFixed(2)}) rotate(${(-angle).toFixed(2)})`
    );
  }, []);

  // Verlet: each free link keeps the velocity it had last step, plus
  // gravity. The held link goes to the hand.
  const integrate = useCallback(() => {
    const s = sim.current;
    const { xs, ys, pxs, pys } = s;
    let moved = 0;
    for (let i = 1; i <= LINKS; i++) {
      if (i === s.held) {
        continue;
      }
      let vx = (xs[i]! - pxs[i]!) * DAMPING;
      let vy = (ys[i]! - pys[i]!) * DAMPING;
      const speed = Math.hypot(vx, vy);
      if (speed > MAX_SPEED) {
        vx *= MAX_SPEED / speed;
        vy *= MAX_SPEED / speed;
      }
      pxs[i] = xs[i]!;
      pys[i] = ys[i]!;
      xs[i] = xs[i]! + vx;
      ys[i] = ys[i]! + vy + GRAVITY * STEP * STEP;
      moved = Math.max(moved, Math.abs(vx) + Math.abs(vy));
    }
    if (s.held > 0) {
      const i = s.held;
      moved = Math.max(
        moved,
        Math.abs(s.targetX - xs[i]!) + Math.abs(s.targetY - ys[i]!)
      );
      pxs[i] = xs[i]!;
      pys[i] = ys[i]!;
      xs[i] = s.targetX;
      ys[i] = s.targetY;
    }
    return moved;
  }, []);

  // Pull each link back to its length, and keep points two links apart from
  // folding too close. The anchor and the held link don't move; everything
  // else shares the correction.
  const constrain = useCallback(() => {
    const s = sim.current;
    for (let k = 0; k < ITERATIONS; k++) {
      for (let i = 0; i < LINKS; i++) {
        relax(s, i, i + 1, LINK, false);
      }
      for (let i = 0; i + 2 <= LINKS; i++) {
        relax(s, i, i + 2, BEND_MIN, true);
      }
    }
  }, []);

  const step = useCallback(() => {
    const moved = integrate();
    constrain();
    return moved;
  }, [integrate, constrain]);

  const tick = useCallback(
    (now: number) => {
      const s = sim.current;
      s.raf = 0;
      const elapsed = s.last ? Math.min((now - s.last) / 1000, 0.05) : STEP;
      s.last = now;
      s.carry += elapsed;
      let moved = 0;
      while (s.carry >= STEP) {
        moved = Math.max(moved, step());
        s.carry -= STEP;
      }
      draw();
      s.still = moved < REST_EPSILON ? s.still + 1 : 0;
      if (s.held > 0 || s.still < REST_STEPS) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.last = 0;
      }
    },
    [draw, step]
  );

  const wake = useCallback(() => {
    const s = sim.current;
    s.still = 0;
    if (!s.raf) {
      s.raf = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    const s = sim.current;
    s.reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const localPoint = (event: PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }
    // The drawing is laid out in its own units; map the pointer into them.
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  // The hand can pull the cord a little past its length, with growing
  // resistance, but never pull it off the anchor.
  const reach = (index: number, x: number, y: number) => {
    const dx = x - ANCHOR.x;
    const dy = y - ANCHOR.y;
    const dist = Math.hypot(dx, dy) || 0.0001;
    const length = index * LINK;
    if (dist <= length) {
      return { x, y, pull: 0 };
    }
    const allowed = length + damp(dist - length, MAX_STRETCH);
    return {
      x: ANCHOR.x + (dx / dist) * allowed,
      y: ANCHOR.y + (dy / dist) * allowed,
      pull: dy > 0 ? (allowed - length) * (dy / dist) : 0,
    };
  };

  const handlePointerDown = (event: PointerEvent<SVGElement>) => {
    const s = sim.current;
    if (s.held > 0) {
      return;
    }
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    event.preventDefault();
    const point = localPoint(event);
    // Hold the link nearest to where the cord was grabbed.
    let nearest = LINKS;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 1; i <= LINKS; i++) {
      const d = Math.hypot(s.xs[i]! - point.x, s.ys[i]! - point.y);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    svgRef.current?.setPointerCapture(event.pointerId);
    s.held = nearest;
    s.targetX = s.xs[nearest]!;
    s.targetY = s.ys[nearest]!;
    s.offsetX = s.targetX - point.x;
    s.offsetY = s.targetY - point.y;
    s.pointerId = event.pointerId;
    s.armed = true;
    setGrabbing(true);
    wake();
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const s = sim.current;
    if (s.held < 0 || event.pointerId !== s.pointerId) {
      return;
    }
    const point = localPoint(event);
    const target = reach(s.held, point.x + s.offsetX, point.y + s.offsetY);
    s.targetX = target.x;
    s.targetY = target.y;
    // The switch clicks once per pull, as soon as the cord is pulled far
    // enough, and re-arms on the next grab.
    if (s.armed && target.pull > CLICK_PULL) {
      s.armed = false;
      setTriggered(true);
      haptic();
      step();
      draw();
      latest.current.toggle(!latest.current.checked);
    }
    wake();
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const s = sim.current;
    if (s.held < 0 || event.pointerId !== s.pointerId) {
      return;
    }
    s.held = -1;
    setGrabbing(false);
    setTriggered(false);
    if (s.reduceMotion) {
      // No swinging back: the cord drops straight to rest.
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
      s.carry = 0;
      s.xs.set(REST.xs);
      s.ys.set(REST.ys);
      s.pxs.set(REST.xs);
      s.pys.set(REST.ys);
      draw();
      return;
    }
    wake();
  };

  const handleKeyToggle = () => {
    toggle(!checked);
    const s = sim.current;
    if (!s.reduceMotion) {
      // A small tug on the bead, so the cord answers the key too.
      s.pys[LINKS] = s.ys[LINKS]! - 5;
      wake();
    }
  };


  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={className}
      data-grabbing={grabbing}
      data-triggered={triggered}
      onClick={event => {
        if (event.detail === 0) handleKeyToggle();
      }}
    >
      <svg
        aria-hidden="true"
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
      >
        <path d={REST_PATH} ref={cordRef} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <g ref={beadRef} transform={`translate(${ANCHOR.x} ${LINKS * LINK})`}>
          <rect x={-5} y={0} width={10} height={17} rx={5} fill="currentColor" />
        </g>
      </svg>
      <span aria-hidden="true" className="studio-cord-hint">
        {triggered ? 'Release' : grabbing ? 'Keep pulling ↓' : 'Pull to switch ↓'}
      </span>
    </button>
  );
}

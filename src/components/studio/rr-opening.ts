const limit = (value: number) => Math.max(0, Math.min(1, value));
const phase = (time: number, start: number, end: number) => limit((time - start) / (end - start));
const smooth = (p: number) => p * p * (3 - 2 * p);
const mix = (from: number, to: number, p: number) => from + (to - from) * p;
const rightOffset = [9.96, 9.87] as const;
export const rrFlightDirection = [-.77, -.638] as const;

export function createOpeningSwap(upper: SVGUseElement, lower: SVGUseElement) {
  const exit = .52;
  const slideEnd = exit + .25;
  const returnStart = slideEnd + .05;
  const landing = returnStart + .56;
  const [slotX, slotY] = rightOffset;
  const [dx, dy] = rrFlightDirection;

  return {
    completeAt: landing + .10,
    draw(time: number, width: number, height: number, unit: number) {
      const slide = smooth(phase(time, exit, slideEnd));
      lower.setAttribute('transform', `translate(${-slotX * slide} ${-slotY * slide})`);
      let x: number;
      let y: number;
      let turn: number;
      let blur: number;
      if (time >= returnStart) {
        const arrival = 1 - (1 - phase(time, returnStart, landing)) ** 3;
        x = mix(.35 * width / unit, slotX, arrival);
        y = mix(.67 * height / unit + 15, slotY, arrival);
        turn = mix(12, 0, arrival);
        blur = .55 * (1 - arrival);
      } else {
        const pull = smooth(phase(time, 0, .10));
        const departure = phase(time, .10, exit) ** 2;
        const distance = Math.hypot(width, height) / unit;
        x = mix(1.7 * pull, dx * distance, departure);
        y = mix(1.1 * pull, dy * distance, departure);
        turn = mix(3 * pull, -16, departure);
        blur = .72 * departure;
      }
      upper.setAttribute('transform', `translate(${x} ${y}) rotate(${turn} 74.675 75.055)`);
      upper.style.filter = blur > 0 ? `blur(${blur}px)` : '';
    },
  };
}

export function createOpeningScene(scene: SVGSVGElement) {
  const get = <T extends SVGElement = SVGElement>(id: string) => scene.querySelector<T>("#rr-opening-" + id)!;
  const opacity = (element: SVGElement, value: number) => { element.style.opacity = String(value); };
  const move = (element: SVGElement, x: number, y: number) => element.setAttribute('transform', `translate(${x} ${y})`);
  const art = { x: 720, y: 405, scale: 14, centerX: 79.655, centerY: 80 };
  const blocks = ([
    { element: get<SVGGElement>('left-horizontal'), offset: [-6, -10], tint: [251, 151, 120] },
    { element: get<SVGGElement>('left-vertical'), offset: [-15, 2], tint: [228, 105, 73] },
    { element: get<SVGGElement>('right-horizontal'), offset: [11, -3], tint: [251, 151, 120] },
    { element: get<SVGGElement>('right-vertical'), offset: [10, 8], tint: [228, 105, 73] },
  ] as const).map(({ element, offset, tint }) => ({
    element,
    offset,
    tint,
    body: element.firstElementChild as SVGUseElement,
    outline: element.lastElementChild as SVGUseElement,
  }));

  // Each corner starts at a rectangle-union vertex and expands into the source SVG's Bézier.
  const corners = [
    [[84.59,72.12], [84.59,70.22], [84.61,71.24], [83.78,72.08], [82.76,72.08]],
    [[71.76,72.12], [73.60,72.12], [72.58,72.12], [71.75,72.96], [71.75,73.98]],
    [[71.76,84.99], [71.79,83.13], [71.79,84.15], [70.97,84.99], [69.94,84.99]],
    [[64.76,84.99], [66.69,84.99], [65.67,85.01], [64.83,84.18], [64.83,83.16]],
    [[64.76,65.12], [64.76,67.05], [64.76,66.03], [65.58,65.19], [66.61,65.19]],
    [[84.59,65.12], [82.73,65.12], [83.75,65.12], [84.59,65.94], [84.59,66.97]],
  ] as const;
  const firstDraw = .12;
  const wideDraw = .46;
  const arrangeStart = 1.31;
  const assembled = 2.29;
  const { x, y, scale, centerX, centerY } = art;
  const cornerOrder: readonly number[] = [4, 5, 0, 1, 2, 3];
  const cornerBeat = .28;
  const closeUpStart = 2.57;
  const closeUpCount = 3;
  const pullbackStart = closeUpStart + closeUpCount * cornerBeat;
  const pullbackEnd = pullbackStart + .36;
  const panDuration = .105;
  const fillets = ['left-fillet', 'right-fillet'].map((id, index) => ({
    path: get<SVGPathElement>(id),
    offset: index ? rightOffset : ([0, 0] as const),
  }));
  const steps = fillets.flatMap(({ offset }, piece) => cornerOrder.map((corner, order) => {
    const index = piece * cornerOrder.length + order;
    const close = index < closeUpCount;
    const [px, py] = corners[corner]![0];
    return {
      start: close ? closeUpStart + index * cornerBeat : pullbackStart,
      lead: close ? panDuration : 0,
      duration: close ? cornerBeat : pullbackEnd - pullbackStart,
      local: [px + offset[0], py + offset[1]] as const,
      focus: [x + (px + offset[0] - centerX) * scale, y + (py + offset[1] - centerY) * scale] as const,
    };
  }));

  function updateConstruction(time: number) {
    const darken = smooth(phase(time, 2.19, assembled));
    blocks.forEach(({ element, offset, tint, body, outline }, index) => {
      const start = index ? wideDraw + (index - 1) * .235 : firstDraw;
      const drawn = phase(time, start, start + .17);
      const filled = smooth(phase(time, start + .17, start + .22));
      const placement = arrangeStart + index * .23;
      const arrange = smooth(phase(time, placement, placement + .19));
      outline.style.strokeDashoffset = String(100 * (1 - drawn));
      opacity(outline, drawn > 0 ? 1 - filled : 0);
      opacity(body, filled);
      move(element, offset[0] * (1 - arrange), offset[1] * (1 - arrange));
      body.setAttribute('fill', `rgb(${tint.map(channel => Math.round(mix(channel, 30, darken))).join(' ')})`);
    });
    opacity(get('primitives'), time < assembled ? 1 : 0);
    opacity(get('fillets'), time >= assembled ? 1 : 0);

    fillets.forEach(({ path }, piece) => {
      const d = corners.map(([vertex, ...points], corner) => {
        const step = steps[piece * cornerOrder.length + cornerOrder.indexOf(corner)]!;
        const radius = smooth(phase(time, step.start + step.lead, step.start + step.duration - .015));
        const [start, ...curve] = points.map(([px, py]) => `${mix(vertex[0], px, radius)} ${mix(vertex[1], py, radius)}`);
        return `${corner ? 'L' : 'M'}${start} C${curve.join(' ')}`;
      }).join(' ') + ' Z';
      path.setAttribute('d', d);
    });
  }

  function updateCamera(time: number) {
    const index = time >= steps[2]!.start ? 2 : time >= steps[1]!.start ? 1 : 0;
    const step = steps[index]!;
    const enter = smooth(phase(time, assembled, closeUpStart));
    const retreat = phase(time, pullbackStart, pullbackEnd);
    const opening = smooth(phase(time, 0, firstDraw)) * (1 - smooth(phase(time, .30, wideDraw)));
    const placing = smooth(phase(time, 1.15, arrangeStart)) * (1 - enter);
    const secondJoint = smooth(phase(time, 1.68, 1.83));
    const closeUp = enter * (1 - smooth(retreat));
    const zoom = 1 + .85 * opening + .64 * placing + 1.55 * closeUp;
    const previous = steps[index - 1] ?? step;
    const pan = smooth(phase(time, step.start, step.start + panDuration));
    const focusX = x + (565 - x) * opening + (mix(542, 733, secondJoint) - x) * placing + (mix(previous.focus[0], step.focus[0], pan) - x) * closeUp;
    const focusY = y + (106 - y) * opening + (mix(261, 487, secondJoint) - y) * placing + (mix(previous.focus[1], step.focus[1], pan) - y) * closeUp;
    const camera = get('camera');
    camera.setAttribute('transform', `translate(${x} ${y}) scale(${zoom}) translate(${-focusX} ${-focusY})`);
    camera.style.filter = retreat > 0 && retreat < 1 ? `blur(${36 * retreat * (1 - retreat)}px)` : '';

    const activeCorner = get('active-corner');
    move(activeCorner, step.local[0], step.local[1]);
    opacity(activeCorner, smooth(phase(time, step.start + step.lead * .55, step.start + step.lead)) *
      (1 - smooth(phase(time, step.start + step.duration - .028, step.start + step.duration))));
  }


  return {
    completeAt: pullbackEnd + .09,
    launch() {
      opacity(get('fillets'), 0);
    },
    draw(time: number) {
      updateCamera(time);
      updateConstruction(time);
    },
  };
}

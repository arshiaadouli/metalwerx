// The journey's clock. Scroll position maps to "tau", which counts segments:
// stop 0 runs from tau 0 to 1, the flight to stop 1 from 1 to 2, stop 1 from
// 2 to 3, and so on, so stop i always spans [2i, 2i + 1]. Everything that moves
// (the camera, the customer's ute, the machines) is a function of tau, which is
// what makes scrolling back up play the whole film in reverse.
//
// This file has no three.js import, so the page can use it for the copy and
// the route rail without loading the 3D world.

// weight = viewport heights of scroll the segment takes. Stops get the most,
// so the camera lingers while their copy is up; the drive to the yard is the
// longest flight.
// About six screens in all.
export const SEGMENTS = [
  { kind: "stop", stop: 0, weight: 0.62 },
  { kind: "fly", from: 0, to: 1, weight: 0.36 },
  { kind: "stop", stop: 1, weight: 0.66 },
  { kind: "fly", from: 1, to: 2, weight: 0.5 },
  { kind: "stop", stop: 2, weight: 0.7 },
  { kind: "fly", from: 2, to: 3, weight: 0.36 },
  { kind: "stop", stop: 3, weight: 0.66 },
  { kind: "fly", from: 3, to: 4, weight: 0.32 },
  { kind: "stop", stop: 4, weight: 0.66 },
  { kind: "fly", from: 4, to: 5, weight: 0.42 },
  { kind: "stop", stop: 5, weight: 0.8 },
];

export const STOP_COUNT = 6;
export const TAU_END = SEGMENTS.length; // 11

// Total scroll length of the journey, in viewport heights.
export const TOTAL_WEIGHT = SEGMENTS.reduce((sum, s) => sum + s.weight, 0);

const starts = [];
{
  let acc = 0;
  for (const s of SEGMENTS) {
    starts.push(acc);
    acc += s.weight;
  }
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (x) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
export const easeInOut = (x) => {
  x = clamp(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
export const easeIn = (x) => Math.pow(clamp(x), 3);
// Overshoots a little before settling, for things that pop into place.
export const easeOutBack = (x) => {
  x = clamp(x);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Where tau sits between a and b, from 0 to 1. The workhorse for animating a
// prop over a window of the story: span(tau, 2.2, 2.8).
export const span = (tau, a, b) => clamp((tau - a) / (b - a));

// Rises over [a, b], holds, then falls over [c, d]: for things that appear and
// go again, like a callout over one stop.
export const pulse = (tau, a, b, c, d) =>
  Math.min(smoothstep(span(tau, a, b)), 1 - smoothstep(span(tau, c, d)));

export const stopStart = (i) => 2 * i;
export const stopEnd = (i) => 2 * i + 1;
export const stopMid = (i) => 2 * i + 0.5;

// Scroll progress (0 to 1 over the journey) to tau, and back.
export function progressToTau(p) {
  const w = clamp(p) * TOTAL_WEIGHT;
  for (let i = SEGMENTS.length - 1; i >= 0; i--) {
    if (w >= starts[i]) {
      return i + clamp((w - starts[i]) / SEGMENTS[i].weight);
    }
  }
  return 0;
}

export function tauToProgress(tau) {
  const t = clamp(tau, 0, TAU_END);
  const i = Math.min(Math.floor(t), SEGMENTS.length - 1);
  const w = starts[i] + (t - i) * SEGMENTS[i].weight;
  return w / TOTAL_WEIGHT;
}

// The stop nearest to tau, for the route rail and the reduced-motion slides.
export function nearestStop(tau) {
  return clamp(Math.round((tau - 0.5) / 2), 0, STOP_COUNT - 1);
}

// How visible stop i's copy is at tau. The first stop's copy is up when the
// page loads and the last one's stays up at the end, holding the CTAs. During
// a flight neither stop's copy shows, so the camera has the screen to itself.
export function copyOpacity(i, tau) {
  const a = stopStart(i);
  const b = stopEnd(i);
  const fadeIn = i === 0 ? 1 : smoothstep((tau - (a - 0.3)) / 0.45);
  const fadeOut = i === STOP_COUNT - 1 ? 1 : 1 - smoothstep((tau - (b - 0.22)) / 0.42);
  return clamp(Math.min(fadeIn, fadeOut));
}

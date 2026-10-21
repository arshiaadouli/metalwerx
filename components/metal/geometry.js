// Cross-sections of the stock the yard buys, seen end-on, as SVG path data.
// Every shape is a { d, metal, rule? } descriptor in a 220 x 150 box whose floor
// (the rack arm) is y = 146. Holes are real holes (even-odd fill), so whatever
// the bundle sits on shows through a pipe or a tube.

const f = (n) => Math.round(n * 100) / 100;

function circle(cx, cy, r) {
  return `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
}
function rect(x, y, w, h) {
  return `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
}
function poly(points) {
  return `M${points.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;
}

// A round bar.
export const round = (cx, cy, r, metal) => ({ d: circle(cx, cy, r), metal });
// Pipe or tube: a ring with `wall` thickness.
export const pipe = (cx, cy, r, wall, metal) => ({ d: circle(cx, cy, r) + circle(cx, cy, r - wall), metal, rule: "evenodd" });
// Hex bar, points up.
export function hex(cx, cy, r, metal) {
  const pts = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return { d: poly(pts), metal };
}
// Flat bar or busbar.
export const flat = (x, y, w, h, metal) => ({ d: rect(x, y, w, h), metal });
// Square or rectangular hollow section.
export const tube = (x, y, w, h, wall, metal) => ({ d: rect(x, y, w, h) + rect(x + wall, y + wall, w - 2 * wall, h - 2 * wall), metal, rule: "evenodd" });
// Equal angle, the corner at bottom left.
export const angle = (x, y, w, h, t, metal) => ({ d: poly([[x, y], [x + t, y], [x + t, y + h - t], [x + w, y + h - t], [x + w, y + h], [x, y + h]]), metal });
// Channel, opening upwards.
export const channel = (x, y, w, h, t, metal) => ({ d: poly([[x, y], [x + t, y], [x + t, y + h - t], [x + w - t, y + h - t], [x + w - t, y], [x + w, y], [x + w, y + h], [x, y + h]]), metal });
// Universal beam (I-beam), standing.
export function beam(x, y, w, h, flange, web, metal) {
  const cx = x + w / 2;
  return {
    d: poly([[x, y], [x + w, y], [x + w, y + flange], [cx + web / 2, y + flange], [cx + web / 2, y + h - flange], [x + w, y + h - flange], [x + w, y + h], [x, y + h], [x, y + h - flange], [cx - web / 2, y + h - flange], [cx - web / 2, y + flange], [x, y + flange]]),
    metal,
  };
}
// Lead ingot, wider at the base.
export const ingot = (x, y, w, h, taper, metal) => ({ d: poly([[x + taper, y], [x + w - taper, y], [x + w, y + h], [x, y + h]]), metal });
// Car battery: the case with two terminal posts.
export function battery(x, y, w, h, metal) {
  const post = w * 0.16;
  return [
    { d: rect(x, y, w, h), metal },
    { d: rect(x + w * 0.14, y - h * 0.16, post, h * 0.16) + rect(x + w - w * 0.14 - post, y - h * 0.16, post, h * 0.16), metal },
  ];
}
// Insulated cable: a sheath around three cores, each a copper conductor in coloured insulation.
export function cable(cx, cy, r) {
  const core = r * 0.42;
  const off = r * 0.46;
  const cores = [-90, 30, 150].map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    return [cx + off * Math.cos(a), cy + off * Math.sin(a), ["red", "black", "earth"][i]];
  });
  return [
    { d: circle(cx, cy, r), metal: "sheath" },
    ...cores.map(([x, y, c]) => ({ d: circle(x, y, core), metal: c })),
    ...cores.map(([x, y]) => ({ d: circle(x, y, core * 0.5), metal: "cu" })),
  ];
}
// Electric motor stator lamination: a steel ring with slots, copper windings in the slots.
export function stator(cx, cy, r) {
  const inner = r * 0.62;
  const slots = 12;
  let teeth = "";
  const wind = [];
  for (let i = 0; i < slots; i++) {
    const a = (2 * Math.PI * i) / slots;
    const sx = cx + (inner + r * 0.12) * Math.cos(a);
    const sy = cy + (inner + r * 0.12) * Math.sin(a);
    teeth += circle(sx, sy, r * 0.085);
    wind.push({ d: circle(sx, sy, r * 0.06), metal: "cu" });
  }
  return [
    { d: circle(cx, cy, r) + circle(cx, cy, inner) + teeth, metal: "fe", rule: "evenodd" },
    ...wind,
    { d: circle(cx, cy, inner * 0.62) + circle(cx, cy, inner * 0.18), metal: "fe", rule: "evenodd" },
  ];
}
// Spur gear.
export function gear(cx, cy, r, teeth, metal) {
  const pts = [];
  const root = r * 0.8;
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (Math.PI * i) / teeth;
    const a1 = (Math.PI * (i + 1)) / teeth;
    const rr = i % 2 === 0 ? r : root;
    pts.push([cx + rr * Math.cos(a0 + 0.08), cy + rr * Math.sin(a0 + 0.08)]);
    pts.push([cx + rr * Math.cos(a1 - 0.08), cy + rr * Math.sin(a1 - 0.08)]);
  }
  return { d: poly(pts) + circle(cx, cy, r * 0.28), metal, rule: "evenodd" };
}
// Brake disc: a ring with a hat and drilled holes.
export function rotor(cx, cy, r, metal) {
  let holes = "";
  for (let i = 0; i < 8; i++) {
    const a = (2 * Math.PI * i) / 8;
    holes += circle(cx + r * 0.78 * Math.cos(a), cy + r * 0.78 * Math.sin(a), r * 0.07);
  }
  return { d: circle(cx, cy, r) + circle(cx, cy, r * 0.42) + holes, metal, rule: "evenodd" };
}
// Pipe flange: a ring with bolt holes.
export function flange(cx, cy, r, metal) {
  let holes = "";
  for (let i = 0; i < 6; i++) {
    const a = (2 * Math.PI * i) / 6 + Math.PI / 6;
    holes += circle(cx + r * 0.72 * Math.cos(a), cy + r * 0.72 * Math.sin(a), r * 0.1);
  }
  return { d: circle(cx, cy, r) + circle(cx, cy, r * 0.42) + holes, metal, rule: "evenodd" };
}
// Alloy wheel face: rim, five spokes, hub.
export function wheel(cx, cy, r, metal) {
  let spokes = "";
  for (let i = 0; i < 5; i++) {
    const a = (2 * Math.PI * i) / 5 - Math.PI / 2;
    const w = 0.22;
    const p = (ang, rad) => [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
    spokes += poly([p(a - w, r * 0.24), p(a - w * 0.42, r * 0.84), p(a + w * 0.42, r * 0.84), p(a + w, r * 0.24)]);
  }
  return [
    { d: circle(cx, cy, r) + circle(cx, cy, r * 0.84), metal, rule: "evenodd" },
    { d: spokes + circle(cx, cy, r * 0.26), metal },
  ];
}
// A baled car body: a crushed steel block with fold lines and two streaks of old paint.
export function bale(x, y, w, h) {
  const folds = [0.22, 0.47, 0.7].map((t, i) => {
    const yy = y + h * t;
    return { d: poly([[x + 4, yy], [x + w * 0.3, yy - 3 + i], [x + w * 0.62, yy + 2], [x + w - 4, yy - 1], [x + w - 4, yy + 2.2], [x + w * 0.62, yy + 4.2], [x + w * 0.3, yy - 0.8 + i], [x + 4, yy + 2.2]]), metal: "fold" };
  });
  return [
    { d: rect(x, y, w, h), metal: "fe" },
    ...folds,
    { d: poly([[x + w * 0.08, y + h * 0.34], [x + w * 0.5, y + h * 0.3], [x + w * 0.5, y + h * 0.36], [x + w * 0.08, y + h * 0.4]]), metal: "paint-red" },
    { d: poly([[x + w * 0.4, y + h * 0.8], [x + w * 0.9, y + h * 0.77], [x + w * 0.9, y + h * 0.83], [x + w * 0.4, y + h * 0.86]]), metal: "paint-blue" },
  ];
}

const flat1 = (arr) => arr.flat();

// One bundle per thing the yard buys, laid on the rack arm. Keys are material
// slugs, plus "steel" for general steel and iron.
export const BUNDLES = {
  copper: flat1([
    flat(6, 106, 78, 40, "cu"),
    pipe(122, 114, 32, 8, "cu"),
    pipe(186, 123, 23, 7, "cu"),
    pipe(62, 78, 27, 7, "cu"),
    round(160, 68, 20, "cu"),
    pipe(112, 52, 17, 6, "cu"),
  ]),
  brass: flat1([
    hex(64, 118, 28, "brass"),
    hex(118, 124, 22, "brass"),
    hex(172, 116, 30, "brass"),
    hex(88, 72, 23, "brass"),
    round(142, 70, 20, "brass"),
    round(22, 132, 14, "brass"),
  ]),
  aluminium: flat1([
    tube(8, 90, 56, 56, 8, "al"),
    angle(74, 86, 60, 60, 12, "al"),
    channel(144, 94, 56, 52, 12, "al"),
    tube(30, 40, 44, 44, 7, "al"),
    tube(88, 56, 70, 22, 6, "al"),
  ]),
  "aluminium-wheels": flat1([wheel(58, 104, 42, "al"), wheel(150, 108, 38, "al"), wheel(104, 50, 30, "al")]),
  "stainless-steel": flat1([
    round(34, 120, 26, "ss"),
    pipe(96, 112, 34, 5, "ss"),
    round(160, 126, 20, "ss"),
    round(196, 132, 14, "ss"),
    round(60, 64, 20, "ss"),
    pipe(146, 78, 24, 4, "ss"),
  ]),
  lead: flat1([
    ingot(8, 114, 88, 32, 10, "pb"),
    ingot(104, 114, 88, 32, 10, "pb"),
    ingot(56, 80, 88, 32, 10, "pb"),
    battery(150, 60, 62, 52, "pb"),
  ]),
  "pvc-wire": flat1([cable(48, 112, 34), cable(124, 120, 26), cable(182, 116, 30), cable(84, 62, 22), cable(150, 66, 18)]),
  "electric-motors": flat1([stator(64, 98, 48), stator(162, 108, 38)]),
  "unwanted-cars": flat1([bale(10, 92, 96, 54), bale(112, 92, 96, 54), bale(60, 36, 96, 54)]),
  "scrap-car-parts": flat1([gear(56, 104, 42, 14, "fe"), rotor(156, 106, 40, "fe"), gear(112, 52, 26, 10, "fe")]),
  "scrap-machinery": flat1([flange(52, 106, 40, "fe"), gear(146, 104, 42, 16, "fe"), beam(96, 30, 52, 36, 9, 9, "fe")]),
  steel: flat1([
    beam(6, 84, 64, 62, 12, 12, "fe"),
    channel(80, 92, 52, 54, 12, "fe"),
    tube(142, 92, 52, 54, 8, "fe"),
    angle(40, 36, 44, 44, 10, "fe"),
    tube(96, 50, 76, 36, 7, "fe"),
  ]),
};

// A single profile per material, for small sizes (menus, list markers), in a 48 x 48 box.
export const ICONS = {
  copper: [pipe(24, 24, 20, 6, "cu")],
  brass: [hex(24, 24, 21, "brass")],
  aluminium: [tube(5, 5, 38, 38, 7, "al")],
  "aluminium-wheels": wheel(24, 24, 21, "al"),
  "stainless-steel": [pipe(24, 24, 20, 3.5, "ss")],
  lead: battery(6, 14, 36, 28, "pb"),
  "pvc-wire": cable(24, 24, 21),
  "electric-motors": stator(24, 24, 21),
  "unwanted-cars": bale(4, 10, 40, 28),
  "scrap-car-parts": [gear(24, 24, 21, 12, "fe")],
  "scrap-machinery": [flange(24, 24, 21, "fe")],
  steel: [beam(6, 6, 36, 36, 8, 8, "fe")],
};

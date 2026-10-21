// The customer's white ute and box trailer, the one thread through the whole
// story: parked at home while the load is sorted into three crates on the
// trailer, driven to the yard, unloaded at the grade bays, weighed on the
// weighbridge, then driven home empty. Its position is a pure function of tau,
// so it drives backwards when the visitor scrolls back up.
//
// Stations read it through ctx.actors.customer:
//   positionAt(tau)      -> THREE.Vector3, the ute's centre on the ground
//   crateWorldPosition(i, target) -> top centre of crate i (0 copper, 1 aluminium, 2 steel)
//   CRATES               -> the crate grades, in order
// Crate fill: rises while the load is sorted (stop 1), empties at the bays
// (stop 2). The fill windows are exported so the home and grading stations
// can time their flying pieces to match.

import * as THREE from "three";
import { CUSTOMER_LEGS, CUSTOMER_ROUTE, ROUTE_STOPS } from "../layout.js";
import { BRAND, CODE_INK } from "../palette.js";
import { easeInOut, span } from "../timeline.js";

export const CRATES = ["copper", "aluminium", "steel"];
// Each crate's grade tag: the metal's code, stamped in its code ink on an
// aluminium tag, as on the rack.
const CRATE_TAGS = {
  copper: { code: "Cu", ink: CODE_INK.cu },
  aluminium: { code: "Al", ink: CODE_INK.al },
  steel: { code: "Fe", ink: CODE_INK.fe },
};
// tau windows: crate i fills over FILL[i], empties over EMPTY[i].
export const FILL = [
  [2.12, 2.5],
  [2.34, 2.72],
  [2.56, 2.92],
];
export const EMPTY = [
  [4.3, 4.56],
  [4.44, 4.7],
  [4.58, 4.84],
];
// The driver shows in the cab only while the ute is being driven or waits on
// the weighbridge; the stations stand the customer outside at the other stops.
const DRIVER = [
  [3.0, 4.22],
  [4.92, 7.3],
  [9.0, 11],
];

const TRAILER_GAP = 5.5; // ute centre to towbar (2.95) plus coupling to trailer axle (2.55)
const CRATE_X = [-0.95, 0, 0.95]; // along the trailer

export function buildCustomer(ctx) {
  const { kit } = ctx;
  const root = kit.dynamic(kit.group());
  root.name = "customer";

  // The route as one smooth curve, with the arc length of each parking spot.
  const curve = new THREE.CatmullRomCurve3(
    CUSTOMER_ROUTE.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    "centripetal",
    0.5
  );
  const divisions = 2400;
  const lengths = curve.getLengths(divisions);
  const total = lengths[lengths.length - 1];
  const n = CUSTOMER_ROUTE.length - 1;
  // Control point k sits at curve parameter k/n; look up its arc length.
  const arcAtPoint = (k) => {
    const f = (k / n) * divisions;
    const i = Math.floor(f);
    const frac = f - i;
    return i >= divisions ? total : lengths[i] + (lengths[i + 1] - lengths[i]) * frac;
  };
  const stopArc = Object.fromEntries(Object.entries(ROUTE_STOPS).map(([name, k]) => [name, arcAtPoint(k)]));

  // Distance travelled along the route at tau.
  function arcAt(tau) {
    let s = stopArc.park;
    for (const leg of CUSTOMER_LEGS) {
      const [a, b] = leg.tau;
      if (tau <= a) break;
      const t = easeInOut(span(tau, a, b));
      s = stopArc[leg.from] + (stopArc[leg.to] - stopArc[leg.from]) * t;
    }
    return s;
  }

  const tangent = new THREE.Vector3();
  function pointAtArc(s, target) {
    const u = Math.min(1, Math.max(0, s / total));
    return curve.getPointAt(u, target);
  }
  function headingAtArc(s) {
    const u = Math.min(0.9999, Math.max(0.0001, s / total));
    curve.getTangentAt(u, tangent);
    return Math.atan2(-tangent.z, tangent.x);
  }

  // ---- the ute
  const ute = kit.ute();
  root.add(ute);
  const driver = kit.group({ parent: ute });
  kit.sphere(0.19, "skin", { x: ute.userData.cabin.x, y: ute.userData.cabin.y + 0.55, z: ute.userData.cabin.z, parent: driver, seg: 12, rings: 8 });
  kit.box(0.5, 0.45, 0.4, "navy", { x: ute.userData.cabin.x, y: ute.userData.cabin.y + 0.05, z: ute.userData.cabin.z, parent: driver, r: 0.1 });

  // ---- the trailer and its three crates
  const trailer = kit.trailer();
  root.add(trailer);
  const crateBase = trailer.userData.bedY;
  const crates = CRATES.map((grade, i) => {
    const crate = kit.group({ x: CRATE_X[i], y: crateBase, parent: trailer });
    // a plastic tub with low walls
    kit.box(0.86, 0.06, 1.42, "tub", { parent: crate, r: 0.02 });
    kit.box(0.86, 0.5, 0.05, "tub", { z: 0.69, parent: crate, r: 0.02 });
    kit.box(0.86, 0.5, 0.05, "tub", { z: -0.69, parent: crate, r: 0.02 });
    kit.box(0.05, 0.5, 1.42, "tub", { x: 0.41, parent: crate, r: 0.02 });
    kit.box(0.05, 0.5, 1.42, "tub", { x: -0.41, parent: crate, r: 0.02 });
    // its grade tag on the outer side
    const tag = kit.sign(0.5, 0.24, {
      text: CRATE_TAGS[grade].code,
      font: "display",
      weight: "800",
      stretch: "condensed",
      bg: BRAND.tag,
      color: CRATE_TAGS[grade].ink,
      size: 0.78,
    });
    tag.position.set(0, 0.3, 0.72);
    crate.add(tag);
    // the load, a mound that grows from nothing
    const load = kit.group({ parent: crate });
    // radius runs along the crate (z); stretch narrows it across (x) to fit
    const pile = kit.scrapPile({
      radius: 0.6,
      height: 0.5,
      colors: grade === "copper" ? ["copper", "copperDull"] : grade === "aluminium" ? ["aluminium", "stainless"] : ["steel", "rust", "steelDark"],
      kinds: grade === "copper" ? ["coil", "pipe"] : grade === "aluminium" ? ["can", "plate"] : ["chunk", "plate", "beam"],
      count: 16,
      size: 0.3,
      seed: 31 + i,
      core: grade === "copper" ? "copperDull" : grade === "aluminium" ? "aluminium" : "rustDark",
      stretch: 0.62,
    });
    load.add(pile);
    load.position.y = 0.06;
    return { grade, crate, load };
  });

  // ---- per-frame
  const utePos = new THREE.Vector3();
  const trailerPos = new THREE.Vector3();
  const hitch = new THREE.Vector3();
  let lastArc = null;

  function update({ tau }) {
    const s = arcAt(tau);
    pointAtArc(s, utePos);
    ute.position.copy(utePos);
    ute.rotation.y = headingAtArc(s);

    // the trailer follows the route behind the ute, pointing at the towbar
    const ts = s - TRAILER_GAP;
    pointAtArc(ts, trailerPos);
    hitch.set(-2.95, 0, 0).applyAxisAngle(THREE.Object3D.DEFAULT_UP, ute.rotation.y).add(utePos);
    trailer.position.copy(trailerPos);
    trailer.rotation.y = Math.atan2(-(hitch.z - trailerPos.z), hitch.x - trailerPos.x);

    if (lastArc !== s) {
      for (const w of ute.userData.wheels) w.rotation.z = -s / 0.4;
      for (const w of trailer.userData.wheels) w.rotation.z = -ts / 0.32;
      lastArc = s;
    }

    crates.forEach((c, i) => {
      const fill = easeInOut(span(tau, FILL[i][0], FILL[i][1])) * (1 - easeInOut(span(tau, EMPTY[i][0], EMPTY[i][1])));
      c.load.visible = fill > 0.01;
      c.load.scale.set(0.55 + 0.45 * fill, Math.max(0.001, fill), 0.55 + 0.45 * fill);
    });

    driver.visible = DRIVER.some(([a, b]) => tau >= a && tau <= b);
  }

  function positionAt(tau, target = new THREE.Vector3()) {
    return pointAtArc(arcAt(tau), target);
  }

  function crateWorldPosition(i, target = new THREE.Vector3()) {
    const c = crates[i];
    c.crate.updateWorldMatrix(true, false);
    return target.set(0, 0.55, 0).applyMatrix4(c.crate.matrixWorld);
  }

  update({ tau: 0 });

  return {
    name: "customer",
    group: root,
    update,
    positionAt,
    crateWorldPosition,
    CRATES,
    FILL,
    EMPTY,
    get trailer() {
      return trailer;
    },
    get ute() {
      return ute;
    },
  };
}

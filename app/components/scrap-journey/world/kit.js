// The building kit every station uses: shared materials, cached geometry,
// primitives with one placement convention, a few reusable props (people,
// the ute, wheels, scrap piles, trees, lamps, fences, signs, callouts) and the
// static-mesh merge that keeps draw calls down.
//
// Conventions (stations rely on these):
//   - Units are metres. +y is up, +x is east, +z is south (towards the camera
//     at the start of the journey).
//   - box() and cyl() take y as the BOTTOM of the shape (they add half the
//     height), unless you pass center: true. sphere() takes the centre.
//   - Builders (person, ute, trailer, tree...) return a Group whose origin is
//     on the ground. People face +z, vehicles face +x.
//   - Anything a station animates must be inside a group marked with
//     kit.dynamic(group); everything else is merged into a few meshes after
//     the station is built, so moving it later does nothing.
//   - Glowing things (windows, lamp heads, screens) use kit.glow(); lights use
//     kit.pointLight(). Both follow the theme by themselves.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { SURFACES, BRAND, LIGHTS } from "./palette.js";

const TAU = Math.PI * 2;

// mulberry32: a small seeded random, so every build of the world looks the same.
export function rng(seed = 1) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function resolveFonts() {
  const css = typeof document !== "undefined" ? getComputedStyle(document.documentElement) : null;
  // next/font puts Archivo's generated family name in --font-archivo (see
  // app/layout.jsx). The site sets everything in it, as signs in the world do:
  // heavy and narrow for stamped codes (stretch: "condensed"), plainer for
  // labels and body. Readouts whose figures change keep a monospace.
  const value = css ? css.getPropertyValue("--font-archivo").trim() : "";
  const archivo = value ? `${value}, ui-sans-serif, system-ui, sans-serif` : "ui-sans-serif, system-ui, sans-serif";
  return {
    display: archivo,
    label: archivo,
    body: archivo,
    mono: 'ui-monospace, Menlo, Consolas, "Courier New", monospace',
  };
}

export function createKit({ quality = {} } = {}) {
  const materials = new Map();
  const geometries = new Map();
  const textures = new Set();
  const themed = { glows: [], lights: [], sprites: [] };
  const fonts = resolveFonts();
  let theme = "dark";

  // ---------------------------------------------------------------- materials

  function mat(name) {
    let m = materials.get(name);
    if (m) return m;
    const spec = SURFACES[name];
    if (!spec) throw new Error(`kit.mat: unknown surface "${name}"`);
    m = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: spec.roughness ?? 0.85,
      metalness: spec.metalness ?? 0,
      flatShading: !!spec.flatShading,
    });
    m.name = name;
    materials.set(name, m);
    return m;
  }

  // A shared material from a raw colour, for one-offs the palette lacks.
  function paint(hex, { roughness = 0.8, metalness = 0, flat = false } = {}) {
    const key = `paint:${hex}:${roughness}:${metalness}:${flat}`;
    let m = materials.get(key);
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color: hex, roughness, metalness, flatShading: flat });
      m.name = key;
      materials.set(key, m);
    }
    return m;
  }

  // Accepts a surface name, a "#hex" colour or a material.
  function resolve(material) {
    if (!material) return mat("concrete");
    if (typeof material !== "string") return material;
    if (material.startsWith("#")) return paint(material);
    return mat(material);
  }

  // A self-lit material (window, lamp head, LED, molten metal). Its brightness
  // follows the theme: `dark` at night, `light` by day. Each call makes a new
  // material, so fading one (kit.setLevel) doesn't fade the others. Never set
  // emissiveIntensity yourself; the theme switch would overwrite it.
  function glow(hex, { dark = 2, light = 0.2, base = null } = {}) {
    const m = new THREE.MeshStandardMaterial({
      color: base ?? hex,
      emissive: hex,
      emissiveIntensity: theme === "dark" ? dark : light,
      roughness: 0.55,
    });
    const entry = { kind: "glow", m, dark, light, level: 1 };
    m.userData.glow = entry;
    themed.glows.push(entry);
    return m;
  }

  function applyEntry(e) {
    const value = (theme === "dark" ? e.dark : e.light) * e.level;
    if (e.kind === "glow") e.m.emissiveIntensity = value;
    else if (e.kind === "halo") e.m.opacity = value;
    else if (e.kind === "light") e.l.intensity = value;
  }

  // Fades anything themed between off (0) and its full theme brightness (1):
  // a kit.glow() material, a kit.halo() sprite, a kit.pointLight(), or a
  // mesh/sprite using one of those.
  function setLevel(thing, level) {
    const e =
      thing?.userData?.glow ||
      thing?.userData?.halo ||
      thing?.userData?.themed ||
      thing?.material?.userData?.glow ||
      thing?.material?.userData?.halo;
    if (!e || e.level === level) return;
    e.level = level;
    applyEntry(e);
  }

  // ---------------------------------------------------------------- geometry

  function cached(key, make) {
    let g = geometries.get(key);
    if (!g) {
      g = make();
      geometries.set(key, g);
    }
    return g;
  }

  const round = (n) => Math.round(n * 1000) / 1000;

  function boxGeometry(w, h, d, r) {
    const radius = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    const key = `box:${round(w)}:${round(h)}:${round(d)}:${round(Math.max(radius, 0))}`;
    return cached(key, () =>
      radius > 0.005 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d)
    );
  }

  function cylGeometry(rt, rb, h, seg, open = false, thetaLength = TAU) {
    const key = `cyl:${round(rt)}:${round(rb)}:${round(h)}:${seg}:${open}:${round(thetaLength)}`;
    return cached(key, () => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open, 0, thetaLength));
  }

  function sphereGeometry(r, seg = 16, ring = 10) {
    return cached(`sph:${round(r)}:${seg}:${ring}`, () => new THREE.SphereGeometry(r, seg, ring));
  }

  // ---------------------------------------------------------------- placement

  // o: { x, y, z, rx, ry, rz, s, parent }
  function place(obj, o = {}) {
    if (o.x !== undefined) obj.position.x = o.x;
    if (o.y !== undefined) obj.position.y = o.y;
    if (o.z !== undefined) obj.position.z = o.z;
    if (o.rx) obj.rotation.x = o.rx;
    if (o.ry) obj.rotation.y = o.ry;
    if (o.rz) obj.rotation.z = o.rz;
    if (o.s !== undefined) {
      if (typeof o.s === "number") obj.scale.setScalar(o.s);
      else obj.scale.set(o.s[0], o.s[1], o.s[2]);
    }
    if (o.parent) o.parent.add(obj);
    return obj;
  }

  function shadowFlags(mesh, o) {
    mesh.castShadow = o.cast ?? true;
    mesh.receiveShadow = o.receive ?? true;
    return mesh;
  }

  // A box, softly bevelled by default (r: 0 for sharp corners). y is its bottom.
  function box(w, h, d, material, o = {}) {
    const r = o.r ?? Math.min(0.12, Math.min(w, h, d) * 0.12);
    const mesh = shadowFlags(new THREE.Mesh(boxGeometry(w, h, d, r), resolve(material)), o);
    return place(mesh, { ...o, y: (o.y ?? 0) + (o.center ? 0 : h / 2) });
  }

  // An upright cylinder (or cone frustum). y is its bottom. seg: sides.
  function cyl(rTop, rBottom, h, material, o = {}) {
    const g = cylGeometry(rTop, rBottom, h, o.seg ?? 16, o.open ?? false, o.theta ?? TAU);
    const mesh = shadowFlags(new THREE.Mesh(g, resolve(material)), o);
    return place(mesh, { ...o, y: (o.y ?? 0) + (o.center ? 0 : h / 2) });
  }

  // A cylinder lying along x (pipes, axles, rollers). x/y/z is its centre.
  function rod(r, length, material, o = {}) {
    const mesh = shadowFlags(new THREE.Mesh(cylGeometry(r, r, length, o.seg ?? 12), resolve(material)), o);
    mesh.rotation.z = Math.PI / 2;
    const holder = new THREE.Group();
    holder.add(mesh);
    return place(holder, o);
  }

  function sphere(r, material, o = {}) {
    const mesh = shadowFlags(new THREE.Mesh(sphereGeometry(r, o.seg ?? 16, o.rings ?? 10), resolve(material)), o);
    return place(mesh, o);
  }

  function cone(r, h, material, o = {}) {
    return cyl(0, r, h, material, o);
  }

  // Any geometry, placed and shadowed like the primitives (y is NOT adjusted).
  function mesh(geometry, material, o = {}) {
    return place(shadowFlags(new THREE.Mesh(geometry, resolve(material)), o), o);
  }

  function group(o = {}) {
    return place(new THREE.Group(), o);
  }

  // Marks a group as animated: mergeStatic() leaves it and its children alone.
  function dynamic(obj) {
    obj.userData.dynamic = true;
    return obj;
  }

  // ---------------------------------------------------------------- props

  // A tyre on a hub, axis along z (so it rolls along x). Spin it with rotation.z.
  function wheel(r = 0.38, width = 0.28, o = {}) {
    const g = group(o);
    const tyre = new THREE.Mesh(cylGeometry(r, r, width, 18), mat("rubber"));
    tyre.rotation.x = Math.PI / 2;
    tyre.castShadow = true;
    g.add(tyre);
    const hub = new THREE.Mesh(cylGeometry(r * 0.55, r * 0.55, width + 0.02, 10), mat("hub"));
    hub.rotation.x = Math.PI / 2;
    g.add(hub);
    return g;
  }

  // A person, about 1.75 m tall, facing +z, feet at y = 0.
  //   role: "worker" (hi-vis vest, hard hat), "customer" (casual, cap) or
  //         "staff" (hi-vis polo, no hat, for the office)
  //   pose: "stand", "point" (right arm out), "wave", "carry" (arms forward)
  // Returns a Group; userData.armL / armR are pivots you can rotate.
  function person({ role = "worker", pose = "stand", skin = "skin", seed = 1 } = {}) {
    const g = group();
    const r = rng(seed);
    const shirt = role === "customer" ? (r() > 0.5 ? "navy" : "charcoal") : role === "staff" ? "hivis" : "navy";
    const pants = role === "customer" ? (r() > 0.4 ? "denim" : "khaki") : "navy";
    // legs
    box(0.2, 0.82, 0.24, pants, { x: -0.12, parent: g, r: 0.06 });
    box(0.2, 0.82, 0.24, pants, { x: 0.12, parent: g, r: 0.06 });
    box(0.22, 0.12, 0.3, "black", { x: -0.12, z: 0.03, parent: g, r: 0.04 }); // boots
    box(0.22, 0.12, 0.3, "black", { x: 0.12, z: 0.03, parent: g, r: 0.04 });
    // torso
    box(0.56, 0.66, 0.32, shirt, { y: 0.8, parent: g, r: 0.12 });
    if (role === "worker") {
      box(0.6, 0.48, 0.36, "hivis", { y: 0.92, parent: g, r: 0.1 });
      box(0.61, 0.05, 0.37, BRAND.rackInk, { y: 1.12, parent: g, r: 0.02 }); // reflective stripe
    }
    // arms on shoulder pivots, so poses can swing them
    const arm = (side) => {
      const pivot = group({ x: side * 0.36, y: 1.38, parent: g });
      box(0.15, 0.62, 0.17, role === "worker" ? "hivis" : shirt, { y: -0.62, parent: pivot, r: 0.06 });
      sphere(0.075, skin, { y: -0.66, parent: pivot, seg: 8, rings: 6 });
      return pivot;
    };
    const armL = arm(-1);
    const armR = arm(1);
    // head
    sphere(0.19, skin, { y: 1.66, parent: g, seg: 14, rings: 10 });
    if (role === "worker") {
      const hat = new THREE.Mesh(new THREE.SphereGeometry(0.205, 14, 8, 0, TAU, 0, Math.PI / 2), mat("hivis"));
      hat.position.y = 1.7;
      hat.castShadow = true;
      g.add(hat);
      cyl(0.25, 0.25, 0.03, "hivis", { y: 1.69, parent: g, seg: 16 });
    } else if (role === "customer") {
      const capColor = r() > 0.5 ? "steelBlue" : "charcoal";
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 8, 0, TAU, 0, Math.PI / 2), resolve(capColor));
      cap.position.y = 1.71;
      cap.castShadow = true;
      g.add(cap);
      box(0.2, 0.025, 0.16, capColor, { y: 1.72, z: 0.2, parent: g, r: 0.01 });
    } else {
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 8, 0, TAU, 0, Math.PI / 2.2), mat("hair"));
      hair.position.y = 1.69;
      g.add(hair);
    }
    if (pose === "point") armR.rotation.set(-1.35, 0, -0.25);
    if (pose === "wave") armR.rotation.set(0, 0, -2.6);
    if (pose === "carry") {
      armL.rotation.x = -1.2;
      armR.rotation.x = -1.2;
    }
    g.userData.armL = armL;
    g.userData.armR = armR;
    return g;
  }

  // A tradie's single-cab ute, about 5.2 m long, facing +x, wheels on y = 0.
  // userData.wheels: spin with rotation.z = -distance / 0.4.
  // userData.cabin: where a driver's head goes. userData.trayY: tray floor height.
  function ute({ body = "utewhite", trim = "charcoal" } = {}) {
    const g = group();
    const wheels = [];
    // chassis and lower body
    box(5.0, 0.62, 1.86, body, { y: 0.42, parent: g, r: 0.16 });
    box(5.1, 0.18, 1.9, trim, { y: 0.34, parent: g, r: 0.06 }); // bumper line
    // cab
    box(1.9, 0.78, 1.78, body, { x: 0.55, y: 1.02, parent: g, r: 0.2 });
    box(1.62, 0.5, 1.82, "glass", { x: 0.6, y: 1.16, parent: g, r: 0.12 }); // side glass band
    box(0.08, 0.5, 1.6, "glass", { x: 1.52, y: 1.14, parent: g, r: 0.03, rz: -0.35 }); // windscreen
    // bonnet slope
    box(1.3, 0.22, 1.8, body, { x: 2.0, y: 0.98, parent: g, r: 0.1 });
    // alloy tray with drop sides
    box(2.55, 0.12, 1.92, "aluminium", { x: -1.25, y: 1.02, parent: g, r: 0.03 });
    box(2.55, 0.32, 0.06, "aluminium", { x: -1.25, y: 1.12, z: 0.93, parent: g, r: 0.02 });
    box(2.55, 0.32, 0.06, "aluminium", { x: -1.25, y: 1.12, z: -0.93, parent: g, r: 0.02 });
    box(0.06, 0.32, 1.92, "aluminium", { x: -2.5, y: 1.12, parent: g, r: 0.02 });
    box(0.08, 0.7, 1.92, "steelDark", { x: -0.02, y: 1.1, parent: g, r: 0.02 }); // headboard
    // lights
    box(0.06, 0.16, 0.36, glow(LIGHTS.headlamp, { dark: 1.8, light: 0.3 }), { x: 2.66, y: 0.82, z: 0.62, parent: g, r: 0.02 });
    box(0.06, 0.16, 0.36, glow(LIGHTS.headlamp, { dark: 1.8, light: 0.3 }), { x: 2.66, y: 0.82, z: -0.62, parent: g, r: 0.02 });
    box(0.06, 0.18, 0.2, glow(LIGHTS.tail, { dark: 1.6, light: 0, base: LIGHTS.lens }), { x: -2.53, y: 0.9, z: 0.78, parent: g, r: 0.02 });
    box(0.06, 0.18, 0.2, glow(LIGHTS.tail, { dark: 1.6, light: 0, base: LIGHTS.lens }), { x: -2.53, y: 0.9, z: -0.78, parent: g, r: 0.02 });
    // wheels
    for (const [x, z] of [[1.65, 0.86], [1.65, -0.86], [-1.55, 0.86], [-1.55, -0.86]]) {
      const w = wheel(0.4, 0.3, { x, y: 0.4, z, parent: g });
      wheels.push(w);
    }
    // towbar
    box(0.5, 0.1, 0.1, "steelDark", { x: -2.75, y: 0.42, parent: g, r: 0.02 });
    g.userData.wheels = wheels;
    g.userData.cabin = new THREE.Vector3(0.45, 1.05, 0.35);
    g.userData.trayY = 1.08;
    g.userData.length = 5.2;
    return g;
  }

  // A 2.8 m box trailer facing +x, drawbar at the front, so it can follow a ute
  // that faces +x. Origin under the axle. userData.bedY: floor height;
  // userData.hitch: how far ahead of the origin the coupling sits.
  function trailer({ sides = "steel" } = {}) {
    const g = group();
    box(2.8, 0.1, 1.62, "steelDark", { y: 0.52, parent: g, r: 0.02 });
    box(2.8, 0.42, 0.05, sides, { y: 0.6, z: 0.8, parent: g, r: 0.015 });
    box(2.8, 0.42, 0.05, sides, { y: 0.6, z: -0.8, parent: g, r: 0.015 });
    box(0.05, 0.42, 1.62, sides, { x: 1.4, y: 0.6, parent: g, r: 0.015 });
    box(0.05, 0.42, 1.62, sides, { x: -1.4, y: 0.6, parent: g, r: 0.015 });
    // drawbar
    box(1.2, 0.08, 0.08, "steelDark", { x: 1.95, y: 0.44, z: 0.2, parent: g, r: 0.01, ry: 0.2 });
    box(1.2, 0.08, 0.08, "steelDark", { x: 1.95, y: 0.44, z: -0.2, parent: g, r: 0.01, ry: -0.2 });
    // mudguards and wheels
    box(0.8, 0.06, 0.24, "steelDark", { y: 0.74, z: 0.95, parent: g, r: 0.02 });
    box(0.8, 0.06, 0.24, "steelDark", { y: 0.74, z: -0.95, parent: g, r: 0.02 });
    const wheels = [wheel(0.32, 0.22, { y: 0.32, z: 0.95, parent: g }), wheel(0.32, 0.22, { y: 0.32, z: -0.95, parent: g })];
    box(0.06, 0.12, 0.18, glow(LIGHTS.tail, { dark: 1.4, light: 0, base: LIGHTS.lens }), { x: -1.43, y: 0.62, z: 0.62, parent: g, r: 0.02 });
    box(0.06, 0.12, 0.18, glow(LIGHTS.tail, { dark: 1.4, light: 0, base: LIGHTS.lens }), { x: -1.43, y: 0.62, z: -0.62, parent: g, r: 0.02 });
    g.userData.wheels = wheels;
    g.userData.bedY = 0.57;
    g.userData.hitch = 2.55; // distance from origin to the coupling, along +x
    return g;
  }

  // A truck cab, about 2.6 m long, facing +x, for the yard's trucks (graphite,
  // "fleet"). Put it at the front of a chassis you build yourself.
  function truckCab({ color = "fleet" } = {}) {
    const g = group();
    box(2.4, 1.9, 2.4, color, { y: 0.9, parent: g, r: 0.18 });
    box(0.1, 0.8, 2.1, "glass", { x: 1.2, y: 1.85, parent: g, r: 0.03 }); // windscreen
    box(1.6, 0.6, 2.44, "glass", { x: 0.1, y: 1.95, parent: g, r: 0.06 }); // side windows
    box(0.12, 0.7, 1.6, "charcoal", { x: 1.22, y: 0.95, parent: g, r: 0.04 }); // grille
    box(0.3, 0.2, 2.5, "charcoal", { x: 1.15, y: 0.5, parent: g, r: 0.05 }); // bumper
    box(0.06, 0.18, 0.4, glow(LIGHTS.headlamp, { dark: 1.8, light: 0.3 }), { x: 1.26, y: 0.75, z: 0.9, parent: g, r: 0.02 });
    box(0.06, 0.18, 0.4, glow(LIGHTS.headlamp, { dark: 1.8, light: 0.3 }), { x: 1.26, y: 0.75, z: -0.9, parent: g, r: 0.02 });
    box(0.5, 0.12, 0.9, glow(LIGHTS.beacon, { dark: 2.2, light: 0.6 }), { x: 0, y: 2.84, parent: g, r: 0.05 }); // roof beacon
    return g;
  }

  // ---------------------------------------------------------------- scrap

  // Shared geometry for scrap pieces, one draw call per kind with per-piece colour.
  const scrapMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.55, metalness: 0.55 });
  scrapMaterial.name = "scrap";
  materials.set("scrap", scrapMaterial);
  const scrapKinds = {
    plate: () => cached("scrap:plate", () => new THREE.BoxGeometry(1, 0.08, 0.7)),
    chunk: () => cached("scrap:chunk", () => new THREE.BoxGeometry(0.6, 0.45, 0.5)),
    pipe: () => cached("scrap:pipe", () => new THREE.CylinderGeometry(0.12, 0.12, 1.4, 8)),
    beam: () => cached("scrap:beam", () => new THREE.BoxGeometry(1.8, 0.16, 0.16)),
    coil: () => cached("scrap:coil", () => new THREE.TorusGeometry(0.32, 0.09, 6, 12)),
    can: () => cached("scrap:can", () => new THREE.CylinderGeometry(0.2, 0.2, 0.42, 10)),
  };

  // A mound of scrap: a solid core with pieces scattered over its surface.
  //   radius, height  of the mound
  //   colors          [surface names or #hex], picked per piece
  //   kinds           which piece shapes to use (see scrapKinds)
  //   count           number of pieces
  //   size            scale of the pieces (1 = a plate about 1 m across)
  //   core            surface name for the core, or false for no core
  function scrapPile({
    radius = 3,
    height = 1.6,
    colors = ["steel", "rust", "steelDark"],
    kinds = ["plate", "chunk", "pipe", "beam"],
    count = 70,
    size = 1,
    seed = 7,
    core = "rustDark",
    stretch = 1, // >1 makes an oval mound along x
  } = {}) {
    const g = group();
    const r = rng(seed);
    if (core) {
      const coreGeo = cached(`scrap:core:${round(radius)}:${round(height)}:${seed}:${round(stretch)}`, () => {
        const geo = new THREE.ConeGeometry(radius, height, 11, 2);
        const pos = geo.attributes.position;
        const jr = rng(seed + 99);
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          if (y < height / 2 - 0.01) {
            pos.setX(i, pos.getX(i) * (0.85 + jr() * 0.3) * stretch);
            pos.setZ(i, pos.getZ(i) * (0.85 + jr() * 0.3));
            pos.setY(i, y + (jr() - 0.5) * height * 0.12);
          } else {
            pos.setY(i, y * 0.92);
          }
        }
        geo.computeVertexNormals();
        geo.translate(0, height / 2, 0);
        return geo;
      });
      mesh(coreGeo, core, { parent: g });
    }
    const buckets = new Map();
    const color = new THREE.Color();
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const kind = kinds[Math.floor(r() * kinds.length)];
      const a = r() * TAU;
      const rr = radius * Math.sqrt(r()) * 0.96;
      const surfaceY = height * Math.max(0, 1 - rr / radius);
      p.set(Math.cos(a) * rr * stretch, surfaceY + (r() - 0.3) * 0.25 * size, Math.sin(a) * rr);
      e.set(r() * TAU, r() * TAU, r() * TAU);
      q.setFromEuler(e);
      const s = size * (0.6 + r() * 0.7);
      sc.set(s, s, s);
      m4.compose(p, q, sc);
      const name = colors[Math.floor(r() * colors.length)];
      color.set(name.startsWith("#") ? name : SURFACES[name]?.color ?? "#888888");
      let bucket = buckets.get(kind);
      if (!bucket) buckets.set(kind, (bucket = []));
      bucket.push({ matrix: m4.clone(), color: color.clone() });
    }
    for (const [kind, items] of buckets) {
      const inst = new THREE.InstancedMesh(scrapKinds[kind](), scrapMaterial, items.length);
      items.forEach((it, i) => {
        inst.setMatrixAt(i, it.matrix);
        inst.setColorAt(i, it.color);
      });
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      inst.castShadow = true;
      inst.receiveShadow = true;
      inst.computeBoundingSphere();
      g.add(inst);
    }
    return g;
  }

  // ---------------------------------------------------------------- text

  // Draws text (or anything) onto a canvas texture.
  //   draw(ctx, w, h) for custom drawing, or text/lines with font options.
  //   font: "display", "label", "body" (all Archivo), "mono"
  //   stretch: Archivo's width, "condensed" for a stamped code like Cu
  function canvasTexture({
    width = 512,
    height = 128,
    bg = BRAND.rack,
    color = BRAND.rackInk,
    text = "",
    lines = null,
    font = "display",
    weight = "700",
    stretch = "normal",
    size = 0.62, // of the canvas height, per line
    align = "center",
    letterSpacing = 0,
    padding = 0.06,
    radius = 0,
    border = null,
    draw = null,
  } = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (bg) {
      ctx.fillStyle = bg;
      if (radius > 0) {
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, radius * height);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, width, height);
      }
    }
    if (border) {
      ctx.strokeStyle = border.color;
      ctx.lineWidth = border.width;
      ctx.beginPath();
      ctx.roundRect(border.width / 2, border.width / 2, width - border.width, height - border.width, radius * height);
      ctx.stroke();
    }
    if (draw) {
      draw(ctx, width, height, fonts);
    } else {
      const rows = lines ?? [text];
      const lineH = height / rows.length;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.textAlign = align;
      if ("letterSpacing" in ctx) ctx.letterSpacing = `${letterSpacing}px`;
      const x = align === "left" ? width * padding : align === "right" ? width * (1 - padding) : width / 2;
      const setFont = (px) => {
        ctx.font = `${weight} ${px}px ${fonts[font] ?? font}`;
        if ("fontStretch" in ctx) ctx.fontStretch = stretch;
      };
      rows.forEach((row, i) => {
        let px = lineH * size;
        setFont(px);
        // shrink to fit
        const max = width * (1 - padding * 2);
        while (ctx.measureText(row).width > max && px > 8) {
          px -= 2;
          setFont(px);
        }
        ctx.fillText(row, x, lineH * (i + 0.54));
      });
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    textures.add(tex);
    return tex;
  }

  // A flat sign facing +z: a plane w x h metres with the texture on it.
  //   glow: { dark, light } makes it self-lit (a lightbox or LED panel).
  function sign(w, h, texOptions, { glow: glowCfg = null, doubleSided = false, roughness = 0.6 } = {}) {
    const tex = canvasTexture({ width: Math.round(256 * (w / h)), height: 256, ...texOptions });
    const material = new THREE.MeshStandardMaterial({ map: tex, roughness, side: doubleSided ? THREE.DoubleSide : THREE.FrontSide });
    if (glowCfg) {
      material.emissive = new THREE.Color("#ffffff");
      material.emissiveMap = tex;
      const entry = { kind: "glow", m: material, dark: glowCfg.dark ?? 1, light: glowCfg.light ?? 0.3, level: 1 };
      material.userData.glow = entry;
      themed.glows.push(entry);
      applyEntry(entry);
    }
    const plane = new THREE.Mesh(cached(`plane:${round(w)}:${round(h)}`, () => new THREE.PlaneGeometry(w, h)), material);
    plane.receiveShadow = true;
    return plane;
  }

  // A screen whose content changes (a weighbridge readout, a phone). Redraws
  // only when the value changes. Returns { mesh, set(value) }.
  //   draw(ctx, w, h, value, fonts)
  function screen(w, h, { draw, pixels = 256, glow: glowCfg = { dark: 1.4, light: 0.9 }, initial = null } = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(pixels * (w / h));
    canvas.height = pixels;
    const ctx = canvas.getContext("2d");
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    textures.add(tex);
    const material = new THREE.MeshStandardMaterial({ map: tex, emissive: new THREE.Color("#ffffff"), emissiveMap: tex, roughness: 0.4 });
    const entry = { kind: "glow", m: material, dark: glowCfg.dark, light: glowCfg.light, level: 1 };
    material.userData.glow = entry;
    themed.glows.push(entry);
    applyEntry(entry);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    let last;
    function set(value) {
      if (value === last) return;
      last = value;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height, value, fonts);
      tex.needsUpdate = true;
    }
    if (initial !== null) set(initial);
    return { mesh: plane, set };
  }

  // A floating label that always faces the camera (a Sprite), anchored at its
  // bottom centre. Fade it with sprite.material.opacity. width in metres.
  // A flat, square-cornered plate, like the site's:
  //   style: "tag" (the aluminium grade tag), "rack" (the graphite rack field)
  //          or "action" (deep copper). The old names still work: "chip" draws
  //          the rack plate, "cherry" the copper one and "light" the tag.
  function callout(text, { width = 3, style = "rack", icon = null, font = "label", weight = "700", depthTest = false } = {}) {
    const h = 128;
    const w = Math.round(h * 4);
    const look = { cherry: "action", light: "tag", chip: "rack" }[style] ?? style;
    const bg = look === "action" ? BRAND.action : look === "tag" ? BRAND.tag : BRAND.rack;
    const fg = look === "action" ? BRAND.actionInk : look === "tag" ? BRAND.tagInk : BRAND.rackInk;
    const tex = canvasTexture({
      width: w,
      height: h,
      bg: null,
      draw(ctx, cw, ch, f) {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(4, 4, cw - 8, ch - 8, 6);
        ctx.fill();
        ctx.fillStyle = fg;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        let px = 58;
        ctx.font = `${weight} ${px}px ${f[font] ?? font}`;
        const label = icon ? `${icon}  ${text}` : text;
        while (ctx.measureText(label).width > cw - 70 && px > 12) {
          px -= 2;
          ctx.font = `${weight} ${px}px ${f[font] ?? font}`;
        }
        ctx.fillText(label, cw / 2, ch / 2 + 2);
      },
    });
    const material = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.center.set(0.5, 0);
    sprite.scale.set(width, width / 4, 1);
    sprite.renderOrder = 10;
    return sprite;
  }

  // ---------------------------------------------------------------- light

  let glowTexture = null;
  function glowMap() {
    if (glowTexture) return glowTexture;
    glowTexture = canvasTexture({
      width: 128,
      height: 128,
      bg: null,
      draw(ctx, w, h) {
        const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      },
    });
    glowTexture.colorSpace = THREE.SRGBColorSpace;
    return glowTexture;
  }

  // A soft additive halo (around lamp heads, the furnace mouth). size in metres.
  function halo(hex, size = 2, { dark = 0.85, light = 0 } = {}) {
    const material = new THREE.SpriteMaterial({
      map: glowMap(),
      color: hex,
      transparent: true,
      opacity: theme === "dark" ? dark : light,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, 1);
    const entry = { kind: "halo", m: material, dark, light, level: 1 };
    themed.sprites.push(entry);
    material.userData.halo = entry;
    return sprite;
  }

  // A point light whose intensity follows the theme. priority decides which
  // lights survive when the world trims them to the device's budget (higher
  // wins). Returns the light; add it to your group yourself.
  function pointLight(hex = LIGHTS.lamp, { dark = 60, light = 0, distance = 20, priority = 1 } = {}) {
    const l = new THREE.PointLight(hex, theme === "dark" ? dark : light, distance, 2);
    l.castShadow = false;
    const entry = { kind: "light", l, dark, light, priority, level: 1 };
    l.userData.themed = entry;
    themed.lights.push(entry);
    return l;
  }

  // A yard floodlight or street light: pole, arm and a glowing head, with a
  // halo and (if the budget allows) a real point light under the head.
  function lamp({ height = 6.5, arm = 1.4, color = LIGHTS.lamp, light = { dark: 70, light: 0, distance: 22 }, priority = 1, double = false } = {}) {
    const g = group();
    cyl(0.09, 0.12, height, "steelDark", { parent: g, seg: 8 });
    const heads = double ? [1, -1] : [1];
    const headMat = glow(color, { dark: 3, light: 0 });
    for (const side of heads) {
      box(arm, 0.08, 0.08, "steelDark", { x: (side * arm) / 2, y: height - 0.12, parent: g, r: 0.02 });
      box(0.6, 0.16, 0.34, "steelDark", { x: side * arm, y: height - 0.2, parent: g, r: 0.04 });
      box(0.5, 0.04, 0.28, headMat, { x: side * arm, y: height - 0.24, parent: g, r: 0.01, cast: false });
      const h = halo(color, 2.4);
      h.position.set(side * arm, height - 0.32, 0);
      g.add(h);
    }
    if (light) {
      const l = pointLight(color, { ...light, priority });
      l.position.set(arm, height - 1, 0);
      g.add(l);
    }
    return g;
  }

  // ---------------------------------------------------------------- nature

  // A low-poly gum tree. seed varies its shape.
  function tree({ height = 7, seed = 3, kind = "gum" } = {}) {
    const g = group();
    const r = rng(seed);
    const lean = (r() - 0.5) * 0.18;
    const trunkMat = kind === "gum" ? "trunkPale" : "trunk";
    cyl(0.16, 0.26, height * 0.55, trunkMat, { parent: g, seg: 7, rz: lean });
    const blobs = kind === "gum" ? 3 : 2;
    for (let i = 0; i < blobs; i++) {
      const rad = height * (0.2 + r() * 0.12);
      const geo = cached(`tree:blob:${seed}:${i}:${round(rad)}`, () => {
        const geom = new THREE.IcosahedronGeometry(rad, 0);
        geom.scale(1, 0.75, 1);
        return geom;
      });
      mesh(geo, r() > 0.5 ? "foliage" : "foliageDark", {
        x: (r() - 0.5) * height * 0.32 + lean * height * 0.5,
        y: height * (0.58 + r() * 0.22),
        z: (r() - 0.5) * height * 0.32,
        ry: r() * TAU,
        parent: g,
      });
    }
    return g;
  }

  // A shrub: one squashed blob.
  function shrub({ size = 1, seed = 5 } = {}) {
    const r = rng(seed);
    const geo = cached(`shrub:${round(size)}`, () => {
      const geom = new THREE.IcosahedronGeometry(size, 0);
      geom.scale(1, 0.7, 1);
      return geom;
    });
    return mesh(geo, r() > 0.5 ? "foliage" : "foliageDark", { y: size * 0.55, ry: r() * TAU });
  }

  // ---------------------------------------------------------------- fences

  // A fence along a polyline of [x, z] points, panels between posts.
  //   style: "colorbond" (solid sheet, the yard), "paling" (timber, homes),
  //          "mesh" (see-through panel)
  function fence(points, { height = 2.4, style = "colorbond", postEvery = 3 } = {}) {
    const g = group();
    const panelMat =
      style === "colorbond"
        ? "colorbond"
        : style === "paling"
          ? "timber"
          : new THREE.MeshStandardMaterial({ ...SURFACES.fenceMesh, transparent: true, opacity: 0.35 });
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, z0] = points[i];
      const [x1, z1] = points[i + 1];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.hypot(dx, dz);
      if (len < 0.01) continue;
      const ry = Math.atan2(-dz, dx);
      box(len, height, style === "mesh" ? 0.03 : 0.08, panelMat, {
        x: (x0 + x1) / 2,
        z: (z0 + z1) / 2,
        ry,
        parent: g,
        r: 0.01,
        cast: style !== "mesh",
      });
      box(len, 0.08, 0.14, style === "paling" ? "timberDark" : "steelDark", {
        x: (x0 + x1) / 2,
        y: height - 0.04,
        z: (z0 + z1) / 2,
        ry,
        parent: g,
        r: 0.01,
      });
      const posts = Math.max(1, Math.round(len / postEvery));
      for (let k = 0; k <= posts; k++) {
        const t = k / posts;
        box(0.12, height + 0.12, 0.12, style === "paling" ? "timberDark" : "steelDark", {
          x: x0 + dx * t,
          z: z0 + dz * t,
          parent: g,
          r: 0.02,
        });
      }
    }
    return g;
  }

  // ---------------------------------------------------------------- merging

  // Merges every static mesh under root into one mesh per material (and
  // shadow setting), in root's local space. Skips anything inside a group
  // marked with kit.dynamic(), InstancedMeshes, Sprites, lights, and meshes
  // with multi-materials. Returns how many meshes it removed.
  function mergeStatic(root) {
    root.updateMatrixWorld(true);
    const inverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const buckets = new Map();
    const victims = [];
    const visit = (obj) => {
      if (obj !== root && obj.userData.dynamic) return;
      for (const child of obj.children) visit(child);
      if (
        obj.isMesh &&
        !obj.isInstancedMesh &&
        !obj.isSkinnedMesh &&
        !Array.isArray(obj.material) &&
        obj.visible &&
        !obj.userData.noMerge &&
        obj.geometry?.attributes?.position
      ) {
        const key = `${obj.material.uuid}|${obj.castShadow ? 1 : 0}${obj.receiveShadow ? 1 : 0}|${obj.renderOrder}`;
        let b = buckets.get(key);
        if (!b) buckets.set(key, (b = { material: obj.material, cast: obj.castShadow, receive: obj.receiveShadow, renderOrder: obj.renderOrder, items: [] }));
        b.items.push(obj);
      }
    };
    visit(root);
    let removed = 0;
    for (const b of buckets.values()) {
      if (b.items.length < 2) continue;
      try {
        const needsUv = !!(b.material.map || b.material.emissiveMap);
        const parts = b.items.map((m) => {
          let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
          for (const name of Object.keys(g.attributes)) {
            if (name !== "position" && name !== "normal" && name !== "uv") g.deleteAttribute(name);
          }
          if (!g.attributes.normal) g.computeVertexNormals();
          if (!g.attributes.uv) {
            if (needsUv) throw new Error("textured mesh without uv");
            g.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
          }
          g.morphAttributes = {};
          const matrix = new THREE.Matrix4().multiplyMatrices(inverse, m.matrixWorld);
          g.applyMatrix4(matrix);
          return g;
        });
        const merged = mergeGeometries(parts, false);
        parts.forEach((g) => g.dispose());
        if (!merged) continue;
        merged.computeBoundingSphere();
        const out = new THREE.Mesh(merged, b.material);
        out.castShadow = b.cast;
        out.receiveShadow = b.receive;
        out.renderOrder = b.renderOrder;
        out.userData.merged = true;
        root.add(out);
        victims.push(...b.items);
      } catch (err) {
        // Leave this bucket unmerged; it still renders, just with more draw calls.
      }
    }
    for (const m of victims) {
      m.parent?.remove(m);
      removed++;
    }
    return removed;
  }

  // ---------------------------------------------------------------- theme

  function applyTheme(name) {
    theme = name;
    for (const e of themed.glows) applyEntry(e);
    for (const e of themed.sprites) applyEntry(e);
    for (const e of themed.lights) applyEntry(e);
  }

  // Waits (briefly) for Archivo, so signs don't draw in a fallback.
  async function ready() {
    if (typeof document === "undefined" || !document.fonts) return;
    const wanted = [`800 64px ${fonts.display}`, `700 48px ${fonts.label}`];
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
    await Promise.race([Promise.all(wanted.map((f) => document.fonts.load(f).catch(() => null))), timeout]);
  }

  function dispose() {
    for (const g of geometries.values()) g.dispose();
    for (const m of materials.values()) m.dispose();
    for (const t of textures) t.dispose();
    for (const e of themed.glows) e.m.dispose();
    for (const e of themed.sprites) e.m.dispose();
    geometries.clear();
    materials.clear();
    textures.clear();
  }

  return {
    THREE,
    quality,
    fonts,
    rng,
    // materials
    mat,
    paint,
    resolve,
    glow,
    setLevel,
    // shapes
    box,
    cyl,
    rod,
    sphere,
    cone,
    mesh,
    group,
    place,
    dynamic,
    boxGeometry,
    // props
    wheel,
    person,
    ute,
    trailer,
    truckCab,
    scrapPile,
    tree,
    shrub,
    fence,
    lamp,
    halo,
    pointLight,
    // text
    canvasTexture,
    sign,
    screen,
    callout,
    // world
    mergeStatic,
    applyTheme,
    ready,
    dispose,
    themed,
    get theme() {
      return theme;
    },
  };
}

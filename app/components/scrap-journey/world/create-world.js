// Builds the scrap journey's 3D world into a host element and returns a small
// API the page drives every frame with the story clock (tau, timeline.js):
//
//   const world = await createWorld(host, { theme, quality })
//   world.frame({ tau, time, dt })   update everything for tau, then draw
//   world.setTheme("dark" | "light")
//   world.resize(width, height, mode)   mode: "side" | "bottom" (where the copy sits)
//   world.dispose()
//
// Each station is built inside a try/catch: one that throws is left out and
// the rest of the world still renders.

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createKit } from "./kit.js";
import { THEMES } from "./palette.js";
import * as layout from "./layout.js";
import * as timeline from "./timeline.js";
import { createCameraRig } from "./camera-rig.js";
import { FOLLOW, SHOTS } from "./shots.js";
import { buildCustomer } from "./actors/customer.js";
import { buildScenery } from "./stations/scenery.js";
import { buildHome } from "./stations/home.js";
import { buildYard } from "./stations/yard.js";
import { buildGrading } from "./stations/grading.js";
import { buildWeighbridge } from "./stations/weighbridge.js";
import { buildOffice } from "./stations/office.js";
import { buildProcessing } from "./stations/processing.js";

export const STATIONS = [
  ["scenery", buildScenery],
  ["home", buildHome],
  ["yard", buildYard],
  ["grading", buildGrading],
  ["weighbridge", buildWeighbridge],
  ["office", buildOffice],
  ["processing", buildProcessing],
];

const LIGHT_DIR = new THREE.Vector3(-0.52, 1, 0.42).normalize(); // key light, from the upper left
const RIM_DIR = new THREE.Vector3(0.7, 0.55, -0.75).normalize();

export async function createWorld(host, options = {}) {
  const {
    theme: initialTheme = "dark",
    quality = { tier: "high", dpr: 1.5, antialias: true, shadows: true, shadowMapSize: 2048, maxLights: 8 },
    only = null, // build only these stations (the QA harness uses it)
    onWarn = (...args) => console.warn("[scrap-journey]", ...args),
  } = options;

  // ---- renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: !!quality.antialias,
    powerPreference: "high-performance",
    alpha: false,
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = !!quality.shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  let width = Math.max(1, host.clientWidth);
  let height = Math.max(1, host.clientHeight);
  let viewMode = options.mode ?? "side";
  let pixelRatio = quality.dpr ?? 1;
  const maxPixels = quality.maxPixels ?? (quality.tier === "low" ? 1.3e6 : 2.6e6);
  function applySize() {
    const cap = Math.sqrt(maxPixels / (width * height));
    renderer.setPixelRatio(Math.max(0.75, Math.min(pixelRatio, cap)));
    renderer.setSize(width, height, false);
  }
  applySize();

  // ---- scene, camera, light rig
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#0C0C0C", 120, 600);
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.5, 1400);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight("#ffffff", "#444444", 1);
  scene.add(hemi);
  const key = new THREE.DirectionalLight("#ffffff", 2);
  key.castShadow = !!quality.shadows;
  const mapSize = quality.shadowMapSize ?? 2048;
  key.shadow.mapSize.set(mapSize, mapSize);
  key.shadow.radius = 3;
  key.shadow.bias = -0.00035;
  key.shadow.normalBias = 0.035;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight("#ffffff", 0.4);
  scene.add(rim, rim.target);

  // ---- kit, ground, actors, stations
  const kit = createKit({ quality });
  await kit.ready();

  const ctx = { THREE, kit, layout, timeline, quality, scene, actors: {} };
  scene.add(buildPlinths(kit));

  const updaters = [];
  try {
    const customer = buildCustomer(ctx);
    ctx.actors.customer = customer;
    scene.add(customer.group);
    updaters.push(customer);
  } catch (err) {
    onWarn("customer failed to build", err);
  }

  const built = [];
  for (const [name, build] of STATIONS) {
    if (only && !only.includes(name)) continue;
    try {
      const station = build(ctx);
      if (!station?.group) continue;
      station.name = station.name ?? name;
      scene.add(station.group);
      built.push(station);
      if (station.update) updaters.push(station);
    } catch (err) {
      onWarn(`station "${name}" failed to build`, err);
    }
  }

  // Merge each station's static meshes to keep draw calls down.
  for (const station of built) {
    try {
      kit.mergeStatic(station.group);
    } catch (err) {
      onWarn(`station "${station.name}" could not be merged`, err);
    }
  }

  // Point lights cost per pixel, so keep only the device's budget of them,
  // highest priority first. The rest stay off for good (switching lights on
  // and off later would recompile every shader).
  const lights = [...kit.themed.lights].sort((a, b) => b.priority - a.priority);
  lights.forEach((entry, i) => {
    entry.l.visible = i < (quality.maxLights ?? 8);
  });

  const rig = createCameraRig(SHOTS, { follow: FOLLOW, actors: ctx.actors });

  // ---- theme
  let theme = initialTheme;
  function setTheme(name) {
    theme = THEMES[name] ? name : "dark";
    const t = THEMES[theme];
    scene.background = new THREE.Color(t.background);
    scene.fog.color.set(t.background);
    hemi.color.set(t.hemi.sky);
    hemi.groundColor.set(t.hemi.ground);
    hemi.intensity = t.hemi.intensity;
    key.color.set(t.key.color);
    key.intensity = t.key.intensity;
    rim.color.set(t.rim.color);
    rim.intensity = t.rim.intensity;
    scene.environmentIntensity = t.environment;
    renderer.toneMappingExposure = t.exposure;
    kit.applyTheme(theme);
  }
  setTheme(theme);

  // ---- per frame
  const focus = new THREE.Vector3();
  const snapped = new THREE.Vector3();
  const lightRight = new THREE.Vector3().crossVectors(LIGHT_DIR, THREE.Object3D.DEFAULT_UP).normalize();
  const lightUp = new THREE.Vector3().crossVectors(lightRight, LIGHT_DIR).normalize();
  let lastShadowSize = 0;

  // Shadows only cover what the camera is looking at, sized to its distance,
  // with the light snapped to whole shadow texels so edges don't crawl.
  function fitShadow(distance) {
    const raw = THREE.MathUtils.clamp(distance * 0.62, 16, 150);
    const size = Math.pow(2, Math.round(Math.log2(raw) * 4) / 4);
    const texel = (2 * size) / mapSize;
    const along = focus.dot(LIGHT_DIR);
    const r = Math.round(focus.dot(lightRight) / texel) * texel;
    const u = Math.round(focus.dot(lightUp) / texel) * texel;
    snapped.copy(LIGHT_DIR).multiplyScalar(along).addScaledVector(lightRight, r).addScaledVector(lightUp, u);
    key.target.position.copy(snapped);
    key.position.copy(snapped).addScaledVector(LIGHT_DIR, 220);
    if (size !== lastShadowSize) {
      const cam = key.shadow.camera;
      cam.left = -size;
      cam.right = size;
      cam.top = size;
      cam.bottom = -size;
      cam.near = 20;
      cam.far = 220 + size * 2.5;
      cam.updateProjectionMatrix();
      lastShadowSize = size;
    }
    rim.target.position.copy(focus);
    rim.position.copy(focus).addScaledVector(RIM_DIR, 100);
  }

  let lastTau = null;
  function frame({ tau = 0, time = 0, dt = 0 } = {}) {
    const state = { tau, time, dt, camera, theme };
    for (const u of updaters) {
      try {
        u.update(state);
      } catch (err) {
        onWarn(`"${u.name}" update failed; it will stop animating`, err);
        u.update = () => {};
      }
    }
    focus.copy(rig.apply(camera, tau, { width, height, mode: viewMode }));
    const distance = camera.position.distanceTo(focus);
    fitShadow(distance);
    scene.fog.near = distance * 1.15;
    scene.fog.far = distance * 3.4 + 80;
    renderer.render(scene, camera);
    lastTau = tau;
  }

  function resize(w, h, mode = viewMode) {
    width = Math.max(1, Math.round(w));
    height = Math.max(1, Math.round(h));
    viewMode = mode;
    applySize();
    if (lastTau !== null) frame({ tau: lastTau });
  }

  // Drop the pixel ratio a step when frames are slow (called by the page).
  function degrade() {
    if (pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      applySize();
      return true;
    }
    if (renderer.shadowMap.enabled) {
      renderer.shadowMap.enabled = false;
      key.castShadow = false;
      scene.traverse((o) => {
        if (o.material) o.material.needsUpdate = true;
      });
      return true;
    }
    return false;
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry && o.userData.merged) o.geometry.dispose();
      if (o.isInstancedMesh) o.dispose();
    });
    kit.dispose();
    envTarget.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  return {
    frame,
    setTheme,
    resize,
    degrade,
    dispose,
    canvas,
    // for the QA harness
    debug: {
      scene,
      camera,
      renderer,
      kit,
      rig,
      ctx,
      stations: built.map((s) => s.name),
      stats: () => ({ ...renderer.info.render, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, pixelRatio: renderer.getPixelRatio() }),
    },
  };
}

// The two islands the world sits on, like a model on a plinth: a dark base, a
// band of soil, then the ground. Stations and scenery build on y = 0.
function buildPlinths(kit) {
  const g = kit.group();
  const slab = (island, top = 0) => {
    const { x, z, width, depth, thickness } = island;
    kit.box(width, thickness - 0.9, depth, "plinth", { x, y: top - thickness, z, r: 0.6, parent: g });
    kit.box(width - 0.2, 0.7, depth - 0.2, "soil", { x, y: top - 0.9, z, r: 0.25, parent: g });
    kit.box(width - 0.3, 0.2, depth - 0.3, "grassDark", { x, y: top - 0.2, z, r: 0.08, parent: g, cast: false });
  };
  slab(layout.ISLAND);
  slab(layout.SMELTER_ISLAND, layout.SMELTER_ISLAND.y);
  kit.mergeStatic(g);
  return g;
}

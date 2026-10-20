// Turns the shot list (shots.js) into a camera position, target and field of
// view for any tau. Between keyframes it uses cubic Hermite curves in tau, so
// speed is continuous through every keyframe. A pair of `hold` keyframes at a
// stop's start and end gets the stop's own slow drift as its tangent: the
// camera eases out of the flight, drifts gently while the copy is up, then
// eases into the next flight. It never reverses at a seam, because there are
// no seams: the whole film is one curve.

import * as THREE from "three";
import { clamp, smoothstep, span } from "./timeline.js";

export function createCameraRig(shots, { follow = [], actors = {} } = {}) {
  const keys = shots
    .map((s) => ({
      tau: s.tau,
      pos: new THREE.Vector3(...s.pos),
      look: new THREE.Vector3(...s.look),
      fov: s.fov ?? 34,
      hold: !!s.hold,
      mPos: new THREE.Vector3(),
      mLook: new THREE.Vector3(),
      mFov: 0,
    }))
    .sort((a, b) => a.tau - b.tau);

  const stopOf = (tau) => Math.floor(tau / 2 + 1e-6);

  // Tangents (per unit tau).
  keys.forEach((k, i) => {
    const partner = k.hold
      ? [keys[i - 1], keys[i + 1]].find((o) => o && o.hold && stopOf(o.tau) === stopOf(k.tau) && o.tau !== k.tau)
      : null;
    if (partner) {
      const [a, b] = partner.tau > k.tau ? [k, partner] : [partner, k];
      const dt = b.tau - a.tau;
      k.mPos.subVectors(b.pos, a.pos).divideScalar(dt);
      k.mLook.subVectors(b.look, a.look).divideScalar(dt);
      k.mFov = (b.fov - a.fov) / dt;
      return;
    }
    const prev = keys[i - 1] ?? k;
    const next = keys[i + 1] ?? k;
    const dt = next.tau - prev.tau || 1;
    k.mPos.subVectors(next.pos, prev.pos).divideScalar(dt);
    k.mLook.subVectors(next.look, prev.look).divideScalar(dt);
    k.mFov = (next.fov - prev.fov) / dt;
  });

  function hermite(out, p0, m0, p1, m1, h, s) {
    const s2 = s * s;
    const s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1;
    const h10 = s3 - 2 * s2 + s;
    const h01 = -2 * s3 + 3 * s2;
    const h11 = s3 - s2;
    return out
      .copy(p0)
      .multiplyScalar(h00)
      .addScaledVector(m0, h10 * h)
      .addScaledVector(p1, h01)
      .addScaledVector(m1, h11 * h);
  }

  // Raw shot at tau, before following and framing.
  function evaluate(tau, outPos, outLook) {
    if (tau <= keys[0].tau) {
      outPos.copy(keys[0].pos);
      outLook.copy(keys[0].look);
      return keys[0].fov;
    }
    const last = keys[keys.length - 1];
    if (tau >= last.tau) {
      outPos.copy(last.pos);
      outLook.copy(last.look);
      return last.fov;
    }
    let i = 0;
    while (i < keys.length - 2 && keys[i + 1].tau < tau) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const h = b.tau - a.tau;
    const s = (tau - a.tau) / h;
    hermite(outPos, a.pos, a.mPos, b.pos, b.mPos, h, s);
    hermite(outLook, a.look, a.mLook, b.look, b.mLook, h, s);
    const s2 = s * s;
    const s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * a.fov + (s3 - 2 * s2 + s) * h * a.mFov + (-2 * s3 + 3 * s2) * b.fov + (s3 - s2) * h * b.mFov;
  }

  const P = new THREE.Vector3();
  const L = new THREE.Vector3();
  const A = new THREE.Vector3();
  const lift = new THREE.Vector3(0, 1, 0);
  let override = null;

  // view: { width, height, mode: "side" (copy on the left) | "bottom" (copy under) | "none" }
  function apply(camera, tau, view) {
    let fov;
    if (override) {
      P.copy(override.pos);
      L.copy(override.look);
      fov = override.fov ?? 34;
    } else {
      fov = evaluate(tau, P, L);
      // Follow an actor (the ute on its drive to the yard): move the target
      // to it and carry the camera by the same offset.
      for (const f of follow) {
        const actor = actors[f.actor];
        if (!actor) continue;
        const [a, b] = f.tau;
        const ramp = f.ramp ?? 0.22;
        const w = (f.weight ?? 0.85) * Math.min(smoothstep(span(tau, a, a + ramp)), 1 - smoothstep(span(tau, b - ramp, b)));
        if (w <= 0) continue;
        actor.positionAt(tau, A).addScaledVector(lift, f.lift ?? 1);
        A.sub(L).multiplyScalar(w);
        L.add(A);
        P.add(A);
      }
    }

    const aspect = view.width / Math.max(1, view.height);
    // Narrow screens see less of each scene, so back the camera off.
    if (!override && aspect < 1.3) {
      const back = 1 + (1.3 - aspect) * 0.85;
      P.sub(L).multiplyScalar(back).add(L);
    }

    camera.position.copy(P);
    camera.lookAt(L);
    camera.fov = clamp(fov, 18, 70);
    camera.aspect = aspect;
    const { width: w, height: h } = view;
    if (view.mode === "side") camera.setViewOffset(w, h, -w * 0.13, 0, w, h);
    else if (view.mode === "bottom") camera.setViewOffset(w, h, 0, h * 0.15, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    return L;
  }

  return {
    apply,
    evaluate,
    keys,
    // For tuning shots from the harness: pin the camera, or pass null to release.
    setOverride(value) {
      override = value
        ? { pos: new THREE.Vector3(...value.pos), look: new THREE.Vector3(...value.look), fov: value.fov }
        : null;
    },
  };
}

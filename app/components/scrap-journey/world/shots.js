// The camera's keyframes, one film from the first screen to the last. tau is
// the story clock from timeline.js: stop i spans [2i, 2i + 1], the flight to
// the next stop [2i + 1, 2i + 2]. pos and look are world coordinates (see
// layout.js); fov is the vertical field of view in degrees (narrow = the
// tilt-shift miniature look).
//
// hold: true on a stop's start and end keyframes makes the camera drift
// slowly between them while that stop's copy is up (see camera-rig.js).
// Flight keyframes in between shape the move from one stop to the next.

export const SHOTS = [
  // Stop 0, call ahead: the whole little world, easing in towards the house.
  { tau: 0, pos: [-150, 118, 206], look: [-16, 0, 8], fov: 30, hold: true },
  { tau: 1, pos: [-112, 48, 130], look: [-60, 2, 54], fov: 30, hold: true },

  // Stop 1, sort the load: low over the driveway, the trailer and the pile.
  { tau: 2, pos: [-31, 14, 77], look: [-52, 1.4, 52], fov: 34, hold: true },
  { tau: 3, pos: [-34, 12.5, 73], look: [-51.5, 1.4, 51.5], fov: 34, hold: true },

  // Flight: up and along with the ute as it drives to the yard.
  { tau: 3.5, pos: [-22, 34, 66], look: [-22, 0, 36], fov: 36 },

  // Stop 2, drop-off and grading: beside the grade bays.
  { tau: 4, pos: [14, 17, 16], look: [36, 1.6, -6], fov: 36, hold: true },
  { tau: 5, pos: [12, 15.5, 11], look: [37, 1.6, -9], fov: 36, hold: true },

  // Flight: rise over the yard and swing west to the weighbridge.
  { tau: 5.5, pos: [4, 44, 22], look: [-12, 0, -14], fov: 36 },

  // Stop 3, weigh: the ute on the weighbridge, the readout beside it.
  { tau: 6, pos: [-9, 12, 10], look: [-26, 1.6, -5], fov: 36, hold: true },
  { tau: 7, pos: [-11, 10.5, 7], look: [-26.5, 1.6, -6], fov: 36, hold: true },

  // Stop 4, get paid: close on the office's payment window.
  { tau: 8, pos: [-20, 5.6, 5], look: [-33, 2, -4], fov: 36, hold: true },
  { tau: 9, pos: [-21, 5.2, 2.5], look: [-33, 2, -4.5], fov: 36, hold: true },

  // Flight: up and over the yard to processing.
  { tau: 9.5, pos: [-12, 52, 30], look: [8, 0, -30], fov: 34 },

  // Stop 5, back into the loop: the processing yard, then out to the whole
  // world, the container truck crossing to the smelter.
  { tau: 10, pos: [46, 26, -12], look: [18, 2, -42], fov: 36 },
  { tau: 10.5, pos: [78, 42, 4], look: [44, 2, -38], fov: 34 },
  { tau: 11, pos: [196, 156, 152], look: [34, 0, -20], fov: 30 },
];

// While these windows are open the camera follows an actor (see camera-rig.js).
export const FOLLOW = [{ actor: "customer", tau: [3.06, 3.98], weight: 0.8, ramp: 0.24, lift: 1 }];

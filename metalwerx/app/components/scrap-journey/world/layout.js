// The map of the miniature world. Every station builds inside its own zone,
// so they never overlap, and the camera, the customer's ute and the stations
// all share these coordinates. Metres; +x east, +z south, y = 0 is the top of
// the island.
//
//   north (z -68)
//   ┌──────────────────────────────────────────────────────────┐
//   │   processing: excavator, baler, bales, container   back  │══ bridge ══ smelter island
//   │   ┌──── north ring road (z -26) ─────────┐        gate   │
//   │   │                                      │  grading      │
//   │   office  weighbridge (west ring, x -26) │  bays (east)  │
//   │   │                                      │               │
//   │   └──── south ring road (z 7) ───────────┘               │
//   └──────────────── yard gate (x -8, z 16) ──────────────────┘
//            gate road
//   ════════════════ main road (z 40) ═════════════════════════════
//      the customer's house (south-west)      neighbours, a building site with a Metal Werx bin
//   south (z 68)

export const ISLAND = { x: 0, z: 0, width: 176, depth: 136, thickness: 7 };

// A smaller island off the north-east corner where the smelter stands, joined
// to the main one by a bridge. Its top sits a little lower.
export const SMELTER_ISLAND = { x: 134, z: -36, width: 50, depth: 44, thickness: 6, y: -2 };

// Rectangles each station owns, as [min, max] in x and z.
export const ZONES = {
  home: { x: [-86, -38], z: [44.5, 68] }, // the customer's lot and the street front
  suburb: { x: [-38, 88], z: [44.5, 68] }, // neighbours and the building site (scenery)
  outskirts: { x: [-88, 88], z: [16, 35.5] }, // between the yard fence and the main road (scenery)
  westBush: { x: [-88, -48], z: [-68, 16] }, // paddock and gums west of the yard (scenery)
  eastLots: { x: [54, 88], z: [-68, 16] }, // industrial neighbours east of the yard (scenery)
  yard: { x: [-46, 52], z: [-56, 16] }, // inside the yard fence
  grading: { x: [34, 51], z: [-23, 14] }, // grade bays along the east fence, and the car bodies
  centre: { x: [-20, 25], z: [-21, 2] }, // inside the ring road: the big steel stockpile
  weighbridge: { x: [-31, -21], z: [-16, 5] }, // the weighbridge on the west ring road
  office: { x: [-45, -31], z: [-16, 14] }, // site office, payment window, customer parking
  processing: { x: [-45, 51], z: [-55, -31] }, // north of the north ring road
  smelter: { x: [109, 159], z: [-58, -14] }, // the smelter island
};

// Road centrelines as [x, z] points, with their widths. Scenery paints the
// public roads; the yard station paints the yard's own drives.
export const ROADS = {
  main: { points: [[-88, 40], [88, 40]], width: 9 }, // east-west street; eastbound lane z 37.8, westbound 42.2
  gate: { points: [[-8, 35.5], [-8, 16]], width: 8 }, // north to the gate; inbound lane x -10, outbound x -6
  east: { points: [[52, -40], [88, -40]], width: 8 }, // the yard's back gate to the bridge
  bridge: { points: [[88, -40], [109, -40]], width: 8 },
};

// The yard's one-way ring road (clockwise from the gate: east along the
// south side, north up the east side past the grade bays, west along the north
// side past processing, south down the west side over the weighbridge).
export const RING = {
  south: 7,
  east: 30,
  north: -26,
  west: -26,
  width: 7,
  corner: 6, // corner radius
};

export const GATE = { x: -8, z: 16, width: 10 }; // opening in the south fence
export const BACK_GATE = { x: 52, z: -40, width: 9 }; // opening in the east fence

// Where each stop's focal point sits, for stations and the camera.
export const ANCHORS = {
  house: { x: -64, z: 57 }, // front door faces north (-z), towards the street
  driveway: { x: -50, z: 52 }, // where the ute is parked
  sortPile: { x: -56, z: 50 }, // the customer's pile on the lawn beside the driveway
  bays: { x: 30, z: -6 }, // where the ute stops beside the grade bays
  weighbridge: { x: -26, z: -5 }, // centre of the weighbridge deck (long axis along z)
  officeWindow: { x: -33, z: -4 }, // the payment window, facing east onto the weighbridge
  processing: { x: 20, z: -42 },
  smelter: { x: 134, z: -36 },
};

// The customer's route through the whole story, as [x, z] waypoints. The ute
// parks at "park", "bays" and "weighbridge" and finishes back home. The first
// point sits behind the parking spot so the trailer has road to stand on.
export const CUSTOMER_ROUTE = [
  [-50, 63],
  [-50, 57.5],
  [-50, 52], // park: in the driveway, nose to the street
  [-50, 47],
  [-47, 41.5],
  [-40, 38],
  [-18, 38],
  [-11.5, 35],
  [-10, 28],
  [-10, 16], // through the gate, inbound lane
  [-10, 11],
  [-5, 7],
  [20, 7],
  [27, 5.5],
  [30, 0],
  [30, -6], // bays: beside the grade bays, facing north
  [30, -18],
  [28, -24],
  [22, -26],
  [-18, -26],
  [-24, -24],
  [-26, -18],
  [-26, -5], // weighbridge: on the deck, facing south
  [-26, 2],
  [-24, 6],
  [-18, 7],
  [-9, 7.5],
  [-6, 11],
  [-6, 16], // out through the gate, outbound lane
  [-6, 30],
  [-9, 37],
  [-16, 42.2],
  [-44, 42.2],
  [-49, 45],
  [-50, 50.5], // home again
];

// Waypoint indices where the ute parks.
export const ROUTE_STOPS = { park: 2, bays: 15, weighbridge: 22, home: 34 };

// When the ute drives, in tau (see timeline.js). Between legs it's parked.
export const CUSTOMER_LEGS = [
  { from: "park", to: "bays", tau: [3.04, 4.16] },
  { from: "bays", to: "weighbridge", tau: [4.96, 6.08] },
  { from: "weighbridge", to: "home", tau: [9.06, 10.92] },
];

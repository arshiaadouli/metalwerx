// Colours for the scrap journey's 3D world: a galvanised model of the yard on
// a graphite steel plinth, like the rack on the page above it. Everything the
// yard is built from is galvanised white, graphite or a rack grey; only the
// metal itself carries colour, in the same code colours as the cross-sections
// on the rack (PAINT in components/metal/metal.jsx). There is no red: the
// one warm colour is copper.
//
// Surfaces keep the same colour in both themes; the theme only changes the
// light: an overcast day in light, the yard's lamps after dark. So a station
// never needs to know the theme, unless it has a lamp or a screen, which
// kit.glow() and kit.pointLight() handle.

// The site's colours (app/globals.css), for signs, tags and labels drawn into
// the world.
export const BRAND = {
  ground: "#F3F4F4", // --ground: galvanised white
  groundDark: "#171B1E", // --ground in the dark theme
  raised: "#FFFFFF",
  sunk: "#E7EAEB",
  rule: "#CDD2D5",
  graphite: "#1C2024", // --ink
  inkSoft: "#454D54",
  rack: "#262B2F", // the steel rack field
  rackRaised: "#30363B",
  rackArm: "#4A535A",
  rackRule: "#3A4248",
  rackInk: "#EAEDEF",
  rackInkSoft: "#AFB7BD",
  tag: "#E8ECEE", // an aluminium grade tag
  tagInk: "#1C2024",
  tagRule: "#C5CCD1",
  action: "#A65A2E", // deep copper, the one action colour
  actionInk: "#FFFFFF",
};

// Each metal's paint, [highlight, base, shadow], as in PAINT.
export const METAL = {
  cu: ["#E6A375", "#B8693A", "#7F4120"],
  brass: ["#EDCF80", "#C9A13B", "#8E6D1E"],
  al: ["#EEF1F3", "#B3BBC1", "#7E878E"],
  ss: ["#DCE5EA", "#93A7B3", "#5E7282"],
  pb: ["#9AA4AD", "#68727C", "#414A53"],
  fe: ["#9AA5AF", "#626C76", "#353D44"],
};

// The code inks (--color-cu and the rest in app/globals.css): each metal's
// code stamped on a light tag.
export const CODE_INK = {
  cu: "#8E4A24",
  brass: "#7A5D16",
  al: "#5F686F",
  ss: "#4F6474",
  pb: "#48515A",
  fe: "#3C454D",
};

// What lights give off: lamp heads, head and tail lights, beacons, lit
// windows. Warm whites, and copper for the tail lights and beacons.
export const LIGHTS = {
  headlamp: "#FFF4DE",
  tail: "#D08453",
  lens: "#4A2A1A", // a tail light by day: a dark copper lens, unlit
  beacon: "#E6A375",
  lamp: "#FFE6C2",
  window: "#FFEBCF",
};

// Named surfaces for kit.mat(name). roughness/metalness are PBR values; metals
// get their sheen from the environment map, so keep metalness under ~0.85 or
// they turn black in the dark theme. The names are what stations ask for; a
// few keep an old name for a new colour, noted beside them.
export const SURFACES = {
  // the plinth the model stands on: graphite steel, a rack-arm rail, and the
  // galvanised deck on top
  plinth: { color: BRAND.rack, roughness: 0.8, metalness: 0.15 },
  plinthEdge: { color: BRAND.rackRaised, roughness: 0.8, metalness: 0.15 },
  plinthRail: { color: BRAND.rackArm, roughness: 0.6, metalness: 0.3 },
  deck: { color: "#9C9FA0", roughness: 0.9, metalness: 0.05 }, // renders a shade under the page ground by day

  // ground and buildings, all galvanised whites and greys
  soil: { color: "#9EA6AC", roughness: 1 },
  grass: { color: "#D3D8DB", roughness: 1 }, // ground cover, a shade off the deck
  grassDark: { color: "#C6CCD0", roughness: 1 },
  foliage: { color: "#C2C9CE", roughness: 0.95, flatShading: true }, // model trees
  foliageDark: { color: "#A9B1B7", roughness: 0.95, flatShading: true },
  trunk: { color: "#7E878E", roughness: 1 },
  trunkPale: { color: "#D2D6DA", roughness: 1 }, // the pale bark of a gum
  concrete: { color: "#C9CED1", roughness: 0.95 },
  concreteDark: { color: "#AEB5BA", roughness: 0.95 },
  gravel: { color: "#BCC3C7", roughness: 1 },
  asphalt: { color: "#5E666D", roughness: 1 },
  roadLine: { color: BRAND.ground, roughness: 0.8 },
  kerb: { color: "#D2D6DA", roughness: 0.95 },
  brick: { color: "#B9C0C5", roughness: 0.95 }, // houses in the model are plain grey
  render: { color: BRAND.sunk, roughness: 0.95 },
  weatherboard: { color: "#DFE3E5", roughness: 0.9 },
  roof: { color: BRAND.rackRaised, roughness: 0.7, metalness: 0.25 },
  roofLight: { color: "#9AA3A9", roughness: 0.6, metalness: 0.3 },
  colorbond: { color: BRAND.rack, roughness: 0.6, metalness: 0.3 }, // fence sheet, in the rack's graphite
  timber: { color: "#AEB5BA", roughness: 0.9 }, // timber reads as a light grey in the model
  timberDark: { color: "#7E878E", roughness: 0.9 },
  white: { color: BRAND.ground, roughness: 0.7 },
  paper: { color: BRAND.raised, roughness: 0.9 },
  black: { color: BRAND.graphite, roughness: 0.8 },
  glass: { color: "#2A3136", roughness: 0.15, metalness: 0.4 },
  fenceMesh: { color: "#7E878E", roughness: 0.6, metalness: 0.4 },

  // metals and scrap, in their code colours
  steel: { color: METAL.fe[1], roughness: 0.5, metalness: 0.65 },
  steelLight: { color: METAL.fe[0], roughness: 0.5, metalness: 0.65 },
  steelDark: { color: METAL.fe[2], roughness: 0.55, metalness: 0.6 },
  steelBlue: { color: METAL.ss[2], roughness: 0.5, metalness: 0.6 },
  rust: { color: "#535C64", roughness: 0.9, metalness: 0.25 }, // weathered steel: still steel grey, so copper stays the one warm metal
  rustDark: { color: "#3E464D", roughness: 0.95, metalness: 0.2 },
  copper: { color: METAL.cu[1], roughness: 0.35, metalness: 0.8 },
  copperDull: { color: "#94512B", roughness: 0.6, metalness: 0.6 },
  brass: { color: METAL.brass[1], roughness: 0.35, metalness: 0.8 },
  aluminium: { color: METAL.al[1], roughness: 0.35, metalness: 0.75 },
  stainless: { color: METAL.ss[1], roughness: 0.2, metalness: 0.85 },
  lead: { color: METAL.pb[1], roughness: 0.6, metalness: 0.5 },
  cable: { color: BRAND.graphite, roughness: 0.8 },
  cableRed: { color: "#D2D6DA", roughness: 0.7 }, // insulation, in the PVC wire bundle's sheath grey
  rubber: { color: BRAND.graphite, roughness: 0.92 },
  hub: { color: METAL.al[1], roughness: 0.4, metalness: 0.7 },

  // vehicles, signs and people
  fleet: { color: BRAND.rackRaised, roughness: 0.5, metalness: 0.2 }, // the yard's trucks and bins
  red: { color: BRAND.rackRaised, roughness: 0.5, metalness: 0.2 }, // the old brand red, now the fleet graphite
  redDark: { color: BRAND.rack, roughness: 0.55, metalness: 0.2 },
  utewhite: { color: "#EEF0F1", roughness: 0.4, metalness: 0.2 },
  charcoal: { color: BRAND.rackRaised, roughness: 0.6, metalness: 0.2 },
  yellow: { color: BRAND.rackArm, roughness: 0.55, metalness: 0.2 }, // machinery, in rack grey rather than safety yellow
  hivis: { color: "#DCE5EA", roughness: 0.75 }, // vests, pale in the model
  hivisOrange: { color: BRAND.sunk, roughness: 0.75 },
  navy: { color: BRAND.rackRule, roughness: 0.85 },
  denim: { color: CODE_INK.ss, roughness: 0.9 },
  khaki: { color: "#7E878E", roughness: 0.9 },
  skin: { color: "#D2D6DA", roughness: 0.8 }, // people are plain model figures
  skinDark: { color: "#AEB5BA", roughness: 0.8 },
  hair: { color: CODE_INK.fe, roughness: 0.9 },
  bin: { color: BRAND.rackRaised, roughness: 0.7 },
  tub: { color: BRAND.rackRaised, roughness: 0.6 }, // the customer's sorting crates
};

// Colours for the three crates the customer sorts their load into, and the
// grade piles at the yard.
export const GRADE_COLORS = {
  copper: SURFACES.copper.color,
  brass: SURFACES.brass.color,
  aluminium: SURFACES.aluminium.color,
  stainless: SURFACES.stainless.color,
  steel: SURFACES.steel.color,
  cable: SURFACES.cable.color,
};

// The light rig for each theme. background and fog match the page ground
// (--ground in globals.css), so the stage has no visible edge.
export const THEMES = {
  // After dark the model sits under one cool key light, so the deck is a
  // dim galvanised grey on the graphite ground and the metal still catches it.
  dark: {
    background: BRAND.groundDark,
    hemi: { sky: "#56616A", ground: "#0E1113", intensity: 0.35 },
    key: { color: "#E3E9ED", intensity: 0.95 },
    rim: { color: "#AFB7BD", intensity: 0.35 },
    environment: 0.45,
    exposure: 0.5,
    glow: 1, // multiplier for glow materials, lamps and point lights
  },
  light: {
    background: BRAND.ground,
    hemi: { sky: "#FFFFFF", ground: "#CDD2D5", intensity: 1.45 },
    key: { color: "#FFFFFF", intensity: 2.4 },
    rim: { color: "#FFFFFF", intensity: 0.35 },
    environment: 0.7,
    exposure: 1,
    glow: 0,
  },
};

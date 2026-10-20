// Colours for the scrap journey's 3D world. The brand colours are the ones in
// app/globals.css. Surfaces keep the same colour in both themes; the theme
// only changes the light: a lit-up night shift in dark, an overcast day in
// light. So a station never needs to know the theme, unless it has a lamp or a
// screen, which kit.glow() and kit.pointLight() handle.

export const BRAND = {
  carbon: "#0C0C0C",
  millScale: "#171717",
  gunmetal: "#222222",
  graphite: "#2D2D2D",
  cherryDark: "#940202",
  cherry: "#C50000",
  cherryBright: "#FF0000",
  chrome: "#F8F8F8",
  aluminium: "#CFCFCF",
  steel: "#7A7A7A",
};

// Named surfaces for kit.mat(name). roughness/metalness are PBR values; metals
// get their sheen from the environment map, so keep metalness under ~0.85 or
// they turn black in the dark theme.
export const SURFACES = {
  // ground and buildings
  plinth: { color: "#2a2826", roughness: 0.9 },
  plinthEdge: { color: "#3b3733", roughness: 0.9 },
  soil: { color: "#5d4a3a", roughness: 1 },
  grass: { color: "#62744a", roughness: 1 },
  grassDark: { color: "#4f6040", roughness: 1 },
  foliage: { color: "#55714a", roughness: 0.95, flatShading: true },
  foliageDark: { color: "#3f5a3a", roughness: 0.95, flatShading: true },
  trunk: { color: "#5a4334", roughness: 1 },
  concrete: { color: "#9b978f", roughness: 0.95 },
  concreteDark: { color: "#78746d", roughness: 0.95 },
  gravel: { color: "#837c72", roughness: 1 },
  asphalt: { color: "#3c3c3f", roughness: 1 },
  roadLine: { color: "#ece6d6", roughness: 0.8 },
  kerb: { color: "#b9b4aa", roughness: 0.95 },
  brick: { color: "#a35f48", roughness: 0.95 },
  render: { color: "#e3d9c8", roughness: 0.95 },
  weatherboard: { color: "#d8d2c4", roughness: 0.9 },
  roof: { color: "#4b5058", roughness: 0.7, metalness: 0.25 },
  roofLight: { color: "#9aa0a6", roughness: 0.6, metalness: 0.3 },
  colorbond: { color: "#33373b", roughness: 0.6, metalness: 0.3 }, // "Monument" fence sheet
  timber: { color: "#9b7752", roughness: 0.9 },
  timberDark: { color: "#6e5139", roughness: 0.9 },
  white: { color: "#efeee9", roughness: 0.7 },
  paper: { color: "#f6f3ea", roughness: 0.9 },
  black: { color: "#141414", roughness: 0.8 },
  glass: { color: "#26303a", roughness: 0.15, metalness: 0.4 },

  // metals and scrap
  steel: { color: "#83878b", roughness: 0.5, metalness: 0.65 },
  steelDark: { color: "#4e5256", roughness: 0.55, metalness: 0.6 },
  steelBlue: { color: "#5b6875", roughness: 0.5, metalness: 0.6 },
  rust: { color: "#8c4b2b", roughness: 0.9, metalness: 0.25 },
  rustDark: { color: "#5f3420", roughness: 0.95, metalness: 0.2 },
  copper: { color: "#c87a46", roughness: 0.35, metalness: 0.8 },
  copperDull: { color: "#9a5b38", roughness: 0.6, metalness: 0.6 },
  brass: { color: "#c9a443", roughness: 0.35, metalness: 0.8 },
  aluminium: { color: "#d3d6da", roughness: 0.35, metalness: 0.75 },
  stainless: { color: "#bcc2c8", roughness: 0.2, metalness: 0.85 },
  lead: { color: "#6f737a", roughness: 0.6, metalness: 0.5 },
  cable: { color: "#1f1f1f", roughness: 0.8 },
  cableRed: { color: "#a52a22", roughness: 0.7 },
  rubber: { color: "#1c1c1c", roughness: 0.92 },
  hub: { color: "#a9adb1", roughness: 0.4, metalness: 0.7 },

  // vehicles, signs and people
  red: { color: BRAND.cherry, roughness: 0.5, metalness: 0.15 },
  redDark: { color: BRAND.cherryDark, roughness: 0.55, metalness: 0.15 },
  utewhite: { color: "#ecebe6", roughness: 0.4, metalness: 0.2 },
  charcoal: { color: "#2b2d30", roughness: 0.6, metalness: 0.2 },
  yellow: { color: "#e8b923", roughness: 0.55, metalness: 0.1 }, // machinery
  hivis: { color: "#f2d31b", roughness: 0.75 },
  hivisOrange: { color: "#ff7b1c", roughness: 0.75 },
  navy: { color: "#2c3646", roughness: 0.85 },
  denim: { color: "#3e5170", roughness: 0.9 },
  khaki: { color: "#7d7258", roughness: 0.9 },
  skin: { color: "#d6a07d", roughness: 0.8 },
  skinDark: { color: "#8d5b3f", roughness: 0.8 },
  hair: { color: "#2b211b", roughness: 0.9 },
  bin: { color: "#2f4f3a", roughness: 0.7 }, // wheelie-bin green
  tub: { color: "#3a4a5a", roughness: 0.6 },
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

// The light rig for each theme. background and fog match the page surface
// (--surface in globals.css), so the stage has no visible edge.
export const THEMES = {
  dark: {
    background: "#0C0C0C",
    hemi: { sky: "#4a5878", ground: "#120f0d", intensity: 1.55 },
    key: { color: "#b7c6ef", intensity: 1.15 },
    rim: { color: "#ff9a4a", intensity: 0.55 },
    environment: 0.32,
    exposure: 1.05,
    glow: 1, // multiplier for glow materials, lamps and point lights
  },
  light: {
    background: "#FFFFFF",
    hemi: { sky: "#ffffff", ground: "#cbc3b6", intensity: 1.55 },
    key: { color: "#fff3e2", intensity: 2.6 },
    rim: { color: "#ffffff", intensity: 0.35 },
    environment: 0.7,
    exposure: 1,
    glow: 0,
  },
};

import { BUNDLES, ICONS } from "./geometry";
import { cn } from "@/lib/utils";

// The metal cross-sections that stand for each thing the yard buys: a bundle
// of stock seen end-on (Bundle) and a single profile for small sizes
// (MetalIcon). Their paint is fixed in both themes, like the metal itself; only
// the edge highlight follows the surface (--edge in app/globals.css). The
// gradients live once in MetalDefs, which the root layout renders.

// [highlight, base, shadow] for each paint, lit from the top left.
const PAINT = {
  cu: ["#E6A375", "#B8693A", "#7F4120"],
  brass: ["#EDCF80", "#C9A13B", "#8E6D1E"],
  al: ["#EEF1F3", "#B3BBC1", "#7E878E"],
  ss: ["#DCE5EA", "#93A7B3", "#5E7282"],
  pb: ["#9AA4AD", "#68727C", "#414A53"],
  fe: ["#9AA5AF", "#626C76", "#353D44"],
  sheath: ["#F1F2F3", "#D2D6DA", "#A9AFB5"],
  red: ["#E2675C", "#C8372D", "#8E2620"],
  black: ["#5A6066", "#33383D", "#1C2023"],
  earth: ["#D8CF4A", "#8DAE3E", "#3E8E4A"],
};

// Flat colours: the fold lines in a car bale and the old paint on its panels.
const SOLID = { fold: "#2B3237", "paint-red": "#A63A32", "paint-blue": "#3F5E8C" };

export function MetalDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute size-0 overflow-hidden">
      <defs>
        {Object.entries(PAINT).map(([key, [hi, mid, lo]]) => (
          <linearGradient key={key} id={`mw-${key}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={hi} />
            <stop offset="0.55" stopColor={mid} />
            <stop offset="1" stopColor={lo} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

function Shapes({ shapes }) {
  return shapes.map((shape, i) => (
    <path
      key={i}
      d={shape.d}
      fill={SOLID[shape.metal] ?? `url(#mw-${shape.metal})`}
      fillRule={shape.rule}
      className="metal-edge"
    />
  ));
}

// A bundle of stock for a material slug from app/what-we-buy/materials.js, or
// "steel" for general steel and iron. It sits on the bottom edge of its box, so
// a rack arm drawn under it reads as what it rests on. Decorative unless given
// a label, since the material's name is always set beside it.
export function Bundle({ slug, label, className }) {
  const shapes = BUNDLES[slug];
  if (!shapes) return null;
  return (
    <svg
      viewBox="0 0 220 150"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block h-auto w-full overflow-visible metal-bundle", className)}
    >
      <Shapes shapes={shapes} />
    </svg>
  );
}

// One profile of the same material, in a 48 x 48 box, for menus and markers.
export function MetalIcon({ slug, className }) {
  const shapes = ICONS[slug];
  if (!shapes) return null;
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("block size-12 shrink-0", className)}>
      <Shapes shapes={shapes} />
    </svg>
  );
}

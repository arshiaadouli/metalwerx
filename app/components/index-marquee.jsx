import Marquee from "react-fast-marquee";
import { Recycle } from "lucide-react";

// A scrolling band of what the yard buys and does, between the hero and the
// commercial section. The items are the Home Page's ticker in Strapi. Cherry
// and chrome are fixed palette colours, so the band looks the same in both
// themes.
export default function IndexMarquee({ items }) {
  return (
    <div id="ticker" className="bg-cherry font-oswald text-chrome">
      {/* The marquee repeats its items to fill the width, so screen readers get
          this list once instead. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {/* The marquee renders nothing until it mounts; h-14 holds its space so
          the page doesn't jump. It pauses while hovered. */}
      <div aria-hidden="true" className="flex h-14 items-center">
        <Marquee autoFill pauseOnHover speed={40}>
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-6 pr-6 text-base font-medium uppercase tracking-[0.2em] sm:text-lg"
            >
              {item}
              <Recycle strokeWidth={1.75} className="size-4 text-chrome/60" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { A11y, Autoplay, EffectCoverflow, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
// The carousel's own styles, in a stylesheet rather than a <style> string so
// they're minified with the rest of the site's CSS.
import "./skiper49.css";

import { cn } from "@/lib/utils";

// Skiper 49 (Carousel_003) from Skiper UI, ported to JSX and the Metal Werx
// theme: a Swiper coverflow of photos, the centred one facing you and the rest
// turned away on either side. Changes from the original:
//   - No fade-in on mount, so the photos are there before the page's
//     JavaScript runs.
//   - Previous and next buttons (44px, for touch and keyboard) as well as the
//     dots, and Swiper's keyboard and screen-reader support.
//   - Colours from the theme tokens in app/globals.css, square corners, and no
//     background of its own, so it sits on whatever section it is in.
//   - Visitors who ask for less motion get each slide at once, and no autoplay.
//   - Swiper reads the clock while it renders, which a fully static page can't
//     prerender, so it starts in the browser. Until then (and with scripts
//     off) the same first five slides stand in the coverflow as a still. Every
//     photo in the still keeps its alt text, for search engines, though only
//     the centred one is exposed to screen readers.
// Props of Carousel_003:
//   images          [{ src, srcSet?, alt }]; the loop needs at least six
//   showPagination  the dots under the slides (default false)
//   showNavigation  the previous and next buttons (default false)
//   loop            wrap around at the ends (default true)
//   autoplay        move on every 4 seconds until the visitor takes over (default false)
//   spaceBetween    px between slides (default 0)
//   label           the carousel's accessible name
//   className

// The images the original demo used are illustrations, so this demo uses the
// site's own scrap yard photos (free under the Unsplash License).
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=720&h=840&q=70`;

const Skiper49 = () => {
  const images = [
    { src: unsplash("photo-1722695694560-f452b0919d3a"), alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard" },
    { src: unsplash("photo-1722695510527-cc033e43be1b"), alt: "A grapple holding a crushed bale of scrap metal against a blue sky" },
    { src: unsplash("photo-1536094627107-abf98dedaa8f"), alt: "A worker in an orange hard hat cutting up scrap metal with a gas torch in a scrap yard" },
    { src: unsplash("photo-1723365316514-8509dea457f2"), alt: "A heap of old motorbike parts, including brake shoes, switch housings and wiring" },
    { src: unsplash("photo-1561503412-852800622772"), alt: "A bale of crushed aluminium drink cans in mixed colours" },
    { src: unsplash("photo-1563456020111-f02d832ae94c"), alt: "A rusty grey electric motor bolted to green machinery in an old factory" },
    { src: unsplash("photo-1767340078189-4258fbb7bd7c"), alt: "Used car engines piled together, still fitted with their hoses and wiring" },
    { src: unsplash("photo-1776254575132-fbc8f3d50210"), alt: "A rusting, disused industrial plant with steel stairs and railings against a wooded hill" },
    { src: unsplash("photo-1719242513425-f5eed99b282f"), alt: "An overgrown wrecking yard with old cars behind a wire fence and a green sedan out front" },
    { src: unsplash("photo-1761507320645-b11a00bfcc34"), alt: "Loose lengths of thin insulated wire in many colours on a white background" },
    { src: unsplash("photo-1742899273038-67ff67477663"), alt: "Close-up of rows of industrial battery cells with red and blue terminal caps" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <Carousel_003 images={images} showPagination showNavigation loop label="Scrap metal photos" />
    </div>
  );
};

export { Skiper49 };

// How far a slide turns away and sinks back, by its distance from the centre
// in slide widths. Up to one slide out it follows Swiper's plain coverflow;
// further out the turn eases off and stops short of edge-on, so on a wide
// screen the outer slides still read as photos rather than slivers.
// The width a slide shows at, for photos that come with a srcSet.
const SLIDE_SIZES = "(min-width: 40rem) 16.5rem, 12.5rem";

const ROTATE = 34;
const DEPTH = 100;
function coverflowMultiplier(offset) {
  const distance = Math.abs(offset);
  const eased = distance <= 1 ? distance : 1 + (distance - 1) * 0.55;
  return Math.sign(offset) * Math.min(eased, 2.4);
}

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
  label = "Photos",
}) => {
  const [mounted, setMounted] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {!mounted ? (
        <StillCoverflow images={images} label={label} />
      ) : (
      <Swiper
        onSwiper={setSwiper}
        spaceBetween={spaceBetween}
        speed={reduceMotion ? 0 : 450}
        autoplay={
          autoplay && !reduceMotion
            ? {
                delay: 4000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={loop}
        coverflowEffect={{
          rotate: ROTATE,
          stretch: 0,
          depth: DEPTH,
          modifier: coverflowMultiplier,
          slideShadows: true,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          containerMessage: label,
          prevSlideMessage: "Previous photo",
          nextSlideMessage: "Next photo",
          paginationBulletMessage: "Go to photo {{index}}",
          slideLabelMessage: "Photo {{index}} of {{slidesLength}}",
        }}
        className="carousel-003"
        modules={[EffectCoverflow, Autoplay, Pagination, Keyboard, A11y]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image.src}-${index}`}>
            {/* A plain <img>, as elsewhere on the site, so no next.config
                remotePatterns entry is needed for Strapi or the photo hosts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.srcSet ? SLIDE_SIZES : undefined}
              alt={image.alt}
              title={image.title}
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      )}

      {mounted && showNavigation && (
        <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-1.625rem)] z-10 flex -translate-y-1/2 justify-between px-3 sm:px-6 lg:px-10">
          <NavButton label="Previous photo" onClick={() => swiper?.slidePrev()}>
            <ChevronLeftIcon aria-hidden="true" className="size-5" />
          </NavButton>
          <NavButton label="Next photo" onClick={() => swiper?.slideNext()}>
            <ChevronRightIcon aria-hidden="true" className="size-5" />
          </NavButton>
        </div>
      )}
    </div>
  );
};

// The slides as the coverflow first shows them: the first photo centred, four
// either side turned away by the same rotate and depth, enough to fill a wide
// screen.
function StillCoverflow({ images, label }) {
  const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const at = (offset) => images[(offset + images.length) % images.length];
  return (
    <div role="group" aria-label={label} className="carousel-003 carousel-003-still">
      {offsets.map((offset) => {
        const image = at(offset);
        return (
          <div
            key={offset}
            aria-hidden={offset !== 0}
            style={{
              transform: `translateX(calc(-50% + ${offset * 100}%)) translateZ(${-DEPTH * Math.abs(coverflowMultiplier(offset))}px) rotateY(${-ROTATE * coverflowMultiplier(offset)}deg)`,
              zIndex: 10 - Math.abs(offset),
            }}
          >
            {/* The centre photo is often the largest thing on the first
                screen, so it loads first rather than lazily. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.srcSet ? SLIDE_SIZES : undefined}
              alt={image.alt}
              title={image.title}
              loading={offset === 0 ? "eager" : "lazy"}
              fetchPriority={offset === 0 ? "high" : undefined}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}

function NavButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="pointer-events-auto grid size-11 cursor-pointer place-items-center rounded-[2px] bg-raised text-ink shadow-[0_0_0_1px_var(--rule),0_8px_20px_-8px_rgb(0_0_0/0.35)] transition-[background-color,transform] duration-150 hover:bg-sunk active:scale-95"
    >
      {children}
    </button>
  );
}

export { Carousel_003 };
export default Skiper49;

/**
 * Skiper 49 Carousel_003 — React + Swiper
 * Built with Swiper.js - Read docs to learn more https://swiperjs.com/
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */

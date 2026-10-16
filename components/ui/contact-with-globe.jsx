"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as d3 from "d3";
import { feature } from "topojson-client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ContactWithGlobe from 21st.dev (contact-with-globe), ported to JSX and the
// Metal Werx theme. Props:
//   eyebrow?, title, description  strings for the centred page header
//   contactLinks   [{ icon, label, value, href }]; icon is a rendered lucide
//                  element (<Phone />), so a Server Component can pass it
//   className?     string
// The form isn't connected to anything yet: submissions are dropped until
// there's somewhere to send them.

const smoothEase = [0.25, 0.1, 0.25, 1];

const cityCoordinates = {
  "san francisco": [37.7749, -122.4194],
  "new york": [40.7128, -74.006],
  london: [51.5074, -0.1278],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  moscow: [55.7558, 37.6176],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.076, 72.8777],
  "los angeles": [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
};

function orthographicRaw(x, y) {
  const cosy = Math.cos(y);
  return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

// A projection that blends raw0 into raw1 as alpha goes from 0 to 1.
function interpolateProjection(raw0, raw1) {
  let t = 0;

  const createRawProjection = (alpha) => (lambda, phi) => {
    const [x0, y0] = raw0(lambda, phi);
    const [x1, y1] = raw1(lambda, phi);
    return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)];
  };

  const projection = d3.geoProjection(createRawProjection(t));

  const alphaMethod = (value) => {
    if (value !== undefined) {
      t = +value;
      const newProjection = d3.geoProjection(createRawProjection(t));

      if (projection.scale()) newProjection.scale(projection.scale());
      if (projection.translate()) newProjection.translate(projection.translate());
      if (projection.rotate()) newProjection.rotate(projection.rotate());
      if (projection.precision()) newProjection.precision(projection.precision());

      newProjection.alpha = alphaMethod;

      return newProjection;
    }
    return t;
  };

  projection.alpha = alphaMethod;

  return projection;
}

// Strokes default to currentColor, so the globe takes the text colour of
// whatever wraps it.
function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-150",
  strokeColor = "currentColor",
  strokeWidth = 1.0,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.2,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  rotateToLocation,
  rotateCities = [],
  rotationSpeed = 3000,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  startAsGlobe = true,
  countryFillColor,
  countryHoverColor,
  variant = "wireframe",
  scale = 1,
  backgroundColor,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [progress] = useState(startAsGlobe ? 0 : 100);
  const [worldData, setWorldData] = useState([]);
  const [rotation, setRotation] = useState(() =>
    rotateToLocation ? locationRotation(rotateToLocation) : initialRotation
  );
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const rotationInterval = useRef(null);
  const rotationAnimFrame = useRef(null);
  const rotationStartTime = useRef(null);
  const rotationFrom = useRef([0, 0]);
  const rotationTo = useRef([0, 0]);
  const animationFrame = useRef(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef(null);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultStrokeColor = strokeColor || "currentColor";
  const defaultGraticuleColor = graticuleColor || "currentColor";
  const defaultSphereOutlineColor = sphereOutlineColor || "currentColor";
  const defaultCountryFillColor =
    countryFillColor || (variant === "solid" ? "currentColor" : "none");
  const defaultBackgroundColor = backgroundColor || "transparent";

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const updateDimensions = () => {
      if (container && useResponsive) {
        const width = container.offsetWidth || 300;
        setDimensions({ width, height: width });
      }
    };

    updateDimensions();

    if (useResponsive) {
      resizeObserver.current = new ResizeObserver(updateDimensions);
      resizeObserver.current.observe(container);
    }

    // Only animate while the globe is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      observer.unobserve(container);
    };
  }, [useResponsive]);

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        );
        const world = await response.json();
        setWorldData(feature(world, world.objects.countries).features);
      } catch (error) {
        console.error("Error loading world data:", error);
        // Without the atlas, draw a single shape covering the whole sphere.
        setWorldData([
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90],
                ],
              ],
            },
            properties: {},
          },
        ]);
      }
    };
    loadWorldData();
  }, []);

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }

    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };

    animationFrame.current = requestAnimationFrame(rotate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length]);

  const animateRotationTo = useCallback((target, duration = 1200) => {
    if (rotationAnimFrame.current) {
      cancelAnimationFrame(rotationAnimFrame.current);
    }

    rotationFrom.current = rotationRef.current;
    rotationTo.current = target;
    rotationStartTime.current = performance.now();

    const animate = (time) => {
      const elapsed = time - (rotationStartTime.current || 0);
      const t = Math.min(elapsed / duration, 1);

      // Ease in-out quad.
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const lon =
        rotationFrom.current[0] +
        (rotationTo.current[0] - rotationFrom.current[0]) * eased;

      const lat =
        rotationFrom.current[1] +
        (rotationTo.current[1] - rotationFrom.current[1]) * eased;

      setRotation([lon, lat]);

      if (t < 1) {
        rotationAnimFrame.current = requestAnimationFrame(animate);
      }
    };

    rotationAnimFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;

    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length;
      const city = rotateCities[nextIndex].toLowerCase();
      const coordinates = cityCoordinates[city];

      if (coordinates) {
        animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
        setCurrentCityIndex(nextIndex);
      }
    };

    const city = rotateCities[currentCityIndex].toLowerCase();
    const coordinates = cityCoordinates[city];

    if (coordinates) {
      animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
    }

    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed);

    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [rotateCities, currentCityIndex, rotationSpeed, isVisible, animateRotationTo]);

  // Snap to rotateToLocation whenever it changes. This runs during render, not
  // in an effect, so React doesn't render twice. String() compares a [lat, lon]
  // pair by value.
  const locationKey = rotateToLocation ? String(rotateToLocation) : null;
  const [prevLocationKey, setPrevLocationKey] = useState(locationKey);
  if (locationKey !== prevLocationKey) {
    setPrevLocationKey(locationKey);
    if (rotateToLocation) setRotation(locationRotation(rotateToLocation));
  }

  const handleMouseDown = (event) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !enableInteraction) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];

    const t = progress / 100;
    const sensitivity = variant === "wireframe" && t >= 0.5 ? 0.25 : 0.5;

    setRotation((prev) => [
      prev[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, prev[1] - dy * sensitivity)),
    ]);

    setLastMouse(currentMouse);
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0 || !isVisible) return;
    if (useResponsive && dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let finalCountryFill = "none";
    let finalStrokeWidth = strokeWidth;
    let finalOpacity = 1.0;
    let renderGraticule = showGraticule;
    let finalGraticuleOpacity = graticuleOpacity;
    let finalSphereOutlineWidth = sphereOutlineWidth;

    if (variant === "wireframesolid") {
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    } else if (variant === "solid") {
      finalCountryFill = defaultCountryFillColor;
      finalStrokeWidth = strokeWidth * 0.5;
      finalOpacity = 0.3;
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    }

    if (defaultBackgroundColor !== "transparent") {
      const radius = (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9;
      svg
        .append("circle")
        .attr("cx", finalWidth / 2)
        .attr("cy", finalHeight / 2)
        .attr("r", radius)
        .attr("fill", defaultBackgroundColor);
    }

    let projection;
    const path = d3.geoPath();

    if (variant === "wireframe") {
      const t = progress / 100;
      const alpha = Math.pow(t, 0.5);

      const baseScale = Math.min(finalWidth, finalHeight) / 2;
      const scaleRange = d3
        .scaleLinear()
        .domain([0, 1])
        .range([baseScale * 0.9 * scale, baseScale * 0.54 * scale]);
      const baseRotate = d3.scaleLinear().domain([0, 1]).range([0, 0]);

      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha))
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([baseRotate(alpha) + rotation[0], rotation[1]])
        .precision(0.1);

      projection.alpha(alpha);
      path.projection(projection);
    } else {
      projection = d3
        .geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1);

      path.projection(projection);
    }

    if (renderGraticule && finalGraticuleOpacity > 0) {
      try {
        const graticule = d3.geoGraticule();
        const graticulePath = path(graticule());
        if (graticulePath) {
          svg
            .append("path")
            .datum(graticule())
            .attr("d", graticulePath)
            .attr("fill", "none")
            .attr("stroke", defaultGraticuleColor)
            .attr("stroke-width", 1)
            .attr("opacity", finalGraticuleOpacity);
        }
      } catch (error) {
        console.error("Error creating graticule:", error);
      }
    }

    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d) => {
        try {
          const pathString = path(d);
          if (!pathString) return "";
          if (pathString.includes("NaN") || pathString.includes("Infinity")) {
            return "";
          }
          return pathString;
        } catch {
          return "";
        }
      })
      .attr("fill", finalCountryFill)
      .attr("stroke", defaultStrokeColor)
      .attr("stroke-width", finalStrokeWidth)
      .attr("opacity", finalOpacity)
      .style("visibility", function () {
        const pathData = d3.select(this).attr("d");
        return pathData && pathData.length > 0 && !pathData.includes("NaN")
          ? "visible"
          : "hidden";
      })
      .on("mouseenter", function () {
        if (countryHoverColor && variant === "solid") {
          d3.select(this).attr("fill", countryHoverColor);
        }
      })
      .on("mouseleave", function () {
        if (variant === "solid") {
          d3.select(this).attr("fill", finalCountryFill);
        }
      });

    try {
      const sphereOutline = path({ type: "Sphere" });
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", defaultSphereOutlineColor)
          .attr("stroke-width", finalSphereOutlineWidth)
          .attr("opacity", variant === "wireframe" ? 1.0 : 0.8);
      }
    } catch (error) {
      console.error("Error creating sphere outline:", error);
    }
  }, [
    worldData,
    progress,
    rotation,
    isVisible,
    finalWidth,
    finalHeight,
    defaultStrokeColor,
    strokeWidth,
    defaultGraticuleColor,
    graticuleOpacity,
    defaultSphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    defaultCountryFillColor,
    countryHoverColor,
    variant,
    scale,
    defaultBackgroundColor,
    useResponsive,
    dimensions.width,
  ]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <svg
        ref={svgRef}
        width={finalWidth}
        height={finalHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={
          useResponsive ? "h-full w-full opacity-0 transition-opacity duration-1000" : ""
        }
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1,
        }}
      />
    </div>
  );
}

// A row of dots that fades out at both ends.
function FormDots({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-4 w-full shrink-0 bg-repeat text-iron-oxide", className)}
      style={{
        backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
        backgroundSize: "6px 100%",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    />
  );
}

const labelClassName = "font-oswald text-xs uppercase tracking-[0.25em] text-aluminium";

const fieldClassName =
  "w-full rounded-lg border border-graphite bg-gunmetal px-4 py-2.5 text-sm text-chrome placeholder:text-steel outline-none transition-colors focus:border-cherry focus:ring-2 focus:ring-cherry/30";

function Field({ id, label, optional, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClassName}>
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-steel">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

export default function ContactWithGlobe({
  eyebrow = "Contact",
  title = "Contact Us",
  description,
  contactLinks = [],
  className,
}) {
  // The globe spins on its own, outside framer-motion, so it has to check this itself.
  const reduceMotion = useReducedMotion();

  return (
    // reducedMotion="user" drops the fade-ins for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <section
        className={cn(
          "relative w-full overflow-hidden bg-carbon py-20 font-montserrat text-chrome sm:py-24",
          className
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgb(197_0_0/0.22),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            {/* cherry-bright over the faint cherry tint still meets WCAG AA contrast. */}
            {/* <motion.p
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="inline-flex items-center rounded-full bg-cherry/15 px-4 py-1.5 font-oswald text-xs uppercase tracking-[0.3em] text-cherry-bright ring-1 ring-cherry/40"
            >
              {eyebrow}
            </motion.p> */}

            {/* Bebas Neue only ships weight 400, so no font-bold (it would be faux bold). */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
              className="font-bebas-neue text-6xl leading-none tracking-wide text-white sm:text-7xl lg:text-8xl"
            >
              {title}
            </motion.h1>
            <div className="h-1 w-16 bg-cherry" />

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
                className="mt-2 max-w-xl text-lg leading-8 text-aluminium"
              >
                {description}
              </motion.p>
            )}
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-bebas-neue text-4xl leading-none tracking-wide text-white">
                  Get in Touch
                </h2>
                <p className="max-w-sm leading-7 text-aluminium">
                  Call or email the yard, or send us a message with what you&apos;ve got.
                </p>
              </div>

              <ul className="flex flex-col gap-4">
                {contactLinks.map(({ icon, label, value, href }, i) => {
                  const external = href.startsWith("http");
                  return (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                    >
                      <a
                        href={href}
                        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                        className="group flex w-fit items-center gap-4 rounded-lg focus-visible:outline-none"
                      >
                        <span
                          aria-hidden="true"
                          className="grid size-11 shrink-0 place-items-center rounded-lg bg-cherry/15 text-cherry-bright transition-colors group-hover:bg-cherry group-hover:text-white group-focus-visible:bg-cherry group-focus-visible:text-white [&_svg]:size-5"
                        >
                          {icon}
                        </span>
                        <span className="flex flex-col">
                          <span className="font-oswald text-xs uppercase tracking-[0.25em] text-steel">
                            {label}
                          </span>
                          <span className="text-chrome transition-colors group-hover:text-white group-focus-visible:text-white group-focus-visible:underline">
                            {value}
                          </span>
                        </span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <div aria-hidden="true" className="relative h-52 overflow-hidden text-cherry">
                <GlobeWireframe
                  className="absolute top-0 left-0 aspect-square w-full max-w-full"
                  variant="wireframesolid"
                  autoRotate={!reduceMotion}
                  autoRotateSpeed={0.45}
                  strokeWidth={0.6}
                  graticuleOpacity={0.12}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-carbon to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
              className="flex flex-col gap-6 rounded-2xl  bg-mill-scale p-6 sm:p-8"
            >
              <div>
                <h2 className="font-bebas-neue text-4xl leading-none tracking-wide text-white">
                  Send a Message
                </h2>
                <p className="mt-2 text-sm leading-6 text-aluminium">
                  Tell us what scrap you have and we&apos;ll get back to you with a quote.
                </p>
              </div>

              <FormDots />

              <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="contact-name" label="Full Name">
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Jane Citizen"
                      className={fieldClassName}
                    />
                  </Field>
                  <Field id="contact-phone" label="Phone" optional>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="0400 000 000"
                      className={fieldClassName}
                    />
                  </Field>
                </div>

                <Field id="contact-email" label="Email Address">
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className={fieldClassName}
                  />
                </Field>

                <Field id="contact-message" label="Message">
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder="What metal you have, roughly how much, and where it is"
                    className={cn(fieldClassName, "resize-none py-3")}
                  />
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  className="group mt-1 w-fit gap-2 rounded-lg font-oswald uppercase tracking-[0.15em] text-white hover:bg-cherry-dark focus-visible:ring-offset-mill-scale"
                >
                  Send Message
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

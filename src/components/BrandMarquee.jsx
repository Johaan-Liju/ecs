import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";

/* --------------------------------------------------------------------------
   Two rows of brand logos scrolling in opposite directions. Greyscale and
   held back at 60%, coming up to full colour on hover. The whole block pauses
   when the pointer is over it or anything inside takes focus.

   Under reduced motion it becomes a plain wrapped grid — still every brand,
   just not moving.
   -------------------------------------------------------------------------- */

function Row({ items, reverse, speed, paused }) {
  // Doubled so the loop is seamless; the copy is hidden from screen readers.
  const doubled = [...items, ...items];

  return (
    <ul
      className="flex w-max items-center gap-10 will-change-transform sm:gap-16"
      style={{
        animation: `ecs-marquee ${speed}s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
        animationPlayState: paused ? "paused" : "running",
      }}
    >
      {doubled.map((brand, i) => {
        const copy = i >= items.length;
        return (
          <li key={`${brand.slug}-${i}`} className="shrink-0">
            <BrandLogo
              slug={brand.slug}
              name={brand.name}
              decorative={copy}
              height={38}
              className="opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </li>
        );
      })}
    </ul>
  );
}

export default function BrandMarquee({ items = [], speed = 56 }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduced) {
    return (
      <ul className="hold flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {items.map((brand) => (
          <li key={brand.slug}>
            <BrandLogo slug={brand.slug} name={brand.name} height={38} className="opacity-70" />
          </li>
        ))}
      </ul>
    );
  }

  const half = Math.ceil(items.length / 2);

  return (
    <div
      className="relative flex flex-col gap-6 overflow-hidden py-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Row items={items.slice(0, half)} speed={speed} paused={paused} reverse={false} />
      <Row items={items.slice(half)} speed={speed * 1.12} paused={paused} reverse />

      {/* Feathered edges so logos fade rather than clip. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-concrete to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-concrete to-transparent sm:w-28" />
    </div>
  );
}

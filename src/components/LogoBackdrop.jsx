import { motion, useReducedMotion } from "framer-motion";

/**
 * The logo's tower mark blown up to sit behind a section, as a watermark.
 *
 * It is the supplied artwork, not a redrawing of it. On navy sections the two
 * blues would disappear, so a white silhouette cut from the same file is used
 * instead — decorative texture only, never the logo itself.
 *
 * On the home hero it rises into view from the ground line (`draw`); elsewhere
 * it is still. Decorative, so it is hidden from assistive tech and appears
 * instantly under reduced motion.
 */

const ART = {
  light: "/assets/ecs_mark.png", // for concrete / white sections
  dark: "/assets/ecs_mark_white.png", // for navy sections
};

const POSITION = {
  br: "right-0",
  bl: "left-0",
  center: "left-1/2 -translate-x-1/2",
};

export default function LogoBackdrop({
  tone = "light", // "light" = for concrete/white, "dark" = for navy
  position = "br",
  draw = false,
  className = "",
}) {
  const reduced = useReducedMotion();

  const common = {
    src: tone === "dark" ? ART.dark : ART.light,
    alt: "",
    "aria-hidden": true,
    width: 156,
    height: 274,
    decoding: "async",
    loading: "lazy",
    className: `pointer-events-none absolute bottom-0 h-full w-auto ${POSITION[position]} ${className}`,
  };

  if (!draw || reduced) return <img {...common} />;

  return (
    <motion.img
      {...common}
      initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
      animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
      transition={{
        clipPath: { duration: 1.4, delay: 1.05, ease: [0.22, 0.61, 0.36, 1] },
        opacity: { duration: 0.4, delay: 1.05 },
      }}
    />
  );
}

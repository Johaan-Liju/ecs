import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const BASE =
  "relative inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 " +
  "font-display text-[0.9375rem] font-semibold tracking-tight transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS = {
  solid: "bg-navy text-white hover:bg-navy-soft",
  mark: "bg-mark text-ink hover:bg-[#ffd033]",
  outline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white",
  onDark: "border border-white/30 text-white hover:bg-white hover:text-navy",
};

/**
 * A CTA that leans a little toward the cursor.
 * The pull is switched off under reduced motion and on coarse pointers.
 */
export default function MagneticButton({
  to,
  href,
  variant = "solid",
  strength = 0.32,
  className = "",
  children,
  ...rest
}) {
  const wrap = useRef(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 230, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 230, damping: 18, mass: 0.4 });

  const magnetic =
    !reduced &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  const onMove = (e) => {
    if (!magnetic || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.solid}`;

  const inner = to ? (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  ) : href ? (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  ) : (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );

  return (
    <motion.span
      ref={wrap}
      className={`inline-flex ${className}`}
      style={magnetic ? { x: sx, y: sy } : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlurCapture={reset}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
    >
      {inner}
    </motion.span>
  );
}

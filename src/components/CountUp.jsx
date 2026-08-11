import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const format = (n, decimals) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/** Counts up to `value` when it scrolls into view. Shows the final figure at once
    under reduced motion. */
export default function CountUp({
  value,
  decimals = 0,
  duration = 1600,
  prefix = "",
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setN(value);
      return;
    }
    if (!inView) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setN(value * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{format(n, decimals)}</span>
      {suffix}
    </span>
  );
}

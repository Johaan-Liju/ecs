import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/* Arm gap from the centre point, in px. The crosshair opens up over anything
   clickable and snaps shut on press. Only the gap animates — the arms keep a
   constant length so nothing jumps between states. */
const GAP = { idle: 7, hover: 17, press: 4 };
const ARM_LEN = 12;
const THICK = 2;

const INTERACTIVE = "a, button, input, select, textarea, label, summary, [role='button']";

/* Deep blue core plus a white halo, rather than a difference blend: inverting
   white washed out against the mid-grey concrete sections. The pairing is what
   makes one fixed colour work at both ends — the core reads on concrete and
   white, the halo reads on the navy bands. No per-section logic. */
const ARM = "absolute top-0 left-0 bg-signal ch-halo";
const SPRING = { stiffness: 520, damping: 34, mass: 0.55 };

/**
 * A drafting crosshair that replaces the pointer: a dot pinned exactly to the
 * cursor, with four arms that spring in behind it and settle on the point.
 *
 * Renders nothing on touch devices, coarse pointers, or under reduced motion —
 * in those cases the native cursor is left alone.
 */
export default function Crosshair() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState("idle"); // "idle" | "hover" | "press"

  // The dot tracks the pointer exactly; the arms trail it on a spring.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ax = useSpring(x, SPRING);
  const ay = useSpring(y, SPRING);

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(fine.matches);

    const onChange = (e) => setEnabled(e.matches);
    fine.addEventListener("change", onChange);
    return () => fine.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("crosshair-on");

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setState((s) => (s === "press" ? s : e.target.closest?.(INTERACTIVE) ? "hover" : "idle"));
    };
    const onDown = () => setState("press");
    const onUp = (e) => setState(e.target?.closest?.(INTERACTIVE) ? "hover" : "idle");
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("crosshair-on");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const gap = GAP[state];

  /* A hard show/hide when the pointer leaves the window — no fade, so there is
     nothing to animate and no extra compositing layer. */
  const show = { visibility: visible ? "visible" : "hidden" };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-200 overflow-hidden">
      {/* Arms — spring-followed, so they settle onto the point. */}
      <motion.div className="absolute top-0 left-0" style={{ x: ax, y: ay, ...show }}>
        <motion.span
          className={ARM}
          style={{ width: THICK, height: ARM_LEN }}
          animate={{ x: -THICK / 2, y: -(gap + ARM_LEN) }}
          transition={SPRING}
        />
        <motion.span
          className={ARM}
          style={{ width: THICK, height: ARM_LEN }}
          animate={{ x: -THICK / 2, y: gap }}
          transition={SPRING}
        />
        <motion.span
          className={ARM}
          style={{ width: ARM_LEN, height: THICK }}
          animate={{ x: -(gap + ARM_LEN), y: -THICK / 2 }}
          transition={SPRING}
        />
        <motion.span
          className={ARM}
          style={{ width: ARM_LEN, height: THICK }}
          animate={{ x: gap, y: -THICK / 2 }}
          transition={SPRING}
        />

        {/* Target ring, only over things you can actually click. */}
        <motion.span
          className="absolute top-0 left-0 rounded-full border-[1.5px] border-signal ch-halo-ring"
          style={{ width: 42, height: 42 }}
          animate={{
            x: -21,
            y: -21,
            scale: state === "hover" ? 1 : 0.55,
            opacity: state === "hover" ? 1 : 0,
          }}
          transition={SPRING}
        />
      </motion.div>

      {/* The point itself — pinned to the cursor with no lag. */}
      <motion.div className="absolute top-0 left-0" style={{ x, y, ...show }}>
        <motion.span
          className="absolute top-0 left-0 rounded-full bg-signal ch-halo"
          style={{ width: 4, height: 4 }}
          animate={{ x: -2, y: -2, scale: state === "press" ? 1.9 : 1 }}
          transition={SPRING}
        />
      </motion.div>
    </div>
  );
}

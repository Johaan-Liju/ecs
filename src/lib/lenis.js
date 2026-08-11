import Lenis from "@studio-freight/lenis";

/* A single Lenis instance for the whole app. Kept at module scope so the
   drawer can freeze the page without threading a ref through the tree. */
let instance = null;

export const getLenis = () => instance;

export function startLenis() {
  if (instance) return instance;

  instance = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  let frame = 0;
  const raf = (time) => {
    instance?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);

  instance.__stopRaf = () => cancelAnimationFrame(frame);
  return instance;
}

export function stopLenis() {
  instance?.__stopRaf?.();
  instance?.destroy();
  instance = null;
}

/** Scroll to an element or offset. Falls back to native when Lenis is off. */
export function scrollTo(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { offset: -90, ...options });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof Element) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}

/** Freeze / unfreeze the page — used by the enquiry drawer and mobile menu. */
export function setScrollLocked(locked) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

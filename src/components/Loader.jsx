import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LogoMark from "./LogoMark";

/**
 * Opening panel: the logo scales in over navy, then the panel wipes upward.
 * Skipped entirely under reduced motion.
 */
export default function Loader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), 1150);
    return () => clearTimeout(t);
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-navy"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <LogoMark size={64} tone="light" alt="" />
          </motion.div>
          <motion.span
            className="absolute bottom-16 font-mono text-[0.625rem] tracking-[0.3em] text-white/45 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Since 1982
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

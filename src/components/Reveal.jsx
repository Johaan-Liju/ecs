import { motion, useReducedMotion } from "framer-motion";
import { useInStagger } from "../lib/staggerContext";

const EASE = [0.22, 0.61, 0.36, 1];

/**
 * Fades and lifts content in on scroll.
 *
 * Under `prefers-reduced-motion` it renders the plain element with no
 * transform and no opacity — content is never left invisible.
 */
export default function Reveal({
  as = "div",
  y = 20,
  delay = 0,
  duration = 0.6,
  className,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const inStagger = useInStagger();
  const Tag = as;

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] ?? motion.div;
  const variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, ease: EASE, delay } },
  };

  // Inside a <Stagger> the parent drives the state; standalone it drives itself.
  const trigger = inStagger
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "0px 0px -10% 0px" },
      };

  return (
    <MotionTag className={className} variants={variants} {...trigger} {...rest}>
      {children}
    </MotionTag>
  );
}

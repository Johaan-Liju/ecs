import { motion, useReducedMotion } from "framer-motion";
import { StaggerContext } from "../lib/staggerContext";

/** Scroll-triggered container. Its <Reveal> children come in one after another. */
export default function Stagger({
  as = "div",
  className,
  gap = 0.07,
  delay = 0.04,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) {
    return (
      <StaggerContext.Provider value={false}>
        <Tag className={className} {...rest}>
          {children}
        </Tag>
      </StaggerContext.Provider>
    );
  }

  const MotionTag = motion[as] ?? motion.div;

  return (
    <StaggerContext.Provider value={true}>
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: gap, delayChildren: delay } },
        }}
        {...rest}
      >
        {children}
      </MotionTag>
    </StaggerContext.Provider>
  );
}

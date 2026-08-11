import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

/**
 * A heading whose lines rise out from behind a mask.
 * `lines` is an array of strings or nodes — one per visual line.
 */
export default function MaskHeading({
  as: Tag = "h2",
  lines = [],
  className = "",
  lineClassName = "",
  delay = 0,
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "108%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.085 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

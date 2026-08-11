/**
 * Card shell with the house hover: lift, shadow, and a colour fill that sweeps
 * up from the bottom edge. The sweep is a CSS transition, so it is switched off
 * automatically under reduced motion.
 */
export default function HoverCard({
  as: Tag = "div",
  fill = "navy", // "navy" | "mist"
  className = "",
  children,
  ...rest
}) {
  const sweep =
    fill === "navy"
      ? "bg-navy"
      : "bg-azure-mist";

  return (
    <Tag
      className={
        "group relative isolate overflow-hidden rounded-2xl border border-concrete-line bg-white " +
        "transition-[transform,box-shadow,border-color] duration-300 ease-out " +
        "hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_40px_-18px_rgba(28,36,80,0.45)] " +
        className
      }
      {...rest}
    >
      <span
        aria-hidden
        className={
          `absolute inset-0 -z-10 origin-bottom scale-y-0 ${sweep} ` +
          "transition-transform duration-400 ease-out group-hover:scale-y-100 group-focus-within:scale-y-100"
        }
      />
      {children}
    </Tag>
  );
}

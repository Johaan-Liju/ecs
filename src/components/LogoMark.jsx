/* --------------------------------------------------------------------------
   The ECS logo, as supplied by the client. It is never drawn in code: this
   renders the artwork file itself, so the mark on screen is the mark on the
   letterhead. The only processing done to it was cropping the paper away.

   "Build with trust" is part of the artwork, not separate text — so the
   lockup has to be big enough for the strapline to actually read.

   The artwork is navy and blue on transparent, so on navy sections it is not
   recoloured: it sits on a white plate, the way it does in print.
   -------------------------------------------------------------------------- */

const LOCKUP = { src: "/assets/ecs_logo.png", w: 624, h: 274 };
const MARK = { src: "/assets/ecs_mark.png", w: 156, h: 274 };

export default function LogoMark({
  size, // fixed height in px
  sizeClass, // or Tailwind height utilities, when it needs to be responsive
  tone = "dark", // "dark" = for light backgrounds, "light" = for navy backgrounds
  withWordmark = true,
  alt = "ECS — Elappunkal Enterprises",
  className = "",
}) {
  const art = withWordmark ? LOCKUP : MARK;

  const inline = size
    ? { width: Math.round((size * art.w) / art.h), height: Math.round(size) }
    : undefined;

  const img = (
    <img
      src={art.src}
      width={art.w}
      height={art.h}
      style={inline}
      alt={alt}
      className={`block w-auto max-w-full ${sizeClass ?? ""}`}
      decoding="async"
      fetchPriority="high"
    />
  );

  if (tone !== "light") {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-xl bg-white p-3 shadow-sm sm:p-4 ${className}`}
    >
      {img}
    </span>
  );
}

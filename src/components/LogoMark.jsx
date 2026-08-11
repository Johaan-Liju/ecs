/* --------------------------------------------------------------------------
   The ECS logo, as supplied by the client. It is never drawn in code: this
   renders the artwork file itself, so the mark on screen is the mark on the
   letterhead. The only processing done to it was cropping the paper away.

   The artwork is navy and blue on transparent, so on navy sections it is not
   recoloured — it sits on a white plate, the way it does on print.
   -------------------------------------------------------------------------- */

const LOCKUP = { src: "/assets/ecs_logo.png", w: 624, h: 274 };
const MARK = { src: "/assets/ecs_mark.png", w: 156, h: 274 };

export default function LogoMark({
  size = 40, // height of the artwork, in px
  tone = "dark", // "dark" = for light backgrounds, "light" = for navy backgrounds
  withWordmark = true,
  alt = "ECS — Elappunkal Enterprises",
  className = "",
}) {
  const art = withWordmark ? LOCKUP : MARK;
  const height = Math.round(size);
  const width = Math.round((size * art.w) / art.h);

  const img = (
    <img
      src={art.src}
      width={art.w}
      height={art.h}
      style={{ width, height }}
      alt={alt}
      className="block max-w-full"
      decoding="async"
      fetchPriority="high"
    />
  );

  if (tone !== "light") {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-xl bg-white shadow-sm ${className}`}
      style={{ padding: Math.max(6, Math.round(size * 0.22)) }}
    >
      {img}
    </span>
  );
}

import { useState } from "react";

/* --------------------------------------------------------------------------
   One brand's logo.

   Looks for `/assets/brands/<slug>.png`, then `.svg`, and if neither is on
   disk falls back to the brand name in a bordered box — or to nothing at all
   where the name is already on screen (`fallback="none"`).

   Nothing here draws or approximates a logo. These are registered trademarks,
   and a wrong one is worse than none. Dropping the real file into
   `/public/assets/brands/` is the whole installation step.
   -------------------------------------------------------------------------- */

const sourcesFor = (slug) => [`/assets/brands/${slug}.png`, `/assets/brands/${slug}.svg`];

export default function BrandLogo({
  slug,
  name,
  height, // omit to size the logo purely from `className`
  decorative = false,
  fallback = "name", // "name" = bordered text box, "none" = render nothing
  onFallback,
  className = "",
}) {
  const [attempt, setAttempt] = useState(0);
  const sources = sourcesFor(slug);
  const exhausted = attempt >= sources.length;

  // Kept out of the updater so it stays a plain event handler, not a side
  // effect React might run twice.
  const nextSource = () => {
    const next = attempt + 1;
    setAttempt(next);
    if (next >= sources.length) onFallback?.(slug);
  };

  if (exhausted) {
    if (fallback === "none") return null;
    return (
      <span
        aria-hidden={decorative || undefined}
        className={`inline-flex items-center justify-center rounded-lg border border-navy/20 px-4 font-display text-sm font-semibold whitespace-nowrap text-navy/70 ${className}`}
        style={height ? { height } : undefined}
      >
        {name}
      </span>
    );
  }

  return (
    <img
      key={sources[attempt]}
      src={sources[attempt]}
      alt={decorative ? "" : name}
      aria-hidden={decorative || undefined}
      onError={nextSource}
      style={height ? { height } : undefined}
      className={`object-contain ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

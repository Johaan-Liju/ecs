import { useState } from "react";

/* --------------------------------------------------------------------------
   One brand's logo.

   Looks for `/assets/brands/<slug>.svg`, then `.png`, and if neither is on
   disk falls back to the brand name in a bordered box. Nothing here draws or
   approximates a logo — these are registered trademarks, and a wrong one is
   worse than none. Dropping the real file into `/public/assets/brands/` is
   all it takes to light it up.
   -------------------------------------------------------------------------- */

const sourcesFor = (slug) => [`/assets/brands/${slug}.svg`, `/assets/brands/${slug}.png`];

export default function BrandLogo({
  slug,
  name,
  height = 34,
  decorative = false,
  onFallback, // called once the artwork is confirmed missing
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
    return (
      <span
        aria-hidden={decorative || undefined}
        className={`inline-flex items-center justify-center rounded-lg border border-navy/20 px-4 font-display text-sm font-semibold whitespace-nowrap text-navy/70 ${className}`}
        style={{ height }}
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
      style={{ height }}
      className={`w-auto max-w-[9rem] object-contain ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

import { useState } from "react";
import BrandLogo from "./BrandLogo";

/**
 * A brand logo with its name beneath, for the About page grid.
 *
 * When the artwork is missing <BrandLogo> already renders the name in a
 * bordered box, so the caption drops away rather than printing it twice.
 */
export default function BrandTile({ slug, name }) {
  const [missing, setMissing] = useState(false);

  return (
    <>
      <span className="flex h-16 items-center">
        <BrandLogo
          slug={slug}
          name={name}
          height={missing ? 48 : 56}
          onFallback={() => setMissing(true)}
          className="opacity-75 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
        />
      </span>
      {!missing && <span className="text-center text-sm text-navy/60">{name}</span>}
    </>
  );
}

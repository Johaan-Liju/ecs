import { Check, Plus } from "lucide-react";
import HoverCard from "./HoverCard";
import Reveal from "./Reveal";
import BrandLogo from "./BrandLogo";
import { useEnquiry } from "../context/enquiryContext";
import { getBrand } from "../data/brands";

export default function MaterialCard({ material }) {
  const { add, has } = useEnquiry();
  const added = has(material.code);

  // Sub-brands like Dalmia DSP are not in the brand wall, so fall back to the
  // product name for the alt text.
  const brandName = getBrand(material.brand)?.name ?? material.name;

  return (
    <Reveal as="li" y={16}>
      <HoverCard fill="mist" className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {material.brand && (
              /* The maker's mark, so a builder recognises the stock before
                 reading a word. Renders nothing for unbranded lines like
                 binding wire or mason's tools. */
              <span className="grid h-16 w-20 shrink-0 place-items-center">
                <BrandLogo
                  slug={material.brand}
                  name={brandName}
                  fallback="none"
                  className="max-h-16 max-w-full"
                />
              </span>
            )}
            <div className="min-w-0">
              <p className="eyebrow text-azure">{material.code}</p>
              <h3 className="mt-1 font-display text-lg leading-tight font-bold text-navy">
                {material.name}
              </h3>
              <p className="mt-0.5 text-sm text-navy/60">{material.sub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => add(material.code)}
            aria-label={`Add ${material.name} to enquiry list`}
            className={
              "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors " +
              (added
                ? "bg-mint text-navy"
                : "bg-navy text-white hover:bg-mark hover:text-ink")
            }
          >
            {added ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
          </button>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {material.specs.slice(0, 3).map((s) => (
            <li
              key={s}
              className="rounded-full border border-navy/12 bg-white/70 px-2.5 py-1 font-mono text-[0.6875rem] text-navy/70"
            >
              {s}
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-4 font-mono text-[0.6875rem] tracking-wide text-navy/45 uppercase">
          Sold by {material.unit}
        </p>
      </HoverCard>
    </Reveal>
  );
}

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Search, X } from "lucide-react";

import MaskHeading from "../components/MaskHeading";
import Reveal from "../components/Reveal";
import Stagger from "../components/Stagger";
import MaterialCard from "../components/MaterialCard";
import Backdrop from "../components/Backdrop";
import { CATEGORIES, MATERIALS } from "../data/materials";
import { useEnquiry } from "../context/enquiryContext";
import { useSeo } from "../lib/seo";

export default function Materials() {
  const [params, setParams] = useSearchParams();
  const { count, setOpen } = useEnquiry();
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");

  const active = CATEGORIES.some((c) => c.id === params.get("cat")) ? params.get("cat") : "all";

  useSeo({
    title: "Materials catalogue — cement, TMT steel, AAC blocks",
    description:
      "Browse the ECS catalogue: TMT steel, cement, AAC blocks, structural sections, roofing and finishing. Add items to an enquiry list and send it on WhatsApp.",
    path: "/materials",
  });

  const setCat = (id) => {
    if (id === "all") params.delete("cat");
    else params.set("cat", id);
    setParams(params, { replace: true });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MATERIALS.filter((m) => {
      if (active !== "all" && m.cat !== active) return false;
      if (!q) return true;
      return `${m.name} ${m.sub} ${m.code} ${m.specs.join(" ")}`.toLowerCase().includes(q);
    });
  }, [active, query]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-concrete pt-14 pb-8 sm:pt-20">
        <Backdrop bloom="tr" mark="br" markOpacity={0.09} />
        <div className="hold">
          <p className="eyebrow text-azure">Catalogue</p>
          <MaskHeading
            as="h1"
            className="mt-3 max-w-[14ch] font-display text-[clamp(2.25rem,6.5vw,4rem)] leading-[0.98] font-extrabold text-navy"
            lines={["Pick what", "you need."]}
          />
          <Reveal className="mt-5 max-w-lg text-lg text-navy/65">
            <p>Add items to the list, then send the whole thing on WhatsApp.</p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- Controls */}
      <section className="sticky top-[68px] z-30 border-y border-concrete-line bg-concrete/95 py-4 backdrop-blur-md">
        <div className="hold flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter by category"
            className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1"
          >
            {[{ id: "all", name: "All" }, ...CATEGORIES].map((c) => {
              const on = active === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  aria-pressed={on}
                  className={
                    "shrink-0 snap-start rounded-full border px-4 py-2 font-display text-sm font-semibold transition-colors " +
                    (on
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 bg-white text-navy/70 hover:border-navy/40 hover:text-navy")
                  }
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-64 lg:flex-none">
              <Search
                size={16}
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-navy/40"
              />
              <label className="sr-only" htmlFor="material-search">
                Search materials
              </label>
              <input
                id="material-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search materials"
                className="w-full rounded-full border border-navy/15 bg-white py-2 pr-9 pl-10 text-sm text-navy placeholder:text-navy/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-navy/45 hover:text-navy"
                >
                  <X size={14} aria-hidden />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden shrink-0 items-center gap-2 rounded-full bg-navy px-4 py-2 font-display text-sm font-semibold text-white transition-colors hover:bg-navy-soft lg:inline-flex"
            >
              <ClipboardList size={16} aria-hidden />
              List
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/20 px-1 font-mono text-[0.625rem]">
                {count}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Results */}
      <section className="relative isolate overflow-hidden bg-concrete pt-10 pb-24">
        <Backdrop bloom="bl" />
        <div className="hold">
          <p aria-live="polite" className="mb-6 font-mono text-xs tracking-wide text-navy/50 uppercase">
            {results.length} item{results.length === 1 ? "" : "s"}
          </p>

          {results.length === 0 ? (
            <p className="py-16 text-center text-navy/60">
              Nothing matches that. Try another word, or just WhatsApp us the list.
            </p>
          ) : (
            <Stagger
              as="ul"
              key={`${active}-${query}`}
              gap={0.035}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {results.map((m) => (
                <MaterialCard key={m.code} material={m} />
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Mobile: a bar that appears once something is on the list. */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-concrete-line bg-white/95 p-3 backdrop-blur-md lg:hidden"
            initial={reduced ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduced ? {} : { y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 font-display font-semibold text-white"
            >
              <ClipboardList size={17} aria-hidden />
              Review enquiry list ({count})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

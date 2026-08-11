import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

import MaskHeading from "../components/MaskHeading";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";
import Stagger from "../components/Stagger";
import CountUp from "../components/CountUp";
import BrandMarquee from "../components/BrandMarquee";
import HoverCard from "../components/HoverCard";
import Backdrop from "../components/Backdrop";

import { CATEGORIES } from "../data/materials";
import { BRANDS } from "../data/brands";
import { CONTACT, telLink, waLink } from "../lib/contact";
import { useSeo } from "../lib/seo";

const STATS = [
  { value: 43, label: "Years in the trade" },
  { value: 200, suffix: "+ MT", label: "Steel in stock" },
  { value: 16, label: "Delivery vehicles" },
  { value: 1000, suffix: "+", label: "Homes supplied" },
];

const WHY = [
  "All materials under one roof",
  "Own 16-vehicle fleet",
  "Billed on actual weighbridge weight",
  "Staged delivery, rate locked",
];

export default function Home() {
  const reduced = useReducedMotion();

  useSeo({
    title: "ECS — Elappunkal Enterprises | Cement & TMT steel dealer, Kottayam",
    description:
      "Wholesale building materials dealer and stockist in Kerala since 1982. Cement, TMT steel, AAC blocks, roofing and finishing from one counter. Build with trust.",
    path: "/",
  });

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-concrete pt-24 pb-20 sm:pb-28">
        {/* The logo's tower, blown up to fill the hero and rising from the base. */}
        <Backdrop bloom="tr" mark="br" markOpacity={0.15} drawMark />

        <div className="hold relative">
          <p className="eyebrow text-azure">Est. 1982 · Kerala</p>

          <MaskHeading
            as="h1"
            delay={reduced ? 0 : 1}
            className="mt-3 max-w-[16ch] font-display text-[clamp(2.5rem,8vw,5.25rem)] leading-[0.95] font-extrabold text-navy"
            lines={["Everything for", "a building,", <>from one <span className="text-azure">counter</span>.</>]}
          />

          <Reveal delay={reduced ? 0 : 1.35} className="mt-6 max-w-lg text-lg text-navy/65">
            <p>Wholesale dealers and stockists of building materials, trading since 1982.</p>
          </Reveal>

          <Reveal delay={reduced ? 0 : 1.5} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton to="/materials" variant="solid">
              Browse materials
              <ArrowRight size={17} aria-hidden />
            </MagneticButton>
            <MagneticButton
              href={waLink("Hello ECS, I would like a rate for some materials.")}
              variant="mark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} aria-hidden />
              WhatsApp us
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------- Stat strip */}
      <section
        aria-label="ECS in numbers"
        className="relative isolate overflow-hidden bg-navy py-12 text-white sm:py-14"
      >
        <Backdrop tone="dark" mark="bl" markOpacity={0.1} />
        <Stagger as="dl" className="hold grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label} as="div" y={14}>
              <dd className="font-display text-[clamp(2rem,5vw,3rem)] leading-none font-extrabold text-mark">
                <CountUp value={s.value} suffix={s.suffix ?? ""} />
              </dd>
              <dt className="mt-2 text-sm text-white/65">{s.label}</dt>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* -------------------------------------------------- What we stock */}
      <section className="relative isolate overflow-hidden bg-concrete py-20 sm:py-24">
        <Backdrop bloom="bl" />
        <div className="hold">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-azure">What we stock</p>
              <MaskHeading
                className="mt-2 font-display text-[clamp(1.875rem,4.5vw,3rem)] leading-tight font-extrabold text-navy"
                lines={["Six aisles,", "one delivery note."]}
              />
            </div>
            <Reveal>
              <Link
                to="/materials"
                className="inline-flex items-center gap-2 font-display font-semibold text-navy underline-offset-4 hover:underline"
              >
                Full catalogue
                <ArrowRight size={16} aria-hidden />
              </Link>
            </Reveal>
          </div>

          <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Reveal key={cat.id} as="li">
                <HoverCard as="div" className="h-full">
                  <Link
                    to={`/materials?cat=${cat.id}`}
                    className="flex h-full flex-col justify-between gap-8 p-6"
                  >
                    <span className="eyebrow text-azure transition-colors group-hover:text-mark">
                      {cat.name}
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold text-navy transition-colors group-hover:text-white">
                        {cat.line}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm text-navy/55 transition-colors group-hover:text-white/70">
                        View items
                        <ArrowRight size={15} aria-hidden />
                      </span>
                    </span>
                  </Link>
                </HoverCard>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ----------------------------------------------- Brand marquee */}
      <section aria-label="Brands we stock" className="border-y border-concrete-line bg-concrete py-10">
        <Reveal className="hold mb-7">
          <p className="eyebrow text-center text-navy/45">Brands on the rack</p>
        </Reveal>
        <BrandMarquee items={BRANDS} />
      </section>

      {/* --------------------------------------------------------- Why ECS */}
      <section className="relative isolate overflow-hidden bg-concrete py-20 sm:py-24">
        <Backdrop bloom="tr" mark="bl" markOpacity={0.05} />
        <div className="hold">
          <p className="eyebrow text-azure">Why ECS</p>
          <MaskHeading
            className="mt-2 max-w-[18ch] font-display text-[clamp(1.875rem,4.5vw,3rem)] leading-tight font-extrabold text-navy"
            lines={["The reasons sites", "keep calling back."]}
          />

          <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((tile, i) => (
              <Reveal key={tile} as="li">
                <HoverCard className="h-full p-6">
                  <span className="font-mono text-xs text-mark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-6 font-display text-lg leading-snug font-bold text-navy transition-colors group-hover:text-white">
                    {tile}
                  </p>
                </HoverCard>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* -------------------------------------------------------- CTA band */}
      <section className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-20">
        <Backdrop tone="dark" bloom="tr" mark="br" markOpacity={0.12} />
        <div className="hold flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <MaskHeading
              className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-extrabold"
              lines={["Send the list.", "We will send the rate."]}
            />
            <Reveal className="mt-3 text-white/65">
              <p>{CONTACT.serviceArea.join(" · ")} — own fleet, 0.5 MT to 30 MT.</p>
            </Reveal>
          </div>

          <Reveal className="flex flex-wrap gap-3">
            <MagneticButton
              href={waLink("Hello ECS, I would like a rate for some materials.")}
              variant="mark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} aria-hidden />
              WhatsApp us
            </MagneticButton>
            <MagneticButton href={telLink()} variant="onDark">
              <Phone size={17} aria-hidden />
              {CONTACT.phone}
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}

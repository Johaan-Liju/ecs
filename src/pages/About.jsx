import MaskHeading from "../components/MaskHeading";
import Reveal from "../components/Reveal";
import Stagger from "../components/Stagger";
import CountUp from "../components/CountUp";
import DirectorCard from "../components/DirectorCard";
import BrandTile from "../components/BrandTile";
import Backdrop from "../components/Backdrop";
import MagneticButton from "../components/MagneticButton";
import { MessageCircle } from "lucide-react";
import { BRANDS } from "../data/brands";
import { CONTACT, waLink } from "../lib/contact";
import { useSeo } from "../lib/seo";

const CAPACITY = [
  { value: 6000, suffix: " sq ft", label: "Covered steel shed" },
  { value: 5000, suffix: " sq ft", label: "Insulated cement godown" },
  { value: 16, suffix: " vehicles", label: "From 0.5 MT to 30 MT" },
];

const BUYERS = [
  { n: "1,000+", label: "families" },
  { n: "300+", label: "sub-dealers" },
  { n: "200+", label: "contractors" },
  { n: "150+", label: "block units" },
  { n: "50+", label: "engineers" },
];

export default function About() {
  useSeo({
    title: "About ECS — building materials stockist since 1982",
    description:
      "Second-generation wholesale dealers and stockists of building materials, serving Kottayam, Idukki, Pathanamthitta and Ernakulam since 1982.",
    path: "/about",
  });

  return (
    <>
      {/* -------------------------------------------------------- Intro */}
      <section className="relative isolate overflow-hidden bg-concrete pt-14 pb-16 sm:pt-20 sm:pb-20">
        <Backdrop bloom="tr" mark="br" markOpacity={0.09} />
        <div className="hold">
          <p className="eyebrow text-azure">About</p>
          <MaskHeading
            as="h1"
            className="mt-3 max-w-[13ch] font-display text-[clamp(2.25rem,6.5vw,4rem)] leading-[0.98] font-extrabold text-navy"
            lines={["Two generations", "at the counter."]}
          />
          <Reveal className="mt-6 max-w-xl text-lg text-navy/65">
            <p>
              ECS has traded as Elappunkal Enterprises since 1982. We are wholesale dealers and
              stockists of building materials, now run by the second generation. We supply{" "}
              {CONTACT.serviceArea.join(", ").replace(/, ([^,]*)$/, " and $1")}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- Managing Directors */}
      <section className="relative isolate overflow-hidden bg-white py-20 sm:py-24">
        <Backdrop bloom="bl" mark="br" markOpacity={0.05} />
        <div className="hold">
          <p className="eyebrow text-azure">Managing Directors</p>
          <MaskHeading
            className="mt-2 font-display text-[clamp(1.875rem,4.5vw,3rem)] leading-tight font-extrabold text-navy"
            lines={["Who you deal with."]}
          />

          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:gap-14">
            <DirectorCard
              name="Sojan Scaria"
              role="Managing Director"
              photo="/assets/sojan.jpg"
              bio="[SOJAN SCARIA BIO — 60 TO 90 WORDS, CLIENT TO SUPPLY]"
            />
            {/* don.jpg is not on disk yet; the monogram stands in until it is. */}
            <DirectorCard
              name="Don Sojan"
              role="Managing Director"
              photo="/assets/don.jpg"
              initials="DS"
              bio="[DON SOJAN BIO — 60 TO 90 WORDS, CLIENT TO SUPPLY]"
              delay={0.12}
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Capacity */}
      <section className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-24">
        <Backdrop tone="dark" bloom="tl" mark="br" markOpacity={0.12} />
        <div className="hold">
          <p className="eyebrow text-mark">Capacity</p>
          <MaskHeading
            className="mt-2 font-display text-[clamp(1.875rem,4.5vw,3rem)] leading-tight font-extrabold"
            lines={["What sits behind", "the counter."]}
          />

          <Stagger as="dl" className="mt-12 grid gap-10 sm:grid-cols-3">
            {CAPACITY.map((c) => (
              <Reveal key={c.label} as="div">
                <dd className="font-display text-[clamp(2rem,5vw,3rem)] leading-none font-extrabold text-mark">
                  <CountUp value={c.value} suffix={c.suffix} />
                </dd>
                <dt className="mt-3 text-white/65">{c.label}</dt>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------------------------------ Brands we stock */}
      <section className="relative isolate overflow-hidden bg-white py-20 sm:py-24">
        <Backdrop bloom="tr" mark="bl" markOpacity={0.05} />
        <div className="hold">
          <p className="eyebrow text-azure">Brands we stock</p>
          <MaskHeading
            className="mt-2 font-display text-[clamp(1.875rem,4.5vw,3rem)] leading-tight font-extrabold text-navy"
            lines={["Authorised dealer", "and stockist."]}
          />

          <Stagger
            as="ul"
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
          >
            {BRANDS.map((brand) => (
              <Reveal key={brand.slug} as="li" className="flex flex-col items-center gap-3">
                <BrandTile slug={brand.slug} name={brand.name} />
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* -------------------------------------------------- Who buys here */}
      <section className="relative isolate overflow-hidden bg-concrete py-20 sm:py-24">
        <Backdrop bloom="br" />
        <div className="hold">
          <p className="eyebrow text-azure">Who buys here</p>
          <Stagger as="ul" className="mt-8 flex flex-wrap gap-3">
            {BUYERS.map((b) => (
              <Reveal
                key={b.label}
                as="li"
                className="rounded-full border border-navy/12 bg-white px-5 py-3"
              >
                <span className="font-display text-lg font-extrabold text-navy">{b.n}</span>{" "}
                <span className="text-sm text-navy/60">{b.label}</span>
              </Reveal>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <MagneticButton
              href={waLink("Hello ECS, I would like to know more about your yard.")}
              variant="mark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} aria-hidden />
              Talk to the counter
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}

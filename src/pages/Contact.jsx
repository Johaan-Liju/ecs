import { MapPin } from "lucide-react";

import MaskHeading from "../components/MaskHeading";
import Reveal from "../components/Reveal";
import Stagger from "../components/Stagger";
import EnquiryForm from "../components/EnquiryForm";
import Backdrop from "../components/Backdrop";
import { CONTACT, MAP_EMBED, isPlaceholder, telLink, waLink } from "../lib/contact";
import { useSeo } from "../lib/seo";

export default function Contact() {
  useSeo({
    title: "Contact ECS — building materials supplier, Kottayam",
    description:
      "Phone, WhatsApp and email for ECS, Elappunkal Enterprises. Send your material list and get rates, availability and a delivery window.",
    path: "/contact",
  });

  const DETAILS = [
    { term: "Phone", node: <a href={telLink()} className="hover:text-azure">{CONTACT.phone}</a>, note: CONTACT.hours },
    {
      term: "WhatsApp",
      node: (
        <a
          href={waLink("Hello ECS, I would like a rate for some materials.")}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-azure"
        >
          {CONTACT.phoneAlt}
        </a>
      ),
      note: "Fastest way to get a rate.",
    },
    {
      term: "Email",
      node: <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-azure">{CONTACT.email}</a>,
      note: "Best for drawings and schedules.",
    },
    { term: "Address", node: CONTACT.address, note: "Elappunkal Enterprises" },
    { term: "Service area", node: CONTACT.serviceArea.join(" · "), note: "Own fleet, 0.5 MT to 30 MT." },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-concrete pt-14 pb-12 sm:pt-20">
        <Backdrop bloom="tr" mark="br" markOpacity={0.09} />
        <div className="hold">
          <p className="eyebrow text-azure">Contact</p>
          <MaskHeading
            as="h1"
            className="mt-3 max-w-[12ch] font-display text-[clamp(2.25rem,6.5vw,4rem)] leading-[0.98] font-extrabold text-navy"
            lines={["Send us", "your list."]}
          />
          <Reveal className="mt-5 max-w-lg text-lg text-navy/65">
            <p>Rates, availability and a delivery window come back the same day.</p>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-concrete pb-20 sm:pb-24">
        <Backdrop bloom="bl" />
        <div className="hold grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* ------------------------------------------------- Details */}
          <Stagger as="dl" className="flex flex-col">
            {DETAILS.map((d) => (
              <Reveal
                key={d.term}
                as="div"
                className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-concrete-line py-4 first:pt-0"
              >
                <dt className="eyebrow pt-1 text-navy/45">{d.term}</dt>
                <dd>
                  <span
                    className={
                      "block font-display font-semibold " +
                      (typeof d.node === "string" && isPlaceholder(d.node)
                        ? "font-mono text-sm font-normal text-navy/45"
                        : "text-navy")
                    }
                  >
                    {d.node}
                  </span>
                  <span className="mt-0.5 block text-sm text-navy/50">{d.note}</span>
                </dd>
              </Reveal>
            ))}
          </Stagger>

          {/* ---------------------------------------------------- Form */}
          <Reveal>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- Map */}
      <section aria-label="Location">
        <Reveal className="relative">
          <iframe
            title="ECS — Elappunkal Enterprises on Google Maps"
            src={MAP_EMBED}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-[380px] w-full border-0 grayscale-[0.25] sm:h-[460px]"
          />
          {isPlaceholder(CONTACT.mapsUrl) ? (
            <p className="hold py-3 font-mono text-xs text-navy/45">
              Showing the service area. [EXACT YARD PIN — CLIENT TO SUPPLY]
            </p>
          ) : (
            <p className="hold py-3 text-sm">
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display font-semibold text-navy hover:text-azure"
              >
                <MapPin size={15} aria-hidden />
                Open in Google Maps
              </a>
            </p>
          )}
        </Reveal>
      </section>
    </>
  );
}

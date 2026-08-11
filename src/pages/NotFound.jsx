import MaskHeading from "../components/MaskHeading";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";
import Backdrop from "../components/Backdrop";
import { useSeo } from "../lib/seo";

export default function NotFound() {
  useSeo({
    title: "Page not found",
    description: "That page is not on the site. Head back to the catalogue or the counter.",
    path: "/404",
  });

  return (
    <section className="relative isolate grid min-h-[70svh] place-content-center overflow-hidden bg-concrete px-6 py-24 text-center">
      <Backdrop bloom="tr" mark="center" markOpacity={0.08} />
      <p className="eyebrow text-azure">404</p>
      <MaskHeading
        as="h1"
        className="mt-3 font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold text-navy"
        lines={["Not in stock."]}
      />
      <Reveal className="mt-4 text-navy/60">
        <p>That page is not on the site.</p>
      </Reveal>
      <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
        <MagneticButton to="/">Back to home</MagneticButton>
        <MagneticButton to="/materials" variant="outline">
          Browse materials
        </MagneticButton>
      </Reveal>
    </section>
  );
}

import LogoBackdrop from "./LogoBackdrop";

/**
 * The section background: blueprint grid, an optional soft brand glow, and an
 * optional watermark of the logo's tower mark. Purely decorative and sits
 * behind the content, so the parent section needs `relative isolate`.
 */

const BLOOMS = {
  tl: "-top-40 -left-32",
  tr: "-top-40 -right-32",
  bl: "-bottom-40 -left-32",
  br: "-bottom-40 -right-32",
};

export default function Backdrop({
  tone = "light", // "light" = concrete/white sections, "dark" = navy sections
  grid = true,
  bloom = null, // "tl" | "tr" | "bl" | "br"
  mark = null, // "br" | "bl" | "center"
  markOpacity = 0.07,
  drawMark = false,
  className = "",
}) {
  const dark = tone === "dark";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {grid && <div className={`absolute inset-0 bp-grid ${dark ? "bp-grid-dark" : ""}`} />}

      {bloom && (
        <div
          className={
            `absolute h-[34rem] w-[34rem] rounded-full blur-3xl ${BLOOMS[bloom]} ` +
            (dark ? "bg-azure/12" : "bg-azure-mist")
          }
        />
      )}

      {mark && (
        <div className="absolute inset-0" style={{ opacity: markOpacity }}>
          <LogoBackdrop tone={tone} position={mark} draw={drawMark} />
        </div>
      )}
    </div>
  );
}

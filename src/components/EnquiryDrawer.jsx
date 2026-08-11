import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2, X, MessageCircle } from "lucide-react";
import { useEnquiry } from "../context/enquiryContext";
import { CONTACT, waLink } from "../lib/contact";
import { setScrollLocked } from "../lib/lenis";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function EnquiryDrawer() {
  const { items, count, setQty, remove, clear, asText, open, setOpen } = useEnquiry();
  const reduced = useReducedMotion();
  const panel = useRef(null);
  const noteRef = useRef(null);
  const restoreTo = useRef(null);

  // Escape to close, Tab trapped inside the panel, page frozen behind it.
  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement;
    setScrollLocked(true);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetParent !== null,
      );
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      panel.current?.querySelector(FOCUSABLE)?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      setScrollLocked(false);
      restoreTo.current?.focus?.();
    };
  }, [open, setOpen]);

  const send = () => {
    const note = noteRef.current?.value.trim();
    const message = [
      "Hello ECS, please quote for the following:",
      "",
      asText(),
      note ? `\nNotes: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(message), "_blank", "noopener");
  };

  const slide = reduced
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { x: "100%" },
        animate: { x: 0, transition: { type: "spring", stiffness: 320, damping: 34 } },
        exit: { x: "100%", transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
      };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Close enquiry list"
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry list"
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-white shadow-2xl"
            {...slide}
          >
            <header className="flex items-start justify-between gap-4 border-b border-concrete-line px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">Enquiry list</h2>
                <p className="text-sm text-navy/55">
                  {count ? `${count} item${count > 1 ? "s" : ""}` : "Nothing added yet"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-navy/60 transition-colors hover:bg-concrete hover:text-navy"
              >
                <X size={18} aria-hidden />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {count === 0 ? (
                <p className="pt-10 text-center text-sm text-navy/55">
                  Add materials from the catalogue and send the whole list on WhatsApp.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map(({ code, qty, material }) => (
                    <li key={code} className="rounded-xl border border-concrete-line p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="eyebrow text-azure">{material.code}</p>
                          <p className="truncate font-display font-semibold text-navy">
                            {material.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(code)}
                          aria-label={`Remove ${material.name}`}
                          className="rounded-full p-1.5 text-navy/45 transition-colors hover:bg-concrete hover:text-navy"
                        >
                          <Trash2 size={16} aria-hidden />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(code, qty - 1)}
                          aria-label={`Decrease quantity of ${material.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full border border-concrete-line text-navy transition-colors hover:bg-concrete"
                        >
                          <Minus size={14} aria-hidden />
                        </button>
                        <label className="sr-only" htmlFor={`qty-${code}`}>
                          Quantity of {material.name} in {material.unit}
                        </label>
                        <input
                          id={`qty-${code}`}
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={qty}
                          onChange={(e) => setQty(code, e.target.value)}
                          className="w-16 rounded-lg border border-concrete-line px-2 py-1.5 text-center font-mono text-sm text-navy"
                        />
                        <button
                          type="button"
                          onClick={() => setQty(code, qty + 1)}
                          aria-label={`Increase quantity of ${material.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full border border-concrete-line text-navy transition-colors hover:bg-concrete"
                        >
                          <Plus size={14} aria-hidden />
                        </button>
                        <span className="text-sm text-navy/55">{material.unit}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-concrete-line px-5 py-4">
              <label className="sr-only" htmlFor="enquiry-note">
                Notes for ECS
              </label>
              <textarea
                id="enquiry-note"
                ref={noteRef}
                rows={2}
                maxLength={400}
                placeholder="Delivery location, dates, anything else."
                className="w-full resize-none rounded-xl border border-concrete-line px-3 py-2 text-sm text-navy placeholder:text-navy/40"
              />
              <button
                type="button"
                onClick={send}
                disabled={count === 0}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-mark px-5 py-3 font-display font-semibold text-ink transition-colors hover:bg-[#ffd033] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <MessageCircle size={17} aria-hidden />
                Send on WhatsApp
              </button>
              <div className="mt-2 flex items-center justify-between text-xs text-navy/50">
                <button
                  type="button"
                  onClick={clear}
                  disabled={count === 0}
                  className="underline underline-offset-2 transition-colors hover:text-navy disabled:no-underline disabled:opacity-45"
                >
                  Clear list
                </button>
                <span>Opens WhatsApp to {CONTACT.phoneAlt}</span>
              </div>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

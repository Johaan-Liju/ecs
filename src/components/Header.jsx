import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ClipboardList, Menu, MessageCircle, X } from "lucide-react";
import LogoMark from "./LogoMark";
import { useEnquiry } from "../context/enquiryContext";
import { waLink } from "../lib/contact";
import { setScrollLocked } from "../lib/lenis";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/materials", label: "Materials" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, setOpen } = useEnquiry();
  const reduced = useReducedMotion();
  const location = useLocation();
  const [shrunk, setShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, "change", () => {
    setShrunk(window.scrollY > 40);
  });

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    setScrollLocked(true);
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [menuOpen]);

  const navClass = ({ isActive }) =>
    `relative py-1 font-display text-sm font-semibold transition-colors ${
      isActive ? "text-navy" : "text-navy/55 hover:text-navy"
    }`;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-300"
        style={{
          backgroundColor: shrunk ? "rgba(255,255,255,0.92)" : "rgba(242,244,247,0.6)",
          borderColor: shrunk ? "var(--color-concrete-line)" : "transparent",
        }}
      >
        <motion.div
          className="hold flex items-center justify-between gap-4"
          animate={{ paddingBlock: reduced ? 14 : shrunk ? 10 : 18 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Link to="/" aria-label="ECS — Elappunkal Enterprises, home">
            <motion.span
              className="inline-flex"
              animate={{ scale: reduced ? 1 : shrunk ? 0.92 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "left center" }}
            >
              <LogoMark size={40} />
            </motion.span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass} end={l.to === "/"}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId={reduced ? undefined : "nav-underline"}
                        className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-mark"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full border border-navy/15 px-3.5 py-2 font-display text-sm font-semibold text-navy transition-colors hover:border-navy/40 hover:bg-white"
            >
              <ClipboardList size={16} aria-hidden />
              <span className="hidden sm:inline">List</span>
              <span className="sr-only">Open enquiry list</span>
              <span
                aria-hidden
                className="grid h-5 min-w-5 place-items-center rounded-full bg-navy px-1 font-mono text-[0.625rem] text-white"
              >
                {count}
              </span>
            </button>

            <a
              href={waLink("Hello ECS, I would like a rate for some materials.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-mark px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:bg-[#ffd033] sm:inline-flex"
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy md:hidden"
            >
              {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="h-0.5 origin-left bg-mark"
          style={{ scaleX: progress }}
          aria-hidden
        />
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-x-0 top-[68px] z-40 border-b border-concrete-line bg-white px-6 pt-4 pb-6 md:hidden"
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.to} className="border-b border-concrete-line last:border-0">
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `block py-3.5 font-display text-lg font-semibold ${
                        isActive ? "text-navy" : "text-navy/60"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <a
              href={waLink("Hello ECS, I would like a rate for some materials.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-mark px-4 py-3 font-display font-semibold text-ink"
            >
              <MessageCircle size={17} aria-hidden />
              WhatsApp us
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

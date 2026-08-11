import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import LogoMark from "./LogoMark";
import Backdrop from "./Backdrop";
import { CONTACT, telLink, waLink } from "../lib/contact";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-navy text-white">
      <Backdrop tone="dark" mark="br" markOpacity={0.09} />
      <div className="hold grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <LogoMark sizeClass="h-20 sm:h-24" tone="light" />
          <p className="mt-4 max-w-xs text-sm text-white/65">
            Wholesale dealers and stockists of building materials since 1982.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow text-mark">Site</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/materials" className="hover:text-white">Materials</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-mark">The counter</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
            <li>
              <a href={telLink()} className="inline-flex items-center gap-2 hover:text-white">
                <Phone size={15} aria-hidden />
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={waLink("Hello ECS, I would like a rate for some materials.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <MessageCircle size={15} aria-hidden />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 break-all hover:text-white"
              >
                <Mail size={15} aria-hidden />
                {CONTACT.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin size={15} aria-hidden className="mt-0.5 shrink-0" />
              {CONTACT.serviceArea.join(" · ")}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="hold flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Elappunkal Enterprises</span>
          <span>Build with trust</span>
        </div>
      </div>
    </footer>
  );
}

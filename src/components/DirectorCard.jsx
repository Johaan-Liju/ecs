import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { telLink, waLink } from "../lib/contact";

/**
 * A managing director.
 *
 * `photo` is attempted first; if the file is not on disk the card falls back
 * to a brand monogram of the same 4:5 proportion, so dropping the real
 * portrait in later changes nothing about the layout.
 *
 * `bio` and `contact` are optional — the card simply closes up without them.
 * Never write a bio for a real person; leave it off until they supply one.
 */
export default function DirectorCard({
  name,
  role,
  initials,
  photo,
  bio,
  contact, // optional { phone, whatsapp, email }
  delay = 0,
}) {
  const reduced = useReducedMotion();
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = photo && !photoFailed;

  const card = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "0px 0px -12% 0px" },
        transition: { duration: 0.65, delay, ease: [0.22, 0.61, 0.36, 1] },
      };

  return (
    <motion.article className="group" {...card}>
      <div className="overflow-hidden rounded-2xl bg-azure-mist">
        {showPhoto ? (
          <img
            src={photo}
            alt={`${name}, ${role} at ECS`}
            width="768"
            height="960"
            loading="lazy"
            onError={() => setPhotoFailed(true)}
            className="aspect-4/5 w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          /* Decorative: the name is in the heading directly below, so the
             monogram adds nothing for a screen reader. */
          <div
            aria-hidden
            className="grid aspect-4/5 w-full place-items-center bg-linear-160 from-navy via-navy-soft to-azure"
          >
            <span className="font-display text-[clamp(3.5rem,12vw,6rem)] font-extrabold tracking-tight text-white/90 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              {initials}
            </span>
          </div>
        )}
      </div>

      <h3 className="mt-5 font-display text-2xl font-bold text-navy">{name}</h3>

      <motion.span
        aria-hidden
        className="mt-2 block h-0.5 w-16 origin-left bg-mark"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.25, ease: [0.22, 0.61, 0.36, 1] }}
      />

      <p className="eyebrow mt-3 text-azure">{role}</p>

      {bio && <p className="mt-4 text-navy/70">{bio}</p>}

      {contact && (
        <ul className="mt-5 flex flex-wrap gap-4 text-sm">
          {contact.phone && (
            <li>
              <a href={telLink(contact.phone)} className="inline-flex items-center gap-1.5 text-navy/70 hover:text-azure">
                <Phone size={14} aria-hidden />
                {contact.phone}
              </a>
            </li>
          )}
          {contact.whatsapp && (
            <li>
              <a
                href={waLink(`Hello ${name}, I would like a rate for some materials.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-navy/70 hover:text-azure"
              >
                <MessageCircle size={14} aria-hidden />
                WhatsApp
              </a>
            </li>
          )}
          {contact.email && (
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-1.5 break-all text-navy/70 hover:text-azure"
              >
                <Mail size={14} aria-hidden />
                {contact.email}
              </a>
            </li>
          )}
        </ul>
      )}
    </motion.article>
  );
}

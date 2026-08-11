/* --------------------------------------------------------------------------
   Single source of truth for how people reach ECS.

   The numbers below come from the client's own business card and existing
   site. Anything still in [SQUARE BRACKETS] has not been supplied yet — it
   renders on the page as a visible placeholder rather than a guess.
   -------------------------------------------------------------------------- */

export const CONTACT = {
  whatsapp: "919544380004", // country code + number, digits only
  phone: "+91 94470 41518",
  phoneAlt: "+91 95443 80004",
  // The trading name is not a mismatch: the Google listing reads
  // "ECS | Thekkady trading Company P Ltd".
  email: "thekkadytradingcompany@gmail.com",
  // As published on the business's own Google listing. [CLIENT TO CONFIRM the
  // town and district line — the listing gives only the road and pincode.]
  address: "XI/616A, Mylady Junction, Changanassery – Vazhoor Rd, Kerala 686521",

  // The "ECS | Thekkady trading Company P Ltd" listing, by its place id —
  // stable, and free of the tracking parameters a copied search URL carries.
  mapsUrl: "https://www.google.com/maps?cid=5307834771493155016",

  // Straight from Google Maps → Share → Embed a map. This is the only form
  // that pins the exact place without an API key: a hand-built `?q=…&ftid=…`
  // URL gets rewritten and the ftid thrown away, leaving a name search.
  // Regenerate it the same way if the listing ever moves.
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.7055194474074!2d76.66182392398379!3d9.534293230877001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0631eb31e5f2a3%3A0x49a9379a4150f0c8!2sECS%7C%20Thekkady%20trading%20Company%20P%20Ltd!5e0!3m2!1sen!2sin!4v1786467416855!5m2!1sen!2sin",

  serviceArea: ["Kottayam", "Idukki", "Pathanamthitta", "Ernakulam"],
  hours: "Monday to Saturday, counter hours",
};

/** True when a field is still an unfilled `[PLACEHOLDER]`. */
export const isPlaceholder = (value) =>
  typeof value === "string" && value.trim().startsWith("[");

/** Builds a wa.me link with the message already typed out. */
export const waLink = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const telLink = (number = CONTACT.phone) =>
  `tel:${number.replace(/[^\d+]/g, "")}`;

/**
 * Map embed. Falls back to the service area if the pin is ever taken out.
 *
 * The host must stay www.google.com — that is what `frame-src` allows in
 * public/_headers.
 */
export const MAP_EMBED = isPlaceholder(CONTACT.mapsEmbed)
  ? "https://www.google.com/maps?q=Kottayam,Kerala,India&z=10&output=embed"
  : CONTACT.mapsEmbed;

/* --------------------------------------------------------------------------
   Single source of truth for how people reach ECS.

   The numbers come from the client's own business card and existing site; the
   address and map pin come from their Google listing. Every value here is
   real — nothing on the page is a placeholder any more, so a wrong value will
   be published as fact rather than flagged. Change these with care.
   -------------------------------------------------------------------------- */

export const CONTACT = {
  whatsapp: "919544380004", // country code + number, digits only
  phone: "+91 94470 41518",
  phoneAlt: "+91 95443 80004",
  // The trading name is not a mismatch: the Google listing reads
  // "ECS | Thekkady trading Company P Ltd".
  email: "thekkadytradingcompany@gmail.com",
  // As published on the business's own Google listing, which gives the road
  // and pincode but no town or district line.
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

/** Builds a wa.me link with the message already typed out. */
export const waLink = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const telLink = (number = CONTACT.phone) =>
  `tel:${number.replace(/[^\d+]/g, "")}`;

/**
 * Map embed. The host must stay www.google.com — that is what `frame-src`
 * allows in public/_headers.
 */
export const MAP_EMBED = CONTACT.mapsEmbed;

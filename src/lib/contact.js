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
  email: "thekkadytradingcompany@gmail.com", // [CLIENT TO CONFIRM — trading name differs]
  address: "[FULL YARD ADDRESS — CLIENT TO SUPPLY]",
  mapsUrl: "[GOOGLE MAPS LINK — CLIENT TO SUPPLY]",
  gstin: "[GSTIN — CLIENT TO SUPPLY]",
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

/** Map embed. Falls back to the service area until the yard pin arrives. */
export const MAP_EMBED = isPlaceholder(CONTACT.mapsUrl)
  ? "https://www.google.com/maps?q=Kottayam,Kerala,India&z=10&output=embed"
  : `${CONTACT.mapsUrl}&output=embed`;

/* --------------------------------------------------------------------------
   The brands ECS is an authorised dealer and stockist for.

   `slug` is the filename the artwork is looked for under:
   `/public/assets/brands/<slug>.svg`, falling back to `.png`. If neither file
   is there the name renders in a bordered box instead — see <BrandLogo>.

   These are registered trademarks. Never generate, trace or substitute one:
   a wrong logo is worse than no logo.
   -------------------------------------------------------------------------- */

export const BRANDS = [
  { slug: "tata-tiscon", name: "Tata Tiscon" },
  { slug: "ultratech", name: "UltraTech" },
  { slug: "jsw-neosteel", name: "JSW Neosteel" },
  { slug: "jsw-cement", name: "JSW Cement" },
  { slug: "dalmia", name: "Dalmia" },
  { slug: "vizag-steel", name: "Vizag Steel" },
  { slug: "chettinad", name: "Chettinad" },
  { slug: "sankar", name: "Sankar" },
  { slug: "ramco", name: "Ramco" },
  { slug: "ccl", name: "CCL" },
  { slug: "everest", name: "Everest" },
  { slug: "panther", name: "Panther" },
  { slug: "renacon-aac", name: "Renacon AAC" },
  { slug: "kelachandra", name: "Kelachandra" },
  { slug: "finolex", name: "Finolex" },
  { slug: "maxxite", name: "Maxxite" },
  { slug: "tata-structura", name: "Tata Structura" },
];

export const getBrand = (slug) => BRANDS.find((b) => b.slug === slug);

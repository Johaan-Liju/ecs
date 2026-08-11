/* --------------------------------------------------------------------------
   The catalogue. `code` is the stock code: category prefix + running number.
   Sub-labels stay to one line; specs are the chips shown on the card.
   -------------------------------------------------------------------------- */

export const CATEGORIES = [
  { id: "steel", name: "Steel", line: "TMT bar 8–32 mm, Fe 500D and Fe 550D." },
  { id: "cement", name: "Cement", line: "OPC 53, PPC and PSC in 50 kg bags." },
  { id: "blocks", name: "Blocks", line: "Renacon AAC, adhesive and concrete blocks." },
  { id: "structural", name: "Structural", line: "Pipe, mesh, angle, channel and flat." },
  { id: "roofing", name: "Roofing", line: "Colour-coated and GI sheets, cut to length." },
  { id: "finishing", name: "Finishing", line: "Plumbing, wiring, waterproofing and tools." },
];

export const MATERIALS = [
  // ---- Steel ----------------------------------------------------------
  { code: "ST-01", cat: "steel", name: "Tata Tiscon 550SD", sub: "TMT reinforcement bar", specs: ["8–32 mm", "Fe 550D", "12 m rods"], unit: "MT", brand: "tata-tiscon" },
  { code: "ST-02", cat: "steel", name: "JSW Neosteel", sub: "TMT reinforcement bar", specs: ["8–32 mm", "Fe 550D"], unit: "MT", brand: "jsw-neosteel" },
  { code: "ST-03", cat: "steel", name: "Vizag Steel", sub: "TMT reinforcement bar", specs: ["8–32 mm", "Fe 500D"], unit: "MT", brand: "vizag-steel" },
  { code: "ST-04", cat: "steel", name: "Panther TMT", sub: "TMT reinforcement bar", specs: ["8–25 mm"], unit: "MT", brand: "panther" },
  { code: "ST-05", cat: "steel", name: "Everest TMT", sub: "TMT reinforcement bar", specs: ["8–20 mm"], unit: "MT", brand: "everest" },
  { code: "ST-06", cat: "steel", name: "Binding wire", sub: "Reinforcement accessory", specs: ["18 SWG", "Annealed"], unit: "kg" },

  // ---- Cement ---------------------------------------------------------
  { code: "CM-01", cat: "cement", name: "UltraTech", sub: "OPC 53 · PPC", specs: ["50 kg", "OPC 53", "PPC"], unit: "bags", brand: "ultratech" },
  { code: "CM-02", cat: "cement", name: "JSW Cement", sub: "PSC · composite", specs: ["50 kg", "PSC"], unit: "bags", brand: "jsw-cement" },
  { code: "CM-03", cat: "cement", name: "Dalmia", sub: "OPC · PPC", specs: ["50 kg"], unit: "bags", brand: "dalmia" },
  { code: "CM-04", cat: "cement", name: "Chettinad", sub: "OPC 53 · PPC", specs: ["50 kg"], unit: "bags", brand: "chettinad" },
  { code: "CM-05", cat: "cement", name: "Sankar", sub: "OPC · PPC", specs: ["50 kg"], unit: "bags", brand: "sankar" },
  { code: "CM-06", cat: "cement", name: "Ramco", sub: "OPC · PPC", specs: ["50 kg"], unit: "bags", brand: "ramco" },
  { code: "CM-07", cat: "cement", name: "CCL", sub: "OPC · PPC", specs: ["50 kg"], unit: "bags", brand: "ccl" },
  { code: "CM-08", cat: "cement", name: "Dalmia DSP", sub: "Sulphate resisting", specs: ["50 kg", "SRC"], unit: "bags", brand: "dalmia-dsp" },
  { code: "CM-09", cat: "cement", name: "White cement & putty", sub: "Finishing", specs: ["Assorted"], unit: "bags" },

  // ---- Blocks ---------------------------------------------------------
  { code: "BL-01", cat: "blocks", name: "Renacon AAC", sub: "Autoclaved aerated concrete", specs: ["600×200×100", "600×200×150", "600×200×200"], unit: "blocks", brand: "renacon-aac" },
  { code: "BL-02", cat: "blocks", name: "Renacon AAC 200 HD", sub: "High-density AAC", specs: ["600×200×200", "HD grade"], unit: "blocks", brand: "renacon-aac" },
  { code: "BL-03", cat: "blocks", name: "Block adhesive", sub: "AAC accessory", specs: ["40 kg", "Thin-bed"], unit: "bags" },
  { code: "BL-04", cat: "blocks", name: "Hollow & solid blocks", sub: "Concrete masonry", specs: ['4"', '6"', '8"'], unit: "blocks" },

  // ---- Structural -----------------------------------------------------
  { code: "SR-01", cat: "structural", name: "MS square pipe", sub: "Hollow section", specs: ["Square", "Rectangular", "Various gauges"], unit: "kg" },
  { code: "SR-02", cat: "structural", name: "Weld mesh", sub: "Reinforcement mesh", specs: ["Sheets", "Rolls"], unit: "sheets" },
  { code: "SR-03", cat: "structural", name: "MS angle, channel & flat", sub: "Structural sections", specs: ["Angle", "Channel", "Flat"], unit: "kg" },
  { code: "SR-04", cat: "structural", name: "Tata Structura", sub: "Branded hollow section", specs: ["Square", "Rectangular"], unit: "kg", brand: "tata-structura" },

  // ---- Roofing --------------------------------------------------------
  { code: "RF-01", cat: "roofing", name: "Roofing structurals", sub: "Truss & purlin", specs: ["Made to size"], unit: "kg" },
  { code: "RF-02", cat: "roofing", name: "Roofing sheets", sub: "Colour coated · GI", specs: ["Cut to length", "Colour coated", "GI"], unit: "sq ft" },
  { code: "RF-03", cat: "roofing", name: "Partition boards", sub: "Dry construction", specs: ["Cement", "Gypsum"], unit: "sheets" },

  // ---- Finishing ------------------------------------------------------
  { code: "PL-01", cat: "finishing", name: "Kelachandra pipes", sub: "UPVC · CPVC · SWR", specs: ["UPVC", "CPVC", "SWR"], unit: "pieces", brand: "kelachandra" },
  { code: "PL-02", cat: "finishing", name: "Sanitaryware", sub: "Bath fittings", specs: ["Assorted"], unit: "pieces" },
  { code: "PL-03", cat: "finishing", name: "Water tanks", sub: "Storage", specs: ["500–5000 L", "Multi-layer"], unit: "units" },
  { code: "EL-01", cat: "finishing", name: "Finolex wires", sub: "House wiring", specs: ["1.0–6.0 sq mm", "FR / FRLS"], unit: "coils", brand: "finolex" },
  { code: "EL-02", cat: "finishing", name: "Conduits & switches", sub: "Wiring accessories", specs: ["Conduit", "Modular"], unit: "pieces" },
  { code: "WP-01", cat: "finishing", name: "Maxxite waterproofing", sub: "Chemical", specs: ["Integral", "Coating"], unit: "units", brand: "maxxite" },
  { code: "WP-02", cat: "finishing", name: "Sealants & bonding agents", sub: "Chemical", specs: ["Sealant", "Admixture"], unit: "units" },
  { code: "AC-01", cat: "finishing", name: "Cover blocks & spacers", sub: "Reinforcement accessory", specs: ["20–50 mm"], unit: "per 100" },
  { code: "AC-02", cat: "finishing", name: "Nails, screws & fasteners", sub: "Site consumable", specs: ["Assorted"], unit: "kg" },
  { code: "AC-03", cat: "finishing", name: "Cutting & grinding discs", sub: "Site consumable", specs: ['4"', '7"', '14"'], unit: "pieces" },
  { code: "AC-04", cat: "finishing", name: "Mason's tools", sub: "Site consumable", specs: ["Assorted"], unit: "pieces" },
];

/* Brands moved to `./brands.js`, where each one carries the slug its logo
   file is looked up by. */

export const getMaterial = (code) => MATERIALS.find((m) => m.code === code);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);

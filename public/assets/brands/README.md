# Brand logos

**All 17 brands have artwork, plus `dalmia-dsp` for the sulphate-resisting
line on material CM-08.** Nothing is falling back to a text box.

Generated files — do not edit these by hand. Put new artwork in `/logos/` at
the project root and run:

```powershell
.\scripts\install-brand-logos.ps1
```

That script does two things so the logos can sit straight on the page with no
card behind them. It flood-fills a white background away from the edges
inward — flood fill, not "delete all white", so white *inside* a logo
survives (the UltraTech wordmark, the Tata Tiscon rebar). Artwork on a
deliberate colour is detected and left alone: Everest orange, Ramco yellow,
Renacon green, and the Chettinad and Kelachandra product panels stay as they
are. Then everything is trimmed to its ink, so no logo carries dead margin.

The filename becomes the slug and must match `src/data/brands.js`. Case,
spaces and underscores are normalised (`Tata_Structura.PNG` → `tata-structura`),
but spelling is not — `kelchandra.png` will not find `kelachandra`.

If a file is ever missing, the brand renders as its name in a bordered box on
the brand wall, and shows no logo at all on a material card (the product name
is already there). That fallback is intended: these are registered trademarks,
so never generate, trace, recolour or substitute one. A wrong logo is worse
than none — ask the brand's dealer contact for their official assets pack.

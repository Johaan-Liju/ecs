# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Brand assets

The logo is never drawn in code. Everything comes from the one file the client
supplied, `ecs_logo.jpeg` in the project root:

| File | Derived how | Used by |
|---|---|---|
| `public/assets/ecs_logo.jpeg` | the original, untouched | source of truth |
| `public/assets/ecs_logo.png` | cropped, white keyed to transparent | header, footer, loader |
| `public/assets/ecs_mark.png` | the tower glyph alone | section watermarks, icons |
| `public/assets/ecs_mark_white.png` | same alpha, white — decorative only | watermark on navy sections |
| `public/favicon-*.png`, `public/apple-touch-icon.png` | mark centred on white | browser tabs, home screens |
| `public/assets/og.jpg` | lockup on concrete grey, 1200×630 | link previews |

When a new logo arrives, drop it in the project root and run:

```powershell
.\scripts\make-logo-assets.ps1 -Source .\new_logo.png
```

Re-measure the crop boxes near the bottom of that script if the artwork is a
different size or arrangement. The palette in `src/index.css` was sampled from
the artwork too — the navy is the wordmark, the two blues are the tower, the
mint is the offset behind the letters.

On navy the artwork sits on a white plate rather than being recoloured, since
the wordmark is navy itself.

## Brand logos

`src/data/brands.js` lists all 17 brands, each with the slug its artwork is
found by. Put source files in `/logos/` and run
`.\scripts\install-brand-logos.ps1` — it keys white backgrounds away, trims
each logo to its ink, and writes `public/assets/brands/<slug>.png`. See that
folder's README for the detail.

**If a file is missing the brand renders as its name in a bordered box** — that
is deliberate. These are registered trademarks; never generate, trace or
substitute one, because a wrong logo is worse than none.

## Enquiry form

`/contact` offers three routes to ECS: WhatsApp (the default), Email, and a
call back. WhatsApp builds a `wa.me` deep link; the other two POST to
Web3Forms.

Copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` to a Web3Forms
access key. Without it the two posted paths disable themselves and say so on
the page — WhatsApp keeps working regardless.

**Attachments need a Web3Forms Pro plan.** This was tested against the live
key: a submission carrying a file comes back `400 "You are trying to use a Pro
feature"` and the *entire* enquiry is rejected, not just the file. So the
upload zone sits behind `VITE_FORM_ATTACHMENTS`, off by default; the email
path tells visitors to send drawings by email or WhatsApp instead.
`FileDrop.jsx` is complete and wired — turn the flag on the day the plan is
upgraded, and check the plan's real per-file ceiling against `MAX_FILES` and
`MAX_BYTES` at the top of that file.

One constraint worth knowing before changing anything here: **`wa.me` links
carry text only.** Attachments cannot ride along, which is why the upload zone
appears on the email path alone. Never wire it to the WhatsApp path — the file
would be dropped and the enquiry silently lost.

If you point the form at a different service, update `connect-src` in
`public/_headers` to match, or the browser will block the request.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

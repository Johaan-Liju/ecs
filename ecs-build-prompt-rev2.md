# Build prompt — ECS website, Revision 2

> Run this **after** the base build prompt, or append it to that prompt if you're building from scratch.
> Replace everything in `[SQUARE BRACKETS]` before running.

---

## 1. Replace the logo

A new ECS logo file is being supplied. Swap it in everywhere the old one appears:

- Header (light and dark variants if both exist)
- Footer
- Loading / page-transition screen
- Favicon and Apple touch icon
- Open Graph share image

Put it at `/public/assets/ecs_logo.[ext]`. Do not redraw, recolour, restretch or recreate the logo in code — use the supplied file as-is, and set the site's primary and secondary colours to match it.

Provide `<img>` with proper `width`/`height` attributes so the header doesn't shift while loading, and `alt="ECS — Elappunkal Enterprises"`.

---

## 2. Brand logo wall

ECS is an authorised dealer and stockist for the brands below. Replace the current text-only marquee with **actual brand logos**.

Files go in `/public/assets/brands/` as SVG where possible, PNG with transparency otherwise:

```
tata-tiscon · ultratech · jsw-neosteel · jsw-cement · dalmia · vizag-steel
chettinad · sankar · ramco · ccl · everest · panther · renacon-aac
kelachandra · finolex · maxxite · tata-structura
```

Build it as a **two-row infinite marquee**, rows scrolling in opposite directions, pausing on hover. Render each logo greyscale at ~60% opacity, going full colour on hover.

Add a dedicated **"Brands we stock"** section on the About page: a responsive grid of the same logos, larger, with the brand name beneath each.

**Important:** if a logo file is missing from `/public/assets/brands/`, render a bordered box containing the brand name in text. **Never generate, trace, approximate or substitute a brand logo.** These are registered trademarks and a wrong one is worse than none.

---

## 3. About Us — full biographies

Replace the placeholder bios with real copy. Both directors get an equal-weight card.

### Sojan Scaria — Managing Director
- Photo: `/public/assets/sojan.jpg`
- Bio: `[SOJAN SCARIA BIO — 60 to 90 words. Years in the trade, what he handles day to day, what customers know him for.]`

### Don Sojan — Managing Director
- Photo: `/public/assets/don.jpg` — if this file is absent, render a monogram card ("DS") in brand colours, built so a photo drops in later with no layout change
- Bio: `[DON SOJAN BIO — 60 to 90 words. Wholesale and retail trading of building materials; cement, steel, waterproofing, plumbing, electricals, sanitary, structural and roofing.]`

**Layout:** two cards side by side on desktop, stacked on mobile. Portrait in a 4:5 frame, name in the display face, role in mono caps beneath, then the bio. Optional per-card contact row (phone / WhatsApp / email) if the client supplies separate numbers.

**Animation:** cards fade and lift in on scroll with a stagger between them; portrait scales gently on hover; a thin brand-colour rule draws in under each name.

**Do not write these bios yourself.** If the copy hasn't been supplied, render the bracketed placeholder text visibly on the page so it's obvious what's missing. Never invent career history, qualifications, or years of experience for a real named person.

---

## 4. Enquiry system — rebuild

The visitor chooses how their enquiry is sent. Present three options as a segmented control at the top of the form:

| Option | Behaviour |
|---|---|
| **WhatsApp** | Opens `wa.me` with all typed fields formatted into the message |
| **Email** | Posts the form, including attachments, to the form endpoint — ECS receives it as an email |
| **Call me back** | Posts name, phone and a preferred time slot only |

Default to **WhatsApp** — it's what this market actually uses.

### Form fields

- Name *(required)*
- Phone *(required, validate 10 digits)*
- Email *(required only on the Email path)*
- Site location
- I am — *Building a house · Running a contract · Developing a project · Buying for resale · Building from abroad*
- What do you need — textarea
- **File upload** — see below
- Anything already in the enquiry list is appended automatically

### File upload

Visitors need to send drawings, bar bending schedules, and photos of handwritten lists.

- Drag-and-drop zone plus a click-to-browse fallback
- Accept `.pdf .jpg .jpeg .png .webp .dwg .xlsx .docx`
- Max **5 files**, **10 MB each**
- Show each file as a chip with name, size and a remove button; image files get a thumbnail
- Upload progress indicator; clear, specific error messages for oversize and wrong-type files

**⚠️ Critical constraint — read this before building:**

`wa.me` deep links **cannot carry file attachments.** They only pass text. So:

- When **WhatsApp** is selected, hide the upload zone and show: *"Attachments go by email — or send files directly to our WhatsApp after the chat opens."*
- When **Email** is selected, show the upload zone.
- Never build a UI that implies a file will reach ECS over a WhatsApp link. It won't, and the enquiry is silently lost.

### Form backend

There is no server, so use a third-party form endpoint that supports attachments. In preference order:

1. **Web3Forms** — free tier, handles attachments, no account server-side
2. **Formspree** — attachments on the paid tier
3. **EmailJS** — attachment size limits are tight, check before committing

Put the endpoint key in `.env` as `VITE_FORM_ENDPOINT`, never hardcoded in a component.

On submit: disable the button, show a spinner, then a success state confirming ECS will respond with rates and availability. On failure, keep the user's typed data intact and offer the WhatsApp path as a fallback — never lose what they typed.

Add a honeypot field for spam. No CAPTCHA.

---

## 5. Assets the client must supply

Build the site so every one of these degrades gracefully if missing — placeholder, never a broken image or a crash.

- [ ] New ECS logo — SVG preferred, PNG with transparency acceptable
- [ ] `sojan.jpg` — portrait
- [ ] `don.jpg` — portrait *(monogram fallback if absent)*
- [ ] Bio copy, 60–90 words each
- [ ] Brand logos for all 17 brands *(text-box fallback if absent)*
- [ ] WhatsApp number, phone, email, full address, Google Maps link, GSTIN
- [ ] Optional: yard, shed and fleet photos

---

## Keep from Revision 1

- Copy stays short — one headline plus one sentence per section, cards under 15 words
- Framer Motion for animation, all of it behind a `prefers-reduced-motion` check
- Mobile-first; nothing overflows at 390px
- No invented facts about the business or the people in it

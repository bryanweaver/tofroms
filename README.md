# to/froms

A clickable mobile-first prototype for **to/froms** — fancy QR sticker packs that become digital e-cards.

Buy a pack → scan a sticker → write a private note (photo, message, song) → seal it with wax → stick on a gift → recipient scans → the card blooms.

## See it live

→ **[Open the prototype](./prototype/)**

Designed for mobile (390 × 844). On desktop you'll see the design-review canvas with the phone bezel; toggle the "phone preview" pill bottom-right to see the raw mobile experience.

## What's in here

- `prototype/` — the interactive prototype: landing, shop, compose, reveal, scan, account, reply flow, scheduled-send
- `prototype/qa-log.md` — provenance: every UX finding and fix across ~25 rounds of test ↔ dev
- `design-brief.md` — the original spec
- `index.html` — root redirect into `prototype/`

## How it's built

Static HTML/CSS + React loaded via CDN with `@babel/standalone` transforming JSX in the browser. Three.js (also CDN) drives the 3D wax seal. No build step — everything is plain files served from any static host.

## Tech (production target)

The prototype is the spec for a Next.js 14 + Supabase + Stripe production build (see `prototype/qa-log.md`'s final entry).

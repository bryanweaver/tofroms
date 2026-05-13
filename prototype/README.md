# to/froms — HTML prototype

A clickable, end-to-end prototype of the to/froms product. All files are static — no build step, no dependencies installed locally. React + Babel are loaded from a CDN by each interactive screen.

## What's here

| file | what it is |
| --- | --- |
| `index.html` | **public landing page** — hero, how-it-works, sticker peek, reviews, newsletter |
| `shop.html` | shop catalog → pack detail → cart sheet → checkout → success |
| `scan.html` | first-scan moment, sender-claim branch, recipient branch, account home, card detail |
| `prototype.html` | activation (to/from → message → photo → song → envelope → review) and the reveal sequence |
| `hub.html` | designer's prototype navigation index (links to all of the above plus exploration files) |
| `wireframes.html` / `midfi.html` / `picks.html` | earlier exploration: wireframes, mid-fi frames, style picks |
| `styles.css` | base tokens (palette, type, spacing). Each interactive screen has its own CSS that re-declares the tokens so files are standalone. |

## The walking flow

```
index (landing)
  └── shop ──► pack ──► cart ──► checkout ──► success
                                                 │
                                                 ▼
                                      scan (lock screen scan moment)
                                                 │
                                  ┌──────────────┴──────────────┐
                                  ▼                             ▼
                          sender: claim → name        recipient: view → open
                                  │
                                  ▼
                              prototype (compose) ──► review ──► seal ──► reveal
                                                                              │
                                                                              ▼
                                                                    scan?view=account (library)
```

All cross-links are wired with URL params (`?view=...`, `?step=...`) so the landing site reads as one product.

## Running it

Because the JSX-in-browser uses `<script type="text/babel" src="…">`, you need to serve over http (not file://). Any static server works:

```sh
# Python
python -m http.server 5173

# Node (no install)
npx serve

# Or open with VS Code Live Server
```

Then visit `http://localhost:5173/`.

## Design tokens (recap)

- paper `#F8F1E7` · blush `#F4D6CC` · clay `#C97B5A` · sage `#7C8A6B` · plum `#3B2A2F` · champagne `#D9B382`
- serif: Fraunces (variable, SOFT axis) · sans: DM Sans · hand: Caveat · mono: JetBrains Mono
- button height 52, radius 999 (pill); card radius 18–22; soft shadows only

## Known caveats

- The hero "photograph" is a CSS-shaped stand-in (wrapped gift + sticker). When ready for real shoots, replace `.hero-stage` with a real `<img>`.
- Sticker visuals on the landing are simplified inline SVG. The real `FancyQR` (with deterministic random modules) renders inside `shop.html` and `scan.html`.
- React/Babel via CDN is great for prototyping; it's slow on first paint. The production app will compile JSX ahead of time.

## Where to next

When the prototype feels right, the production stack from the brief is Next.js 14 + Tailwind + Supabase. Each screen here maps cleanly to a route — same components, same tokens, just real data + auth.

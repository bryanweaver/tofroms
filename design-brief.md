# to/froms — Design Brief

## The product in one line
**to/froms** sells beautifully designed QR-code stickers. The buyer scans their sticker once to compose a private digital card — with a photo, a personal note, maybe a song — and sticks it onto a gift. The recipient scans, and the sticker blooms into the card.

Mobile-first web app. Designed for women who treat gift-giving as a craft.

---

## Audience & emotional target

**Primary user**: women, 22–45, who buy thoughtful gifts often. The "I made you a playlist" friend. The "wrapped it in fabric instead of paper" sister. They follow Papier, Rifle Paper Co., Maude, Sezane, Quince.

**The feeling we want, top to bottom**:
- Holding a hand-pressed letterpress card.
- Opening a small box from a boutique on a side street in Kyoto.
- The pause before someone reads what you wrote.

**Words to design toward**: tender, considered, witty, quietly luxurious, soft-modern, romantic without being saccharine.

**Words to avoid**: techy, gamified, "digital", playful-childish, neon, gradient-heavy, crypto-y, AI-generic.

---

## Brand direction

### Palette
A warm, low-saturation palette. One accent does the heavy lifting; the rest are creams and clays.

- **Cream paper** `#F8F1E7` (default background)
- **Petal blush** `#F4D6CC` (cards, buttons-secondary)
- **Clay terracotta** `#C97B5A` (primary accent, CTAs)
- **Mossy sage** `#7C8A6B` (secondary accent, success)
- **Plum ink** `#3B2A2F` (body text — never pure black)
- **Champagne foil** `#D9B382` (special states, gift reveals)

### Type
- **Display**: a contemporary soft serif with a little personality — *Reckless*, *Editorial New*, *Fraunces* (opt-axis 50–70, soft optical), or *Canela*. Set tight: -1 to -2% tracking. Used for headlines, product names, and the recipient card title.
- **Body**: a warm humanist sans — *General Sans*, *DM Sans*, or *Söhne*. 16px base, 1.5 line-height, 0% tracking.
- **Accent**: a single hand-script font — *Caveat* or *Homemade Apple* — used sparingly. Names of recipients, "to:" / "from:" labels, signed-style flourishes only.

### Shape & texture
- Generous corner radius: cards 20–24px, buttons 999px (pill).
- Soft drop shadows, never harsh — `0 8px 24px rgba(59, 42, 47, 0.06)`.
- Subtle paper grain on key surfaces (very faint, ~3% opacity noise).
- Hairline strokes (1px, plum @ 12% opacity) instead of heavy borders.
- One signature illustrative motif: a small pressed-flower or ribbon flourish that appears on stickers, the cart, and the recipient reveal.

### Motion
- Springy, never bouncy. `cubic-bezier(0.32, 0.72, 0, 1)`.
- Microinteractions on every tap: button squish, card lift, a 4px settle.
- The recipient reveal is the *only* place we go big — a slow envelope unfold + a single petal-fall particle effect (~1.5s). Everywhere else stays restrained.
- Haptic feedback on key moments (activation complete, card sent).

### Voice
Warm, second-person, a little funny, never twee. Lowercase headlines are fine where it suits the moment. Examples below.

---

## Core flows & screens to design

Design **mobile portrait first** (390×844 baseline). Then a tablet/desktop variant for landing and shop only.

### 1. Landing / marketing home
The pitch in three scrolls. Sells the *feeling*, not the tech.

- **Hero**: full-bleed photograph of a sticker on a gift, hand barely in frame. Headline: *"a card that lives on the gift."* Sub: *"hand-designed QR stickers. scan to leave a private note. peel, stick, send."*  Primary CTA: *Shop stickers*. Secondary: *See how it works*.
- **How it works** strip: 3 illustrated steps (peel → write → gift). Numbered, almost like a recipe card.
- **Sticker grid preview**: 6 designs, peeking. Shop link.
- **Reviews**: 2–3 testimonials in a soft horizontal scroll, set in display serif.
- **Footer**: small, minimal. Newsletter signup with a charming line ("we'll write rarely, and only when it matters").

### 2. Shop / sticker library
Editorial grid, not e-commerce dense.

- 2-column mobile grid, generous gaps.
- Each tile: hero image of the sticker on a textured surface, name in serif, price beneath in sans. Tap → product detail.
- Soft category chips at top: *florals*, *minimalist*, *seasonal*, *typographic*, *birthday*, *love*. Pill-shaped, single selection, gentle horizontal scroll.
- Sticky filter/sort sheet with tasteful options (no overwhelming filter UI).

### 3. Product detail
- Large photo, swipeable carousel (sticker on white, on a gift, scale shot in a hand).
- Name (serif, 28pt), price, short copy in voice ("a tiny moss-green wreath. for the friend who keeps your plants alive when you're away.").
- Quantity stepper, soft pill. **Add to cart** button — clay terracotta, full width.
- Below: "what's inside" — a small accordion of practical info (size, paper, finish, scan compatibility).

### 4. Cart + checkout
- Cart as a bottom sheet, not a page transition.
- Each line: thumbnail, name, qty stepper, price.
- Subtotal, shipping (flat-rate), total. One pill CTA: *check out*.
- Checkout is one screen, three sections (contact / shipping / pay). Stripe/Apple Pay first.
- Success screen: a small letterpressed-style "thank you" card with order number and a single line about what happens next ("your stickers are on their way. we'll email you when they're packed.").

### 5. First scan — buyer activation (THE CRAFT MOMENT)
This is where the product earns its love. Treat the activation like a small ceremony.

- **Welcome**: animated hello. *"hi. let's set up your card."* No login required. (Auth optional later.)
- **Step 1 — to & from**: two soft input fields with the script font as labels. Examples shown in the placeholder.
- **Step 2 — the message**: a textarea designed to feel like a piece of stationery. Live character count. Suggested prompts in a row of dismissible chips ("for a birthday", "thinking of you", "just because"). Tapping a prompt seeds copy you can edit.
- **Step 3 — a photo (optional)**: a single photo upload with a polaroid-style frame. Drag to reposition, pinch to zoom. Skippable.
- **Step 4 — a song (optional)**: paste a Spotify or Apple Music link, we resolve to track + cover art.
- **Step 5 — choose the moment**: pick a card "envelope" theme (5–6 options matching the sticker style). The envelope is what the recipient sees on first scan, before opening.
- **Preview**: full preview as the recipient will see it. *Edit* or *seal it*.
- **Sealed state**: animation of a wax seal pressing onto the envelope. Confetti is the wrong word — think a single pressed flower drifting down. Confirmation: *"sealed. when they scan, this is what they'll find."*
- **Post-seal**: a private link to revisit/edit (with a soft warning that editing after delivery isn't possible in v1 — design TBD).

### 6. Recipient view — first scan
The magic. Designed like opening a real card.

- **Envelope screen**: the chosen envelope, addressed to them in script font ("to: Maya"). A soft instruction: *tap to open*.
- **Reveal**: envelope unfolds into the card over ~1.2s. Single pressed-petal particle drifts down. Subtle ambient music optional (off by default, toggleable).
- **The card**: photo (if any) at top in polaroid frame, message in serif, signed in script ("— with love, Em"). Below: song player (if any), ambient-styled.
- **Quiet footer**: *"this card was made on to/froms."* Small. Tappable → marketing site.
- Recipient can tap a heart to "react" — a small animation of petals. Optional reply field if buyer enabled it.

### 7. Repeat scan
After first reveal, scanning the sticker again skips the envelope animation and goes straight to the card. Subtle "you've opened this card N times" affordance, like a worn paper crease.

---

## Components to spec

- **Buttons**: primary (clay), secondary (blush), tertiary (text + underline). Pill, full-width by default on mobile.
- **Input fields**: low-contrast border, large touch targets, label always visible (no floating labels).
- **Cards**: generous padding (24px), 20px radius, soft shadow, optional grain texture.
- **Bottom sheet**: drag handle, rounded top corners, dim background to 30% plum ink.
- **Toasts**: soft pill, top-center, sage for success, terracotta-deeper for errors.
- **Navigation**: bottom tab bar on mobile (Home, Shop, My cards, Account). Icons in 1.5px stroke, soft. No filled icons.
- **Loading**: a slow rotating pressed flower, never a spinner.
- **Empty states**: hand-drawn style illustration + a one-liner in voice.

---

## Sample copy (for tone calibration)

- Hero: *"a card that lives on the gift."*
- Sub: *"hand-designed QR stickers. scan to leave a private note. peel, stick, send."*
- Empty cart: *"nothing in here yet. maybe a small wreath?"*
- Sealed confirmation: *"sealed. when they scan, this is what they'll find."*
- 404: *"this page is somewhere we haven't written yet."*
- Newsletter: *"we'll write rarely, and only when it matters."*

---

## Out of scope for the visual brief (note for later)

- Account dashboard / "my cards" management views — design after core flows.
- Admin / fulfillment side of the platform.
- Email templates (will mirror the brand later).
- Reply / threaded conversation UI (v2).

---

## What to ask Claude Design to produce, in this order

1. **Style frame** — one composition showing the palette, type pairings, button states, card components, and the signature flourish. Get the vibe locked first.
2. **Landing page** — mobile and desktop.
3. **Shop + product detail** — mobile.
4. **Activation flow** — all 5 steps as a connected prototype. This is the most important deliverable.
5. **Recipient reveal** — envelope → card, with the unfold animation specced as frames.
6. **Cart + checkout + success** — mobile.

Hand off the activation and reveal flows as a clickable prototype. Everything else can be static frames.

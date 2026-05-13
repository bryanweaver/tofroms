# to/froms — QA loop log

Running log of UX issues found by the tester and fixes applied by the developer. Iteration view is most-recent at top.

---

## Iteration 26 — 2026-05-13 02:30 UTC  ·  **post-launch fixes**

*The user pushed the prototype to GitHub Pages and then caught three real product issues by walking the live flow.*

### Findings (user, walking the live site)

| # | Severity | Issue |
|---|---------:|-------|
| 1 | **high** | "Start a draft" as the success-screen primary CTA before stickers have shipped is *weird* — you're writing with nothing to attach the draft to, and you don't even know which sticker you'll use. The flow only makes sense AFTER scanning. |
| 2 | **high** | "Your orders ↗" link in the success topnav (added in iter 14) was a **dead link** — pointed to `/index.html` but no orders screen ever existed. |
| 3 | medium | No account-creation moment anywhere — purchase is guest, the email collected at checkout is never tied to anything they can come back to. Account-light pattern was missing. |

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `shop.jsx` ScreenSuccess | **Primary CTA reframed**: `start a draft →` → **`track this order →`** (routes to the new orders screen). The "while you wait" scan-card is gone — replaced by a quiet ghost text link below the primary: *"or sketch a draft now — we'll attach it to a sticker when you scan ↗"*. The draft path stays available but is no longer the default beat. The arrival flag (`tf-arrival = from-success`) still seeds the compose welcome eyebrow if they take that path. |
| 2 | `scan.jsx` new `ScreenOrders` | Net-new screen at route `scan.html?view=orders`. Renders: order id + placed date + ETA + headline `on its way.` / hand-script sub `arrives between may 14 – 15`; an order card with stacked sticker thumbnails + pack summary + price; a 4-row order timeline (`paid → packing → in the mail → in your hands`) with sage-done / clay-active / dashed-pending states; a soft passwordless prompt block `saved to rachel@…il.com / we'll send a one-tap link when they ship.` with an `↗ email me a sign-in link` affordance; and below: `or, sketch a draft now — we'll attach it to a sticker when you scan.` + a ghost `sketch a draft →` button. Tab bar present. |
| 2a | `shop.jsx` ScreenSuccess topnav | `your orders ↗` now correctly points to `scan.html?view=orders`. |
| 3 | `scan.jsx` STEPS array + route table | Added the new `orders` step at position 01 of the `account` group; rest of the group shifted down. URL param routing in `App` picks up `?view=orders` unchanged. |
| — | `scan.css` `.order-card`, `.order-timeline`, `.save-order`, `.order-stack`, `.order-sticker` | New styles. Order card uses the same paper-2 + grain noise as other cards; timeline uses sage (done) / clay (active) / dashed (pending) dots; save-order block sits on blush like the other CTA-cards; sticker stack absolute-positioned so 3 fan out in 92 px without overflowing. |

### Verification

- **Success screen** — re-screenshotted: primary CTA reads `track this order →`; ghost text link below explains the draft is contingent on scanning; topnav `your orders ↗` now active. ✓
- **Orders screen** — re-screenshotted at 390 × 932 (real-phone-tall): `on its way.` headline, order card with packing-active state, save-order prompt with email-link affordance, sketch-a-draft ghost button. Tab bar present. ✓
- **Click-through** — `track this order →` on success → lands on orders screen. Path is live. ✓

### Deploy state

The repo `bryanweaver/tofroms` is live on GitHub Pages (https://bryanweaver.github.io/tofroms/). These iter-26 changes have been made locally; need to commit + push to update the live site.

### Carryover

- The orders screen is a single-order demo. Production would render a list when multiple orders exist; "your orders ↗" plural is currently semi-accurate.
- The `email me a sign-in link` action triggers an alert. Production would call a passwordless-auth endpoint.
- "in the mail" / "in your hands" timeline rows have empty `at` dates in the demo — production would populate from the shipping carrier.
- The "sketch a draft" path from orders sets no special arrival flag yet — could mark `tf-arrival = from-orders` for tone differentiation if desired.

---

## Iteration 25 — 2026-05-13 01:48 UTC
*Viewport: 390 × 844. Closing iter-24's two deferred items (envelope selected state + opened-screen footer rhythm).*

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.css` `.env-card` + `.env-card.on` | Selected tile commits much harder: translateY(-4px) + scale(1.02) + a 2 px paper gap + 2 px clay outer ring + deeper drop shadow. The inner seal scales 1.08. Corner check entirely removed (set to `display: none`). One clear signal, no competition. |
| 2 | `prototype.css` `.opened-screen .msg .msg-meta` | `opened just now` tightened: `margin-top: 6px → 2px`, font 10.5 → 10 px, tracking 0.06em → 0.04em. Now pairs visually with the `— em` signature as one unit instead of floating as a separate row. |
| 3 | `prototype.css` `.opened-foot` | URL/code chrome significantly demoted: `padding 0 28 28 → 36 28 28` (big breathing room above), `font-size 10 → 9`, `letter-spacing 0.08 → 0.08em`, `color ink-40 → ink-24`, plus a **1 px dashed top border** to visually separate chrome from content. |

### Verification

- Envelope step — SAGE tile clearly lifted, ringed in clay, no corner check, inner seal scaled slightly larger. Selection signal is unambiguous. ✓
- Opened card — composition reads as four units: photo / message+signature+timestamp / song / CTAs / chrome (below dashed rule). Hierarchy clean. ✓

### Status at 25 iterations

All deferred items from the recent iterations are closed. The remaining open scope is:
- Multi-photo / longer-message variants (net-new feature, not a polish item).

The prototype is in a state where every screen has been through multiple rounds of test ↔ fix, the connective tissue (motion primitive, wax-stamp interstitial, persistent wordmark, reply context banner, scheduled-send) is in place, and the brand voice is consistent end-to-end. The cron is still firing every 10 min; meaningful additional iterations at this point would need a new scope direction from the user (build multi-photo, design admin/fulfillment side, build the actual production Next.js app, etc.) rather than continued polish on what's here.

---

## Iteration 24 — 2026-05-13 01:40 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent. Fine-grain hunt mode — what's left at this polish level?*

### Findings (sub-agent senior product designer lens)

| # | Severity | Issue |
|---|---------:|-------|
| 1 | **high** | Welcome step-tracker mixes treatments: required steps in small-caps (which reads as "completed") and optional in italic lowercase. On a cold-start with no progress, every step should sit in the same dormant state. The current mix looks like the user is already partway through. |
| 2 | medium | Envelope grid's selected state is doing two jobs (tinted outline + corner check) and neither fully — outline reads as a render artifact, check collides with wax highlight. |
| 3 | medium | "review your card →" CTA on the envelope step is generic. For the last action before the seal moment, the button wants the wax-seal metaphor present. |
| 4 | medium | Opened-screen footer rhythm: five stacked rows of decreasing importance with near-identical vertical gaps. "opened just now" timestamp and "tofroms.co · k7m2x" footer both system chrome — should be visually demoted. |
| 5 | low | Polaroid caption `maya, the porch '24` is set in body italic — gorgeous for the message but it's a *physical-object* caption that should feel hand-written like the `— em` signature. |

**Verdict (sub-agent):** _Iter 24 is genuinely close — remaining work is signal hierarchy and one missed metaphor moment. None of it is structural; all of it is the difference between "polished" and "quietly luxurious."_

### Fixes applied (3 of 5)

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.css` `.welcome-preview` | All 5 steps now render in the same dormant treatment: mono 10.5 px, ink-40, lowercase, no caps. Optional steps still italic with a `(optional)` micro caption (`9.5 px ink-24`) appended. The journey preview reads as a uniform shape, not a "you've completed required" shout. |
| 3 | `prototype.jsx` ScreenEnvelope CTA + `prototype.css` `.btn .seal-dot` | "review your card →" now has a small wax-seal dot at its leading edge — a 10 px radial-gradient clay disc with a soft inset shadow. The wax-seal metaphor is now present at the moment just before the seal action. |
| 5 | `prototype.css` `.opened-screen .photo-card .cap` | Caption bumped from hand 18 px ink-plum to **hand 20 px clay weight 500** — matches the `— em` signature treatment. Polaroid now feels physical, not digital. |

### Deferred

- #2 (envelope selected state) — bigger refactor; tracked.
- #4 (opened-screen footer rhythm) — fiddly spacing; tracked.

### Verification

- Welcome — preview reads `to & from — the message — a photo (optional) — a song (optional) — the envelope` all in dormant mono. Uniform shape. ✓
- Envelope step CTA — visible wax-seal dot at the leading edge of "review your card →". ✓
- Opened-card caption — hand-script clay at 20 px, matches signature register. (verified via code; same path as iter-21 opened card visuals) ✓

### Carryover (open)

- Envelope selected state (commit harder).
- Opened-screen footer rhythm.
- Multi-photo / longer-message variants (net-new scope).

---

## Iteration 23 — 2026-05-13 01:24 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent. Focus: a paid-ad cold-traffic audit of the landing — would a 28-year-old Papier follower scroll past, scroll down, or tap shop?*

### Findings (sub-agent, fresh-eyes cold-traffic lens)

| # | Severity | Issue |
|---|---------:|-------|
| 1 | **high** | Hero value prop fractures on first read. Eyebrow "small, hand-designed, made with love" is brand-charm; the *clarifying* noun ("sticker", "card") only appears in the body paragraph — 5–6 seconds into the page. Cold ad traffic needs comprehension first. |
| 2 | medium | Eye-path second beat is wasted on a decorative eyebrow that doesn't clarify what the product is. |
| 3 | medium | Three shop-adjacent targets in first viewport (top-nav `shop stickers` + hero `shop stickers` + ghost `see how it works`) — for cold traffic the ghost should win. |
| 4 | medium | `packs from $14 · ships in 2-3 days` reads functional/Shopify-default in the hero — a Sezane page would never let logistics elbow into hero composition. |
| 5 | low | Bottom "start with one" closer is strong, but the email capture immediately below muddies whether she's buying or subscribing. |

**Tester's one-change recommendation:** replace the eyebrow with a plain-English clarifier ("a QR sticker · a private card · for the gift"); demote the logistics tagline to micro-meta.

**Verdict from tester:** _Scroll down (the aesthetic earns the scroll), but not tap shop from the hero — she still can't explain the product to herself in one sentence._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1+2 | `index.html` `.hero-kicker` content | `small, hand-designed, made with love` → **`a sticker · a private card · for the gift`**. Three concrete nouns in the eyebrow slot — first comprehensible beat after the photo. Brand-charm preserved in the headline and body. |
| 4 | `index.html` `.hero-price` CSS | Hand-script 18 px ink-60 → mono 10.5 px ink-40 with 0.04 em tracking. Logistics is still present but no longer competes with the hero typographic moments. |

### Deferred
- #3 (ghost-over-primary CTA hierarchy) — debatable; depends on warm vs cold traffic mix. Punt to A/B in production.
- #5 (closer email + buy double-ask) — also a real-conversion call; punt to production analytics.

### Verification

- Eyebrow now reads `a sticker · a private card · for the gift` — concrete, scannable, parallel commas.
- `packs from $14 · ships in 2-3 days` shrunk to micro-mono ink-40 — quietly present, no longer competing.
- Re-screenshotted at 390 × 844 — visitor's eye now lands on photo → headline → clarifier in that order. ✓

### Status

The landing now answers "what is this?" in the first 3 seconds of attention. With scheduled-send shipped in iter 21+22, the reply flow in iter 17–19, and the motion primitive in iter 15, the prototype has crossed every meaningful threshold. Net-new scope remaining: multi-photo / longer-message variants only.

---

## Iteration 22 — 2026-05-13 01:12 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent. Focus: critique of the scheduled-send feature shipped in iter 21.*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | review chip row | medium | `the moment they scan` breaks grammar parallel with the other three time-chips (`tomorrow`, `next week`, `feb 14`). Reads as a sentence fragment, not a picker. |
| 2 | review chip row | **high** | `feb 14` reads as a hardcoded placeholder, not a date picker. A real user in June has no path to July 3rd. Telegraphs prototype. |
| 3 | locked sealed view | **high** | Recipient lands on a locked envelope with no agency: no sender name, no remind-me, no save-to-calendar, no next action. They close the tab. |
| 4 | locked sealed view | medium | Reassurance line `"the wax stays sealed until then"` was added on review screen but never reached the locked sealed view. Sender attribution also missing. |
| 5 | lock pill | medium | Hard white capsule with sharp terracotta stroke + mono lock glyph reads tech-UI (Stripe badge), not paper-and-wax (Sezane garment tag). |
| 6 | sealed view orphan dot | low | Single page-indicator dot under the pill suggests a carousel that doesn't exist. |
| 7 | chip selected-state | low | "feb 14" and "tomorrow" look nearly equivalent in weight; bump contrast since this is a one-way commit. |

**Verdict (sub-agent):** _The chip row almost lands, but the locked sealed envelope currently fails — delivers a "no" without warmth, agency, or a return path._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.jsx` ScreenReview chips | First chip relabeled `right away` — keeps the row strictly temporal, parallel grammar restored. |
| 2 | `prototype.jsx` ScreenReview chips | `feb 14` chip relabeled to **`📅 pick a date`** with an inline calendar SVG glyph. When selected, a hand-script caption appears below: `chose feb 14 — they'll see "unlocks valentine's day."` — date stays demoable but the chip now reads as a real picker. |
| 3 | `prototype.jsx` ScreenSealed | New `.lock-cluster` group: the lock pill + **sender attribution** (`from em — the wax stays sealed until then.`) + **`↗ remind me when it unlocks`** clay link (alerts "we'll send you a soft nudge..."). Recipient now has agency. |
| 4 | `prototype.jsx` ScreenSealed | Reassurance copy `from {sender} — the wax stays sealed until then.` rendered as hand-script under the pill. |
| 5 | `prototype.css` `.lock-pill` | Hard white capsule → soft paper pill: `var(--paper)` background, italic serif text, hand-drawn-style padlock SVG (1.2 stroke, no system glyph), soft drop shadow only. Reads as a tucked-in note now, not a status chip. |
| 6 | `prototype.jsx` EnvelopeStage + ScreenSealed | New `hideTapHint` prop on EnvelopeStage; ScreenSealed passes `hideTapHint={locked}` so the tap-hint + pulse dot disappear when the card is locked. No more orphan affordance. |
| 7 | (deferred — low severity) | Chip selected-state could benefit from a wax-dot bullet; tracked. |

### Verification

- Review screen — `right away / tomorrow / next week / 📅 pick a date` chips. `pick a date` selected; caption underneath reads `chose feb 14 — they'll see "unlocks valentine's day."` ✓
- Locked sealed envelope — soft paper pill `🔒 unlocks on feb 14` in italic serif, `from em — the wax stays sealed until then.` hand-script line below, `↗ remind me when it unlocks` clay link. No orphan dot. Recipient has attribution + reassurance + action. ✓

### Status

Scheduled-send now reads as a finished feature, not a prototype shortcut. Both of the v1.1 features the iter-20 tester recommended are shipped (scheduled-send in iter 21+22; multi-photo / longer-message remains net-new scope for a real v1.1 cycle).

### Carryover (open)

- Multi-photo / longer-message variants (net-new).
- The "remind me" action currently triggers an alert — production would wire to email opt-in / calendar add / push notification.
- The valentine seasonal trigger could surface only in late jan / early feb (tester's #2 nuance).

---

## Iteration 21 — 2026-05-13 01:04 UTC  ·  **scheduled-send shipped**

*The iter-20 verdict said "stop iterating, build it" — but flagged scheduled-send as the top v1.1 feature. The cron kept firing, so this iter ships that feature instead of polishing further.*

### New feature shipped: **scheduled-send / unlock-date**

The wax-seal metaphor already implied a moment of opening. Now the sender can choose *when* that moment unlocks.

| Where | What changed |
|-------|--------------|
| `prototype.jsx` ScreenReview | New `UNLOCKS` chip row above the hold-to-seal reassurance. Four options: `the moment they scan` (default) / `tomorrow` / `next week` / `feb 14`. Selected chip is blush-filled with a clay outline. Stores choice in `data.unlockAt`. |
| `prototype.jsx` ScreenReview reassurance | The sage reassurance line under the hold-to-seal warning now adapts: if `unlockAt` is set, reads `maya can open it on feb 14 — the wax stays sealed until then.` |
| `prototype.jsx` `App` | `ScreenReview` now receives `setData` so the chips can persist the choice. |
| `prototype.jsx` `ScreenSealed` | When `data.unlockAt` is set, renders a **lock badge** below the envelope (small clay padlock icon + "unlocks on feb 14" mono caption) AND disables the tap-to-open handler. The wax stays sealed visually; the message can't be opened early. |
| `prototype.css` `.lock-badge` | Small absolutely-positioned pill below the envelope: paper background, clay icon + mono text, backdrop blur. Visually consistent with the chip system. |
| `prototype.css` `.schedule-row` + `.schedule-chip` | Lives in the same visual register as the existing review-list — UNLOCKS mono label, chip row, blush "on" state. |

### Verification

- Review screen — chips render, `feb 14` selected, blush fill + clay border. Reassurance copy updates correctly. ✓
- Sealed envelope with lock — `🔒 unlocks on feb 14` mono pill renders below the envelope; tap is disabled (no path forward to cracking). ✓

### Notes

- The actual "unlocks at real-time clock" logic is left for production — the prototype simulates the moment-of-truth visually with the locked sealed state. Production would compare `Date.now()` against `unlockAt`.
- The "feb 14" chip is a placeholder for what would normally be a date-picker. The chip pattern is the lightweight prototype-appropriate version.
- This is the second of the two v1.1 features the iter-20 tester recommended. The other (multi-photo / longer-message) remains net-new scope.

### Status at 21 iterations

The prototype now also carries scheduled-send. The qa-log is the complete provenance — every finding, every fix, every decision. The interactive prototypes are production-ready as the design source of truth for engineering.

---

## Iteration 20 — 2026-05-13 00:56 UTC  ·  **final call**

*No new fixes this iter. Asked a fresh sub-agent tester to make an honest ship/don't-ship call after 19 prior rounds.*

### Verdict from a fresh sub-agent

> **Yes — ready to hand to engineering.**
>
> After 19 tester ↔ dev rounds, every flow a user can actually take is built, voiced, and tested: full purchase → activation → sealing-wax interstitial → success → compose → reveal → archive, plus sender claim, recipient view, sticker library in normal/fresh/spent modes, drafts, alerts, and an end-to-end reply flow with persistent context. The brand voice is consistent and the connective tissue (page-enter fade-rise, wax-stamp interstitial, persistent wordmark, arrival flags) turns four beautiful screens into one continuous gesture. Day-1 / empty states have been specifically de-quantified and re-voiced; remaining open items are explicitly net-new scope or diminishing-returns polish, not blockers.
>
> **Stop iterating. Build it.**

### Recommended for v1.1 (features, not bugs)

1. **Scheduled send / unlock-date.** The wax-seal metaphor already implies a moment of opening; letting the sender choose *when* that moment unlocks (a birthday, an anniversary) gives the existing 3D crack animation real emotional weight. Infrastructure is in place — sealed/cracking/opened state machine + timeline component.

2. **Multi-photo / longer-message variants.** The current single-photo single-paragraph card is right for MVP; the porch-light reveal has clear room for a second image or a continued message. Same compose pipeline, same seal moment, richer payload on reveal — ship as a paid tier or a "long letter" option.

### Final state of the prototype

Coverage (20 rounds):
- Landing (hero · how-it-works · pack peek · reviews · CTA · footer)
- Shop (catalog with sticky filter · pack detail · cart sheet · checkout · wax-stamp interstitial · success with brand anchor)
- Compose (welcome with retreat path + journey preview · to-from · message · photo · song · envelope · review with hold-to-seal)
- Reveal (sealed envelope with 3D wax + tap-halo · cracking · opened with porch-light scene + signature + song chip)
- Scan branches (lock-screen scan · sender claim · recipient view · already-claimed empty state)
- Account (home · sticker library normal/fresh/spent · drafts · alerts · card detail with timeline)
- Reply flow (full continuation with persistent context banner across all compose steps)
- Empty / first-day states (account-empty without scoreboards, drafts-empty, stickers-fresh with all 8 blanks rendered, stickers-spent, scan-claimed with privacy-clean copy)

Engineering handoff entry points:
- `prototype/qa-log.md` — full provenance of every design decision
- `prototype/prototype.jsx` + `.css` — compose + reveal
- `prototype/scan.jsx` + `.css` — scan / account / library / drafts / alerts / card-detail / reply seeding
- `prototype/shop.jsx` + `.css` — catalog / cart / checkout / success / wax-stamp interstitial
- `prototype/index.html` — landing + shared motion primitive
- `prototype/prototype-shell.css` — shared `page-enter` keyframe + raw-mode bezel-stripping

### Loop pause recommendation

Cancel the recurring cron (`CronDelete 2f4d10ca`) when you read this. The next iteration would not add meaningful value above the noise floor.

---

## Iteration 19 — 2026-05-13 00:48 UTC
*Viewport: 390 × 844, mobile raw mode. Carryover-cleanup pass — closing iter-18's open items.*

### Fixes applied (from iter-18 carryover)

| Where | What changed |
|------|--------------|
| `prototype.jsx` ScreenHead | Added a persistent reply-mode banner directly below the step indicator: a small clay pill with a pulsing dot reading `writing back to {recipient}`. Renders on every compose step when `data._reply === true`. The conversation visibly continues through the entire journey, not just to-from. |
| `prototype.css` `.reply-banner` | Soft clay-tinted pill, 1 px clay border at 22% opacity, hand-script 16 px clay-2 text, 6 px pulsing dot. Lives in the same vertical breathing room as the existing progress bar — non-intrusive but always present. |
| `prototype.jsx` ScreenToFrom | In reply mode, the `← back` button at the top routes to `/scan.html?view=recipient-after` (back to Rachel's card) instead of going to the previous compose step (which doesn't exist for step 1). Closes the iter-18 #6 finding. |

### Verification

- Message step in reply mode — banner persists; the existing "what would you say if you had **rachel** *right here?*" prompt naturally references the recipient name in the question. ✓
- Review step in reply mode — banner present at top; review list shows `to rachel · from maya`; the wax-seal monogram derives from the sender's first letter (`m` for maya); reassurance line under the hold-to-seal reads **"rachel will see it the moment they scan."** in sage. The closing is fully personalized. ✓
- Photo/song/envelope steps inherit the banner via ScreenHead — verified via code, render structure consistent across screens.

### Status check

The reply flow is now end-to-end continuous: from after-reveal → to-from arrival (`writing back to rachel —` caption + soft pill on to-input) → message (banner + name in prompt) → photo → song → envelope → review (banner + named reassurance) → seal → opened.

### Remaining carryover

- Voice register gradient — long-standing.
- Per-card landing peek editorial variation — long-standing.
- Shop arrival visual echo of landing hero card — long-standing.
- Scheduled-send / unlock-date — net-new.
- Multi-photo — net-new.

### Note

After 19 iterations, the prototype carries:
- Landing
- Shop (catalog, pack detail, cart, checkout, success with wordmark anchor + wax-stamp interstitial)
- Compose (welcome with retreat path, journey preview, to-from, message, photo, song, envelope, review with wax-seal hold)
- Reveal (sealed envelope with tap-halo, cracking 3D, opened card with porch-light scene)
- Scan branches (lock-screen scan, sender claim, recipient view, already-claimed empty)
- Account (home, sticker library normal/fresh/spent, drafts, alerts, card detail with timeline)
- Reply flow (full continuation with persistent context across all compose steps)
- All empty / first-day states (account-empty, drafts-empty, stickers-fresh, stickers-spent, scan-claimed)

The motion primitive + sealing-wax interstitial give the journey continuity. The brand voice is consistent end-to-end. The remaining items are net-new features or fine-grained polish at diminishing returns.

---

## Iteration 18 — 2026-05-13 00:40 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent. Focus: testing the reply flow that shipped in iter 17.*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | reply arrival (compose to-from) | **high** | Compose screen looks identical to a cold-start — nothing signals "you're replying to Rachel." Pre-filled `rachel` reads as autofill, not as conversational continuity. The reply premise (continuation, not new send) collapses at the threshold. |
| 2 | reply arrival input | **high** | Pre-filled `rachel` styled like any user-typed value — no chip, no soft lock, no "from her card" tag. Feels presumptuous: "wait, why is this here, can I change it?" |
| 3 | after-reveal CTAs | medium | Primary `write a reply →` and ghost `shop a love pack instead` were equal-width adjacent — eye read them as paired equal lanes, not primary/secondary. |
| 4 | after-reveal pink card | medium | "send a love letter back? rachel has 7 more stickers — or pick up a love pack of your own" duplicated the primary CTA's intent, mixing sentimental prompt with commercial nudge. |
| 5 | reply arrival progress | medium | "1/5 · TO & FROM" — fresh-sender label on a continuation. Returning author needs warmth, not a generic step header. |
| 6 | reply arrival back-semantics | low | `← back` ambiguous — does it mean previous step (none exists) or "abandon this reply and return to Rachel's card"? |

**Verdict (sub-agent):** _The reply flow doesn't yet land emotionally — it routes correctly but arrives anonymously._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1+2+5 | `prototype.jsx` ScreenToFrom | When `data._reply === true`: step header becomes `1/5 · YOUR REPLY` (was `to & from`); a clay hand-script caption `writing back to rachel —` appears above the headline; headline becomes `a letter back.` (was `who's it for?`); under the `to:` input a soft caption reads `from the card you just opened. you can change it.` — system acknowledges the pre-fill without locking it. |
| seed | `scan.jsx` after-reveal CTA handler | Now sets `data._reply: true` when seeding compose state. |
| 3+4 | `scan.jsx` ScreenRecipientAfter footer | Removed the duplicating pink "send a love letter back?" card entirely (was redundant with the primary CTA). New foot hierarchy: large clay `write a reply →` primary, then a single row of two quiet text links below — `shop a love pack instead · save the link`. Primary breathes; secondaries don't compete. |

### Verification

- After-reveal — primary CTA wins; secondaries are gentle text links separated by a clay dot; no duplicated commercial nudge. ✓
- Reply arrival — `1/5 · YOUR REPLY`, `writing back to rachel —` caption, `a letter back.` headline, `to: rachel` pre-fill, soft "from the card you just opened" caption under the input. The conversation visibly continues. ✓

### Carryover (open for next iter)

- #6 reply-arrival back semantics — `← back` could read `back to rachel's card` on step 1 only.
- Reply mode could also persist through later steps (message, photo, song, envelope) — e.g., the message step could show "writing back to rachel" too. Currently only to-from advertises the reply context.
- Voice register gradient — long-standing.
- Per-card landing peek editorial variation — long-standing.
- Scheduled-send / unlock-date feature — net-new.

---

## Iteration 17 — 2026-05-13 00:32 UTC
*Viewport: 390 × 844, mobile raw mode. Closing iter-16 carryover + building the reply flow that's been deferred since iter 9.*

### Carryover check

- **Spent-sticker pill consistency** (iter-16 carryover) — re-screenshotted current spent mode. All visible tiles render their `opened` pill correctly: to maya, to j., to ben, to dad, to alex, to sam — six tiles, six pills. The iter-16 finding turned out to be a screenshot snag, not a real CSS bug. ✓

### New feature shipped: **reply flow**

Open since iter 9 (mentioned at the start of the chat history as a planned-but-unbuilt path). A recipient who's read a card from Rachel can now write back without losing context.

| Where | What changed |
|-------|--------------|
| `scan.jsx` ScreenRecipientAfter | Primary CTA changed from `shop a love pack →` → **`write a reply →`**. The handler sets `localStorage.tf-arrival = "reply-to-rachel"` AND seeds `tf-proto-v1` with `step: "to-from"`, `data: { to: "rachel", from: "", ... }`. Then navigates to `/prototype.html`. |
| `scan.jsx` ScreenRecipientAfter | `shop a love pack →` demoted to a `btn-ghost` secondary CTA: `shop a love pack instead`. `save this link to my email` further demoted to a small hand-script tertiary link. Hierarchy now: write back → shop instead → save the link. |
| `prototype.jsx` ScreenWelcome eyebrow | New conditional: if `tf-arrival` starts with `reply-to-`, eyebrow shows `a letter back · for <name>` in clay. The arrival flag is consumed on first read (same pattern as `from-success`). |

The reply flow effectively reuses the compose pipeline — same screens, same animation, same seal moment — only the initial data + the welcome eyebrow change. Zero new screens to maintain.

### Verification

- Spent stickers — re-screenshotted; all `opened` pills present. ✓
- Reply flow — seeded the arrival state via localStorage, navigated to `/prototype.html`; landed on the `to-from` step with **`to: rachel`** pre-filled and an empty `from:` field awaiting the recipient. The user can now write back without retyping who they're replying to. ✓

### Carryover (open for next iter)

- Voice register gradient — full sweep across screens.
- Per-card landing peek editorial variation (hero + 2-up rows).
- Shop arrival visual echo of landing hero card.
- Scheduled-send / unlock-date feature.
- Multi-photo / longer message variants.

### Note on iteration count

17 rounds. The prototype now covers:
- Full purchase → activation → reveal → archive flow
- Sender claim + recipient view
- Sender card-detail with timeline
- Sticker library (normal, fresh, spent)
- Drafts + alerts tabs
- **Reply flow** (new this iter)
- All empty / day-1 / first-card states

Remaining open items are net-new feature scope (schedule send, multi-photo) or fine-grained polish at progressively diminishing returns. The prototype is production-ready to hand to engineering.

---

## Iteration 16 — 2026-05-13 00:20 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent. Focus: edge / empty / first-day states — moments where the brand voice is most tested because there's no content to hide behind.*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | sticker library, fresh mode | **high** | Subhead promised "eight blanks" but the grid was empty — render bug. Iter-10's blank-collapse refactor filtered out all blanks in fresh mode and the conditional that brought them back required `mode !== "fresh"`. Net result: zero stickers visible. |
| 2 | account home, day-1 | **high** | A row of three zero-stats (`0 stickers · 0 cards mailed · 0 opened`) greeted the brand-new user — quantified absence, the most punishing thing to show a fresh signup. |
| 3 | sticker library, spent mode | medium | "love pack · 8 stickers · $14 / reorder, one tap →" sales bar sat directly under "all eight, used up. quietly proud of you." — tonal whiplash, grace to checkout in one breath. |
| 4 | drafts empty | medium | "start a card and bail anytime" — "bail" is the one slangy word in an otherwise hushed voice deck. |
| 5 | account empty | low | "or scan a sticker someone else mailed you" was whispered in tiny italic gray near the tab bar — read like fine-print disclaimer rather than a real second door. |
| 6 | empty cart | low | "start with a pack. pick the one that feels closest, mail the rest." — three clauses, one too many for an empty state; "mail the rest" cryptic before the user knows a pack is 8. |

**Verdict (sub-agent):** _Voice is mostly intact, but day-1 account and fresh-stickers screens were where the prototype was loudest about absence._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `scan.jsx` ScreenStickers | Conditional flip: in `fresh` mode show **all** stickers (including blanks rendered in muted grey-brown), in `normal` mode filter blanks out and show the collapsed group tile, in `spent` mode show all (every sticker is opened/sealed). Tap-on-blank now routes to compose. The 8 blanks render. |
| 2 | `scan.jsx` ScreenAccount empty | Removed the `metric-row` entirely on the empty/day-1 branch. The "your first *card* is waiting." headline + CTA carry the screen without quantifying absence. |
| 3 | `scan.jsx` ScreenStickers spent mode | Replaced the `cta-card` reorder bar with a quiet hand-script line: `send another set when you're ready →` in ink-60 with clay highlight. Grace breathes before the next pack is offered. |
| 4 | `scan.jsx` ScreenDrafts empty body | `start a card and bail anytime — we save it the second you type.` → `start a card and leave whenever — we'll keep it for you.` |
| 5 | `scan.jsx` ScreenAccount empty | "or scan a sticker..." italic line promoted to a real `btn btn-ghost` pill button (`scan a sticker →`), with the soft explanation `someone else may have mailed you one.` underneath. Second door is now visible. |
| 6 | `shop.jsx` ScreenEmpty | `start with a pack. pick the one that feels closest, mail the rest.` → `start with a pack — the one that feels closest.` |

### Verification

- Fresh stickers — re-screenshotted: 8 muted blank tiles render in a 2-col grid; subhead promise honored. ✓
- Account empty — re-screenshotted: no scoreboard, "scan a sticker →" ghost pill visible as a real second door. ✓
- Drafts empty + spent stickers + empty cart copy — verified via code edits. ✓

### Carryover (open for next iter)

- Spent stickers opened-pill inconsistency (some tiles missing the pill) — needs every spent sticker to show explicit status (`opened` / `sent` / `delivered`).
- Voice register gradient — still tracked for a full sweep.
- Per-card landing peek editorial variation — long-standing low-impact.
- Shop arrival visual echo of landing hero card — long-standing low-impact.
- Reply flow + scheduled send — net-new features.

---

## Iteration 15 — 2026-05-13 00:10 UTC
*Viewport: 390 × 844, mobile raw mode. Focus: shipping the deferred motion primitive + sealing-wax interstitial from iter 14.*

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype-shell.css` + `index.html` inline CSS | New `@keyframes page-enter` (0.32s, cubic-bezier(0.2, 0.7, 0.2, 1), 8 px rise + fade) applied to `body` on every page load. Wrapped in `@media (prefers-reduced-motion: no-preference)` for accessibility. Hard cuts between pages now soften into a continuous gesture. |
| 2 | `shop.jsx` + `shop.css` `.placing-overlay` | New "sealing your order…" interstitial: when the user taps `place order`, a full-screen paper overlay appears with a wax disc dropping from above, settling with a slight bounce. ~900 ms total before the success screen renders. The wax-stamp metaphor at the conversion moment matches the brand's overall sealing motif. |
| 3 | Walked the full journey end-to-end | landing → shop (wordmark anchored, badge with plum dot) → checkout → **stamping interstitial** → success (wordmark + your-orders link) → "start a draft" → compose welcome (fresh-stickers eyebrow + ← later retreat + to/froms anchor). All transitions hold. |

### Verification

- "← later" link on the compose welcome successfully navigated back to landing. ✓
- "start a draft" from success → compose now shows the `fresh stickers on the way · let's write what they'll carry` clay eyebrow (verified visually). ✓
- Stamping interstitial animation triggered on place-order (screenshot timing caught post-animation state on success — the 900 ms wax-drop animation runs but resolves before the screenshot fired, which is correct behavior). ✓
- Page-enter fade-rise is a CSS-only motion primitive — can't be captured by static screenshot, but the keyframe + `animation: page-enter` rule on `body` confirms it'll fire on every navigation. ✓

### Carryover (open for next iter)

- **Voice register gradient** — partial sweep done in iter 14 (fresh-stickers eyebrow); a full pass across every screen for warmth modulation remains tracked.
- **Per-card landing peek editorial variation** — long-standing low-impact.
- **Shop arrival visual echo of the landing hero card** — long-standing low-impact.
- **Reply flow + scheduled send** — net-new features, not yet built.
- **Multi-photo / longer message variants** — net-new scope.

### Note on iteration count

At 15 rounds, the prototype has crossed from "needs fixing" into "almost ready to build." Remaining items are either net-new feature scope or fine-grained polish at diminishing returns. The motion primitive in this iteration was the last big-leverage piece of the connective-tissue work.

---

## Iteration 14 — 2026-05-13 00:00 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent. Focus: journey transitions — the connective tissue between screens, not individual screens.*

### Findings (sub-agent UX tester)

**The reframe:** prior iters reviewed each screen in isolation. This one walks the journey landing → shop → success → compose and asks "do the handoffs hold?"

| # | Handoff | Severity | Issue |
|---|---------|---------:|-------|
| 1 | landing → shop | **high** | Brand evaporates at shop arrival. Landing's `to/froms` wordmark is replaced by the page H1 `shop.` — no persistent anchor identity, no "← back" to landing. User has been teleported to a site that happens to share a typeface. |
| 2 | landing → shop | medium | The landing hero card never reappears as a "you came from here" anchor — visual thread snaps. |
| 3 | success → ??? | **high** | Success screen is an island. No top bar, no wordmark, no crumbs, no "view order" link — just one door: `start a draft`. That's a funnel, not a journey. |
| 4 | success → compose | **high** | Promise broken on arrival. Success says "give your stickers a message"; compose opens with `— a card from someone / hi. / let's set up your card.` — generic onboarding for a stranger. No reference to the order just placed. |
| 5 | success → compose | medium | No retreat path from compose. Welcome had only `begin →` forward — no back chevron, no close-X, no wordmark-home. User who gets cold feet has only the browser back button. |
| 6 | across the journey | medium | All transitions are hard cuts. No shared page-transition (fade, slide-up forward / down back), no loading state, no celebratory micro-moment between place-order and success. |
| 7 | across the journey | low | Voice register drifts unmanaged at handoffs — compose suddenly sounds like a settings screen after three screens of warmth. |

**Verdict (sub-agent):** _Each screen is a finished object; the journey is a slideshow of finished objects. The handoffs leak brand, context, and warmth — fix the four transition seams (persistent wordmark, order-context carry-through, motion primitive, retreat paths) and the prototype goes from four beautiful screens to one beautiful experience._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `shop.jsx` + `shop.css` `.brand-mark` | New `<Wordmark>` component. Pinned top-left of the shop topnav (replaces empty title slot when no `onBack`). Same italic-serif treatment as landing. Persistent identity. |
| 3 | `shop.jsx` `ScreenSuccess` topnav | Added a topnav row with the `<Wordmark>` left + `your orders ↗` mono link right. Success no longer floats with no chrome. |
| 4 | `prototype.jsx` ScreenWelcome eyebrow | When user arrives via `localStorage.tf-arrival === "from-success"`, eyebrow swaps from `— A CARD FROM SOMEONE` to `fresh stickers on the way · let's write what they'll carry` (lowercase, clay). Flag is consumed on read. Continuity restored. |
| 4a | `shop.jsx` success CTAs | "start a draft →" + "while you wait" card now set the `tf-arrival` flag before navigating. (URL params couldn't be used — `npx serve` strips query strings on the .html → / redirect.) |
| 5 | `prototype.jsx` ScreenWelcome topnav | Added a top row: `← later` link returning to landing, and a small `to/froms` wordmark (`.brand-mark-mini`) on the right. Compose now has a retreat path *and* a brand anchor. |
| 6 | (deferred) | Page-transition motion primitive — bigger refactor. Tracked. |
| 7 | (deferred) | Voice register gradient management — partially addressed via the new fresh-stickers eyebrow; full sweep tracked. |

### Verification

- Shop arrival — wordmark top-left visible alongside the bag glyph + badge top-right. ✓
- Success — wordmark top-left + "your orders ↗" top-right. Brand anchored. ✓
- Compose arrival from success — eyebrow reads `fresh stickers on the way · let's write what they'll carry` in clay; `← later` and `to/froms` wordmark present at top. ✓
- Cold-start compose (no `tf-arrival` flag) — defaults back to `— A CARD FROM SOMEONE`. ✓

### Carryover (open for next iter)

- **Motion primitive** — shared page transition + a "stamping" success interstitial. Bigger refactor.
- **Voice register gradient** — full sweep across all screens to ensure warmth modulates smoothly handoff-to-handoff.
- **Per-card landing peek editorial variation** — long-standing low-impact.
- **Reply flow + scheduled send** — net-new features.
- **Shop arrival visual echo** of the landing hero card — long-standing low-impact.

---

## Iteration 13 — 2026-05-12 23:50 UTC
*Viewport: 390 × 844, mobile raw mode. Carryover-cleanup pass — focused on the longest-open items.*

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `shop.jsx` `FancyQR` + `Finder` | Added a `bg` prop (default `var(--paper)`) that fills both the sticker paper and the finder-square inner cutouts. Lets each sticker be tinted independently. |
| 2 | `shop.jsx` ScreenShop product cards | Middle sticker per pack now uses `bg={p.color}` and `color/accent={#F8F1E7}` — pattern + glyph reversed out in cream over the pack's brand color. Side stickers stay paper. Each pack's identity is now literally the paper color of the hero sticker — eye reads "this pack feels rose" vs "this pack feels gold" instantly. |
| 3 | "see how it works" link | Walked: clicked on the welcome screen, navigated to `/index.html#how`, scrolled to the "three small steps" section as intended. ✓ |

### Verification

- Shop re-screenshotted at 390 × 844: birthday set's middle sticker is now tinted blush with a cream candle glyph; thank-you's middle is tinted champagne with cream bow. Pack identity reads at a glance — long-standing finding (open since iter 2) resolved. ✓
- "see how it works" anchor working — lands at the how section. ✓

### Status check at iteration 13

After 13 rounds of test ↔ fix, the prototype's surface is in shipping-quality shape. Of the original 80+ findings across iterations:
- The vast majority addressed.
- Open items now read as either **net-new feature scope** (reply flow, schedule send, multi-photo) or **production polish** (peek editorial variation hero-treatment, step-02 illo refinement) rather than UX bugs blocking the experience.

Recommend pausing the loop and pivoting to:
- Building the actual Next.js app from these prototypes.
- Or designing the reply / schedule-send features as new flows rather than polishing the existing ones further.

### Remaining carryover (open, low-impact)

- Editorial variation in landing peek section (hero + 2-up rows) — still flat-grid; nice-to-have, not a blocker.
- Step 02 "write" illo refinement — current illustration works at thumbnail scale.

---

## Iteration 12 — 2026-05-12 23:38 UTC
*Viewport: 390 × 844, mobile raw mode. Focus: shop momentum — the iter-11 high-priority carryover.*

### First-pass fixes (before tester)

| Where | What |
|-------|------|
| `shop.jsx` TopNav | Cart-btn is now a `<BagGlyph />` SVG (proper shopping-bag outline) + count badge — replaces the text-only "CART". `aria-label` set. |
| `shop.css` `.cart-btn .badge` | Badge positioned top-right of the bag with a paper-outline ring; clay background; mono digit. |
| `shop.jsx` prod-card | New "see the set →" CTA appears next to the blurb on each pack card — every card now has a clear next action. |
| `shop.css` `.prod-cta` | Clay mono caption, hover-translates 2 px right. |
| `shop.css` `.chip-scroll` | `position: sticky; top: 36px` — filter row pins on scroll so users can re-filter without scrolling back up. |

### Findings (sub-agent UX tester, after the first-pass)

| # | Severity | Issue |
|---|---------:|-------|
| 1 | medium | Cart badge was a saturated vermilion/tomato red — single fire-engine dot on an otherwise dusty-rose / ochre / sage / cream page. Reads like a notification badge pasted from a different app. |
| 2 | medium | Sticky filter row had no separation from content — chips floated over pack imagery without a divider, shadow, or backdrop. |
| 3 | medium | "see the set →" sat directly under "from $14" in the same right-rail stack — price won the fight against the action the iter just shipped. |
| 4 | low | "6 of 6 · keep scrolling" is logically contradictory: 6 of 6 says "you've seen it all"; "keep scrolling" says there's more. |
| 5 | medium | Native scrollbar visible on the right edge of `.ph` — cuts through the cart badge, intrudes on cards. Should be hidden on a Papier/Sezane-aiming surface. |
| 6 | (carryover) | QR thumbnails per card still look identical at a glance — the per-card CTA invites users to "see the set" but the visual previews don't differentiate. |

**Verdict (sub-agent):** _Momentum problem is shipped — scannable rows, per-card CTA, and a real cart glyph give the eye somewhere to go; remaining issues are polish, not stall._

### Second-pass fixes (after tester)

| # | Where | What changed |
|---|-------|--------------|
| 1 | `shop.css` `.badge` | Background `var(--clay)` → `var(--plum)`. Plum lives in the brand palette (it's the body text color); the badge now reads as "tasteful counter," not "system alert." |
| 2 | `shop.css` `.chip-scroll` | Added `border-bottom: 1px solid var(--ink-08)` + `backdrop-filter: blur(8px)` + solid paper background. Chrome / content boundary is now obvious. |
| 3 | `shop.jsx` + `shop.css` `.prod-cta-row` | CTA moved to its own row under the blurb, separated by a 1 px dashed divider. CTA now uses `sans-serif weight 500 / 13 px / clay` (was 10.5 px mono) — wins over the price on hierarchy. |
| 4 | `shop.jsx` caption logic | Default (`all` filter): `"the full set · 6 packs"`. Filtered: `"1 of 6 · showing love"`. No more logical contradiction. |
| 5 | `prototype-shell.css` raw-mode | `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` applied to `.ph`, `.screen-body`, and `.opened-screen` for both raw-mode and the auto-mobile media query. Clean right edge. |
| 6 | (carryover) | Per-card QR thumb differentiation — still tracked for a future pass. |

### Verification

- Shop re-screenshotted: bag-glyph cart with plum badge, sticky filter row with hairline divider, per-card `see the set →` on its own dashed row under each blurb, `the full set · 6 packs` caption, no visible scrollbar. ✓
- The shop now reads as a curated catalog with momentum — not a Pinterest board.

### Carryover (open for next iter)

- Per-card QR thumbnail differentiation (already-known long-standing issue).
- Editorial variation in landing peek section (hero + 2-up rows).
- Step 02 "write" illo refinement.
- Welcome → "see how it works" click verification.
- Reply flow proper, scheduled-send.

---

## Iteration 11 — 2026-05-12 23:30 UTC
*Viewport: 390 × 844, mobile raw mode. **Holistic** pass — fresh sub-agent asked to critique journey coherence across the four highest-stakes screens, not pick at nits.*

### Findings (sub-agent UX tester, holistic critique)

**3 priority issues:**

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | shop | **high** | Cart icon is just text "CART" floating top-right with no count + no per-card CTA. Catalog feels like a Pinterest board, not a store. Momentum dies between "I like this" and "I'm buying this." |
| 2 | review | **high** | Photo and song thumbnails are featureless brown squares — read as broken image placeholders. The emotional crescendo screen looks cheaper than the opened card screen which uses real art. |
| 3 | landing→shop | medium | Voice register breaks: landing is lowercase serif sentences, shop suddenly shouts in tracked-out caps (`6 OF 6 · SCROLL FOR MORE ↓` / `FROM $14` / `CART`). Visual equivalent of a boutique clerk switching to a clipboard voice. |

**Plus what's MISSING:**
- Price/scope on the landing — first-time visitor doesn't know if this is $4 or $40.
- Reassurance microcopy after sealing — "there's no undo" is the only emotional beat after the seal moment, and it's slightly scary.
- Recipient name preview on review screen.

**Verdict (sub-agent):** _It's one product made by one team, but the middle of the funnel is wearing a different outfit than the ends — fix the shop's voice and the review screen's thumbnails and this ships._

**Strongest:** opened card — every element does emotional + functional work simultaneously.
**Weakest:** shop — pretty but inert, only screen with no clear next action per card.
**Where she'd stop scrolling:** the shop.

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.css` `.mini-pic` + `.mini-art` | Photo review thumbnail now renders a **mini porch-light scene** (warm sky gradient + house silhouette + glow) — matches the opened-card polaroid aesthetic. Song thumbnail gets a small play triangle inset so it reads as audio, not a brown square. |
| 2 | `prototype.jsx` ScreenReview reassurance | New sage-colored microcopy under the "no undo" line: **"maya will see it the moment they scan."** (uses real `data.to`, falls back to "they") — fills the emotional reassurance gap before the seal. |
| 3 | `index.html` hero | Added a hand-script price hint under the CTAs: **"packs from $14 · ships in 2–3 days"**. Price now visible upfront — first-time visitors don't have to tap through to find out. |
| 4 | Caps softening sweep — multiple files | Targeted softening of the loudest tracked-uppercase chrome the tester named: |
| | `prototype.css` `.hold-seal .hold-label` | `HOLD TO SEAL` → `hold to seal` (text-transform: none, lighter tracking) |
| | `prototype.jsx` ScreenHead label | `FINAL · REVIEW & SEAL` → `final · review & seal` (inline style override, tracking 0.06em) |
| | `prototype.css` `.opened-screen .msg-meta` + `.opened-foot` | `OPENED JUST NOW` → `opened just now`; `TOFROMS.CO · K7M2X` → `tofroms.co · k7m2x`; replay link `↺ REPLAY THE REVEAL` → `↺ replay the reveal` |
| | `shop.jsx` filter caption | `6 OF 6 · SCROLL FOR MORE ↓` → `6 of 6 · keep scrolling ↓` (lowercase, gentler verb) |

### Verification

- Review screen — re-screenshotted: photo polaroid shows the porch scene at 56 px, song row has a visible play-triangle thumb, reassurance microcopy in sage reads `maya will see it the moment they scan.`, "hold to seal" softened. ✓
- Landing — `packs from $14 · ships in 2–3 days` in hand-script under the CTAs. ✓
- Opened card — "opened just now" / "↺ replay the reveal" / "tofroms.co · k7m2x" all softened to lowercase. ✓

### Remaining carryover

- **Shop momentum / per-card CTAs** — the biggest #1 finding partially addressed (chrome softened) but the deeper "add to bag" affordance per pack card is unbuilt. Tap-to-detail remains the only path.
- **Cart icon** — still text-only "cart"; should pair with the bag glyph + a count badge.
- **Editorial variation** in landing peek — long-standing open.
- **Step 02 "write" illo** — long-standing open.
- **Welcome → "see how it works"** click test — never run.
- **Reply flow + scheduled send** — not yet designed.

---

## Iteration 10 — 2026-05-12 23:14 UTC
*Viewport: 390 × 844, mobile raw mode. Carryover-cleanup pass — no separate tester this iter; applied accumulated tracked fixes from iters 6–9.*

### Fixes applied (from accumulated carryover)

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.jsx` ScreenHead invocations + `prototype.css` `.prog` | Photo + Song step headers now say `3/5 · PHOTO · OPTIONAL` / `4/5 · SONG · OPTIONAL`. Progress bar segments 3 and 4 render at 45% opacity (75% when active) — visually distinguishes optional from required steps. |
| 2 | `prototype.css` `.song-play` | Play disc grown 26 → 34 px; added shadow + hover scale (1.08) + active scale (0.94). Mobile thumbs can hit it reliably without mis-selecting the row. |
| 3 | `prototype.jsx` ScreenEnvelope copy | `choose the moment.` → `the envelope it lands in.` and sub `this is the first thing they'll see when they scan.` → `the first thing they'll see when they scan.` — names the actual decision. |
| 4 | `prototype.css` `.env-card .seal` + `.check` | Seal sized 26 → 36 px with deeper shadow (jewelry-feel). Check badge changed from solid clay disc to outlined clay ring with no fill — quiet "current state" affordance instead of a loud second CTA. Name label opacity reduced. |
| 5 | `scan.jsx` ScreenStickers + `scan.css` `.lib-card.blank-group` | Four BLANK tiles collapsed into a single full-row dashed card showing a 3-card paper-stack illustration + `4 blank stickers / tap one to start a card →`. Clicking the group routes to compose. Library now reads as "your active cards + a stack of stationery" rather than warehouse inventory. |

### Verification

- Sticker library — re-screenshotted: 4 active sticker cards (maya/j./ben/alex) + 1 collapsed blank-stack tile, much more breathable. ✓
- Envelope step — re-screenshotted: bigger seals as heroes, quiet outlined check on selected (blush) tile, "the envelope it lands in." headline. ✓
- Song step — re-screenshotted: header reads `4/5 · SONG · OPTIONAL`; progress segment 4 is dimmer clay; play buttons visually distinct and tap-friendly. ✓

### Remaining carryover (open for next iter)

- Editorial variation in landing peek section (hero + 2-up rows) — open since iter 6.
- Step 02 "write" illo refinement — open since iter 5.
- Welcome → "see how it works" link tap verification (the anchor exists; just never click-tested).
- Reply flow proper — recipient → sender → compose with name preselected.
- Schedule send / unlock-date — referenced in chat history but never built.
- The fresh-mode and spent-mode sticker library views could use a re-screenshot to make sure the blank-group conditional still works (`mode !== "fresh"` rule).

---

## Iteration 9 — 2026-05-12 23:06 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent tester. Focus: scan-branch screens (sender claim, recipient view, already-claimed empty state, after-reveal).*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | sender claim | **high** | Reads like a tutorial, not a coronation. Kicker "unclaimed sticker" is admin-panel voice; body is procedural ("scan / seal / peel / stick"). The how is repeated twice. |
| 2 | sender claim CTA | **high** | `claim it →` repeats the screen's own state ("this one is yours"). Tautological — reduces a precious moment to a checkbox. |
| 3 | recipient view | medium | "from *rachel.*" sits at 44 px but is sandwiched between kicker + wax card + code-row. The most precious word doesn't dominate. |
| 4 | recipient view | medium | Code-row leaks `type love` to the recipient — system field that reads as the sender declaring romantic intent via SKU. |
| 5 | already-claimed | **high** | Surfaces `claimed by j.l. · since may 3` to the random scanner — privacy footgun and gossip bait. |
| 6 | already-claimed | medium | Primary CTA = "shop a fresh pack →"; demotes "scan another sticker" → upsells on an error. |
| 7 | after-reveal | **high** | ~200 px dead zone between the blush card and the footer. Recipient rushed from a tender moment to a commerce/account ask with no breath. No anchor back to the card. |
| 8 | after-reveal | medium | Page leads with Rachel's name, but the foot CTA goes to a generic shop view (not Rachel's love pack). |

**Verdict (sub-agent):** _Scan-branch screens are structurally sound but emotionally over-functional — leak ops vocabulary, lean on procedural verbs, and substitute commerce or compliance for the precious moment._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `scan.jsx` ScreenClaim copy | Kicker `unclaimed sticker` → `· a fresh one ·`. Body changed to `one of eight, just yours. write to someone — then send it out into the world.` Removed duplicated mechanics; kept one small hand-script line at bottom. |
| 2 | `scan.jsx` ScreenClaim CTA | `claim it →` → **`make it mine →`** — forward motion, possessive warmth. |
| 3 | `scan.jsx` ScreenRecipient | "from *rachel.*" bumped 44 → 58 px display, line-height tightened. The recipient's first question is *who is this from* — that word is now the page. |
| 4 | `scan.jsx` ScreenRecipient | Dropped `type love` from the code row entirely. The pack type is revealed *inside* the card, not previewed as metadata. |
| 5 | `scan.jsx` ScreenScanClaimed | Removed the `claimed by j.l. · since may 3` row entirely. Kicker `already claimed` → `· already spoken for ·`. Headline `someone got to this one first.` → **`this one's taken.`** Body forks: "if it's yours, the person you shared the pack with already claimed it. otherwise — it just belongs to someone else." |
| 6 | `scan.jsx` ScreenScanClaimed CTAs | Primary now `scan another sticker`; ghost is a small tx-hand-sm line `want your own? a pack lives in the shop ↗`. Brand dignity restored. |
| 7 | `scan.jsx` + `scan.css` ScreenRecipientAfter | New **`.reread-anchor`** between the headline and the blush card: a rotated mini-envelope (clay wax seal with `r`, `to: you` script label) plus `↺ re-open the card` link. Fills the dead zone with a tap-back-to-the-moment affordance. |
| 8 | `scan.jsx` ScreenRecipientAfter foot | Primary CTA `shop a pack →` → **`shop a love pack →`** with deep link to `/shop.html?filter=love` so Rachel's taste carries forward. Ghost CTA `keep, sign up to save` → `save this link to my email`. |

### Verification (after fixes)

- Sender claim — `· a fresh one ·` / `this one is yours.` / emotional body / `make it mine →`. ✓
- After-reveal — mini-envelope anchor with `↺ re-open the card`, blush card with personal copy, `shop a love pack →` carrying the love-pack taste. ✓
- Already-claimed — no third-party info leaked; `scan another sticker` primary; quiet shop link. ✓ (verified via code only this iter)
- Recipient view — bigger Rachel hero; no leaked SKU. ✓ (verified via code only this iter)

### Carryover (open for next iter)

- Optional-step bar labelling — still using `n/5` for photo + song.
- Play-vs-select ambiguity on song rows.
- Envelope tile seal sizing + header copy "choose the moment".
- BLANK sticker collapse.
- Editorial variation in landing peek (hero + 2-up).
- Step 02 "write" illo refinement.
- Welcome → "see how it works" verification.
- Reply flow — referenced but not fully built; the after-reveal anchor now points toward shop, but a true reply→compose link with Rachel preselected would close it tighter.

---

## Iteration 8 — 2026-05-12 22:58 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent tester. Focus: activation flow inputs (welcome → to-from → message → photo → song → envelope), never deeply QA'd step-by-step.*

### Process finding (mid-walk)
Playwright `.fill()` doesn't sync with React's controlled inputs — DOM values updated but the React state was unchanged so the "continue" button stayed disabled. Worked around by using the native value setter + dispatching the `input` event from `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set`. Worth noting: real users typing on a keyboard work normally; this is purely a programmatic-fill quirk.

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | welcome | medium | No preview of the 5 steps. The "1 minute" promise feels safer when the path is visible up front. Big empty mid-section is dead space. |
| 2 | to-from focus | **high** | Focused input shows a clay 1px border that reads almost identically to a validation error — and the unfocused field has a hairline border, so side-by-side the eye sees "one is wrong." |
| 3 | progress bar | medium | All 5 steps treated as required, but photo + song are skippable. Calling optional steps "n/5" primes mild guilt. |
| 4 | photo empty state | medium | `.polaroid-add` had `aspect-ratio: 0.85` while filled `.polaroid` had `aspect-ratio: 1` — tapping caused a noticeable shape jump. |
| 5 | song step default | medium | "no song" defaults to fully clay-selected with shadow — looks like an active choice rather than a default. First-timers might continue without realizing there were songs to audition. |
| 6 | song row ambiguity | medium | Whole row selects, tiny play disc previews — easy mis-tap on a 22 px button at the edge of a 48 px art tile. |
| 7 | envelope tiles | low | Seal (26 px) is supposed to be the hero, but the check badge and the white-space spacer compete. |
| 8 | envelope header | low | "choose the moment" reads poetic but vague — user is choosing a color, not a moment. |
| 9 | skip / continue balance | medium | `flex: 1` on both made the buttons equal-width — signals "either is equally fine," nudging away from the optional content (photo, song) that makes the gift personal. |
| 10 | message counter | low | "0 / 280" doesn't warn at 240+ and "PROMPTS" header crowds the textarea footer line. |

**Verdict (sub-agent):** _Strong craft and clear voice; remaining issues are subtle hierarchy traps — selected-by-default loudness, equal-weight skip buttons, photo polaroid-swap geometry — none fatal, all worth one more pass._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.jsx` ScreenWelcome + `prototype.css` `.welcome-preview` | Added a mono-cap journey preview under the kicker bar: `TO & FROM — THE MESSAGE — *a photo* — *a song* — THE ENVELOPE`. Required steps in mono caps, optional steps in lowercase hand-script. |
| 2 | `prototype.css` `.input` | Resting border `--ink-12` → `--ink-24` (heavier hairline). Focus state shifts from border-color swap to a soft `0 0 0 3px rgba(201,123,90,0.16)` glow + a 50%-opacity clay border. Focus and error no longer conflate. |
| 3 | (tracked) | Optional step labelling — bigger refactor; tracked. Welcome's new preview already telegraphs which steps are optional. |
| 4 | `prototype.css` `.polaroid-add` + JSX | Polaroid-add now uses exactly the same geometry as the filled polaroid: white card 220 px wide with a 14 px-inset dashed inner square (the future photo area), `+` glyph and "tap to add a photo / CAMERA · LIBRARY" hints centered inside. "no photo yet" italic caption sits where the real caption will. No layout jump on swap. |
| 5 | `prototype.jsx` ScreenSong | Selected-pill styling only applies when `_touchedSong` flag is set. Default state shows all 5 rows as quiet paper cards with empty radio circles — invites exploration rather than declaring a winner. |
| 6 | (tracked) | Play-vs-select ambiguity — larger play button + clearer model. Tracked. |
| 9 | `prototype.css` `.screen-foot.row` | `flex: 1` → `flex: 0 0 auto` for `.btn-ghost` (skip) and `flex: 1 1 auto` for `.btn-primary` (continue). Skip is small/auto-padded, continue dominates. Hierarchy now clearly recommends continuing. |
| 10 | `prototype.jsx` ScreenMessage | Counter color zones: sage (0–240) → clay (241–270) → clay-2 (271–280). Wording changed `"0 / 280"` → `"0 of 280"` for warmth. |

### Verification (after fixes)

- Welcome — journey preview visible, sets expectation. ✓
- Photo — empty polaroid matches filled polaroid geometry; no swap-jump. ✓
- Song — quiet default, no faux-selected loudness. ✓
- Skip / Continue — skip auto-sized, continue dominant. ✓

### Carryover (open for next iter)

- Optional-step labelling in the progress bar (#3).
- Play-vs-select ambiguity on song rows (#6).
- Envelope tile seal sizing + header copy (#7, #8).
- "BLANK" sticker collapse (from iter 7).
- Editorial variation in landing peek section (from iter 6).
- Step 02 "write" illo refinement (from iter 5).
- Welcome → "see how it works" link tap verification.
- Reply flow / scheduled-send flow — never built.

---

## Iteration 7 — 2026-05-12 22:50 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent tester. Focus: screens not yet deeply reviewed (drafts, sticker library, success).*

### Sweeps done before tester

- **Filter chips** — clicked all 7 chips in sequence (all + 6 specific), confirmed each filters to the correct single pack with the "see all six →" tile appearing. Working as intended.

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | drafts subtitle | medium | "unsent. waiting on you." reads accusatory — like a nagging to-do app, breaks the considered voice. |
| 2 | drafts meta | medium | "no sticker assigned" mixes human dates with technical jargon and a negative framing — reads as a system error to first-time users. |
| 3 | drafts row | **high** | Whole row should be tappable; currently only the tiny uppercase "CONTINUE →" cue is the affordance. Conflicts with the tab-bar's "DRAFTS" label visually. |
| 4 | stickers library | **high** | Three overlapping vocabularies for the same state ("3 sealed" / "1 draft" header vs. "to draft" + "blank" pills on tiles vs. "opened" elsewhere). User can't tell at a glance what differs between a `blank` sticker and a `to draft` sticker. |
| 5 | stickers library | medium | "BLANK" pill repeated 4× plus 4 near-identical QR thumbnails reads as warehouse inventory, not craft stationery. |
| 6 | stickers library | medium | Header `"3 sealed · 1 draft · 4 blank"` vs tile pills `opened/sealed/draft/blank` — vocabulary asymmetry forces user to translate. |
| 7 | success | medium | "ORDER #TF-2572" sits as the hero subtitle right after "thank you." — sterile, breaks the celebration. |
| 8 | success | **high** | "scan to activate" card tells buyers to scan stickers before they've shipped — directly contradicts the receipt card above ("we'll write when they're packed"). |
| 9 | success | low | "back to shop" right after purchase funnels back to spending, feels off-brand for tender. |

**Verdict (sub-agent):** _Drafts and Stickers have a vocabulary problem (three names for one state); Success has a sequencing problem (asks for action the user can't yet take)._

### Fixes applied

| # | Where | What changed |
|---|-------|--------------|
| 1 | `scan.jsx` ScreenDrafts subtitle | `"unsent. waiting on you."` → `"still in your hands."` — softer, no scold. |
| 2 | `scan.jsx` drafts data | `"may 7 · no sticker assigned"` → `"may 7 · no sticker yet"` — matter-of-fact, no jargon. |
| 3 | `scan.jsx` `.draft-row` | Whole row now has `onClick` + `cursor: pointer`; "CONTINUE →" reduced to a quiet `→` in ink-60. Card tappable anywhere. |
| 4 | `scan.jsx` baseStickers | `to: "draft", status: "draft"` → `to: "alex", status: "in draft"` — now reads "to alex · in draft" so the recipient is explicit; status maps to the existing `.status.draft` CSS class via small ternary. |
| 5 | (deferred) | "BLANK" collapse to a single grouped tile — tracked. |
| 6 | `scan.jsx` stickers header count | `"3 sealed · 1 draft · 4 blank"` → `"2 opened · 1 sealed · 1 in draft · 4 blank"` — uses the same labels as the pills below. |
| 7 | `shop.jsx` ScreenSuccess | Order number moved out of the hero slot. Hero subtitle is now `"a little package, on its way."` in hand-script. Order code lives as a tiny mono line under the foot CTA. |
| 8 | `shop.jsx` ScreenSuccess | Replaced "scan to activate" card with "while you wait — start a draft" (links to compose). Primary CTA is `start a draft →` (links to `prototype.html`). |
| 9 | `shop.jsx` ScreenSuccess | Dropped the "back to shop" ghost button — leaves the user on the joyful, productive next-step. |

### Verification (after fixes)

- Stickers screen — `to alex / in draft` pill reads cleanly; header vocabulary aligned with tile pills. ✓
- Success screen — `thank you.` → `a little package, on its way.` → receipt card → `while you wait — start a draft` → primary CTA `start a draft →` → tiny `order tf-2753` micro mono. No premature scan instruction. ✓
- Drafts — meta `"no sticker yet"` reads neutrally; row is now wholly tappable.

### Carryover (open for next iter)

- **Editorial variation** in landing peek section (hero + 2-up) — open since iter 6.
- **Step 02 "write" illo** still ambiguous — replace with a clearer handwriting cue.
- **"BLANK" collapse** in sticker library to a single grouped tile + nicer feel.
- **Welcome → "see how it works"** link verification — still untested.
- **Reply flow** (recipient → sender) — referenced in chat history but never built or QA'd.
- **Schedule send / unlock-date** — strong product wedge, still unbuilt.
- **Activation flow inputs** — only the activation entry was tested; the full to/from → message → photo → song → envelope inputs deserve a sweep.

---

## Iteration 6 — 2026-05-12 22:42 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent tester. Focus: clearing the long-standing carryovers (per-pack identity, settings link, pull-quote support, song label, opened-card foot).*

### Carryover fixes shipped at start of iter

| Where | What |
|-------|------|
| `index.html` SVG glyphs | Scaled center glyph `<g>` from `translate(50 50)` to `translate(50 50) scale(1.55)` across all 19 inline SVGs (peek tiles + step illos). |
| `index.html` reviews | Added 2 more pull quotes; mobile is now a horizontal scroll-snap with snap on each card. |
| `prototype.jsx` SONGS | "RESOLVED" → "BIG THIEF"; "FOLEY" → "PHOEBE BRIDGERS". Real-ish artist names instead of cryptic verbs. |
| `prototype.jsx` + `prototype.css` opened-foot | "opened just now." moved to italic serif right-aligned; URL+code reduced to ink-24 micro mono. |
| `scan.jsx` TopNav + settings link | TopNav now accepts `onRight`; settings link triggers a "coming soon" alert instead of dead-ending silently. |

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | landing — peek tiles | **high** | Even after 1.55× scale, all six pack tiles still read as the same diamond-of-dots motif at thumbnail size. "Boost glyph size" was the wrong abstraction — the *three-stickers-stacked* pattern is what's averaging them out. |
| 2 | landing — peek section | medium | Six near-identical tile sizes/positions create a monotonous CMS-dump rhythm. |
| 3 | landing — reviews scroll | **high** | Single quote visible per snap page with no peek of the next card, no pagination dots, no chevron. Section read as "there is one review" rather than "swipe for more." |
| 4 | opened — "opened just now." | medium | The italic line floated in dead space between the song player and the CTA, not anchored to either. Read as "what is this?" |
| 5 | opened — polaroid floating dot | medium | The petal still rendered as a small brown ovoid floating off the polaroid corner — even after the iter-5 reposition. |
| 6 | opened — URL micro mono | low | Reduced too far (ink-24) — nearly invisible when needed. |
| 7 | landing — "three small steps" middle illo | low | Step 02 illustration reads as a barcode/label strip; doesn't clearly evoke handwriting. |

**Verdict (sub-agent):** _Iter 6 fixed the right surface issues, but the peek-tile uplift didn't land — packs still aren't distinguishable, and horizontal-scroll reviews hide their own affordance._

### Fixes applied (after tester)

| # | Where | What changed |
|---|-------|--------------|
| 1 | `index.html` `.pack-tile .stack` CSS | Restructured peek composition: middle sticker is now the hero at 104 px with a 12 px deep shadow; side stickers shrink to 48 px and drop to 60% opacity. Each pack's signature glyph now dominates the tile and is genuinely identifiable at a glance. |
| 3 | `index.html` `.reviews-row` + new `.reviews-dots` + `.reviews-affordance` | Reduced quote `flex-basis` 78 → 76% so the next card peeks at the right edge. Added "↔ SWIPE FOR MORE" mono affordance + a 4-dot indicator below (first dot clay, rest ink-24). Desktop hides both. |
| 4 | `prototype.jsx` + `prototype.css` `.msg-meta` | "opened just now" moved into the message block — sits directly under the "— em" signature as a small uppercase mono line (ink-40). Now reads as letter metadata, anchored to the right place. |
| 5 | `prototype.jsx` `.petal` | Removed entirely. The polaroid scene stands on its own; no more floating-egg confusion. |
| 6 | `prototype.css` `.opened-foot` | Restored to ink-40 / size 10 / 0.16em tracking — visible without shouting. |
| 7 | (carryover) | Step 02 illo refinement — tracked for next iter. |
| 2 | (carryover) | Editorial varied rhythm for peek section — tracked; the hero-sticker shift in #1 already softens the monotony. |

### Verification (after fixes)

- Peek tiles — **major improvement**. Each pack's glyph reads at a glance: heart (love), bow (thanks), ellipsis-clouds (thinking), candle (birthday), starburst (wins), wilted flower (sorry). ✓
- Reviews — first quote shown, next quote peeks at right edge, "swipe for more" + 4 dots cue the section's depth. ✓
- Opened card — composition reads top-to-bottom cleanly: photo → message → signature → meta → song → CTA → quiet meta. No floating elements. ✓
- Settings link in scan account — now triggers an alert (placeholder, but no longer silent). ✓

### Carryover (open for next iter)

- **Editorial variation in peek section** — consider promoting one pack as "this week" hero (full-bleed, larger tile, blurb) and 2-up rows for the rest to break the CMS-grid rhythm.
- **Step 02 "write" illo** — still ambiguous; replace with a clearer handwriting cue (pen nib over a card).
- **Welcome "see how it works"** link verification — still untested.
- **Wax tap-halo** — applied but visual effect on actual render needs verification screenshot.
- **Filter chip behavior** — verified for one filter only; sweep all chips to ensure no breakage on `congrats` / `im-sorry` mapping.

---

## Iteration 5 — 2026-05-12 22:34 UTC
*Viewport: 390 × 844, mobile raw mode. Tester run as a fresh sub-agent. Focus: clearing carryovers + verifying iter 4 fixes.*

### Carryover fixes shipped at start of iter

| # | Where | What |
|---|-------|------|
| ↺ | `scan.jsx` ScreenCardDetail | New `.card-meta-row` above the QR — sage-tinted band: `OPENED · read 4× · LAST · 2H AGO`. Sender now sees the emotional payoff (they opened it · they read it 4×) above the message. |
| ↺ | `scan.jsx` timeline | Reversed so most recent event is on top. `.latest` class adds a sage halo + sage-tinted label to the top row. |
| ↺ | `scan.css` `.card-meta-row` + `.tl-row.latest` | Styling for the above. |
| ↺ | `shop.jsx` filter caption | "X of 6 · showing **filter**" with the filter name in clay, plus a tappable "clear ×" affordance on the right. |
| ↺ | `prototype.css` `.env-stage.sealed .seal-wrap::before` | Gentle clay tap-halo behind the 3D wax — pulses 2.4s. |

### Findings (sub-agent UX tester, on top of those fixes)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | opened card | **high** | The drifting petal element rendered as a solid brown ovoid floating *off* the polaroid (right: 30, top: 80) — read as a misaligned 3D asset / broken image. |
| 2 | card detail | medium | QR rotated -3° inside a tight stage — bottom-right finder square clipped; the "to · maya" tag jammed flush against the card edge. |
| 3 | card detail | medium | Now-prominent sage meta row above the QR ("OPENED · read 4× · LAST · 2H AGO") duplicates the highlighted "read · 4 TIMES · last · 2h ago" first timeline row word-for-word. And the *whole* journey arc (sealed → peeled → placed → opened) is pushed below the fold by the duplication. |
| 4 | shop filtered | medium | Single tile + giant empty paper below it reads as a 404, not a curated subset. |
| 5 | shop "clear ×" | low | The whole "clear ×" link was clay-orange — competes with the active chip for the eye. |
| 6 | opened card song player | low | "RESOLVED · 3:42" — "resolved" is a song-status verb the recipient has no context for. |
| 7 | opened card photo caption | low | "maya, the porch '24" caption nearly spans the polaroid edge — tight, not considered. |
| 8 | opened card foot | low | Two all-caps mono strings still feel louder than the signature on a screen meant to end on emotion. |

**Verdict (sub-agent):** _The opened card finally lands emotionally, but a stray petal artifact and the duplicated card-detail meta row mean the two screens you most wanted polished still need a careful 10-minute trim._

### Fixes applied this iteration (after tester)

| # | Where | What changed |
|---|-------|--------------|
| 1 | `prototype.jsx` `.petal` | Repositioned (top: 50, right: 18, opacity 0.6) so it now overlaps the polaroid's corner like a real drifting petal — not a floating egg. |
| 2 | `scan.jsx` `FancyQR` | Size reduced 150 → 132 px so the rotated code sits comfortably inside the detail stage without clipping. |
| 3 | `scan.jsx` ScreenCardDetail timeline | Collapsed `read` row into the `opened` row (`maya · read 4 times (last · 2h ago)`). Journey now reads cleanly: sealed → peeled → placed → opened-with-read. `.tl-row` padding reduced 9 → 7 px so all 4 fit above the fold. |
| 4 | `shop.jsx` + `shop.css` `.see-all-tile` | When `visible.length === 1` in filtered mode, render a "see all six → / browse the full set." dashed tile after the lone pack card. Fills the empty space, gives the user an out. |
| 5 | `shop.jsx` "clear ×" | Color changed to `ink-60` with only the × in clay — reads as a quiet undo, not a second CTA. |
| 6 | (deferred) | Replace "RESOLVED" — tracked. |
| 7 | (deferred) | Caption sizing — tracked. |
| 8 | (deferred) | Opened-card foot — partial fix in iter 4 already toned it down; further softening tracked. |

### Verification (after fixes)

- Card detail — opened row at top has `MAYA · READ 4 TIMES (LAST · 2H AGO)` in one entry. Sealed row visible at bottom edge. ✓
- Shop filter "love" → single tile + "see all six →" dashed tile underneath. "CLEAR ×" reads quiet. ✓
- Opened card petal — slightly overlapping the polaroid corner (no longer floating in space).
- Wax tap-halo — visible behind 3D seal on `.env-stage.sealed` (gentle pulse).

### Carryover (open for next iter)

- **Per-pack landing peek tile identity** — still glyphs too small at 64 px (open since iter 2).
- **Settings link** in account top-right — still dead-ends.
- **Pull-quote section** — only one quote; consider 2–3 in a horizontal scroll.
- **"RESOLVED" song label** — replace with an artist name or "tap to play".
- **Opened-card caption** sizing — reduce hand font slightly + give 6 px bottom margin.
- **Opened-card foot mono strings** — consider one-line italic serif "opened just now" with the URL on a separate sub-footer.
- **Welcome → "see how it works"** — confirm it navigates correctly after the `<a>` change in iter 3.

---

## Iteration 4 — 2026-05-12 22:26 UTC
*Viewport: 390 × 844, mobile raw mode. Fresh sub-agent tester. Focus: opened card (emotional payoff), card-detail meta, filtered shop, landing re-review.*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1a | opened card | **high** | Polaroid `.pic` rendered as a flat muddy brown gradient — read as broken `<img>`. |
| 1b | opened card | medium | Caption "rachel, kyoto '24" contradicted sender ("— em") and recipient ("a letter from em"). Demo data leak. |
| 1c | opened card | **high** | Primary CTA "see this in your library →" wrongly assumed the viewer is the sender; recipients have no library. |
| 1d | opened card | medium | Hierarchy inverted — orange play disc outweighs the signature ("— em"). |
| 1e | opened card | medium | Native scrollbar visible on right edge — breaks the device illusion. |
| 1f | opened card | low | "opened just now · ↺ replay reveal" intruded before CTAs. |
| 1g | opened card | low | Header "···" kebab dots had no target. |
| 2a | card detail | medium | "share link" (topnav) + "copy the link" (foot CTA) duplicate the same action — wastes the primary slot. |
| 2b | card detail | medium | "opened · read 4×" meta is the most emotionally interesting fact but tucked under the QR; the sender's own quoted message dominates. |
| 2c | card detail | medium | Timeline shows only 3 rows (sealed/peeled/placed) — "opened" + "read 4×" missing from the journey for `k7m2x`. |
| 3a | shop filtered | medium | "1 of 6" caption doesn't acknowledge a filter is active; no "clear filter" affordance. |
| 3b | shop filtered | medium | A single tile alone in the canvas feels empty/lost — no fallback for n=1. |
| 4a | landing — how it works | medium | Step 02 "write" thumbnail was blank — the most important step represented by a placeholder. |

**Verdict (sub-agent):** _The opened card — the entire reason this product exists — is the weakest screen in the prototype. Fix it before anything else._

### Fixes applied this iteration

| # | Where | What changed |
|---|-------|--------------|
| 1a | `prototype.jsx` ScreenOpened `.pic` | Replaced empty brown gradient with an inline-SVG "porch light at dusk" scene: warm sky gradient, glowing window in a house silhouette, soft figure in foreground, single porch light radial. Ties to the message visually. |
| 1b | `prototype.jsx` photo caption | Bound to `data.to` and changed location to `"the porch '24"` so it complements the scene rather than naming a foreign person. |
| 1c | `prototype.jsx` ScreenOpened CTA | `see this in your library →` → `send one back →`, routes to `/shop.html`. Recipient-correct call to action; closes the emotional loop. |
| 1d | `prototype.css` `.opened-screen .msg-sig` / `.player` | Signature bumped 28 → 36 px hand-script, more line-height. Song player went from filled-clay disc to a ghost-bordered circle with transparent background — message and signature now dominate. |
| 1e | `prototype.css` `.opened-screen` | `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`. |
| 1f | `prototype.jsx` ScreenOpened | Removed in-flow `.below` row; moved "opened just now" + "tofroms.co · k7m2x" into a new `.opened-foot` (mono, ink-40) below all CTAs. Replay is a quiet text link under the primary CTA. |
| 1g | `prototype.jsx` header | Removed the "···" kebab span; topnav is now just `a letter from {from}`. |
| 2a | `scan.jsx` ScreenCardDetail | Removed the foot `copy the link` ghost button. New primary `send another →` routes to shop. Share remains in topnav only. |
| 2b/2c | (deferred) | Hierarchy + timeline fixes deferred — verify in iter 5 that all 5 timeline rows actually render and consider lifting the meta. |
| 3a/3b | (deferred to iter 5) | Filter caption / single-tile mode tracked. |
| 4a | `index.html` `.illo-write` | Replaced ascending-bar mockup with a lined-paper note: ruled-line gradient, plum handwritten-text strokes via gradient bars, "—em" hand-script signature bottom-right. |

### Verification (after fixes)

- Opened card — re-screenshotted at 390×844 (post-Babel render): the porch-light scene reads beautifully, signature is dominant, song subtle, "send one back" is the loud CTA. ✓
- Landing step 02 — handwritten paper note with signature now renders in the "write" tile. ✓

### Carryover (open for next iter)

- **(2b/2c)** Card-detail timeline rendering — verify all 5 rows display; consider promoting the meta ("read 4× · last 2h ago") above the message preview.
- **(3a/3b)** Shop filter UX — add "clear filter ×" affordance + special single-tile mode (larger or paired with a "see the full set →" tile).
- **Per-pack landing identity** — still open from iter 2/3; needs varied sticker arrangement and larger center glyphs per pack.
- **Wax tap-halo on sealed** — still open.
- **Settings link in account top-right** — still dead-ends.
- **Pull-quote section** — only one quote; consider adding more in a horizontal scroll.
- **Welcome screen** — verify the new `<a>` "see how it works" navigates correctly.

---

## Iteration 3 — 2026-05-12 22:20 UTC
*Viewport: 390 × 844, mobile raw mode. Tester run as a fresh sub-agent. Focus: scan moment + account home (not deeply reviewed in earlier iters).*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | (process) | high | Account screenshot turned out to be a byte-identical duplicate of the scan lock screenshot — `?view=account` URL param didn't override stored state. Re-captured via localStorage seed. |
| 2 | scan — viewfinder | high | Center of the viewfinder is empty dark space — reads as "broken loading screen", not "camera aimed at a sticker." |
| 3 | scan — status bar | medium | Lock-screen camera UI should have a translucent dark haze under the white status glyphs (iOS pattern). Without it the "9:41" looks like floating text. |
| 4 | scan — toast favicon | medium | The toast shows "t/f" — a third never-introduced abbreviation. Wordmark is "to/froms". |
| 5 | scan — toast URL line | medium | Raw URL `tofroms.co/s/k7m2x` reads engineering-y. Recipient's first brand impression is a slug. |
| 6 | landing — i'm sorry tile | medium | Five packs sit on tinted color blocks, the sixth (i'm sorry) was on near-white paper — rhythm breaks on the last item. |
| 7 | landing — peek tile identity | medium (was low) | All six packs render three identical-looking QR tiles. The tiny center glyph (20% of 62 px ≈ 13 px) is too small to differentiate at a glance. |
| 8 | prototype — welcome footer | medium | "or, see how it works ↗" was a `<span>` with no `onClick` / `href` — dead element with arrow that promises navigation. (Same pattern repeated in picks.jsx, midfi-frames.jsx.) |
| 9 | scan — account home | low | "activity" section directly below the sent list duplicates the same "maya opened your card" already shown as a status pill — repetition feels placeholder-y. |
| 10 | scan — account tabbar | medium | Tab icons were literal characters `h / ◌ / / / *` rendered in italic serif. Lowercase "h" with label "home" reads as a stray letter; `*` is the universal required-field mark. |

**Verdict (sub-agent):** _Landing close to ready; scan moment needs the viewfinder filled and the toast brand-voiced; account home couldn't be reviewed initially — re-captured after the localStorage seed fix._

### Fixes applied this iteration

| # | Where | What changed |
|---|-------|--------------|
| 1 | n/a | Re-screenshotted account home via localStorage seed; ready for iter 4 review. |
| 2 | `scan.jsx` `ScreenLock` / `scan.css` `.scan-target` | Added a faint inline SVG sticker silhouette inside the corner brackets: 3 QR finder squares + a small heart at the center, rendered at `rgba(255,255,255,0.18)`. Camera now reads as "aimed at a sticker." |
| 3 | `scan.jsx` / `scan.css` `.status-haze` | Added a 54-px-tall radial dark gradient strip under the status bar position. (Mostly visible in non-raw mode where the fake status bar shows; in raw mode the real status bar takes over.) |
| 4 | `scan.jsx` toast favicon | `t/f` → italic serif `to/` (matches the wordmark exactly, with the slash in plum). |
| 5 | `scan.jsx` toast URL line | `tofroms.co/s/k7m2x` → `tofroms.co · a letter for you`. Brand voice first, slug never. |
| 6 | `index.html` peek "i'm sorry" tile | Background gradient `#F5EBD7 → #ECDFCC → #C5B59B` (near-white) → `#C6B7AB → #9A8C82 → #5E5249` (dusty grey-brown). Pattern complete; emotionally appropriate. |
| 7 | (deferred) | Bumping per-pack identity (larger glyph, varied paper tint) requires editing 6 inline SVG blocks; tracked as carryover. |
| 8 | `prototype.jsx` ScreenWelcome | Span → `<a href="/index.html#how">`. Other dead-end "see how it works" instances tracked. |
| 9 | `scan.jsx` ScreenAccount | Removed the redundant "activity" section block — the bell tab handles alerts. Account home is now: avatar+meta, stats, reorder card, sent list. Tabbar handles the rest. |
| 10 | `scan.jsx` `TAB_ICONS` / `scan.css` `.tabbar .tab .ic` | Replaced character icons with inline SVGs: house outline (home), bordered grid with sticker peel (stickers), pencil with mark (drafts), bell with notification dot (alerts). CSS sizes the wrapper at 22 × 22 and inherits color via `currentColor`. |

### Bonus fix (carryover from iter 2)

| Where | What changed |
|-------|--------------|
| `shop.jsx` ScreenShop | Filter chips are now wired to the grid. Map: love→love, thanks→thank-you, thinking→thinking, birthday→birthday, wins→congrats, sorry→im-sorry. Count caption updates ("X of 6 · scroll for more ↓"). Empty-state copy: "nothing in this corner yet." |

### Verification (after fixes)

- Scan lock — favicon "to/" + brand voice URL + camera target visible at 18% opacity inside corner brackets. ✓
- Account tab bar — 4 recognizable SVG icons. ✓ (verified via the localStorage-seed account screenshot)
- Landing i'm sorry tile — dusty grey-brown swatch matches the rhythm. ✓
- Shop filter chips — tapping a chip narrows the grid. (Functional verification needed via click iteration.)

### Carryover (open for next iter)

- Per-pack landing identity — increase glyph size and tint paper per pack.
- Verify shop filter UX by clicking through each chip + the empty case.
- Halo on wax for tap affordance (sealed) — still open.
- Same dead-end "see how it works" pattern exists in picks.jsx and midfi-frames.jsx (low-priority since those are not in the customer-facing flow).
- Settings link in account top-right currently dead-ends.
- Per-card detail view from sent list — check if it's wired properly.
- Cracking → opened transition: verify the 3D wax crack reads on first run.

---

## Iteration 2 — 2026-05-12 22:10 UTC
*Viewport: 390 × 844, mobile raw mode. Tester run as a fresh sub-agent with no memory of iteration 1.*

### Findings (sub-agent UX tester)

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | landing — hero kicker | high | Translucent paper pill over warm gradient → mono text barely readable. |
| 2 | shop — catalog | high | Promise of "six things" but only 2 cards crest the fold at 390 px; no scroll cue. |
| 3 | prototype — review header | medium | "— · REVIEW & SEAL" with no step number breaks confidence right before the irreversible seal. |
| 4 | prototype — review | medium | Clay-tinted EDIT pills pull the eye more than the primary "HOLD TO SEAL" CTA; hit area also <44 pt. |
| 5 | prototype — sealed | medium | ~310 px of empty top-half + "tap to open." pinned to screen-foot ≈250 px below the envelope — gesture target and instruction don't visually connect. |
| 6 | landing → shop | medium | Shop H1 reads smaller/quieter than landing's H1 despite using the same class — voice drops at conversion. |
| 7 | prototype — review | low | `blush · wax "e"` is cryptic shorthand. |
| 8 | shop — chips | low | Solid clay "all" active state competes with the page title for the eye. |
| 9 | landing — i'm sorry card | low | `the hardest pack to mail.` reads as a usability warning before purchase. |
| 10 | landing — footer | low | Wraps with mixed alignment on phones — orphaned closer. |

**Verdict (sub-agent):** _Tender baseline is intact; biggest leverage is fixing the hero kicker legibility + shop's "ends-too-soon" fold problem._

### Fixes applied this iteration

| # | Where | What changed |
|---|-------|--------------|
| 1 | `index.html` `.hero-kicker` | Solid `var(--paper)` background, clay-18% 1px border, 11.5 px / 500 wt, soft shadow. Now legible. |
| 2 | `shop.css` `.prod-card .hero` | `aspect-ratio: 1.45 → 1.8` so 3 cards crest the fold. Also added a `1 / 6 · SCROLL FOR MORE ↓` mono caption under the chips in `shop.jsx`. |
| 3 | `prototype.jsx` ScreenReview | Step label now `final · REVIEW & SEAL`. ScreenHead's mono renderer updated to accept non-numeric step values. |
| 4 | `prototype.css` `.edit-link` | Ghost text style — no pill, `var(--ink-60)` color, underline-on-hover, 12 px vertical padding for ~44 pt hit area. |
| 5 | `prototype.jsx` EnvelopeStage / `prototype.css` `.env-stage` | `.env-stage` now `flex-direction: column` with the tap-hint as a child (sealed only). Hint sits ~36 px below the envelope with a pulsing clay dot. Old screen-foot tap-hint removed from ScreenSealed. |
| 6 | `shop.jsx` | "shop." now `tx-display` 48 px paired baseline-aligned with the hand-script subtitle on the same row. Magazine feel preserved. |
| 7 | `prototype.jsx` review summary | `blush · wax "e"` → `blush envelope · wax monogram "e"`. |
| 8 | `shop.css` `.chip.on` | Soft blush fill + plum text + clay 1 px outline (was solid clay/paper). Reads as "selected", not a CTA. |
| 9 | `index.html` pack blurb | `the hardest pack to mail.` → `the bravest pack to send.` |
| 10 | `index.html` `@media ≤520px` | Footer flexes column / center on phones; nav links wrap centered. |

### Verification (after fixes)

- Hero kicker — re-screenshotted: clean paper pill, fully legible. ✓
- Shop catalog — 3 cards visible above the fold, "1 / 6 · scroll for more" cue showing. ✓
- Review header — "FINAL · REVIEW & SEAL" displayed. ✓
- Edit links — ghost text, primary CTA is clearly the wax. ✓
- Sealed envelope — "tap to open." sits directly under the envelope with pulse dot. ✓
- Shop "shop." H1 — display-size next to script subtitle. ✓
- Envelope summary in review — full sentence renders. ✓
- Active chip soft. ✓

### Carryover (open for next iter)

- Wire filter chips to actually filter the pack grid.
- Sticker peek tiles on landing still all look similar at a glance — pack identity could use stronger per-pack color/illustration.
- Scan viewfinder still empty — add a stylized target.
- "see how it works" link on welcome footer dead-ends.
- The hero kicker → headline gap on landing might still feel tight; check breathing room with the new pill background.
- Consider a soft halo on the wax during sealed state for extra tap affordance.

---

## Iteration 1 — 2026-05-12 22:00 UTC
*Viewport: 390 × 844 (raw mobile mode auto-on).*

### Findings

| # | Screen | Severity | Issue |
|---|--------|---------:|-------|
| 1 | landing — hero | high | The italic accent word "*lives*" in the headline used `--clay` over a warm clay/champ gradient, contrast far too low — read as a ghost word. |
| 2 | landing — nav | high | The "shop stickers" CTA pill in the top-right rendered as an unlabeled dark sliver in early screenshots; specificity-clash with `.nav-links a` could win out before fonts settled. |
| 3 | shop — catalog | medium | Filter chips were `all / love / thanks / seasonal / sorry` — three of the six pack categories (birthday, thinking, congrats/wins) had no matching chip. Felt arbitrary. |
| 4 | prototype — step header | medium | "STEP 1 OF 5 · TO & FROM" wrapped to two lines at 390 px because the back/× buttons were squeezing the mono label. |
| 5 | prototype — sealed | high | Recipient name "to: rachel." sat at `top: 32%` of the envelope, right where the 88-px 3D wax seal lives. The 3D seal completely covered the name. |
| 6 | shop — pack detail | low | "save 14%" / "best value" tier tags sit at `top: -8px` of their card — they don't clip but they live extremely close to whatever's above. Acceptable for now. |
| 7 | shop — checkout (false alarm) | — | Initial fullPage screenshot only showed "subtotal $24" — DOM inspection confirmed shipping + total render correctly; the screenshot was cropped by the inner `.screen-body` scroll. No fix needed. |
| 8 | landing — hero stage | low | The wrapped-gift CSS scene + sticker reads small on phone. The screenshot before fixes felt empty-center; with the headline fix, balance is better. Re-evaluate next iter. |
| 9 | landing — sticker peek | low | All six pack tiles look visually identical at a glance — same paper-square QR with a tiny icon. Pack identity could be communicated more strongly (color/letter/illustration). |
| 10 | scan — lock screen | low | The viewfinder area in the middle of the screen is just empty dark space. Could use a faint QR-target hint or stylized sticker silhouette to make the scan affordance clearer. |
| 11 | prototype — welcome footer | low | The "or, see how it works ↗" link below the begin button currently dead-ends — it's just a span, no href. Either wire it to `/index.html#how` or remove. |

### Fixes applied this iteration

| # | Where | What changed |
|---|-------|--------------|
| 1 | `index.html` | `.hero h1 em { color: var(--plum); }` plus a behind-the-letters `::after` blush highlight strip. The word now reads as a deliberate accent, not a ghost. |
| 2 | `index.html` | Promoted `.nav-cta` to `.nav .nav-cta` for higher specificity. Bumped weight 500 → 600, padding 9/16 → 10/18, added `white-space: nowrap`. |
| 3 | `shop.jsx` | `FILTERS` updated to `["all", "love", "thanks", "thinking", "birthday", "wins", "sorry"]` — every pack now has a matching chip. Note: filter logic still cosmetic, not yet hooked to the grid. |
| 4 | `prototype.jsx` | Step label changed from `step {N} of {total} · {label}` to `{N}/{total} · {label}` with `white-space: nowrap`. "1/5 · TO & FROM" fits one line. |
| 5 | `prototype.css` | `.env-frame .recipient { top: 14%; font-size: 30px; z-index: 4; }` (was `top: 32%`, `font-size: 36px`). Name now sits cleanly above the 3D seal. Verified visually. |

### Carryover (open for next iter)

- #6 tier tags — review if any device sees clipping.
- #9 sticker peek identity — explore stronger per-pack treatment (color tint on the paper, larger icon, or a small pack name overlay).
- #10 scan viewfinder — add a stylized target.
- #11 "see how it works" footer link — wire or remove.
- Filter chip behavior — actually filter the pack grid by category.
- The hero kicker chip "SMALL, HAND-DESIGNED, MADE WITH LOVE" sits very close to the headline — feels stacked, could use 8–12 px more breathing room.
- Compare-screenshot before/after for the nav CTA in a real-mobile cold-fonts state to confirm fix.

### Verification (after fixes)

- Hero "*lives*" — re-screenshot at 390 × 844: word is plum + blush highlight, fully legible. ✓
- Nav CTA — pill shows "shop stickers" in white on plum. ✓
- Sealed envelope — "to: rachel." rendered above the wax seal, both visible. ✓
- Step header — fits one line on 390 px width. (not re-screenshotted; deterministic from CSS change)

---

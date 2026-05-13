/* midfi-frames.jsx — mid-fi mockups for to/froms
   Each frame is a complete production-scale 390-wide phone screen.
*/

/* ─── shared bits ─── */

const Status = ({ tone = "light", time = "9:41" }) => (
  <div className={`ph-status ${tone === "dark" ? "dark" : ""}`}>
    <span>{time}</span>
    <span className="icons">
      <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
        <rect x="0" y="3" width="3" height="8" rx="0.5" />
        <rect x="5" y="1" width="3" height="10" rx="0.5" opacity="0.85" />
        <rect x="10" y="0" width="3" height="11" rx="0.5" opacity="0.7" />
        <rect x="15" y="2" width="3" height="9" rx="0.5" opacity="0.45" />
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M 1 4 Q 8 -1 15 4" />
        <path d="M 3 6 Q 8 2 13 6" />
        <path d="M 5 8 Q 8 5 11 8" />
        <circle cx="8" cy="10" r="0.8" fill="currentColor" stroke="none" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3" />
        <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
        <rect x="23.5" y="4" width="1.5" height="4" fill="currentColor" />
      </svg>
    </span>
  </div>
);

const Phone = ({ children, statusTone = "light", homeTone = "light", className = "", screenStyle = {}, time = "9:41" }) => (
  <div className={`ph ${className}`}>
    <Status tone={statusTone} time={time} />
    <div className="ph-island" />
    <div className="ph-screen ph-grain" style={screenStyle}>{children}</div>
    <div className={`ph-home ${homeTone === "dark" ? "dark" : ""}`} />
  </div>
);

const Photo = ({ variant = "moss", label, h = 280, style = {}, children, className = "" }) => (
  <div className={`photo photo-${variant} ${className}`} style={{ height: h, ...style }}>
    {children}
    {label && <span className="ph-label">{label}</span>}
  </div>
);

/* ─── 01 Landing — hero ─────────────────────────────────────── */

const FrameLandingHero = () => (
  <Phone>
    <div className="col gap-24" style={{ padding: "8px 24px 0" }}>
      <div className="row-between" style={{ marginTop: 4 }}>
        <span className="tx-h4" style={{ fontStyle: "italic" }}>to/froms</span>
        <div className="row gap-16">
          <span className="tx-mono">shop</span>
          <span className="tx-mono">how</span>
          <span style={{ width: 18, height: 18, borderRadius: 999, border: "1px solid var(--ink-40)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11 }}>=</span>
        </div>
      </div>

      <div className="col gap-16" style={{ marginTop: 28 }}>
        <span className="tx-mono">— a card for the gift</span>
        <h1 className="tx-display">a card<br/>that <em>lives</em><br/>on the gift.</h1>
        <p className="tx-body" style={{ maxWidth: 300, marginTop: 6 }}>hand-designed qr stickers. scan once to leave a private note. peel, stick, send.</p>
      </div>

      <div className="col gap-12" style={{ marginTop: 8 }}>
        <button className="btn btn-primary btn-block btn-lg">shop stickers →</button>
        <a className="tx-hand-sm" style={{ textAlign: "center", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 4 }}>or, see how it works ↓</a>
      </div>
    </div>

    <Photo variant="hand" label="a hand reaching for the sticker" h={300} style={{ marginTop: 28, marginLeft: 24, marginRight: 24, borderRadius: 18 }} />

    <div className="col gap-8" style={{ padding: "32px 24px 0", borderTop: "1px dashed var(--ink-24)", marginTop: 32 }}>
      <span className="tx-mono">— how it works</span>
      <h2 className="tx-h2" style={{ marginTop: 8 }}>three small steps.</h2>
    </div>
  </Phone>
);

/* ─── 02 Shop — index ───────────────────────────────────────── */

const FrameShopIndex = () => (
  <Phone>
    <div className="row-between p-h" style={{ paddingTop: 4 }}>
      <span className="tx-mono">← back</span>
      <span className="tx-mono">cart (0)</span>
    </div>

    <div className="col gap-8 p-h" style={{ marginTop: 32 }}>
      <span className="tx-mono">— shop</span>
      <h1 className="tx-h1">shop.</h1>
      <p className="tx-hand">six things, this season.</p>
    </div>

    <div className="row gap-8 p-h" style={{ marginTop: 28, overflowX: "auto" }}>
      <span className="tag tag-clay">all</span>
      <span className="tag tag-paper">florals</span>
      <span className="tag tag-paper">type</span>
      <span className="tag tag-paper">love</span>
      <span className="tag tag-paper">birthdays</span>
    </div>

    <div className="col p-h gap-24" style={{ marginTop: 32 }}>
      {[
        { name: "moss wreath", price: "$8", line: "for the friend who keeps your plants alive.", photo: "moss" },
        { name: "letter type", price: "$8", line: "for the one who still sends postcards.", photo: "letter" },
        { name: "small peony", price: "$10", line: "the gift you'd give a sister.", photo: "peony" },
      ].map((it, i) => (
        <div key={it.name} className="col gap-12" style={{ paddingBottom: 24, borderBottom: i < 2 ? "1px dashed var(--ink-24)" : "none" }}>
          <Photo variant={it.photo} h={300} style={{ borderRadius: 14 }} />
          <div className="row-between" style={{ alignItems: "baseline" }}>
            <h3 className="tx-h3" style={{ fontStyle: "italic" }}>{it.name}</h3>
            <span className="tx-mono" style={{ fontSize: 13, color: "var(--plum)" }}>{it.price}</span>
          </div>
          <p className="tx-body-sm">{it.line}</p>
        </div>
      ))}
    </div>
  </Phone>
);

/* ─── 03 PDP ───────────────────────────────────────────────── */

const FramePDP = () => (
  <Phone statusTone="dark">
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 460, marginTop: -54 }}>
      <Photo variant="moss" h={460} label="HERO · MOSS WREATH" style={{ borderRadius: 0 }} />
      <div style={{ position: "absolute", top: 60, left: 24, right: 24, display: "flex", justifyContent: "space-between", zIndex: 7 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--paper)", letterSpacing: "0.1em" }}>← BACK</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--paper)", letterSpacing: "0.1em" }}>♡   ⤴︎</span>
      </div>
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, color: "var(--paper-80)", letterSpacing: "0.3em", zIndex: 7 }}>● ○ ○ ○</div>
    </div>

    <div style={{ position: "absolute", top: 420, left: 0, right: 0, background: "var(--paper)", borderRadius: "24px 24px 0 0", padding: "28px 24px 100px", minHeight: 460 }} className="ph-grain">
      <div className="col gap-12">
        <span className="tx-mono">— this season's pick</span>
        <h1 className="tx-h1">moss<br/>wreath.</h1>
        <div className="row-between" style={{ alignItems: "baseline", marginTop: 4 }}>
          <span className="tx-mono" style={{ color: "var(--plum)", fontSize: 13 }}>$8 · SET OF 3</span>
          <span className="tag tag-blush">2.5" round</span>
        </div>
        <p className="tx-body" style={{ marginTop: 10 }}>a tiny moss-green wreath, hand-illustrated on cream paper. for the friend who keeps your plants alive when you're away.</p>

        <div className="row-between" style={{ marginTop: 18 }}>
          <div className="row gap-16" style={{ alignItems: "center", padding: "10px 18px", borderRadius: 999, border: "1px solid var(--ink-24)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17 }}>
            <span style={{ color: "var(--ink-60)" }}>−</span>
            <span>1</span>
            <span style={{ color: "var(--clay)" }}>+</span>
          </div>
          <span className="tx-mono">what's inside ▾</span>
        </div>

        <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }}>add to cart · $8</button>
      </div>
    </div>
  </Phone>
);

/* ─── 04 Activation — message step ──────────────────────────── */

const FrameActivationMessage = () => (
  <Phone>
    <div className="col gap-16 p-h" style={{ paddingTop: 4 }}>
      <div className="row gap-6" style={{ marginTop: 4 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= 3 ? "var(--clay)" : "var(--ink-12)" }} />
        ))}
      </div>
      <div className="row-between">
        <span className="tx-mono">step 3 of 5 · message</span>
        <span className="tx-mono" style={{ color: "var(--ink-40)" }}>skip</span>
      </div>

      <h1 className="tx-h1" style={{ marginTop: 24 }}>what would<br/>you say if you had<br/>her <em>right here?</em></h1>

      <div className="col gap-4" style={{ marginTop: 12 }}>
        <span className="tx-hand-sm" style={{ color: "var(--clay)" }}>your message:</span>
        <div style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--ink-12)", borderRadius: 18, padding: "20px 18px", minHeight: 180 }}>
          <p className="tx-h3" style={{ fontStyle: "italic", color: "var(--plum)", lineHeight: 1.25 }}>
            thirty years.<br/>
            you still make me<br/>
            read aloud.
          </p>
          <span style={{ display: "inline-block", width: 1.5, height: 22, background: "var(--clay)", marginTop: 4, verticalAlign: "middle", animation: "blink 1s steps(1) infinite" }} />
        </div>
        <div className="row-between" style={{ marginTop: 6 }}>
          <span className="tx-hand-sm">a line or a letter — both work.</span>
          <span className="tx-mono">32 / 280</span>
        </div>
      </div>

      <div className="col gap-6" style={{ marginTop: 18 }}>
        <span className="tx-mono">prompts</span>
        <div className="row gap-8" style={{ flexWrap: "wrap" }}>
          <span className="tag tag-paper">birthday</span>
          <span className="tag tag-paper">thinking of you</span>
          <span className="tag tag-paper">just because</span>
          <span className="tag tag-paper">i'm sorry</span>
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 24, right: 24, bottom: 50 }}>
      <button className="btn btn-primary btn-block btn-lg">continue →</button>
    </div>
  </Phone>
);

/* ─── 05 Activation — envelope picker ───────────────────────── */

const FrameActivationEnvelope = () => {
  const envelopes = [
    { name: "blush", bg: "#F4D6CC", txt: "var(--plum)" },
    { name: "sage", bg: "#7C8A6B", txt: "white" },
    { name: "champagne", bg: "#D9B382", txt: "var(--plum)" },
    { name: "paper", bg: "#F8F1E7", txt: "var(--plum)", border: "var(--ink-24)" },
    { name: "clay", bg: "#C97B5A", txt: "white" },
    { name: "midnight", bg: "#3B2A2F", txt: "var(--paper)" },
  ];
  return (
    <Phone>
      <div className="col gap-16 p-h" style={{ paddingTop: 4 }}>
        <div className="row gap-6" style={{ marginTop: 4 }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--clay)" }} />
          ))}
        </div>
        <div className="row-between">
          <span className="tx-mono">step 5 of 5 · envelope</span>
        </div>

        <h1 className="tx-h1" style={{ marginTop: 24 }}>choose the<br/><em>moment.</em></h1>
        <p className="tx-body" style={{ maxWidth: 300 }}>this is the first thing they'll see when they scan.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
          {envelopes.map((e, i) => (
            <div key={e.name} style={{ position: "relative", aspectRatio: "1.45", borderRadius: 12, background: e.bg, border: i === 0 ? "2px solid var(--clay)" : (e.border ? `1px solid ${e.border}` : "1px solid var(--ink-08)"), padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: i === 0 ? "0 8px 24px -10px rgba(201,123,90,0.4)" : "0 2px 8px -4px rgba(59,42,47,0.15)" }}>
              <div style={{ height: 24 }}>
                {i === 0 && <span style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 999, background: "var(--clay)", color: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: e.txt === "white" || e.txt === "var(--paper)" ? "rgba(255,255,255,0.8)" : "var(--clay)" }} />
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: e.txt }}>{e.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 24, right: 24, bottom: 50 }}>
        <button className="btn btn-primary btn-block btn-lg">preview your card →</button>
      </div>
    </Phone>
  );
};

/* ─── 06 Reveal — sealed envelope ───────────────────────────── */

const FrameRevealSealed = () => (
  <Phone statusTone="dark" homeTone="dark" screenStyle={{ background: "#ECDFCC" }}>
    <div style={{ position: "absolute", inset: 0, padding: "70px 28px 60px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div className="col gap-4" style={{ alignItems: "flex-end" }}>
        <span className="tx-mono">— a letter</span>
      </div>

      <div style={{ position: "relative", flex: 1, marginTop: 30, marginBottom: 24, background: "linear-gradient(180deg, #F8E8D2 0%, #E8D2B5 100%)", borderRadius: 4, boxShadow: "0 30px 60px -20px rgba(59,42,47,0.3), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
        {/* envelope flap */}
        <svg viewBox="0 0 334 200" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: "62%" }}>
          <path d="M 0 0 L 334 0 L 167 130 Z" fill="#E8D2B5" stroke="rgba(59,42,47,0.15)" strokeWidth="0.5" />
          <path d="M 0 0 L 167 130" stroke="rgba(59,42,47,0.1)" strokeWidth="0.5" />
          <path d="M 334 0 L 167 130" stroke="rgba(59,42,47,0.1)" strokeWidth="0.5" />
        </svg>
        {/* recipient handwritten */}
        <div style={{ position: "absolute", top: "18%", left: 0, right: 0, textAlign: "center" }}>
          <span className="tx-hand-lg" style={{ color: "var(--clay)", fontSize: 38 }}>to: maya.</span>
        </div>
        {/* wax seal */}
        <div style={{ position: "absolute", top: "53%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #D88A6A 0%, #C97B5A 40%, #8B4A30 100%)", boxShadow: "0 4px 12px rgba(0,0,0,0.25), inset -4px -6px 12px rgba(0,0,0,0.2), inset 4px 4px 8px rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 32, color: "rgba(248,241,231,0.85)", textShadow: "0 1px 2px rgba(0,0,0,0.3)", fontVariationSettings: "'SOFT' 80, 'opsz' 96" }}>t/f</span>
            <span style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.1)" }} />
          </div>
        </div>
        {/* bottom info */}
        <div style={{ position: "absolute", bottom: 20, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div className="col gap-2">
            <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-60)" }}>FROM</span>
            <span className="tx-hand-sm" style={{ color: "var(--plum)", fontSize: 18 }}>em ✶</span>
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-60)" }}>#TF-2103</span>
        </div>
      </div>

      <div className="col gap-12" style={{ alignItems: "center" }}>
        <span className="tx-hand" style={{ color: "var(--ink-80)" }}>tap to open.</span>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--clay)" }} />
      </div>
    </div>
  </Phone>
);

/* ─── 07 Reveal — card opened ───────────────────────────────── */

const FrameRevealCard = () => (
  <Phone>
    <div className="col gap-16 p-h" style={{ paddingTop: 4 }}>
      <div className="row-between">
        <span className="tx-mono">a letter from em</span>
        <span className="tx-mono">·  ·  ·</span>
      </div>

      <div style={{ marginTop: 12, position: "relative", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 240, padding: "16px 16px 56px", background: "var(--paper)", boxShadow: "0 16px 40px -16px rgba(59,42,47,0.3), 0 4px 12px -4px rgba(59,42,47,0.15)", transform: "rotate(-2deg)", border: "1px solid var(--ink-08)" }}>
          <Photo variant="couple" h={240} style={{ borderRadius: 0 }} />
          <span className="tx-hand" style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", color: "var(--plum)" }}>maya, kyoto '24</span>
        </div>
        {/* drifting pressed petal */}
        <span style={{ position: "absolute", top: 80, right: 30, width: 18, height: 24, background: "radial-gradient(circle at 40% 40%, #EFC2B4, #C97B5A)", borderRadius: "60% 40% 60% 40% / 50% 60% 40% 50%", opacity: 0.85, transform: "rotate(-25deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }} />
      </div>

      <div className="col gap-12" style={{ marginTop: 28 }}>
        <p className="tx-h2" style={{ fontStyle: "italic", lineHeight: 1.2 }}>
          thirty years.<br/>
          you still make me<br/>
          read aloud.
        </p>
        <p className="tx-hand-lg" style={{ textAlign: "right", fontSize: 28, marginTop: 2 }}>— em</p>
      </div>

      <div className="divider-dashed" style={{ marginTop: 18 }} />

      <div className="row gap-12" style={{ alignItems: "center", marginTop: 6, padding: "12px 14px", borderRadius: 14, background: "var(--paper-2)" }}>
        <div style={{ width: 44, height: 44, borderRadius: 6, background: "linear-gradient(135deg, #C97B5A, #3B2A2F)" }} />
        <div className="col" style={{ flex: 1 }}>
          <span className="tx-h4">a song she chose</span>
          <span className="tx-caption">resolved track · 3:42</span>
        </div>
        <span style={{ width: 36, height: 36, borderRadius: 999, background: "var(--clay)", color: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>▶</span>
      </div>

      <div className="row-between" style={{ marginTop: 14 }}>
        <span className="tx-hand-sm">opened just now</span>
        <span className="tx-mono">↳ reply</span>
      </div>
    </div>
  </Phone>
);

/* ─── 08 Success ────────────────────────────────────────────── */

const FrameSuccess = () => (
  <Phone>
    <div className="col p-h" style={{ paddingTop: 4, alignItems: "center", textAlign: "center", height: "100%" }}>
      <div style={{ marginTop: 80 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <g stroke="var(--clay)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 32 10 C 24 18, 24 26, 32 32 C 40 26, 40 18, 32 10 Z" />
            <g transform="rotate(60 32 32)">
              <path d="M 32 10 C 24 18, 24 26, 32 32 C 40 26, 40 18, 32 10 Z" />
            </g>
            <g transform="rotate(120 32 32)">
              <path d="M 32 10 C 24 18, 24 26, 32 32 C 40 26, 40 18, 32 10 Z" />
            </g>
            <circle cx="32" cy="32" r="3" fill="var(--champ)" stroke="none" />
          </g>
        </svg>
      </div>

      <h1 className="tx-display" style={{ marginTop: 32, fontSize: 56 }}>thank<br/><em>you.</em></h1>
      <span className="tx-mono" style={{ marginTop: 18 }}>ORDER #TF-2103</span>

      <div style={{ background: "var(--blush)", borderRadius: 18, padding: "28px 24px", marginTop: 32, width: "100%" }}>
        <p className="tx-hand-lg" style={{ color: "var(--plum)", fontSize: 28 }}>
          your stickers are<br/>
          on their way.
        </p>
        <p className="tx-hand-sm" style={{ marginTop: 14, color: "var(--ink-80)" }}>
          we'll write when they're<br/>packed by hand.
        </p>
      </div>

      <div className="col gap-12" style={{ width: "100%", marginTop: 32 }}>
        <button className="btn btn-ghost btn-block">back to shop</button>
        <span className="tx-hand-sm" style={{ textAlign: "center" }}>or — get a heads-up when they ship ↗</span>
      </div>
    </div>
  </Phone>
);

/* ─── Assembly ───────────────────────────────────────────────── */

const App = () => {
  const sections = [
    {
      id: "landing",
      title: "01 · landing",
      blurb: "type-led hero, photo supports. brand voice intact.",
      frames: [
        { id: "landing-hero", label: "hero · above the fold", w: 390, h: 940, render: () => <FrameLandingHero /> },
      ],
    },
    {
      id: "shop",
      title: "02 · shop + product",
      blurb: "single-column journal. each sticker gets a sentence on the index.",
      frames: [
        { id: "shop-index", label: "shop · index", w: 390, h: 1380, render: () => <FrameShopIndex /> },
        { id: "shop-pdp", label: "product detail · moss wreath", w: 390, h: 880, render: () => <FramePDP /> },
      ],
    },
    {
      id: "activation",
      title: "04 · activation",
      blurb: "one task per screen. five small ceremonies.",
      frames: [
        { id: "act-message", label: "step 3 · the message", w: 390, h: 880, render: () => <FrameActivationMessage /> },
        { id: "act-envelope", label: "step 5 · envelope picker", w: 390, h: 880, render: () => <FrameActivationEnvelope /> },
      ],
    },
    {
      id: "reveal",
      title: "05 · recipient reveal",
      blurb: "wax seal break. the only place we go big with motion.",
      frames: [
        { id: "rev-sealed", label: "envelope · sealed · 0.0s", w: 390, h: 880, render: () => <FrameRevealSealed /> },
        { id: "rev-card", label: "card · revealed · 1.6s", w: 390, h: 880, render: () => <FrameRevealCard /> },
      ],
    },
    {
      id: "success",
      title: "03 · success",
      blurb: "the close. letterpress moment, not a confetti dump.",
      frames: [
        { id: "success-1", label: "thank you", w: 390, h: 880, render: () => <FrameSuccess /> },
      ],
    },
  ];

  return (
    <DesignCanvas>
      {sections.map(sec => (
        <DCSection key={sec.id} id={sec.id} title={sec.title} subtitle={sec.blurb}>
          {sec.frames.map(f => (
            <DCArtboard key={f.id} id={f.id} label={f.label} width={f.w} height={f.h}>
              {f.render()}
            </DCArtboard>
          ))}
        </DCSection>
      ))}
    </DesignCanvas>
  );
};

window.MidFiApp = App;

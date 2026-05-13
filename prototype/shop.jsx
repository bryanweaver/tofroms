/* shop.jsx — clickable prototype: shop catalog → pack detail → cart → checkout → success */

const { useState, useEffect, useMemo } = React;

const LS_KEY = "tf-shop-v1";
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const save = (s) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} };

const STEPS = [
  { id: "shop",     label: "shop · index" },
  { id: "pack",     label: "pack detail" },
  { id: "cart",     label: "cart sheet" },
  { id: "checkout", label: "checkout" },
  { id: "success",  label: "confirmation" },
  { id: "empty",    label: "empty state" },
];

const PACKS = [
  { id: "birthday",    title: "the birthday set",   blurb: "candles, confetti, cake.", hand: "happy day",   color: "#F4D6CC", accent: "#C97B5A", glyphs: ["b", "★", "🎂", "•"] },
  { id: "thank-you",   title: "thank-you, plainly", blurb: "small words. big debts.",  hand: "thank you",   color: "#D9B382", accent: "#A85F40", glyphs: ["ty", "✦", "thx", "❀"] },
  { id: "thinking",    title: "thinking of you",    blurb: "for the in-between days.", hand: "thinking",    color: "#7C8A6B", accent: "#3B2A2F", glyphs: ["of", "•", "you", "~"] },
  { id: "love",        title: "the love letter",    blurb: "for the soft, soft kind.", hand: "love",        color: "#F4D6CC", accent: "#A85F40", glyphs: ["xo", "♡", "&", "u"] },
  { id: "congrats",    title: "well done.",         blurb: "graduations, raises, wins.", hand: "well done", color: "#C97B5A", accent: "#3B2A2F", glyphs: ["!", "✦", "→", "yay"] },
  { id: "im-sorry",    title: "i'm sorry.",         blurb: "the hardest pack to mail.", hand: "i'm sorry",  color: "#ECDFCC", accent: "#A85F40", glyphs: ["i", "—", "u", "✕"] },
];

const TIERS = [
  { id: "4",  qty: 4,  price: 14, save: null },
  { id: "8",  qty: 8,  price: 24, save: "save 14%" },
  { id: "12", qty: 12, price: 32, save: "best value" },
];

/* ─── Icons for QR centers ─── */
const ICONS = {
  birthday: (
    /* candle */
    <g>
      <path d="M-6 -10 q 0 -5 0 -8 q 0 -3 -3 -3 q -3 0 -3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="-9" y="-9" width="6" height="16" rx="1" fill="currentColor"/>
      <path d="M-14 12 h 28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="5" cy="-4" r="1.6" fill="currentColor"/>
      <circle cx="9" cy="4" r="1.6" fill="currentColor"/>
    </g>
  ),
  "thank-you": (
    /* bow */
    <g fill="currentColor">
      <path d="M-14 0 q -2 -8 4 -10 q 6 -2 6 6 q 0 -8 6 -6 q 6 2 4 10 q 2 8 -4 10 q -6 2 -6 -6 q 0 8 -6 6 q -6 -2 -4 -10 z" />
      <circle cx="0" cy="0" r="2.6" fill="var(--paper)" />
    </g>
  ),
  thinking: (
    /* ellipsis cloud */
    <g fill="currentColor">
      <circle cx="-8" cy="0" r="3"/>
      <circle cx="0" cy="0" r="3"/>
      <circle cx="8" cy="0" r="3"/>
    </g>
  ),
  love: (
    /* heart */
    <path d="M0 12 C -14 2, -14 -10, -6 -10 C -2 -10, 0 -7, 0 -4 C 0 -7, 2 -10, 6 -10 C 14 -10, 14 2, 0 12 Z" fill="currentColor" />
  ),
  congrats: (
    /* starburst */
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
      <path d="M0 -12 V -4 M0 12 V 4 M-12 0 H -4 M12 0 H 4 M-9 -9 L -4 -4 M9 -9 L 4 -4 M-9 9 L -4 4 M9 9 L 4 4"/>
      <circle cx="0" cy="0" r="2.4" fill="currentColor" stroke="none"/>
    </g>
  ),
  "im-sorry": (
    /* wilted flower */
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M0 12 q 0 -10 -6 -14" />
      <ellipse cx="-7" cy="-4" rx="4" ry="3" transform="rotate(-30 -7 -4)" fill="currentColor" stroke="none"/>
      <ellipse cx="-2" cy="-10" rx="3.6" ry="3" transform="rotate(15 -2 -10)" fill="currentColor" stroke="none"/>
      <circle cx="-4" cy="-7" r="1.6" fill="var(--paper)" stroke="none"/>
    </g>
  ),
};

/* ─── FancyQR: a designer QR-code-style sticker ─── */
// Deterministic PRNG so each pack/index renders the same pattern.
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry32 = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const Finder = ({ x, y, color, cell = 1, bg = "var(--paper)" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={7 * cell} height={7 * cell} rx={1.6 * cell} fill={color} />
    <rect x={1 * cell} y={1 * cell} width={5 * cell} height={5 * cell} rx={1 * cell} fill={bg} />
    <rect x={2 * cell} y={2 * cell} width={3 * cell} height={3 * cell} rx={0.6 * cell} fill={color} />
  </g>
);

const FancyQR = ({ seed = "x", color = "#3B2A2F", accent = "#C97B5A", iconId, size = 80, bg = "var(--paper)" }) => {
  const N = 33; // denser, more like a real QR
  const FINDER = 7;
  const CENTER_R = 5; // clearance radius (in modules) around the icon
  const rnd = useMemo(() => {
    const r = mulberry32(hash(seed));
    const grid = [];
    const cx = (N - 1) / 2;
    for (let y = 0; y < N; y++) {
      const row = [];
      for (let x = 0; x < N; x++) {
        const inFinder =
          (x < FINDER + 1 && y < FINDER + 1) ||
          (x > N - FINDER - 2 && y < FINDER + 1) ||
          (x < FINDER + 1 && y > N - FINDER - 2);
        const inCenter = Math.abs(x - cx) <= CENTER_R && Math.abs(y - cx) <= CENTER_R;
        row.push(inFinder || inCenter ? 0 : (r() > 0.50 ? 1 : 0));
      }
      grid.push(row);
    }
    return grid;
  }, [seed]);

  const cell = size / (N + 2);
  const pad = cell;
  const icon = ICONS[iconId];
  const iconCenterX = ((N - 1) / 2 + 0.5) * cell;
  const iconCenterY = ((N - 1) / 2 + 0.5) * cell;
  // icon viewBox is -16..16 (32 units). Render at 20% of QR size.
  const iconRenderScale = (size * 0.20) / 32;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} rx={size * 0.13} fill={bg} />
      <g transform={`translate(${pad} ${pad})`}>
        {rnd.map((row, y) => row.map((v, x) => v ? (
          <rect key={`${x}-${y}`} x={x * cell + cell * 0.08} y={y * cell + cell * 0.08} width={cell * 0.84} height={cell * 0.84} rx={cell * 0.22} fill={color} />
        ) : null))}
        <Finder x={0}            y={0}            color={color} cell={cell} bg={bg} />
        <Finder x={(N - FINDER) * cell} y={0}            color={color} cell={cell} bg={bg} />
        <Finder x={0}            y={(N - FINDER) * cell} color={color} cell={cell} bg={bg} />
        {icon && (
          <g transform={`translate(${iconCenterX} ${iconCenterY}) scale(${iconRenderScale})`} style={{ color: accent }}>
            {icon}
          </g>
        )}
      </g>
    </svg>
  );
};

/* ─── shared chrome ─── */

const Status = ({ tone = "light" }) => (
  <div className={`ph-status ${tone === "dark" ? "dark" : ""}`}>
    <span>9:41</span>
    <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="3" width="3" height="8" rx="0.5" /><rect x="5" y="1" width="3" height="10" rx="0.5" opacity="0.85" /><rect x="10" y="0" width="3" height="11" rx="0.5" opacity="0.7" /><rect x="15" y="2" width="3" height="9" rx="0.5" opacity="0.45" /></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="22" height="11" rx="3" /><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" /><rect x="23.5" y="4" width="1.5" height="4" fill="currentColor" /></svg>
    </span>
  </div>
);

const BagGlyph = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7 H17 L16 20 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 Z"/>
    <path d="M6.5 7 V5 a3.5 3.5 0 0 1 7 0 V7"/>
  </svg>
);
const Wordmark = () => (
  <a href="/index.html" className="brand-mark" aria-label="to/froms home">
    to<em>/</em>froms
  </a>
);
const TopNav = ({ title, onBack, cartCount, onCart, right }) => (
  <div className="topnav">
    {onBack
      ? <span className="tx-mono" style={{ cursor: "pointer" }} onClick={onBack}>← back</span>
      : <Wordmark />}
    {right ? right : (
      <span className="cart-btn" onClick={onCart} style={{ cursor: onCart ? "pointer" : "default", color: "var(--plum)" }} aria-label={`cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
        <BagGlyph />
        {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </span>
    )}
  </div>
);

/* ─── 01 shop catalog ─── */
const ScreenShop = ({ onOpenPack, onOpenCart, cartCount, filter, setFilter, isEmpty }) => {
  if (isEmpty) return null;
  const FILTERS = ["all", "love", "thanks", "thinking", "birthday", "wins", "sorry"];
  return (
    <div className="screen">
      <Status />
      <TopNav cartCount={cartCount} onCart={onOpenCart} right={null} title="" />

      <div className="screen-body">
        <div className="p-h col gap-4" style={{ paddingTop: 8 }}>
          <div className="row gap-12" style={{ alignItems: "baseline", flexWrap: "wrap" }}>
            <h1 className="tx-display" style={{ fontSize: 48, lineHeight: 1 }}>shop.</h1>
            <p className="tx-hand" style={{ color: "var(--ink-60)" }}>six things, this season.</p>
          </div>
        </div>

        <div className="chip-scroll" style={{ marginTop: 16 }}>
          {FILTERS.map(f => (
            <span key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}</span>
          ))}
        </div>

        {(() => {
          const filterMap = { love: "love", thanks: "thank-you", thinking: "thinking", birthday: "birthday", wins: "congrats", sorry: "im-sorry" };
          const visible = filter === "all" ? PACKS : PACKS.filter(p => p.id === filterMap[filter]);
          const isFiltered = filter !== "all";
          return (
            <>
              <div className="p-h row" style={{ paddingTop: 10, paddingBottom: 4, gap: 10, alignItems: "baseline" }}>
                <span className="tx-mono" style={{ color: "var(--ink-40)", textTransform: "none", letterSpacing: "0.04em" }}>
                  {isFiltered
                    ? <>{visible.length} of {PACKS.length} · showing <span style={{ color: "var(--clay)" }}>{filter}</span></>
                    : `the full set · ${PACKS.length} packs`}
                </span>
                {isFiltered && (
                  <span className="tx-mono" style={{ color: "var(--ink-60)", cursor: "pointer", marginLeft: "auto", textTransform: "none", letterSpacing: "0.04em" }} onClick={() => setFilter("all")}>clear <span style={{ color: "var(--clay)" }}>×</span></span>
                )}
              </div>
              <div className="event-row" style={{ marginTop: 4 }}>
                {visible.length === 0 ? (
                  <div className="p-h" style={{ padding: "40px 28px", textAlign: "center" }}>
                    <p className="tx-hand" style={{ color: "var(--ink-60)" }}>nothing in this corner yet.</p>
                  </div>
                ) : visible.map(p => (
            <div key={p.id} className="prod-card" onClick={() => onOpenPack(p.id)}>
              <div className="hero" style={{ background: `linear-gradient(155deg, color-mix(in oklab, ${p.color} 92%, white) 0%, ${p.color} 60%, color-mix(in oklab, ${p.color} 75%, black) 100%)` }}>
                <div className="stickers">
                  {[0,1,2].map(i => (
                    <span key={i} className="sticker bare" style={{ transform: `rotate(${(i - 1) * 6}deg)` }}>
                      <FancyQR
                        seed={`${p.id}-${i}`}
                        color={i === 1 ? "#F8F1E7" : p.accent}
                        accent={i === 1 ? "#F8F1E7" : p.accent}
                        iconId={i === 1 ? p.id : null}
                        size={62}
                        bg={i === 1 ? p.color : "var(--paper)"}
                      />
                    </span>
                  ))}
                </div>
              </div>
              <div className="meta-row">
                <span className="tx-h3">{p.title}</span>
                <span className="tx-mono" style={{ textTransform: "none", letterSpacing: "0.04em", color: "var(--ink-60)" }}>from $14</span>
              </div>
              <span className="tx-hand-sm">{p.blurb}</span>
              <div className="prod-cta-row">
                <span className="prod-cta">see the set →</span>
              </div>
            </div>
          ))}
                {isFiltered && visible.length === 1 && (
                  <div className="p-h" style={{ paddingTop: 8, paddingBottom: 8 }}>
                    <div className="see-all-tile" onClick={() => setFilter("all")}>
                      <span className="tx-h3" style={{ fontSize: 18 }}>see all six →</span>
                      <span className="tx-hand-sm">browse the full set.</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          );
        })()}
        <div style={{ height: 28 }} />
      </div>
    </div>
  );
};

/* ─── 02 pack detail ─── */
const ScreenPack = ({ packId, onBack, onAdd, cartCount, onOpenCart }) => {
  const pack = PACKS.find(p => p.id === packId) || PACKS[0];
  const [tier, setTier] = useState("8");
  const t = TIERS.find(x => x.id === tier);
  return (
    <div className="screen">
      <Status />
      <TopNav onBack={onBack} cartCount={cartCount} onCart={onOpenCart} />

      <div className="screen-body">
        <div className="sticker-hero" style={{ background: `linear-gradient(165deg, color-mix(in oklab, ${pack.color} 92%, white) 0%, ${pack.color} 50%, color-mix(in oklab, ${pack.color} 70%, black) 100%)` }}>
          <div style={{ position: "relative", zIndex: 2, transform: "rotate(-3deg)", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.18))" }}>
            <FancyQR seed={`${pack.id}-hero`} color={pack.accent} accent={pack.accent} iconId={pack.id} size={180} />
          </div>
        </div>

        <div className="p-h col gap-8" style={{ paddingTop: 22 }}>
          <span className="tx-mono">scan-to-activate · waterproof · matte</span>
          <h1 className="tx-h1">{pack.title}</h1>
          <p className="tx-body">{pack.blurb} each sticker unlocks the activation flow when scanned.</p>
        </div>

        <div className="col gap-12" style={{ marginTop: 22 }}>
          <span className="tx-mono p-h">choose a pack size</span>
          <div className="tier-row">
            {TIERS.map(opt => (
              <div key={opt.id} className={`tier ${tier === opt.id ? "on" : ""}`} onClick={() => setTier(opt.id)}>
                {opt.save && <span className="save">{opt.save}</span>}
                <span className="qty">{opt.qty}</span>
                <span className="label">stickers</span>
                <span className="price">${opt.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col gap-12" style={{ marginTop: 24 }}>
          <span className="tx-mono p-h">what's inside</span>
          <div className="sticker-grid">
            {Array.from({length: t.qty}).map((_, i) => (
              <span key={i} className="cell bare" style={{ transform: `rotate(${((i % 5) - 2) * 3}deg)` }}>
                <FancyQR seed={`${pack.id}-g-${i}`} color={pack.accent} accent={pack.accent} iconId={pack.id} size={58} />
              </span>
            ))}
          </div>
        </div>

        <div style={{ height: 28 }} />
      </div>

      <div className="screen-foot">
        <button className="btn btn-primary btn-block" onClick={() => onAdd(pack, t)}>add to cart · ${t.price}</button>
      </div>
    </div>
  );
};

/* ─── 03 cart sheet (over shop) ─── */
const CartSheet = ({ items, onClose, onCheckout, updateQty, remove }) => {
  const subtotal = items.reduce((s, it) => s + it.price * it.count, 0);
  const ship = subtotal > 0 ? 4 : 0;
  const total = subtotal + ship;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="handle" />
        <div className="row-between">
          <span className="tx-h2">your cart</span>
          <span className="tx-mono" style={{ cursor: "pointer" }} onClick={onClose}>close</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", marginTop: 6 }}>
          {items.length === 0 ? (
            <div style={{ padding: "28px 0", textAlign: "center" }}>
              <p className="tx-hand">nothing in here yet.</p>
              <p className="tx-hand-sm" style={{ marginTop: 6 }}>maybe a small wreath?</p>
            </div>
          ) : items.map((it, i) => {
            const pack = PACKS.find(p => p.id === it.packId);
            return (
              <div key={i} className="cart-row">
                <div className="thumb" style={{ background: pack?.color || "var(--paper-2)", padding: 4 }}>
                  {pack && <FancyQR seed={`${pack.id}-cart`} color={pack.accent} accent={pack.accent} iconId={pack.id} size={48} />}
                </div>
                <div className="info">
                  <span className="tx-h3" style={{ fontSize: 16 }}>{pack?.title}</span>
                  <span className="tx-mono">{it.qty} stickers · ${it.price}</span>
                </div>
                <div className="qty-stepper">
                  <button onClick={() => updateQty(i, -1)}>−</button>
                  <span className="n">{it.count}</span>
                  <button onClick={() => updateQty(i, +1)}>+</button>
                </div>
                <span className="tx-mono" style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => remove(i)}>×</span>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <>
            <div style={{ borderTop: "1px dashed var(--ink-24)", paddingTop: 12, marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="row-between"><span className="tx-mono">subtotal</span><span className="tx-mono">${subtotal}</span></div>
              <div className="row-between"><span className="tx-mono">shipping</span><span className="tx-mono">${ship}</span></div>
              <div className="row-between" style={{ marginTop: 2 }}>
                <span className="tx-h3">total</span>
                <span className="tx-h2">${total}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={onCheckout}>check out →</button>
          </>
        )}
      </div>
    </>
  );
};

/* ─── 04 checkout ─── */
const ScreenCheckout = ({ items, onBack, onPlace, contact, setContact, ship, setShip, pay, setPay }) => {
  const subtotal = items.reduce((s, it) => s + it.price * it.count, 0);
  const shipping = 4;
  const total = subtotal + shipping;
  const ready = contact.email && ship.name && ship.address && ship.zip && pay;
  return (
    <div className="screen">
      <Status />
      <TopNav onBack={onBack} right={<span className="tx-mono">secure ✓</span>} />

      <div className="screen-body" style={{ paddingTop: 4 }}>
        <div className="p-h" style={{ paddingTop: 12 }}>
          <h1 className="tx-h1">checkout.</h1>
        </div>

        {/* Apple Pay express */}
        <div className="p-h" style={{ paddingTop: 18 }}>
          <button className={`pay-opt dark`} style={{ width: "100%", height: 52 }} onClick={() => { setPay("apple"); }}>
             Pay
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--ink-12)" }} />
            <span className="tx-mono">or</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-12)" }} />
          </div>
        </div>

        <div className="co-section">
          <span className="label"><span className="num">①</span> CONTACT</span>
          <input className="field" style={{ marginTop: 10 }} placeholder="your email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
          <p className="tx-hand-sm" style={{ marginTop: 8 }}>we'll send a receipt + tracking. no account needed.</p>
        </div>

        <div className="co-section">
          <span className="label"><span className="num">②</span> WHERE TO SEND THEM</span>
          <div className="col gap-8" style={{ marginTop: 10 }}>
            <input className="field" placeholder="full name" value={ship.name} onChange={e => setShip({ ...ship, name: e.target.value })} />
            <input className="field" placeholder="street address" value={ship.address} onChange={e => setShip({ ...ship, address: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 8 }}>
              <input className="field" placeholder="city" value={ship.city} onChange={e => setShip({ ...ship, city: e.target.value })} />
              <input className="field" placeholder="zip" value={ship.zip} onChange={e => setShip({ ...ship, zip: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="co-section">
          <span className="label"><span className="num">③</span> PAYMENT</span>
          <div className="pay-row" style={{ marginTop: 10 }}>
            <div className={`pay-opt ${pay === "card" ? "on" : ""}`} onClick={() => setPay("card")}>card</div>
            <div className={`pay-opt ${pay === "google" ? "on" : ""}`} onClick={() => setPay("google")}>G Pay</div>
          </div>
        </div>

        <div className="totals">
          <div className="line"><span>subtotal</span><span>${subtotal}</span></div>
          <div className="line"><span>shipping</span><span>${shipping}</span></div>
          <div className="grand"><span className="tx-h3">total</span><span className="v">${total}</span></div>
        </div>

        <div style={{ height: 24 }} />
      </div>

      <div className="screen-foot">
        <button className="btn btn-primary btn-block" disabled={!ready} onClick={onPlace}>place order · ${total}</button>
        <span className="tx-hand-sm" style={{ textAlign: "center" }}>physical stickers, mailed in 2–3 days.</span>
      </div>
    </div>
  );
};

/* ─── 05 success ─── */
const ScreenSuccess = ({ onBackToShop, orderNum, fromName }) => (
  <div className="screen">
    <Status />
    <div className="topnav">
      <Wordmark />
      <a href="/index.html" className="tx-mono" style={{ textTransform: "none", letterSpacing: "0.04em", color: "var(--ink-60)" }}>your orders ↗</a>
    </div>
    <div className="screen-body">
      <div style={{ paddingTop: 28, display: "flex", justifyContent: "center" }}>
        <div className="flourish">✓</div>
      </div>
      <div className="p-h col gap-4" style={{ alignItems: "center", paddingTop: 22, textAlign: "center" }}>
        <h1 className="tx-display">thank you.</h1>
        <p className="tx-hand" style={{ color: "var(--ink-80)" }}>a little package, on its way.</p>
      </div>

      <div className="receipt-card">
        <span className="stamp">sent</span>
        <p className="tx-hand" style={{ color: "var(--plum)" }}>your stickers are on their way.</p>
        <p className="tx-hand-sm" style={{ marginTop: 8 }}>we'll write when they're packed — usually within a day.</p>
      </div>

      <div className="scan-card" style={{ marginTop: 20, cursor: "pointer" }} onClick={() => { try { localStorage.setItem('tf-arrival', 'from-success'); } catch(_) {} window.location.href = "prototype.html"; }}>
        <div className="qr" />
        <div className="col gap-4" style={{ flex: 1 }}>
          <span className="tx-h3" style={{ fontSize: 16 }}>while you wait — start a draft</span>
          <span className="tx-hand-sm">save a message now; pick which sticker carries it when they arrive.</span>
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
    <div className="screen-foot">
      <button className="btn btn-primary btn-block" onClick={() => { try { localStorage.setItem('tf-arrival', 'from-success'); } catch(_) {} window.location.href = "prototype.html"; }}>start a draft →</button>
      <span className="tx-mono" style={{ textAlign: "center", color: "var(--ink-40)" }}>order tf-{orderNum.replace('TF-', '')}</span>
    </div>
  </div>
);

/* ─── 06 empty state ─── */
const ScreenEmpty = ({ onBrowse }) => (
  <div className="screen">
    <Status />
    <TopNav title="" right={<span className="tx-mono">cart · 0</span>} />
    <div className="screen-body" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="p-h col gap-16" style={{ alignItems: "center", textAlign: "center", paddingTop: 0 }}>
        <div className="empty-illo">— ·</div>
        <div className="col gap-8" style={{ alignItems: "center", marginTop: 18 }}>
          <h1 className="tx-h1">nothing in here<br/><em>yet.</em></h1>
          <p className="tx-body" style={{ maxWidth: 240 }}>start with a pack — the one that feels closest.</p>
        </div>
      </div>
    </div>
    <div className="screen-foot">
      <button className="btn btn-primary btn-block" onClick={onBrowse}>browse the shop →</button>
    </div>
  </div>
);

/* ─── App ─── */

const App = () => {
  const persisted = load();
  const [step, setStep] = useState(persisted.step || "shop");
  const [cart, setCart] = useState(persisted.cart || []);
  const [showCart, setShowCart] = useState(false);
  const [activePack, setActivePack] = useState(persisted.activePack || PACKS[0].id);
  const [filter, setFilter] = useState("all");

  const [contact, setContact] = useState({ email: "" });
  const [ship, setShip]       = useState({ name: "", address: "", city: "", zip: "" });
  const [pay, setPay]         = useState(null);

  const orderNum = useMemo(() => "TF-" + (2100 + Math.floor(Math.random() * 900)), [step === "success"]);

  useEffect(() => { save({ step, cart, activePack }); }, [step, cart, activePack]);

  const cartCount = cart.reduce((s, it) => s + it.count, 0);

  const addToCart = (pack, tier) => {
    setCart(prev => {
      const idx = prev.findIndex(x => x.packId === pack.id && x.tierId === tier.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], count: next[idx].count + 1 };
        return next;
      }
      return [...prev, { packId: pack.id, tierId: tier.id, qty: tier.qty, price: tier.price, count: 1 }];
    });
    setShowCart(true);
  };

  const updateQty = (i, delta) => {
    setCart(prev => prev.map((x, j) => j === i ? { ...x, count: Math.max(1, x.count + delta) } : x));
  };
  const remove = (i) => setCart(prev => prev.filter((_, j) => j !== i));

  const [placing, setPlacing] = useState(false);
  const placeOrder = () => {
    setShowCart(false);
    setPlacing(true);
    setTimeout(() => {
      setStep("success");
      setPlacing(false);
    }, 900);
  };
  const backToShop = () => { setCart([]); setStep("shop"); };

  const go = (id) => { setStep(id); setShowCart(false); };

  const isEmptyMode = step === "empty";

  const screen = (() => {
    switch (step) {
      case "shop":     return <ScreenShop onOpenPack={(id) => { setActivePack(id); setStep("pack"); }} cartCount={cartCount} onOpenCart={() => setShowCart(true)} filter={filter} setFilter={setFilter} />;
      case "pack":     return <ScreenPack packId={activePack} onBack={() => setStep("shop")} cartCount={cartCount} onOpenCart={() => setShowCart(true)} onAdd={addToCart} />;
      case "cart":     return <ScreenShop onOpenPack={(id) => { setActivePack(id); setStep("pack"); }} cartCount={cartCount} onOpenCart={() => setShowCart(true)} filter={filter} setFilter={setFilter} />;
      case "checkout": return <ScreenCheckout items={cart} onBack={() => { setStep("shop"); setShowCart(true); }} onPlace={placeOrder} contact={contact} setContact={setContact} ship={ship} setShip={setShip} pay={pay} setPay={setPay} />;
      case "success":  return <ScreenSuccess onBackToShop={backToShop} orderNum={orderNum} />;
      case "empty":    return <ScreenEmpty onBrowse={() => setStep("shop")} />;
      default:         return null;
    }
  })();

  // when "cart" step is active, auto-open the sheet
  useEffect(() => {
    if (step === "cart") setShowCart(true);
  }, [step]);

  return (
    <>
      <aside className="side-controls">
        <span className="title">to/froms — shop.</span>
        <span className="sub">shop + checkout · phase 3</span>
        <div className="step-list">
          <span className="sub" style={{ marginBottom: 6 }}>flow</span>
          {STEPS.map(s => (
            <button key={s.id} className={s.id === step ? "on" : ""} onClick={() => go(s.id)}>
              <span className="dot" />
              {s.label}
            </button>
          ))}
        </div>
        <div className="step-list" style={{ marginTop: 8 }}>
          <span className="sub" style={{ marginBottom: 6 }}>state</span>
          <button onClick={() => { setCart([]); }}>
            <span className="dot" /> reset cart
          </button>
          <button onClick={() => { setCart([{ packId: "birthday", tierId: "8", qty: 8, price: 24, count: 1 }, { packId: "love", tierId: "4", qty: 4, price: 14, count: 1 }]); }}>
            <span className="dot" /> seed cart
          </button>
        </div>
      </aside>

      <div className="stage">
        <div className="ph">
          {screen}
          {showCart && step !== "checkout" && step !== "success" && (
            <CartSheet items={cart} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); setStep("checkout"); }} updateQty={updateQty} remove={remove} />
          )}
          {placing && (
            <div className="placing-overlay">
              <div className="placing-wax" />
              <p className="placing-label">sealing your order…</p>
            </div>
          )}
          <div className="ph-island" />
          <div className="ph-home" />
        </div>
      </div>
    </>
  );
};

window.ShopApp = App;

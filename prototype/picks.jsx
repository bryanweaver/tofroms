/* Polished single-direction picks — B,B,A,A,A
   390x844 portrait, real-ish proportions, fewer annotations.
*/

const P = ({ children, tone = "cream", time = "9:41", status = "default" }) => (
  <div className={`p-phone p-tone-${tone}`}>
    <div className="p-status">
      <span>{time}</span>
      <span className="p-dots">●●●●</span>
    </div>
    <div className="p-notch" />
    <div className="p-screen">{children}</div>
    <div className="p-home" />
  </div>
);

const PCap = ({ n, label, sub }) => (
  <div className="p-cap">
    <div className="p-cap-row">
      <span className="p-cap-n">{n}</span>
      <span className="p-cap-label">{label}</span>
    </div>
    {sub && <span className="p-cap-sub">{sub}</span>}
  </div>
);

const PCell = ({ n, label, sub, children, note }) => (
  <div className="p-cell">
    <PCap n={n} label={label} sub={sub} />
    <div className="p-cell-frame">{children}</div>
    {note && <div className="p-cell-note">{note}</div>}
  </div>
);

const PFlow = ({ label }) => (
  <div className="p-flow">
    <svg viewBox="0 0 80 24" preserveAspectRatio="none">
      <path d="M 4 12 L 70 12" stroke="var(--ink-40)" strokeWidth="0.7" strokeDasharray="3 2" fill="none" />
      <path d="M 66 8 L 72 12 L 66 16" stroke="var(--ink-40)" strokeWidth="0.7" fill="none" />
    </svg>
    {label && <span className="p-flow-lbl">{label}</span>}
  </div>
);

/* ─── 01 LANDING · B type-led ───────────────────────────────────── */

const PickLanding = () => (
  <section className="pick-section">
    <header className="pick-head">
      <div className="pick-eyebrow">01 · LANDING · DIRECTION B</div>
      <h2 className="pick-title">type-led, photo supports.</h2>
      <p className="pick-blurb">headline owns the first screen. one primary CTA. photo lives below the fold so SEO + slow connections both work. brand voice intact.</p>
    </header>
    <div className="pick-strip">
      <PCell n="1" label="hero" sub="above the fold">
        <P>
          <div className="p-nav">
            <span className="t-serif-i">to/froms</span>
            <span className="t-mono-xs">shop · how · ✶</span>
          </div>
          <h1 className="t-display">a card<br/>that <em>lives</em><br/>on the gift.</h1>
          <p className="t-body" style={{ maxWidth: 220 }}>hand-designed qr stickers. scan once to leave a private note. peel, stick, send.</p>
          <button className="t-cta">shop stickers →</button>
          <a className="t-link">or, see how it works ↓</a>
          <div className="t-photo t-photo-md">
            <span className="t-photo-label">SUPPORTING PHOTO · sticker close-up, single-light, hand barely in frame</span>
          </div>
        </P>
      </PCell>
      <PFlow label="scroll ↓" />
      <PCell n="2" label="how it works" sub="vertical timeline">
        <P>
          <div className="p-nav-spacer" />
          <h2 className="t-h2">three small steps.</h2>
          <div className="t-timeline">
            <span className="t-timeline-line" />
            {[
              ["peel", "pick a sticker. it shows up in the mail."],
              ["write", "scan with your phone — compose your card."],
              ["gift", "stick & give. they scan, the card opens."],
            ].map(([t, s], i) => (
              <div className="t-step" key={t}>
                <span className="t-step-num">{i + 1}</span>
                <h3 className="t-step-title">{t}</h3>
                <p className="t-step-body">{s}</p>
              </div>
            ))}
          </div>
        </P>
      </PCell>
      <PFlow label="scroll ↓" />
      <PCell n="3" label="featured + reviews">
        <P>
          <div className="p-nav-spacer" />
          <div className="t-row-between">
            <h2 className="t-h2-tight">this week</h2>
            <span className="t-mono-xs">shop →</span>
          </div>
          <div className="t-photo t-photo-feat">
            <span className="t-photo-label">HERO PRODUCT · this week's pick</span>
            <span className="t-tag-clay">FEATURED</span>
          </div>
          <h3 className="t-h3">moss wreath</h3>
          <div className="t-thumb-row">
            {[0,1,2].map(i => <div key={i} className="t-thumb" />)}
          </div>
          <div className="t-pullquote">
            <p className="t-quote">"the pause before someone reads what you wrote — they bottled it."</p>
            <div className="t-row-between t-quote-meta">
              <span>— A., HOUSTON</span>
              <span>● ○ ○</span>
            </div>
          </div>
        </P>
      </PCell>
      <PFlow label="scroll ↓" />
      <PCell n="4" label="footer" sub="newsletter + nav">
        <P>
          <div className="p-nav-spacer" />
          <div className="t-news">
            <span className="t-mono-xs">— letters</span>
            <h2 className="t-h1">letters,<br/>rarely.</h2>
            <p className="t-body">we write when there's something to say. a new release, a small moment. that's it.</p>
            <div className="t-news-input">
              <input className="t-input t-input-flex" placeholder="your email" readOnly />
              <button className="t-cta-sm t-news-btn">ok →</button>
            </div>
            <span className="t-news-hint">we mail ~once a month. no other use.</span>
          </div>

          <div className="t-foot">
            <div className="t-foot-rule" />
            <div className="t-foot-cols">
              <span>shop</span>
              <span>how it works</span>
              <span>about</span>
              <span>journal</span>
              <span>faq</span>
              <span>contact</span>
            </div>
            <div className="t-foot-social">
              <span className="t-mono-xs">elsewhere</span>
              <div className="t-foot-social-row">
                <span>instagram</span>
                <span>tiktok</span>
                <span>are.na</span>
              </div>
            </div>
            <div className="t-foot-meta">
              <span>© 2026 to/froms</span>
              <span>made in houston</span>
            </div>
          </div>
        </P>
      </PCell>
    </div>
  </section>
);

/* ─── 02 SHOP + PDP · B single-column journal ───────────────────── */

const PickShop = () => (
  <section className="pick-section">
    <header className="pick-head">
      <div className="pick-eyebrow">02 · SHOP + PDP · DIRECTION B</div>
      <h2 className="pick-title">single-column journal.</h2>
      <p className="pick-blurb">each sticker gets a sentence on the index — the shop reads like a curated zine, not a SKU grid. PDP is full-bleed image + serif wraparound title.</p>
    </header>
    <div className="pick-strip">
      <PCell n="1" label="shop index" sub="6 things, this season">
        <P>
          <div className="p-nav">
            <span className="t-mono-xs">← back</span>
            <span className="t-mono-xs">filter · cart (0)</span>
          </div>
          <h1 className="t-h1">shop</h1>
          <p className="t-script">six things, this season.</p>
          <div className="t-chips">
            <span className="t-chip-active">all</span>
            <span className="t-chip">florals</span>
            <span className="t-chip">type</span>
            <span className="t-chip">love</span>
            <span className="t-chip">bday</span>
          </div>
          <div className="t-list">
            {[
              ["moss wreath", "$8", "for the friend who keeps your plants alive."],
              ["letter type", "$8", "for the one who still sends postcards."],
              ["small peony", "$10", "the gift you'd give a sister."],
            ].map(([n, p, s]) => (
              <div className="t-list-item" key={n}>
                <div className="t-photo t-photo-list" />
                <div className="t-list-meta">
                  <div className="t-row-between">
                    <span className="t-h3-i">{n}</span>
                    <span className="t-mono-xs">{p}</span>
                  </div>
                  <p className="t-body-sm">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </P>
      </PCell>
      <PFlow label="tap" />
      <PCell n="2" label="PDP" sub="full-bleed image">
        <P>
          <div className="t-photo t-photo-bleed">
            <div className="p-overlay-top">
              <span className="t-mono-xs t-on-photo">← back</span>
              <span className="t-mono-xs t-on-photo">♡  ⤴︎</span>
            </div>
            <div className="p-overlay-dots">● ○ ○ ○</div>
          </div>
          <h1 className="t-display-sm">moss<br/>wreath</h1>
          <div className="t-row-between">
            <span className="t-mono">$8 · SET OF 3</span>
            <span className="t-tag-blush">2.5" round</span>
          </div>
          <p className="t-body">a tiny moss-green wreath. for the friend who keeps your plants alive when you're away.</p>
          <div className="t-row-between t-qty">
            <div className="t-stepper">
              <span>−</span><span className="t-qty-n">1</span><span>+</span>
            </div>
            <span className="t-mono-xs">what's inside ▾</span>
          </div>
          <button className="t-cta">add to cart · $8</button>
        </P>
      </PCell>
    </div>
  </section>
);

/* ─── 03 CART · A bottom-sheet ──────────────────────────────────── */

const PickCart = () => (
  <section className="pick-section">
    <header className="pick-head">
      <div className="pick-eyebrow">03 · CART · CHECKOUT · SUCCESS · DIRECTION A</div>
      <h2 className="pick-title">cart never leaves the page. one-screen checkout. letterpress thank-you.</h2>
      <p className="pick-blurb">bottom-sheet cart preserves browsing context. checkout collapsed to three sections — apple pay first if available. success uses a single emotional moment, not a confetti dump.</p>
    </header>
    <div className="pick-strip">
      <PCell n="1" label="cart" sub="bottom sheet over PDP">
        <P>
          <div className="p-overlay-dim" />
          <div className="t-sheet">
            <div className="t-sheet-grab" />
            <div className="t-row-between">
              <h2 className="t-h2-tight">your cart</h2>
              <span className="t-mono-xs">2 items</span>
            </div>
            {[
              ["moss wreath", "$8"],
              ["letter type", "$8"],
            ].map(([n, p]) => (
              <div className="t-cart-row" key={n}>
                <div className="t-photo t-photo-tiny" />
                <div className="t-cart-meta">
                  <span className="t-h4">{n}</span>
                  <span className="t-mono-xs">{p} · qty 1 −/+</span>
                </div>
                <span className="t-mono-xs t-x">×</span>
              </div>
            ))}
            <div className="t-totals">
              <div className="t-row-between"><span className="t-mono-xs">subtotal</span><span className="t-mono">$16</span></div>
              <div className="t-row-between"><span className="t-mono-xs">ship</span><span className="t-mono">$3</span></div>
              <div className="t-row-between t-grand"><span className="t-h4">total</span><span className="t-h3-i">$19</span></div>
            </div>
            <button className="t-cta">check out</button>
          </div>
        </P>
      </PCell>
      <PFlow label="check out" />
      <PCell n="2" label="checkout" sub="one screen · three sections">
        <P>
          <div className="p-nav">
            <span className="t-mono-xs">← cart</span>
            <span className="t-mono-xs">secure ●</span>
          </div>
          <h1 className="t-h1">checkout</h1>
          <button className="t-cta-dark"> pay</button>
          <div className="t-divider"><span>or</span></div>
          <div className="t-check-sec">
            <span className="t-mono-xs">① contact</span>
            <input className="t-input" placeholder="your email" readOnly />
          </div>
          <div className="t-check-sec">
            <span className="t-mono-xs">② shipping</span>
            <input className="t-input" placeholder="name" readOnly />
            <input className="t-input" placeholder="address" readOnly />
            <div className="t-input-row">
              <input className="t-input" placeholder="city" readOnly />
              <input className="t-input t-input-sm" placeholder="zip" readOnly />
            </div>
          </div>
          <div className="t-check-sec">
            <span className="t-mono-xs">③ pay</span>
            <div className="t-input">card · last 4 ●●●●  ▾</div>
          </div>
          <button className="t-cta">place order · $19</button>
        </P>
      </PCell>
      <PFlow label="paid" />
      <PCell n="3" label="success" sub="letterpress card">
        <P>
          <div className="p-nav-spacer" />
          <div className="t-success">
            <svg className="t-flourish" viewBox="0 0 56 56">
              <g stroke="var(--clay)" strokeWidth="1" fill="none" strokeLinecap="round">
                <path d="M 28 8 C 22 14, 22 20, 28 24 C 34 20, 34 14, 28 8 Z" />
                <path d="M 28 24 C 22 30, 22 36, 28 40 C 34 36, 34 30, 28 24 Z" transform="rotate(60 28 28)" />
                <path d="M 28 24 C 22 30, 22 36, 28 40 C 34 36, 34 30, 28 24 Z" transform="rotate(-60 28 28)" />
                <circle cx="28" cy="28" r="2.5" fill="var(--champ)" stroke="none" />
              </g>
            </svg>
            <h1 className="t-display-sm t-center">thank you.</h1>
            <span className="t-mono-xs">ORDER #TF-2103</span>
            <div className="t-success-card">
              <p className="t-script-lg">your stickers are<br/>on their way.</p>
              <p className="t-script-sm">we'll write when they're packed.</p>
            </div>
            <button className="t-cta-ghost">back to shop</button>
          </div>
        </P>
      </PCell>
    </div>
  </section>
);

/* ─── 04 ACTIVATION · A classic 5 steps ─────────────────────────── */

const ProgDots = ({ n }) => (
  <div className="t-prog">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={i <= n ? "t-prog-on" : "t-prog-off"} />
    ))}
  </div>
);

const PickActivation = () => (
  <section className="pick-section">
    <header className="pick-head">
      <div className="pick-eyebrow">04 · ACTIVATION · DIRECTION A</div>
      <h2 className="pick-title">one task per screen. progress dots on top.</h2>
      <p className="pick-blurb">five small ceremonies. familiar pattern, calm typography. no login required. each step has a soft "skip" except step 5.</p>
    </header>
    <div className="pick-strip">
      <PCell n="1" label="welcome" sub="scan landed here">
        <P>
          <ProgDots n={1} />
          <span className="t-mono-xs">welcome</span>
          <h1 className="t-display-sm" style={{ marginTop: 24 }}>hi.</h1>
          <h2 className="t-h1" style={{ marginTop: 8 }}>let's set up<br/>your card.</h2>
          <p className="t-script" style={{ marginTop: 14 }}>no login. just you and the page.</p>
          <div className="t-bottom-cta">
            <button className="t-cta">begin →</button>
          </div>
        </P>
      </PCell>
      <PFlow label="begin" />
      <PCell n="2" label="to & from" sub="2 fields">
        <P>
          <ProgDots n={2} />
          <span className="t-mono-xs">step 2 of 5 · to & from</span>
          <h2 className="t-h1" style={{ marginTop: 16 }}>who's it for?</h2>
          <div className="t-field">
            <label className="t-script-label">to:</label>
            <input className="t-input-lg" defaultValue="maya" readOnly />
          </div>
          <div className="t-field">
            <label className="t-script-label">from:</label>
            <input className="t-input-lg" defaultValue="em" readOnly />
          </div>
          <div className="t-bottom-cta">
            <button className="t-cta">continue</button>
          </div>
        </P>
      </PCell>
      <PFlow />
      <PCell n="3" label="the message" sub="prompt chips below">
        <P>
          <ProgDots n={3} />
          <span className="t-mono-xs">step 3 of 5 · message</span>
          <h2 className="t-h2" style={{ marginTop: 12 }}>what would you say if you had her right here?</h2>
          <div className="t-textarea">
            <p className="t-quote-soft">thirty years.<br/>you still make me<br/>read aloud.</p>
          </div>
          <div className="t-row-between">
            <div className="t-chips-sm">
              <span className="t-chip">bday</span>
              <span className="t-chip">thinking of you</span>
              <span className="t-chip">just bc</span>
            </div>
            <span className="t-mono-xs">32/280</span>
          </div>
          <div className="t-bottom-cta">
            <button className="t-cta">continue</button>
          </div>
        </P>
      </PCell>
      <PFlow />
      <PCell n="4" label="a photo" sub="optional · polaroid">
        <P>
          <ProgDots n={4} />
          <span className="t-mono-xs">step 4 of 5 · photo</span>
          <h2 className="t-h1" style={{ marginTop: 12 }}>add a photo.</h2>
          <p className="t-body-sm">optional. drag to reposition, pinch to zoom.</p>
          <div className="t-polaroid-wrap">
            <div className="t-polaroid">
              <div className="t-polaroid-img" />
              <span className="t-polaroid-cap">maya, kyoto '24</span>
            </div>
          </div>
          <div className="t-row-center t-actions-sm">
            <span className="t-mono-xs t-clay">REPLACE</span>
            <span className="t-mono-xs">REMOVE</span>
          </div>
          <div className="t-bottom-cta t-two">
            <button className="t-cta-ghost">skip</button>
            <button className="t-cta">continue</button>
          </div>
        </P>
      </PCell>
      <PFlow />
      <PCell n="5" label="envelope" sub="6 styles · final step">
        <P>
          <ProgDots n={5} />
          <span className="t-mono-xs">step 5 of 5 · envelope</span>
          <h2 className="t-h1" style={{ marginTop: 12 }}>choose the moment.</h2>
          <p className="t-body-sm">this is the first thing they'll see.</p>
          <div className="t-env-grid">
            {[
              ["blush", "#F4D6CC", "var(--plum)"],
              ["sage", "#7C8A6B", "white"],
              ["champagne", "#D9B382", "var(--plum)"],
              ["paper", "#F8F1E7", "var(--plum)"],
              ["clay", "#C97B5A", "white"],
              ["midnight", "#3B2A2F", "var(--paper)"],
            ].map(([name, bg, color], i) => (
              <div key={name} className={`t-env ${i === 0 ? "t-env-on" : ""}`} style={{ background: bg, color }}>
                <span className="t-env-label">{name}</span>
              </div>
            ))}
          </div>
          <div className="t-bottom-cta">
            <button className="t-cta">preview your card →</button>
          </div>
        </P>
      </PCell>
    </div>
  </section>
);

/* ─── 05 REVEAL · A wax seal break ─────────────────────────────── */

const PickReveal = () => (
  <section className="pick-section">
    <header className="pick-head">
      <div className="pick-eyebrow">05 · RECIPIENT REVEAL · DIRECTION A</div>
      <h2 className="pick-title">wax seal break.</h2>
      <p className="pick-blurb">envelope → tap → seal cracks → paper unfolds → card. one pressed-petal particle drifts down. ~1.6s total. the only place we go big with motion.</p>
    </header>
    <div className="pick-strip">
      <PCell n="1" label="envelope" sub="0.0s · sealed">
        <P tone="envelope">
          <div className="t-env-frame">
            <span className="t-env-to">to: maya.</span>
            <div className="t-env-seal" />
            <span className="t-env-cta">tap to open.</span>
          </div>
        </P>
      </PCell>
      <PFlow label="tap" />
      <PCell n="2" label="seal cracks" sub="0.0s → 0.4s">
        <P tone="envelope">
          <div className="t-env-frame">
            <div className="t-seal-halves">
              <span className="t-seal-l" />
              <span className="t-seal-r" />
            </div>
            <span className="t-mono-xs t-haptic">·  haptic tick  ·</span>
          </div>
        </P>
      </PCell>
      <PFlow label="0.4s" />
      <PCell n="3" label="paper unfolds" sub="0.4s → 1.2s">
        <P>
          <div className="t-fold-paper">
            <span className="t-fold-crease t-fold-crease-1" />
            <span className="t-fold-crease t-fold-crease-2" />
            <span className="t-script t-fold-status">unfolding…</span>
          </div>
        </P>
      </PCell>
      <PFlow label="1.2s" />
      <PCell n="4" label="card revealed" sub="1.2s · settled">
        <P>
          <div className="p-nav-spacer" />
          <div className="t-card-poly">
            <div className="t-polaroid t-polaroid-card">
              <div className="t-polaroid-img" />
              <span className="t-polaroid-cap">maya, kyoto '24</span>
            </div>
          </div>
          <p className="t-card-msg">thirty years.<br/>you still make me<br/>read aloud.</p>
          <p className="t-card-sig">— em</p>
          <div className="t-player">
            <div className="t-player-art" />
            <div className="t-player-meta">
              <span className="t-h4">resolved track</span>
              <span className="t-mono-xs">artist · 3:42</span>
            </div>
            <span className="t-mono-xs t-clay">▶</span>
          </div>
          <span className="t-petal t-petal-1" />
          <span className="t-petal t-petal-2" />
        </P>
      </PCell>
      <PFlow label="re-scan later" />
      <PCell n="5" label="repeat scan" sub="skip unfold · worn">
        <P>
          <div className="p-nav-spacer" />
          <span className="t-mono-xs t-opened">opened 4 times</span>
          <div className="t-card-poly" style={{ marginTop: 12 }}>
            <div className="t-polaroid t-polaroid-card">
              <div className="t-polaroid-img t-photo-worn" />
              <span className="t-polaroid-cap">maya, kyoto '24</span>
            </div>
          </div>
          <p className="t-card-msg">thirty years.<br/>you still make me<br/>read aloud.</p>
          <p className="t-card-sig">— em</p>
          <span className="t-crease t-crease-1" />
          <span className="t-crease t-crease-2" />
        </P>
      </PCell>
    </div>
  </section>
);

const PicksDoc = () => (
  <>
    <PickLanding />
    <PickShop />
    <PickCart />
    <PickActivation />
    <PickReveal />
  </>
);

window.PicksDoc = PicksDoc;

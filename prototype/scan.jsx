/* scan.jsx — first-scan + account prototype
   Branches:
   - SENDER first-scan: claim the sticker, optional account
   - RECIPIENT scan: view the letter, no account needed
   - ACCOUNT: home / stickers / drafts / notifications
*/

const { useState, useEffect, useMemo } = React;

const LS_KEY = "tf-scan-v1";
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const persist = (s) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} };

const STEPS = [
  { id: "lock",          group: "scan moment",  label: "01 · scan (lock screen)" },
  { id: "branch",        group: "scan moment",  label: "02 · who are you?" },

  { id: "claim",         group: "sender",       label: "01 · this sticker is yours" },
  { id: "claim-name",    group: "sender",       label: "02 · set up name" },
  { id: "claim-success", group: "sender",       label: "03 · ready to compose" },
  { id: "post-send",     group: "sender",       label: "04 · save your work?" },
  { id: "signup",        group: "sender",       label: "05 · sign-up" },

  { id: "recipient",     group: "recipient",    label: "01 · a letter for you" },
  { id: "recipient-open",group: "recipient",    label: "02 · opening" },
  { id: "recipient-after",group: "recipient",   label: "03 · after reveal" },

  { id: "account",       group: "account",      label: "01 · home" },
  { id: "card-detail",   group: "account",      label: "02 · card detail" },
  { id: "stickers",      group: "account",      label: "03 · sticker library" },
  { id: "drafts",        group: "account",      label: "04 · drafts" },
  { id: "notifs",        group: "account",      label: "05 · notifications" },

  { id: "scan-claimed",  group: "empty states", label: "— sticker already claimed" },
  { id: "account-empty", group: "empty states", label: "— day-1 account" },
  { id: "stickers-fresh",group: "empty states", label: "— all blank, just arrived" },
  { id: "stickers-spent",group: "empty states", label: "— all sealed, reorder" },
  { id: "drafts-empty",  group: "empty states", label: "— no drafts" },
  { id: "notifs-empty",  group: "empty states", label: "— nothing yet" },
];

const CARDS = {
  k7m2x: {
    id: "k7m2x", to: "maya", status: "opened", iconId: "love",
    sealedAt: "may 11, 9:14am", openedAt: "may 11, 2:47pm",
    reads: 4, lastReadAt: "2h ago",
    preview: "thirty years and you still leave the porch light on when i come home. i don't know how to say it any other way.",
    timeline: [
      { k: "sealed",   at: "may 11 · 9:14am",  by: "you" },
      { k: "peeled",   at: "may 11 · 9:22am",  by: "you" },
      { k: "placed",   at: "may 11 · 12:03pm", by: "on the fridge" },
      { k: "opened",   at: "may 11 · 2:47pm",  by: "maya" },
      { k: "read",     at: "4 times",          by: "last · 2h ago" },
    ],
  },
  j8p4r: {
    id: "j8p4r", to: "j.", status: "sealed", iconId: "love",
    sealedAt: "may 9, 7:02pm", openedAt: null,
    reads: 0, lastReadAt: null,
    preview: "a quiet one. read it when it's quiet.",
    timeline: [
      { k: "sealed",   at: "may 9 · 7:02pm",   by: "you" },
      { k: "peeled",   at: "may 9 · 7:14pm",   by: "you" },
      { k: "placed",   at: "may 10 · sent in the mail", by: "slipped in a book" },
      { k: "waiting",  at: "not yet opened",   by: "3 days" },
    ],
  },
  n3q7s: {
    id: "n3q7s", to: "ben", status: "opened", iconId: "love",
    sealedAt: "may 3, 8:21am", openedAt: "may 3, 9:40am",
    reads: 2, lastReadAt: "may 4",
    preview: "for that thing you did last tuesday. i know you didn't think anyone noticed.",
    timeline: [
      { k: "sealed",   at: "may 3 · 8:21am",   by: "you" },
      { k: "peeled",   at: "may 3 · 8:30am",   by: "you" },
      { k: "placed",   at: "may 3 · 9:12am",   by: "on his keyboard" },
      { k: "opened",   at: "may 3 · 9:40am",   by: "ben" },
      { k: "read",     at: "2 times",          by: "last · may 4" },
    ],
  },
};

const ICONS = {
  birthday:  <path d="M-9 -8h6v18h-6z M-7 -8 q0 -5 -3 -7" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  "thank-you": <path d="M0 12 C -14 2, -14 -10, -6 -10 C -2 -10, 0 -7, 0 -4 C 0 -7, 2 -10, 6 -10 C 14 -10, 14 2, 0 12 Z" fill="currentColor" />,
  love:      <path d="M0 12 C -14 2, -14 -10, -6 -10 C -2 -10, 0 -7, 0 -4 C 0 -7, 2 -10, 6 -10 C 14 -10, 14 2, 0 12 Z" fill="currentColor" />,
  congrats:  <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"><path d="M0 -12 V -4 M0 12 V 4 M-12 0 H -4 M12 0 H 4 M-9 -9 L -4 -4 M9 -9 L 4 -4 M-9 9 L -4 4 M9 9 L 4 4"/><circle cx="0" cy="0" r="2.4" fill="currentColor" stroke="none"/></g>,
  thinking:  <g fill="currentColor"><circle cx="-8" cy="0" r="3"/><circle cx="0" cy="0" r="3"/><circle cx="8" cy="0" r="3"/></g>,
  "im-sorry":<g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M0 12 q 0 -10 -6 -14" /><ellipse cx="-7" cy="-4" rx="4" ry="3" transform="rotate(-30 -7 -4)" fill="currentColor" stroke="none"/><ellipse cx="-2" cy="-10" rx="3.6" ry="3" transform="rotate(15 -2 -10)" fill="currentColor" stroke="none"/></g>,
};

const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry32 = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const Finder = ({ x, y, color, cell }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={7 * cell} height={7 * cell} rx={1.6 * cell} fill={color} />
    <rect x={cell} y={cell} width={5 * cell} height={5 * cell} rx={cell} fill="var(--paper)" />
    <rect x={2 * cell} y={2 * cell} width={3 * cell} height={3 * cell} rx={0.6 * cell} fill={color} />
  </g>
);

const FancyQR = ({ seed = "x", color = "#3B2A2F", accent = "#C97B5A", iconId, size = 120 }) => {
  const N = 33;
  const FINDER = 7;
  const CENTER_R = 5;
  const grid = useMemo(() => {
    const r = mulberry32(hash(seed));
    const cx = (N - 1) / 2;
    const g = [];
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
      g.push(row);
    }
    return g;
  }, [seed]);

  const cell = size / (N + 2);
  const pad = cell;
  const icon = ICONS[iconId];
  const iconCenterX = ((N - 1) / 2 + 0.5) * cell;
  const iconCenterY = ((N - 1) / 2 + 0.5) * cell;
  const iconScale = (size * 0.20) / 32;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} rx={size * 0.13} fill="var(--paper)" />
      <g transform={`translate(${pad} ${pad})`}>
        {grid.map((row, y) => row.map((v, x) => v ? (
          <rect key={`${x}-${y}`} x={x * cell + cell * 0.08} y={y * cell + cell * 0.08} width={cell * 0.84} height={cell * 0.84} rx={cell * 0.22} fill={color} />
        ) : null))}
        <Finder x={0}                  y={0}                  color={color} cell={cell} />
        <Finder x={(N - FINDER) * cell} y={0}                  color={color} cell={cell} />
        <Finder x={0}                  y={(N - FINDER) * cell} color={color} cell={cell} />
        {icon && (
          <g transform={`translate(${iconCenterX} ${iconCenterY}) scale(${iconScale})`} style={{ color: accent }}>
            {icon}
          </g>
        )}
      </g>
    </svg>
  );
};

/* ─── chrome ─── */
const Status = ({ tone = "light" }) => (
  <div className={`ph-status ${tone}`} style={{ color: tone === "dark" ? "var(--paper)" : "var(--plum)" }}>
    <span>9:41</span>
    <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="3" width="3" height="8" rx="0.5" /><rect x="5" y="1" width="3" height="10" rx="0.5" opacity="0.85" /><rect x="10" y="0" width="3" height="11" rx="0.5" opacity="0.7" /><rect x="15" y="2" width="3" height="9" rx="0.5" opacity="0.45" /></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="22" height="11" rx="3" /><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" /><rect x="23.5" y="4" width="1.5" height="4" fill="currentColor" /></svg>
    </span>
  </div>
);

const SafariBar = () => (
  <div className="safari-bar">
    <div className="reload">‹</div>
    <div className="pill"><span className="lock">●</span><span>tofroms.co/s/k7m2x</span></div>
    <div className="reload">↻</div>
  </div>
);

const TopNav = ({ left, right, onLeft, onRight }) => (
  <div className="topnav">
    <span className="tx-mono" style={{ cursor: onLeft ? "pointer" : "default" }} onClick={onLeft}>{left || ""}</span>
    <span className="tx-mono" style={{ cursor: onRight ? "pointer" : "default" }} onClick={onRight}>{right || ""}</span>
  </div>
);

/* ─── 01 LOCK SCREEN scan moment ─── */
const ScreenLock = ({ onTap }) => (
  <>
    <div className="status-haze" />
    <Status tone="dark" />
    <div className="scan-bg">
      <div className="scan-viewfinder">
        <div className="scan-corners"><span className="tl" /><span className="tr" /><span className="bl" /><span className="br" /></div>
        {/* faint sticker silhouette inside the corner brackets, so the camera reads as "aimed at a sticker" */}
        <svg className="scan-target" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="6" y="6" width="22" height="22" rx="5" />
          <rect x="9" y="9" width="16" height="16" rx="3" fill="rgba(0,0,0,0)" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
          <rect x="72" y="6" width="22" height="22" rx="5" />
          <rect x="79" y="13" width="8" height="8" rx="1.5" />
          <rect x="6" y="72" width="22" height="22" rx="5" />
          <rect x="13" y="79" width="8" height="8" rx="1.5" />
          <g transform="translate(50 50)" stroke="currentColor" strokeWidth="0" fill="currentColor">
            <path d="M0 9 C -10 2, -10 -7, -5 -7 C -2 -7, 0 -5, 0 -3 C 0 -5, 2 -7, 5 -7 C 10 -7, 10 2, 0 9 Z"/>
          </g>
        </svg>
      </div>
      <div className="scan-toast" onClick={onTap}>
        <div className="favicon"><span className="favicon-mark">to<em>/</em></span></div>
        <div className="info">
          <span className="title">Open in Safari</span>
          <span className="url">tofroms.co · a letter for you</span>
        </div>
        <span className="chev">›</span>
      </div>
      <div className="scan-hint">point the camera · tap the banner</div>
    </div>
  </>
);

/* ─── 02 BRANCH (demo control: who are you?) ─── */
const ScreenBranch = ({ goSender, goRecipient }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <div className="screen-body p-h col gap-16" style={{ paddingTop: 18 }}>
        <span className="tx-mono">prototype branch · choose path</span>
        <h1 className="tx-h1">who scanned <em>this sticker?</em></h1>
        <p className="tx-body">in production this is automatic — the sticker code knows if it's been claimed and what's on it. for the prototype, pick a path.</p>
        <div className="col gap-12" style={{ marginTop: 10 }}>
          <button className="btn btn-plum btn-block" onClick={goSender}>i'm setting it up · send a card →</button>
          <button className="btn btn-ghost btn-block" onClick={goRecipient}>i was given this · open the letter →</button>
        </div>
      </div>
    </div>
  </>
);

/* ─── SENDER 01 claim ─── */
const ScreenClaim = ({ onNext, packType }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <div className="screen-body">
        <div className="p-h col gap-8" style={{ paddingTop: 8 }}>
          <span className="tx-mono">· a fresh one ·</span>
          <h1 className="tx-h1">this one is <em>yours.</em></h1>
          <p className="tx-body">one of eight, just yours. write to someone — then send it out into the world.</p>
        </div>

        <div className="claim-card" style={{ marginTop: 18 }}>
          <span className="tx-mono" style={{ color: "var(--clay)" }}>· the love letter pack ·</span>
          <div className="sticker-wrap">
            <FancyQR seed="k7m2x" iconId={packType || "love"} color="#3B2A2F" accent="#A85F40" size={170} />
          </div>
          <span className="tx-hand">one sticker, one card.</span>
        </div>

        <div className="code-row">
          <span>code <span className="code-v">K7M2X</span></span>
          <span>status <span className="code-v" style={{ color: "var(--clay)" }}>fresh</span></span>
        </div>

        <div className="p-h col gap-8" style={{ marginTop: 22 }}>
          <p className="tx-hand-sm">once you seal a card to this sticker, it's locked. peel, mail, stick.</p>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" onClick={onNext}>make it mine →</button>
      </div>
    </div>
  </>
);

/* ─── SENDER 02 name ─── */
const ScreenClaimName = ({ name, setName, onNext, onBack }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <TopNav left="← back" />
      <div className="screen-body p-h col gap-16" style={{ paddingTop: 8 }}>
        <span className="tx-mono">①  who's it from</span>
        <h1 className="tx-h1">how should they know <em>it's you?</em></h1>
        <p className="tx-body">just the name they'll see when they open it. no last name required.</p>
        <div className="col gap-4">
          <label className="tx-hand-sm" style={{ color: "var(--clay)" }}>from:</label>
          <input className="field" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="rachel, ray, r." />
        </div>
        <p className="tx-hand-sm">we don't ask for more than this — yet.</p>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" disabled={!name.trim()} onClick={onNext}>next →</button>
      </div>
    </div>
  </>
);

/* ─── SENDER 03 success — handoff to compose ─── */
const ScreenClaimSuccess = ({ name, onCompose }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <div className="screen-body col">
        <div className="p-h col gap-16" style={{ paddingTop: 24, textAlign: "center", alignItems: "center" }}>
          <div className="wax" style={{ width: 78, height: 78 }}>✓</div>
          <span className="tx-mono">claimed by {name || "you"}</span>
          <h1 className="tx-h1" style={{ paddingBottom: 4 }}>ready, <em>now write.</em></h1>
          <p className="tx-body" style={{ maxWidth: 280 }}>compose the card. you can save a draft and come back — the sticker is yours until you seal it.</p>
        </div>

        <div className="cta-card" style={{ marginTop: 28 }}>
          <div className="body">
            <span className="s">code k7m2x · love · 8</span>
            <span className="h">compose the card →</span>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" onClick={() => { window.location.href = "prototype.html?step=welcome"; }}>begin writing →</button>
        <button className="btn btn-ghost btn-block" onClick={onCompose}>save draft for later</button>
      </div>
    </div>
  </>
);

/* ─── SENDER 04 post-send — encourage signup ─── */
const ScreenPostSend = ({ onSignup, onSkip }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <div className="screen-body">
        <div className="p-h col gap-8" style={{ paddingTop: 14, alignItems: "center", textAlign: "center" }}>
          <span className="tx-mono">sent · 1 of 8</span>
          <h1 className="tx-h1" style={{ marginTop: 6 }}>sealed and <em>sent.</em></h1>
          <p className="tx-hand" style={{ marginTop: 6 }}>save your work?</p>
        </div>

        <div className="claim-card" style={{ marginTop: 24 }}>
          <span className="tx-hand" style={{ color: "var(--plum)", textAlign: "center" }}>keep a record of every card you mail.</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", marginTop: 4 }}>
            <div className="metric"><span className="v" style={{ fontSize: 22 }}>7</span><span className="l">stickers left</span></div>
            <div className="metric"><span className="v" style={{ fontSize: 22 }}>1</span><span className="l">card mailed</span></div>
          </div>
        </div>

        <div className="p-h col gap-8" style={{ marginTop: 22 }}>
          <p className="tx-body">an account is optional. it just lets you see your sent cards, save drafts, and re-order packs in a tap.</p>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" onClick={onSignup}>save my cards →</button>
        <button className="btn btn-ghost btn-block" onClick={onSkip}>not now</button>
      </div>
    </div>
  </>
);

/* ─── SENDER 05 signup ─── */
const ScreenSignup = ({ onAuthed, onBack }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <TopNav left="← back" />
      <div className="screen-body" style={{ paddingTop: 8 }}>
        <div className="p-h col gap-8">
          <span className="tx-mono">sign in or make an account</span>
          <h1 className="tx-h1">welcome <em>back.</em></h1>
          <p className="tx-body">we'll link this sticker (and any future ones) to your account.</p>
        </div>

        <div className="auth-row" style={{ marginTop: 22 }}>
          <button className="auth-btn dark" onClick={onAuthed}><span className="ico"></span> continue with apple</button>
          <button className="auth-btn" onClick={onAuthed}><span className="ico">G</span> continue with google</button>
        </div>

        <div className="auth-divider"><div /><span className="tx-mono">or</span><div /></div>

        <div className="auth-row">
          <input className="field" placeholder="your email" />
          <button className="btn btn-primary btn-block" onClick={onAuthed}>send a magic link</button>
        </div>

        <p className="tx-hand-sm" style={{ textAlign: "center", marginTop: 16 }}>we'll only email you about your cards.</p>
      </div>
    </div>
  </>
);

/* ─── RECIPIENT 01 incoming ─── */
const ScreenRecipient = ({ onOpen }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <div className="screen-body">
        <div className="p-h col gap-6" style={{ paddingTop: 14, textAlign: "center", alignItems: "center" }}>
          <span className="tx-mono">a letter, for you</span>
          <h1 className="tx-display" style={{ fontSize: 58, lineHeight: 0.98, paddingBottom: 4 }}>from <em>rachel.</em></h1>
        </div>

        <div className="incoming" style={{ marginTop: 24 }}>
          <span className="from-stamp">to · you</span>
          <div className="wax">r</div>
          <span className="tx-hand" style={{ textAlign: "center" }}>sealed on may 9.<br/>tap when you have a quiet minute.</span>
        </div>

        <p className="tx-hand-sm" style={{ textAlign: "center", marginTop: 28 }}>no app, no sign-in. it's just here.</p>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" onClick={onOpen}>open the letter →</button>
      </div>
    </div>
  </>
);

/* ─── RECIPIENT 02 opening (simple cracked-wax moment) ─── */
const ScreenRecipientOpen = ({ onDone }) => (
  <>
    <Status />
    <div className="screen" style={{ paddingTop: 60 }}>
      <div className="screen-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="col gap-16" style={{ alignItems: "center", textAlign: "center" }}>
          <div className="wax" style={{ width: 110, height: 110, fontSize: 38, animation: "wobble 1.6s ease-out infinite" }}>r</div>
          <h1 className="tx-h1">opening…</h1>
          <p className="tx-hand-sm">the seal is cracking.</p>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn btn-ghost btn-block" onClick={onDone}>skip animation →</button>
      </div>
    </div>
    <style>{`@keyframes wobble { 0%, 100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(-3deg) scale(1.04); } }`}</style>
  </>
);

/* ─── RECIPIENT 03 after reveal — gentle keep-this prompt ─── */
const ScreenRecipientAfter = ({ onReply, onKeep, onClose }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <div className="screen-body">
        <div className="p-h col gap-8" style={{ paddingTop: 18, alignItems: "center", textAlign: "center" }}>
          <span className="tx-mono">card from rachel · saved here</span>
          <h1 className="tx-h1" style={{ marginTop: 6 }}>kept, <em>quietly.</em></h1>
          <p className="tx-body" style={{ maxWidth: 280 }}>this card lives at this link. no account needed. bookmark it, screenshot it, send something back.</p>
        </div>

        {/* a tiny anchor back to the moment: a rotated mini-card + re-open link */}
        <div className="reread-anchor" onClick={onClose} style={{ cursor: "pointer" }}>
          <div className="mini-letter" aria-hidden="true">
            <span className="mini-wax">r</span>
            <span className="mini-to">to: you</span>
          </div>
          <span className="tx-hand-sm" style={{ color: "var(--clay)" }}>↺ re-open the card</span>
        </div>

      </div>
      <div className="screen-foot" style={{ gap: 14 }}>
        <button className="btn btn-primary btn-block" onClick={() => {
          try {
            localStorage.setItem('tf-arrival', 'reply-to-rachel');
            // seed compose with the original sender as the recipient
            localStorage.setItem('tf-proto-v1', JSON.stringify({
              step: 'to-from',
              data: { to: 'rachel', from: '', message: '', photo: false, song: 'none', envelope: 'blush', _reply: true },
            }));
          } catch(_) {}
          window.location.href = '/prototype.html';
        }}>write a reply →</button>
        <div className="row" style={{ justifyContent: "center", gap: 18 }}>
          <span className="tx-hand-sm" style={{ color: "var(--ink-60)", cursor: "pointer" }} onClick={() => { window.location.href = '/shop.html?filter=love'; }}>shop a love pack instead</span>
          <span className="tx-hand-sm" style={{ color: "var(--ink-40)" }}>·</span>
          <span className="tx-hand-sm" style={{ color: "var(--ink-60)", cursor: "pointer" }} onClick={onKeep}>save the link</span>
        </div>
      </div>
    </div>
  </>
);

/* ─── ACCOUNT card detail ─── */
const ScreenCardDetail = ({ cardId, onBack }) => {
  const c = CARDS[cardId] || CARDS.k7m2x;
  return (
    <>
      <Status />
      <TopNav left="← all sent" right="share link" />
      <div className="screen">
        <div className="screen-body">
          <div className="p-h col gap-4" style={{ paddingTop: 4 }}>
            <span className="tx-mono">card · {c.id.toUpperCase()}</span>
            <h1 className="tx-h1">to <em>{c.to}.</em></h1>
          </div>

          {/* the meta row — the part the sender actually wants to know */}
          <div className="card-meta-row">
            <span className={`status ${c.status}`}>{c.status}</span>
            {c.reads > 0 && <span className="meta-read">read <span className="meta-read-n">{c.reads}×</span></span>}
            {c.lastReadAt && <span className="meta-last">last · {c.lastReadAt}</span>}
          </div>

          <div className="detail-stage">
            <div className="detail-card">
              <span className="from-stamp">to · {c.to}</span>
              <div style={{ transform: "rotate(-3deg)", filter: "drop-shadow(0 10px 20px rgba(59,42,47,0.18))" }}>
                <FancyQR seed={c.id} iconId={c.iconId} color="#3B2A2F" accent="#A85F40" size={132} />
              </div>
              <span className="tx-hand" style={{ color: "var(--ink-80)", textAlign: "center", maxWidth: 260 }}>“{c.preview}”</span>
            </div>
          </div>

          <div className="sec-head"><span className="tx-h3">its journey</span></div>
          <div className="timeline">
            {(() => {
              // collapse the "read" row into "opened" so the journey reads cleanly: sealed → peeled → placed → opened (+ read meta)
              const items = c.timeline.filter(t => t.k !== "read");
              const readRow = c.timeline.find(t => t.k === "read");
              const merged = items.map(t => t.k === "opened" && readRow
                ? { ...t, by: `${t.by} · read ${readRow.at} (${readRow.by})` }
                : t);
              return [...merged].reverse().map((t, i) => (
                <div key={i} className={`tl-row ${t.k} ${i === 0 ? "latest" : ""}`}>
                  <span className="tl-rail"><span className="tl-dot" /></span>
                  <div className="tl-body">
                    <span className="tl-k">{t.k}</span>
                    <span className="tl-at">{t.at}</span>
                    <span className="tl-by">{t.by}</span>
                  </div>
                </div>
              ));
            })()}
          </div>

          <div className="p-h" style={{ paddingTop: 14, paddingBottom: 14 }}>
            <p className="tx-hand-sm" style={{ textAlign: "center" }}>this sticker is sealed. it can't be re-used — but the link lives forever.</p>
          </div>
        </div>
        <div className="screen-foot">
          <button className="btn btn-primary btn-block" onClick={() => { window.location.href = '/shop.html'; }}>send another →</button>
        </div>
      </div>
    </>
  );
};

/* ─── EMPTY: sticker already claimed by someone else ─── */
const ScreenScanClaimed = ({ onBack }) => (
  <>
    <Status />
    <SafariBar />
    <div className="screen" style={{ paddingTop: 96 }}>
      <TopNav left="← cancel" />
      <div className="screen-body">
        <div className="p-h col gap-8" style={{ paddingTop: 8 }}>
          <span className="tx-mono" style={{ color: "var(--clay)" }}>· already spoken for ·</span>
          <h1 className="tx-h1">this one's <em>taken.</em></h1>
          <p className="tx-body">if this sticker is yours, the person you shared the pack with already claimed it. otherwise — it just belongs to someone else.</p>
        </div>

        <div className="claim-card" style={{ marginTop: 18, background: "var(--paper-3)" }}>
          <div className="sticker-wrap" style={{ filter: "grayscale(0.4) opacity(0.85)" }}>
            <FancyQR seed="claimed-k7m2x" iconId="love" color="#3B2A2F" accent="#7C8A6B" size={160} />
          </div>
          <div className="row gap-12" style={{ marginTop: 4 }}>
            <span className="tx-mono">code <span style={{ color: "var(--plum)" }}>K7M2X</span></span>
            <span className="tx-mono" style={{ color: "var(--sage)" }}>· locked</span>
          </div>
        </div>

        <p className="tx-hand-sm" style={{ textAlign: "center", marginTop: 28 }}>each sticker has exactly one owner. that's the whole point.</p>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" onClick={onBack}>scan another sticker</button>
        <span className="tx-hand-sm" style={{ textAlign: "center", color: "var(--ink-60)", cursor: "pointer" }} onClick={() => { window.location.href = '/shop.html'; }}>want your own? a pack lives in the shop ↗</span>
      </div>
    </div>
  </>
);

/* ─── ACCOUNT shared tabbar ─── */
const TAB_ICONS = {
  account: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11 L12 4 L21 11 V20 a1 1 0 0 1 -1 1 H4 a1 1 0 0 1 -1 -1 Z"/>
      <path d="M9.5 21 V14 H14.5 V21"/>
    </svg>
  ),
  stickers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3"/>
      <rect x="7" y="7" width="3.5" height="3.5" rx="0.6"/>
      <rect x="13.5" y="7" width="3.5" height="3.5" rx="0.6"/>
      <rect x="7" y="13.5" width="3.5" height="3.5" rx="0.6"/>
      <path d="M15 17 c0 -1.2 1 -2.2 2.2 -2.2 S19.4 15.8 19.4 17 S18.4 19.2 17.2 19.2" strokeLinecap="round"/>
    </svg>
  ),
  drafts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19 L4 16 L15 5 a1.5 1.5 0 0 1 2 2 L6 18 L3 19 Z"/>
      <path d="M13 7 L17 11"/>
    </svg>
  ),
  notifs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 17 V11 a6 6 0 0 1 12 0 V17 L20 19 H4 Z"/>
      <path d="M10 21 a2 2 0 0 0 4 0"/>
      <circle cx="17" cy="7.5" r="2.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
};
const TabBar = ({ active, onTab }) => (
  <div className="tabbar">
    {[
      { id: "account",  label: "home" },
      { id: "stickers", label: "stickers" },
      { id: "drafts",   label: "drafts" },
      { id: "notifs",   label: "alerts" },
    ].map(t => (
      <span key={t.id} className={`tab ${active === t.id ? "on" : ""}`} onClick={() => onTab(t.id)}>
        <span className="ic">{TAB_ICONS[t.id]}</span>
        <span>{t.label}</span>
      </span>
    ))}
  </div>
);

/* ─── ACCOUNT 01 home ─── */
const ScreenAccount = ({ go: goTab, openCard, empty = false }) => {
  const go = (a) => typeof a === "string" ? goTab(a) : openCard(a.cardId);
  if (empty) {
    return (
  <>
    <Status />
    <TopNav left="" right="settings" onRight={() => alert('settings — coming soon (this is a prototype)')} />
    <div className="screen with-tabbar">
      <div className="screen-body">
        <div className="profile-strip">
          <div className="avatar">r</div>
          <div className="col gap-4" style={{ flex: 1 }}>
            <span className="tx-h2">rachel.</span>
            <span className="tx-mono">just joined · no cards yet</span>
          </div>
        </div>

        <div className="empty-stage" style={{ marginTop: 24 }}>
          <div className="empty-mark">
            <svg width="76" height="76" viewBox="-16 -16 32 32" style={{ overflow: "visible" }}>
              <circle r="14" fill="none" stroke="var(--clay)" strokeWidth="0.6" strokeDasharray="1 2" opacity="0.7" />
              <path d="M-6 0 L -2 4 L 6 -4" stroke="var(--clay)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="tx-h2" style={{ textAlign: "center" }}>your first <em style={{ color: "var(--clay)", fontStyle: "italic" }}>card</em><br/>is waiting.</h2>
          <p className="tx-body" style={{ textAlign: "center", maxWidth: 240 }}>order a pack, peel a sticker, write something you mean. we keep it all here.</p>
        </div>

        <div className="cta-card" onClick={() => { window.location.href = "shop.html"; }} style={{ cursor: "pointer" }}>
          <div className="body">
            <span className="s">six packs · from $14</span>
            <span className="h">browse the shop →</span>
          </div>
          <span className="arrow">›</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "18px 28px 8px" }}>
          <span className="btn btn-ghost" style={{ height: 44, fontSize: 14, padding: "0 22px" }}>scan a sticker →</span>
        </div>
        <p className="tx-hand-sm" style={{ textAlign: "center", padding: "0 28px 8px", color: "var(--ink-60)" }}>someone else may have mailed you one.</p>
      </div>
      <TabBar active="account" onTab={goTab} />
    </div>
  </>
    );
  }
  return (
  <>
    <Status />
    <TopNav left="" right="settings" onRight={() => alert('settings — coming soon (this is a prototype)')} />
    <div className="screen with-tabbar">
      <div className="screen-body">
        <div className="profile-strip">
          <div className="avatar">r</div>
          <div className="col gap-4" style={{ flex: 1 }}>
            <span className="tx-h2">rachel.</span>
            <span className="tx-mono">since may '26 · love pack × 1</span>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric"><span className="v">7</span><span className="l">stickers left</span></div>
          <div className="metric"><span className="v">3</span><span className="l">cards mailed</span></div>
          <div className="metric"><span className="v">2</span><span className="l">opened</span></div>
        </div>

        <div className="cta-card" onClick={() => { window.location.href = "shop.html"; }} style={{ cursor: "pointer" }}>
          <div className="body">
            <span className="s">love pack · 8 stickers</span>
            <span className="h">reorder in one tap →</span>
          </div>
          <span className="arrow">›</span>
        </div>

        <div className="sec-head">
          <span className="tx-h3">sent</span>
          <span className="more" onClick={() => go("stickers")}>all →</span>
        </div>

        {[
          { id: "k7m2x", who: "maya", meta: "may 11 · love", status: "opened" },
          { id: "j8p4r", who: "j.",   meta: "may 9 · love",  status: "sealed" },
          { id: "n3q7s", who: "ben",  meta: "may 3 · love",  status: "opened" },
        ].map((s) => (
          <div key={s.id} className="sent-item" onClick={() => go({ step: "card-detail", cardId: s.id })}>
            <div className="thumb"><FancyQR seed={s.id} iconId="love" color="#3B2A2F" accent="#A85F40" size={42} /></div>
            <div className="info">
              <span className="who">to {s.who}</span>
              <span className="meta">{s.meta}</span>
            </div>
            <span className={`status ${s.status}`}>{s.status}</span>
          </div>
        ))}

      </div>
      <TabBar active="account" onTab={goTab} />
    </div>
  </>
  );
};

/* ─── ACCOUNT 02 sticker library ─── */
const ScreenStickers = ({ go, openCard, mode = "normal" }) => {
  const baseStickers = [
    { id: "k7m2x", to: "maya",   status: "opened",   iconId: "love", linkable: true },
    { id: "j8p4r", to: "j.",     status: "sealed",   iconId: "love", linkable: true },
    { id: "n3q7s", to: "ben",    status: "opened",   iconId: "love", linkable: true },
    { id: "v9w2k", to: "alex",   status: "in draft", iconId: "love", linkable: true },
    { id: "z4y6h", to: null,     status: "blank",    iconId: "love" },
    { id: "m1f8b", to: null,     status: "blank",    iconId: "love" },
    { id: "p2g3c", to: null,     status: "blank",    iconId: "love" },
    { id: "q5n9d", to: null,     status: "blank",    iconId: "love" },
  ];
  const freshStickers = baseStickers.map(s => ({ ...s, to: null, status: "blank", linkable: false }));
  const spentStickers = [
    { id: "k7m2x", to: "maya",  status: "opened",   iconId: "love", linkable: true },
    { id: "j8p4r", to: "j.",    status: "opened",   iconId: "love", linkable: true },
    { id: "n3q7s", to: "ben",   status: "opened",   iconId: "love", linkable: true },
    { id: "v9w2k", to: "dad",   status: "opened",   iconId: "love", linkable: true },
    { id: "z4y6h", to: "alex",  status: "opened",   iconId: "love", linkable: true },
    { id: "m1f8b", to: "sam",   status: "opened",   iconId: "love", linkable: true },
    { id: "p2g3c", to: "lou",   status: "sealed",   iconId: "love", linkable: true },
    { id: "q5n9d", to: "mom",   status: "sealed",   iconId: "love", linkable: true },
  ];
  const stickers = mode === "fresh" ? freshStickers : mode === "spent" ? spentStickers : baseStickers;
  const counts = {
    blank:  stickers.filter(s => s.status === "blank").length,
    draft:  stickers.filter(s => s.status === "draft").length,
    sealed: stickers.filter(s => s.status === "sealed").length,
    opened: stickers.filter(s => s.status === "opened").length,
  };
  return (
    <>
      <Status />
      <TopNav left="" right="filter" />
      <div className="screen with-tabbar">
        <div className="screen-body">
          <div className="p-h col gap-4" style={{ paddingTop: 4 }}>
            <span className="tx-mono">love pack · 8</span>
            <h1 className="tx-h1">your <em>stickers.</em></h1>
            {mode === "fresh" ? (
              <p className="tx-hand-sm">eight blanks. pick one when you're ready.</p>
            ) : mode === "spent" ? (
              <p className="tx-hand-sm">all eight, used up. quietly proud of you.</p>
            ) : (
              <p className="tx-hand-sm">{counts.opened} opened · {counts.sealed} sealed · {stickers.filter(s => s.status === "in draft").length} in draft · {counts.blank} blank.</p>
            )}
          </div>

          {mode === "spent" && (
            <p className="tx-hand" style={{ textAlign: "center", padding: "18px 28px 4px", color: "var(--ink-60)", cursor: "pointer" }} onClick={() => { window.location.href = "shop.html"; }}>
              <span style={{ color: "var(--clay)" }}>send another set when you're ready →</span>
            </p>
          )}

          <div className="lib-grid" style={{ marginTop: 18 }}>
            {(mode === "fresh" ? stickers : stickers.filter(s => s.status !== "blank")).map(s => (
              <div key={s.id} className="lib-card" onClick={() => s.linkable ? openCard(s.id) : (s.status === "blank" ? window.location.href = "prototype.html" : null)} style={{ cursor: (s.linkable || s.status === "blank") ? "pointer" : "default" }}>
                <FancyQR seed={s.id} iconId={s.iconId} color={s.status === "blank" ? "#A8997D" : "#3B2A2F"} accent={s.status === "blank" ? "#A8997D" : "#A85F40"} size={92} />
                <span className="lab">{s.id.toUpperCase()}</span>
                <span className="title">{s.to ? `to ${s.to}` : "blank"}</span>
                <span className={`status ${s.status === "in draft" ? "draft" : s.status}`} style={{ marginTop: 2 }}>{s.status}</span>
              </div>
            ))}
            {counts.blank > 0 && mode === "normal" && (
              <div className="lib-card blank-group" onClick={() => { window.location.href = "prototype.html"; }} style={{ cursor: "pointer", gridColumn: "span 2" }}>
                <div className="row gap-12" style={{ alignItems: "center", width: "100%" }}>
                  <div className="blank-stack" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                  <div className="col" style={{ flex: 1, gap: 2 }}>
                    <span className="tx-h3" style={{ fontSize: 18 }}>{counts.blank} blank stickers</span>
                    <span className="tx-hand-sm">tap one to start a card →</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {mode === "fresh" && (
            <p className="tx-hand" style={{ textAlign: "center", padding: "20px 28px 8px", color: "var(--ink-80)" }}>tap a sticker to start composing.</p>
          )}
        </div>
        <TabBar active="stickers" onTab={go} />
      </div>
    </>
  );
};

/* ─── ACCOUNT 03 drafts ─── */
const ScreenDrafts = ({ go, empty = false }) => (
  <>
    <Status />
    <TopNav left="" right="" />
    <div className="screen with-tabbar">
      <div className="screen-body">
        <div className="p-h col gap-4" style={{ paddingTop: 4 }}>
          <h1 className="tx-h1">your <em>drafts.</em></h1>
          <p className="tx-hand-sm">{empty ? "nothing in progress." : "still in your hands."}</p>
        </div>

        {empty ? (
          <div className="empty-stage" style={{ marginTop: 28 }}>
            <div className="empty-mark">
              <svg width="68" height="68" viewBox="-16 -16 32 32" style={{ overflow: "visible" }}>
                <path d="M-10 -8 H 10 M-10 -2 H 6 M-10 4 H 8" stroke="var(--ink-24)" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="12" cy="-10" r="3" fill="var(--clay)" />
              </svg>
            </div>
            <h2 className="tx-h2" style={{ textAlign: "center" }}>no <em style={{ color: "var(--clay)", fontStyle: "italic" }}>drafts</em>, yet.</h2>
            <p className="tx-body" style={{ textAlign: "center", maxWidth: 240 }}>start a card and leave whenever — we'll keep it for you.</p>
          </div>
        ) : (
          <>
            {[
              { id: "v9w2k", to: "mom", preview: "thirty years and you still…", meta: "may 10 · sticker v9w2k" },
              { id: "x3a1m", to: "alex", preview: "the trip last summer.", meta: "may 7 · no sticker yet" },
            ].map((d, i) => (
              <div key={i} className="draft-row" style={{ cursor: "pointer" }} onClick={() => go("card-detail")}>
                <div className="row-between">
                  <span className="tx-h3">to {d.to}</span>
                  <span className="tx-mono" style={{ color: "var(--ink-60)" }}>→</span>
                </div>
                <span className="preview">"{d.preview}"</span>
                <span className="meta">{d.meta}</span>
              </div>
            ))}

            <div style={{ padding: "20px 28px", textAlign: "center" }}>
              <p className="tx-hand-sm">no other drafts. start one anytime — they save automatically.</p>
            </div>
          </>
        )}
      </div>
      <TabBar active="drafts" onTab={go} />
    </div>
  </>
);

/* ─── ACCOUNT 04 notifications ─── */
const ScreenNotifs = ({ go, empty = false }) => (
  <>
    <Status />
    <TopNav left="" right={empty ? "" : "mark all"} />
    <div className="screen with-tabbar">
      <div className="screen-body">
        <div className="p-h col gap-4" style={{ paddingTop: 4 }}>
          <h1 className="tx-h1"><em>activity.</em></h1>
          <p className="tx-hand-sm">{empty ? "nothing happening, gently." : "small bells, no buzzes."}</p>
        </div>

        {empty ? (
          <div className="empty-stage" style={{ marginTop: 28 }}>
            <div className="empty-mark">
              <svg width="68" height="68" viewBox="-16 -16 32 32" style={{ overflow: "visible" }}>
                <path d="M-10 -2 q 0 -10 10 -10 q 10 0 10 10 v 6 h -20 z" fill="none" stroke="var(--ink-40)" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M-3 5 q 3 4 6 0" fill="none" stroke="var(--ink-40)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M-14 -10 L -10 -10 M 10 -10 L 14 -10" stroke="var(--clay)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              </svg>
            </div>
            <h2 className="tx-h2" style={{ textAlign: "center" }}>all <em style={{ color: "var(--clay)", fontStyle: "italic" }}>clear.</em></h2>
            <p className="tx-body" style={{ textAlign: "center", maxWidth: 240 }}>we'll let you know when someone opens one of yours.</p>
          </div>
        ) : (
          <div style={{ marginTop: 18 }}>
            {[
              { who: "maya opened your card.", time: "2h ago · k7m2x", read: false },
              { who: "j. hasn't opened theirs in 3 days.", time: "this morning · j8p4r", read: false },
              { who: "your love pack shipped.", time: "may 7 · 8 stickers", read: true },
              { who: "ben opened your card.", time: "may 3 · n3q7s", read: true },
              { who: "welcome to to/froms.", time: "may 1", read: true },
            ].map((n, i) => (
              <div key={i} className={`notif-row ${n.read ? "read" : ""}`}>
                <span className="dot" />
                <div className="body">
                  <span className="who">{n.who}</span>
                  <span className="time">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TabBar active="notifs" onTab={go} />
    </div>
  </>
);

/* ─── App shell ─── */

const App = () => {
  const persisted = load();
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams("");
  const urlView = params.get("view");
  const [step, setStep] = useState(urlView || persisted.step || "lock");
  const [name, setName] = useState(persisted.name || "rachel");
  const [cardId, setCardId] = useState(persisted.cardId || "k7m2x");

  useEffect(() => { persist({ step, name, cardId }); }, [step, name, cardId]);

  const go = (id) => setStep(id);
  const openCard = (id) => { setCardId(id); setStep("card-detail"); };

  const screen = (() => {
    switch (step) {
      case "lock":            return <ScreenLock onTap={() => go("branch")} />;
      case "branch":          return <ScreenBranch goSender={() => go("claim")} goRecipient={() => go("recipient")} />;
      case "claim":           return <ScreenClaim onNext={() => go("claim-name")} packType="love" />;
      case "claim-name":      return <ScreenClaimName name={name} setName={setName} onNext={() => go("claim-success")} onBack={() => go("claim")} />;
      case "claim-success":   return <ScreenClaimSuccess name={name} onCompose={() => go("post-send")} />;
      case "post-send":       return <ScreenPostSend onSignup={() => go("signup")} onSkip={() => go("account")} />;
      case "signup":          return <ScreenSignup onAuthed={() => go("account")} onBack={() => go("post-send")} />;
      case "recipient":       return <ScreenRecipient onOpen={() => go("recipient-open")} />;
      case "recipient-open":  return <ScreenRecipientOpen onDone={() => go("recipient-after")} />;
      case "recipient-after": return <ScreenRecipientAfter onReply={() => go("recipient-after")} onKeep={() => go("signup")} onClose={() => go("lock")} />;
      case "account":         return <ScreenAccount go={go} openCard={openCard} empty={false} />;
      case "card-detail":     return <ScreenCardDetail cardId={cardId} onBack={() => go("account")} />;
      case "stickers":        return <ScreenStickers go={go} openCard={openCard} mode="normal" />;
      case "drafts":          return <ScreenDrafts go={go} empty={false} />;
      case "notifs":          return <ScreenNotifs go={go} empty={false} />;

      case "scan-claimed":    return <ScreenScanClaimed onBack={() => go("lock")} />;
      case "account-empty":   return <ScreenAccount go={go} openCard={openCard} empty={true} />;
      case "stickers-fresh":  return <ScreenStickers go={go} openCard={openCard} mode="fresh" />;
      case "stickers-spent":  return <ScreenStickers go={go} openCard={openCard} mode="spent" />;
      case "drafts-empty":    return <ScreenDrafts go={go} empty={true} />;
      case "notifs-empty":    return <ScreenNotifs go={go} empty={true} />;
      default: return null;
    }
  })();

  // group steps for the side rail
  const groups = useMemo(() => {
    const m = new Map();
    STEPS.forEach(s => { if (!m.has(s.group)) m.set(s.group, []); m.get(s.group).push(s); });
    return [...m.entries()];
  }, []);

  return (
    <>
      <aside className="side-controls">
        <span className="title">to/froms — scan + account.</span>
        <span className="sub">scan moment · sender · recipient · account</span>
        {groups.map(([g, items]) => (
          <div key={g} className="step-list">
            <span className="group-label">{g}</span>
            {items.map(s => (
              <button key={s.id} className={s.id === step ? "on" : ""} onClick={() => go(s.id)}>
                <span className="dot" />
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div className="stage">
        <div className="ph">
          {screen}
          <div className="ph-island" />
          <div className="ph-home" />
        </div>
      </div>
    </>
  );
};

window.ScanApp = App;

/* prototype.jsx — Activation + Reveal clickable prototype */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const LS_KEY = "tf-proto-v1";
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
};
const saveState = (s) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} };

const STEPS = [
  { id: "welcome",  group: "activation", num: null, label: "welcome" },
  { id: "to-from",  group: "activation", num: 1,    label: "to & from" },
  { id: "message",  group: "activation", num: 2,    label: "the message" },
  { id: "photo",    group: "activation", num: 3,    label: "a photo" },
  { id: "song",     group: "activation", num: 4,    label: "a song" },
  { id: "envelope", group: "activation", num: 5,    label: "envelope" },
  { id: "review",   group: "activation", num: null, label: "review & seal" },
  { id: "sealed",   group: "reveal",     num: null, label: "sealed" },
  { id: "cracking", group: "reveal",     num: null, label: "cracking" },
  { id: "unfolding",group: "reveal",     num: null, label: "unfolding" },
  { id: "opened",   group: "reveal",     num: null, label: "opened" },
];
const indexOf = (id) => STEPS.findIndex(s => s.id === id);

const ENVELOPES = [
  { name: "blush",     bg: "#F4D6CC", seal: "#C97B5A", txt: "#3B2A2F" },
  { name: "sage",      bg: "#7C8A6B", seal: "#D9B382", txt: "#FFFFFF" },
  { name: "champagne", bg: "#D9B382", seal: "#A85F40", txt: "#3B2A2F" },
  { name: "paper",     bg: "#F8F1E7", seal: "#C97B5A", txt: "#3B2A2F", outline: true },
  { name: "clay",      bg: "#C97B5A", seal: "#8B4A30", txt: "#F8F1E7" },
  { name: "midnight",  bg: "#3B2A2F", seal: "#D9B382", txt: "#F8F1E7" },
];

const PROMPTS = ["birthday", "thinking of you", "just because", "i'm sorry", "thank you"];

/* derive the wax-seal monogram from the sender's name */
const getMonogram = (from) => {
  const s = (from || "").trim();
  if (!s) return "t/f";
  return s.charAt(0).toLowerCase();
};

/* tiny pulsing "saved" pill — auto-shows for 1.4s when data mutates */
const SavedBadge = ({ data }) => {
  const [shown, setShown] = useState(false);
  const key = useMemo(() => JSON.stringify(data || {}), [data]);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    setShown(true);
    const t = setTimeout(() => setShown(false), 1400);
    return () => clearTimeout(t);
  }, [key]);
  return (
    <span className="saved-badge" data-on={shown}>
      <span className="saved-dot" /> saved
    </span>
  );
};

const SONGS = [
  { id: "none",    title: "no song",                 artist: "silence works too",      art: "linear-gradient(135deg, #E8DDC8, #C9B79A)" },
  { id: "track-1", title: "a song she chose",        artist: "big thief · 3:42",       art: "linear-gradient(135deg, #C97B5A, #3B2A2F)" },
  { id: "track-2", title: "late summer",             artist: "phoebe bridgers · 2:58", art: "linear-gradient(135deg, #7C8A6B, #2E3A28)" },
  { id: "track-3", title: "thirty years on",         artist: "warm hands · 4:10",      art: "linear-gradient(135deg, #D9B382, #6E4A20)" },
  { id: "track-4", title: "a quiet thing",           artist: "piano · 3:21",           art: "linear-gradient(135deg, #F4D6CC, #A85F40)" },
];

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

const Progress = ({ active, total = 5 }) => (
  <div className="prog" style={{ marginTop: 8 }}>
    {Array.from({length: total}, (_, i) => i + 1).map(i => <span key={i} className={i <= active ? "on" : ""} />)}
  </div>
);

const ScreenHead = ({ step, total, label, onBack, statusTone, onClose, data }) => {
  const isReply = data && data._reply === true;
  return (
    <>
      <Status tone={statusTone} />
      <div className="row-between p-h" style={{ paddingTop: 4 }}>
        <span className="tx-mono" onClick={onBack} style={{ cursor: "pointer", color: onBack ? "var(--ink-60)" : "transparent" }}>← back</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {data && <SavedBadge data={data} />}
          <span className="tx-mono" style={{ whiteSpace: "nowrap", textTransform: "none", letterSpacing: "0.06em" }}>{typeof step === "number" ? `${step}/${total}` : step} · {label}</span>
          {onClose && <span className="close-x" onClick={onClose} title="save and exit">×</span>}
        </div>
      </div>
      {isReply && (
        <div className="reply-banner">
          <span className="dot" /> writing back to {data.to || "them"}
        </div>
      )}
    </>
  );
};

/* ─── 01 welcome ─── */
const ScreenWelcome = ({ onNext, hasDraft, data, onDiscard }) => (
  <div className="screen active">
    <Status />
    <div className="row-between p-h" style={{ paddingTop: 8 }}>
      <a href="/index.html" className="tx-mono" style={{ textTransform: "none", letterSpacing: "0.04em", color: "var(--ink-60)", textDecoration: "none" }}>← later</a>
      <a href="/index.html" className="brand-mark-mini" aria-label="to/froms home">to<em>/</em>froms</a>
    </div>
    <div className="screen-body p-h col" style={{ paddingTop: 40 }}>
      {(() => {
        let arrival = null;
        try {
          if (typeof window !== "undefined") {
            arrival = localStorage.getItem("tf-arrival");
            if (arrival) localStorage.removeItem("tf-arrival"); // consume on first read
          }
        } catch (_) {}
        if (arrival === "from-success") {
          return <span className="tx-mono" style={{ textTransform: "none", letterSpacing: "0.04em", color: "var(--clay)" }}>fresh stickers on the way · let's write what they'll carry</span>;
        }
        if (arrival && arrival.startsWith("reply-to-")) {
          const name = arrival.replace("reply-to-", "");
          return <span className="tx-mono" style={{ textTransform: "none", letterSpacing: "0.04em", color: "var(--clay)" }}>a letter back · for {name}</span>;
        }
        return <span className="tx-mono">— a card from someone</span>;
      })()}
      <h1 className="tx-display" style={{ marginTop: 16 }}>hi.</h1>
      <h2 className="tx-h1" style={{ marginTop: 16 }}>let's set up<br/>your <em>card.</em></h2>
      <p className="tx-hand" style={{ marginTop: 24 }}>no login. just you and the page.</p>

      {hasDraft ? (
        <div className="draft-card" onClick={onNext}>
          <div className="row-between">
            <span className="tx-mono" style={{ color: "var(--clay)" }}>draft · saved</span>
            <span className="tx-mono" style={{ color: "var(--ink-60)" }}>continue →</span>
          </div>
          <div className="col gap-4" style={{ marginTop: 8 }}>
            <span className="tx-h3" style={{ fontSize: 20 }}>to {data.to || "—"}{data.from ? <span style={{ color: "var(--ink-60)" }}>{` · from ${data.from}`}</span> : null}</span>
            {data.message ? (
              <span className="tx-hand" style={{ color: "var(--ink-80)" }}>“{(data.message || "").split("\n")[0].slice(0, 60)}{(data.message || "").length > 60 ? "…" : ""}”</span>
            ) : (
              <span className="tx-hand-sm">no message yet.</span>
            )}
          </div>
          <div className="row" style={{ gap: 16, marginTop: 12 }}>
            <span className="tx-mono" style={{ color: "var(--clay)", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onNext(); }}>continue draft</span>
            <span className="tx-mono" style={{ color: "var(--ink-60)", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onDiscard(); }}>discard ×</span>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 28, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 4, height: 28, background: "var(--clay)" }} />
            <p className="tx-body" style={{ fontSize: 14 }}>takes about a minute. you can come back later — your draft stays here.</p>
          </div>
          <div className="welcome-preview" aria-hidden="true">
            <span>to &amp; from</span>
            <span className="sep">—</span>
            <span>the message</span>
            <span className="sep">—</span>
            <span className="opt">a photo</span>
            <span className="sep">—</span>
            <span className="opt">a song</span>
            <span className="sep">—</span>
            <span>the envelope</span>
          </div>
        </>
      )}
    </div>
    <div className="screen-foot">
      <button className="btn btn-primary btn-block" onClick={onNext}>{hasDraft ? "continue →" : "begin →"}</button>
      {!hasDraft && <a className="tx-hand-sm" href="/index.html#how" style={{ textAlign: "center", color: "var(--ink-60)", textDecoration: "none" }}>or, see how it works ↗</a>}
    </div>
  </div>
);

/* ─── 02 to & from ─── */
const ScreenToFrom = ({ data, setData, onNext, onBack, onClose }) => {
  const valid = (data.to || "").trim() && (data.from || "").trim();
  // detect reply mode: arrival was set OR data has a 'replyTo' marker we persist for the duration of compose.
  const isReply = !!data._reply;
  // in reply mode, back goes to the original card view, not the previous compose step
  const backHandler = isReply ? (() => { window.location.href = '/scan.html?view=recipient-after'; }) : onBack;
  return (
    <div className="screen active">
      <ScreenHead step={1} total={5} label={isReply ? "your reply" : "to & from"} onBack={backHandler} onClose={onClose} data={data} />
      <Progress active={1} />
      <div className="screen-body p-h col gap-20" style={{ paddingTop: 32 }}>
        {isReply && (
          <p className="tx-hand" style={{ color: "var(--clay)", margin: 0 }}>writing back to {data.to || "them"} —</p>
        )}
        <h1 className="tx-h1">{isReply ? <>a letter <em>back.</em></> : <>who's it <em>for?</em></>}</h1>

        <div className="col gap-4">
          <label className="tx-hand-sm" style={{ color: "var(--clay)" }}>to:</label>
          <input className="input" autoFocus value={data.to || ""} onChange={e => setData({ ...data, to: e.target.value })} placeholder="their name" />
          {isReply && <span className="tx-hand-sm" style={{ color: "var(--ink-60)", marginTop: 4 }}>from the card you just opened. you can change it.</span>}
        </div>

        <div className="col gap-4">
          <label className="tx-hand-sm" style={{ color: "var(--clay)" }}>from:</label>
          <input className="input" value={data.from || ""} onChange={e => setData({ ...data, from: e.target.value })} placeholder="your name or initial" />
        </div>

        <p className="tx-hand-sm" style={{ marginTop: 4 }}>first names or initials work best.</p>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" disabled={!valid} onClick={onNext}>continue →</button>
      </div>
    </div>
  );
};

/* ─── 03 message ─── */
const PROMPT_FILLER = {
  "birthday": "happy birthday.\nthe year was yours.",
  "thinking of you": "thinking of you.\nthat's it.\nthat's the message.",
  "just because": "no reason.\njust because.",
  "i'm sorry": "i'm sorry.\nlet's try again.",
  "thank you": "thank you.\nfor every small thing.",
};
const ScreenMessage = ({ data, setData, onNext, onBack, onClose }) => {
  const msg = data.message || "";
  const valid = msg.trim().length > 0;
  const [hovered, setHovered] = useState(null);
  const addPrompt = (p) => { setData({ ...data, message: PROMPT_FILLER[p] || p }); setHovered(null); };
  const preview = hovered ? (PROMPT_FILLER[hovered] || hovered) : null;
  return (
    <div className="screen active">
      <ScreenHead step={2} total={5} label="message" onBack={onBack} onClose={onClose} data={data} />
      <Progress active={2} />
      <div className="screen-body p-h col gap-16" style={{ paddingTop: 32 }}>
        <h1 className="tx-h1">what would<br/>you say if you had<br/>{data.to ? <span>{data.to}</span> : "them"} <em>right here?</em></h1>

        {preview ? (
          <div className="textarea preview" aria-hidden>
            {msg.trim() ? (
              <span style={{ textDecoration: "line-through", textDecorationColor: "var(--clay)", textDecorationThickness: "2px", opacity: 0.45, whiteSpace: "pre-wrap" }}>{msg}{"\n"}</span>
            ) : null}
            <span style={{ whiteSpace: "pre-wrap", color: "var(--clay)" }}>{preview}</span>
          </div>
        ) : (
          <textarea className="textarea" placeholder="a line, a memory, a whole letter…" value={msg} onChange={e => setData({ ...data, message: e.target.value })} />
        )}

        <div className="row-between" style={{ marginTop: -4 }}>
          <span className="tx-hand-sm">{preview ? "click a prompt to replace." : "a line or a letter — both work."}</span>
          {(() => {
            const len = (preview || msg).length;
            const tone = len > 270 ? "var(--clay-2)" : len > 240 ? "var(--clay)" : "var(--sage)";
            return <span className="tx-mono" style={{ color: tone }}>{len} of 280</span>;
          })()}
        </div>

        <div className="col gap-8" style={{ marginTop: 4 }}>
          <span className="tx-mono">prompts</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PROMPTS.map(p => (
              <span
                key={p}
                className={`tag ${hovered === p ? "tag-clay" : "tag-paper"}`}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => addPrompt(p)}
              >{p}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn btn-primary btn-block" disabled={!valid} onClick={onNext}>continue →</button>
      </div>
    </div>
  );
};

/* ─── 04 photo ─── */
const ScreenPhoto = ({ data, setData, onNext, onBack, onSkip, onClose }) => {
  const has = data.photo === true;
  return (
    <div className="screen active">
      <ScreenHead step={3} total={5} label="photo · optional" onBack={onBack} onClose={onClose} data={data} />
      <Progress active={3} />
      <div className="screen-body p-h col gap-12" style={{ paddingTop: 32 }}>
        <h1 className="tx-h1">add a <em>photo.</em></h1>
        <p className="tx-body" style={{ fontSize: 15 }}>optional. it'll sit at the top of the card.</p>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          {has ? (
            <div className="polaroid">
              <div className="pic" />
              <span className="cap">{data.to || "maya"}, kyoto '24</span>
            </div>
          ) : (
            <div className="polaroid-add" onClick={() => setData({ ...data, photo: true })}>
              <div className="pic-stub">
                <span className="plus">+</span>
                <span className="hint">tap to add a photo</span>
                <span className="sub">camera · library</span>
              </div>
              <span className="cap">no photo yet</span>
            </div>
          )}
        </div>

        {has && (
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
            <span className="tx-mono" style={{ cursor: "pointer", color: "var(--clay)" }} onClick={() => setData({ ...data, photo: true })}>replace</span>
            <span className="tx-mono" style={{ cursor: "pointer" }} onClick={() => setData({ ...data, photo: false })}>remove</span>
          </div>
        )}
      </div>
      <div className="screen-foot row">
        <button className="btn btn-ghost" onClick={onSkip}>skip</button>
        <button className="btn btn-primary" onClick={onNext}>continue →</button>
      </div>
    </div>
  );
};

/* ─── 05 song ─── */
const ScreenSong = ({ data, setData, onNext, onBack, onSkip, onClose }) => {
  const sel = data.song || "none";
  const explicitlyChosen = (data.song !== undefined && data.song !== null) && (data._touchedSong === true || data.song !== "none");
  const [playing, setPlaying] = useState(null);
  return (
    <div className="screen active">
      <ScreenHead step={4} total={5} label="song · optional" onBack={onBack} onClose={onClose} data={data} />
      <Progress active={4} />
      <div className="screen-body p-h col gap-16" style={{ paddingTop: 32 }}>
        <div className="col gap-8">
          <h1 className="tx-h1">attach a <em>song.</em></h1>
          <p className="tx-body" style={{ fontSize: 15 }}>optional. plays once when they open the card.</p>
        </div>

        <div className="col gap-8" style={{ marginTop: 4 }}>
          {SONGS.map(s => {
            // visually "on" only if user actively chose this song.
            // The default "no song" state should look quiet, not selected.
            const on = explicitlyChosen && sel === s.id;
            const isPlaying = playing === s.id;
            return (
              <div key={s.id}
                className="song-row"
                data-on={on}
                onClick={() => setData({ ...data, song: s.id, _touchedSong: true })}>
                <span className="song-art" style={{ background: s.art }}>
                  {s.id !== "none" && (
                    <span className="song-play" onClick={(e) => { e.stopPropagation(); setPlaying(isPlaying ? null : s.id); }}>
                      {isPlaying ? "❚❚" : "▶"}
                    </span>
                  )}
                </span>
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span className="tx-h3" style={{ fontSize: 15, fontFamily: "var(--sans)", fontWeight: 500 }}>{s.title}</span>
                  <span className="tx-mono" style={{ fontSize: 10 }}>{s.artist}</span>
                </div>
                <span className="song-radio" data-on={on} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="screen-foot row">
        <button className="btn btn-ghost" onClick={onSkip}>skip</button>
        <button className="btn btn-primary" onClick={onNext}>continue →</button>
      </div>
    </div>
  );
};

/* ─── 06 envelope ─── */
const ScreenEnvelope = ({ data, setData, onNext, onBack, onClose }) => (
  <div className="screen active">
    <ScreenHead step={5} total={5} label="envelope" onBack={onBack} onClose={onClose} data={data} />
    <Progress active={5} />
    <div className="screen-body col gap-16" style={{ paddingTop: 32 }}>
      <div className="p-h col gap-12">
        <h1 className="tx-h1">the envelope it <em>lands in.</em></h1>
        <p className="tx-body" style={{ fontSize: 15 }}>the first thing they'll see when they scan.</p>
      </div>

      <div className="env-grid" style={{ marginTop: 8 }}>
        {ENVELOPES.map(e => {
          const on = data.envelope === e.name;
          return (
            <div key={e.name} className={`env-card ${on ? "on" : ""}`} style={{ background: e.bg, border: e.outline && !on ? "1px solid var(--ink-24)" : undefined }} onClick={() => setData({ ...data, envelope: e.name })}>
              {on && <span className="check">✓</span>}
              <div style={{ height: 18 }} />
              <span className="seal" style={{ background: `radial-gradient(circle at 35% 30%, ${e.seal} 0%, ${e.seal} 35%, color-mix(in oklab, ${e.seal} 70%, black) 100%)` }} />
              <span className="name" style={{ color: e.txt }}>{e.name}</span>
            </div>
          );
        })}
      </div>
    </div>
    <div className="screen-foot">
      <button className="btn btn-primary btn-block" onClick={onNext}>
        <span className="seal-dot" aria-hidden="true" />
        review your card →
      </button>
    </div>
  </div>
);

/* ─── 06.5 REVIEW + hold-to-seal ─── */
const ScreenReview = ({ data, setData, onSeal, onBack, onEdit, onClose }) => {
  const env = ENVELOPES.find(e => e.name === data.envelope) || ENVELOPES[0];
  const song = SONGS.find(s => s.id === (data.song || "none")) || SONGS[0];
  const monogram = getMonogram(data.from);
  const msgFirst = (data.message || "").split("\n")[0];

  // hold-to-seal
  const [progress, setProgress] = useState(0);
  const holding = useRef(false);
  const sealed = useRef(false);
  useEffect(() => {
    let last = performance.now();
    let raf;
    const tick = (now) => {
      const dt = now - last; last = now;
      setProgress(p => {
        if (sealed.current) return p;
        const target = holding.current
          ? Math.min(100, p + dt / 12)
          : Math.max(0, p - dt / 6);
        if (target >= 100 && holding.current && !sealed.current) {
          sealed.current = true;
          holding.current = false;
          setTimeout(onSeal, 280);
        }
        return target;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onSeal]);
  const start = (e) => { e.preventDefault(); holding.current = true; };
  const end   = () => { holding.current = false; };

  const Edit = ({ to }) => (
    <span className="edit-link" onClick={() => onEdit(to)}>edit</span>
  );

  return (
    <div className="screen active">
      <ScreenHead step={"final"} total={5} label="review & seal" onBack={onBack} onClose={onClose} data={data} />
      <Progress active={5} />
      <div className="screen-body col" style={{ paddingTop: 24 }}>
        <div className="p-h col gap-8">
          <h1 className="tx-h1">one last <em>look.</em></h1>
          <p className="tx-body" style={{ fontSize: 14 }}>once sealed, the card is final. nothing else gets in.</p>
        </div>

        {/* review summary */}
        <div className="review-list">
          <div className="review-row">
            <div className="col gap-4">
              <span className="review-lab">to &amp; from</span>
              <span className="tx-h3" style={{ fontSize: 18 }}>to {data.to || "—"}<span style={{ color: "var(--ink-60)" }}>{data.from ? ` · from ${data.from}` : ""}</span></span>
            </div>
            <Edit to="to-from" />
          </div>

          <div className="review-row">
            <div className="col gap-4" style={{ flex: 1, minWidth: 0 }}>
              <span className="review-lab">message</span>
              {data.message ? (
                <span className="review-msg">“{msgFirst.slice(0, 70)}{(data.message.length > 70 || data.message.includes("\n")) ? "…" : ""}”</span>
              ) : (
                <span className="tx-hand-sm">no message yet.</span>
              )}
            </div>
            <Edit to="message" />
          </div>

          <div className="review-row">
            <div className="row gap-12" style={{ flex: 1 }}>
              {data.photo ? (
                <div className="mini-polaroid"><div className="mini-pic" /></div>
              ) : (
                <div className="mini-polaroid empty">+</div>
              )}
              <div className="col gap-4">
                <span className="review-lab">photo</span>
                <span className="tx-h3" style={{ fontSize: 16 }}>{data.photo ? "attached" : "none"}</span>
              </div>
            </div>
            <Edit to="photo" />
          </div>

          <div className="review-row">
            <div className="row gap-12" style={{ flex: 1, minWidth: 0 }}>
              <span className="mini-art" style={{ background: song.art }} />
              <div className="col gap-4" style={{ flex: 1, minWidth: 0 }}>
                <span className="review-lab">song</span>
                <span className="tx-h3" style={{ fontSize: 16 }}>{song.id === "none" ? "none" : song.title}</span>
              </div>
            </div>
            <Edit to="song" />
          </div>

          <div className="review-row">
            <div className="row gap-12" style={{ flex: 1 }}>
              <span className="mini-env" style={{ background: env.bg, border: env.outline ? "1px solid var(--ink-24)" : undefined }}>
                <span className="mini-seal" style={{ background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${env.seal} 60%, white) 0%, ${env.seal} 35%, color-mix(in oklab, ${env.seal} 50%, black) 100%)` }}>{monogram}</span>
              </span>
              <div className="col gap-4">
                <span className="review-lab">envelope</span>
                <span className="tx-h3" style={{ fontSize: 16 }}>{env.name} envelope · wax monogram “{monogram}”</span>
              </div>
            </div>
            <Edit to="envelope" />
          </div>
        </div>

        {/* schedule-send chips — choose when the recipient can open */}
        <div className="schedule-row">
          <span className="schedule-lab">unlocks</span>
          <div className="schedule-chips">
            {[
              { id: null, label: "right away" },
              { id: "tomorrow", label: "tomorrow" },
              { id: "week", label: "next week" },
              { id: "valentine", label: "pick a date", isPicker: true },
            ].map(opt => (
              <span
                key={opt.id || "now"}
                className={`schedule-chip ${(data.unlockAt || null) === opt.id ? "on" : ""}`}
                onClick={() => setData({ ...data, unlockAt: opt.id })}
              >
                {opt.isPicker && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginRight: 4, verticalAlign: -1 }}><rect x="1" y="2" width="8" height="7" rx="1"/><path d="M1 4 H9 M3 1 V3 M7 1 V3"/></svg>}
                {opt.label}
              </span>
            ))}
          </div>
          {(data.unlockAt === "valentine") && (
            <span className="tx-hand-sm" style={{ color: "var(--ink-60)" }}>chose feb 14 — they'll see "unlocks valentine's day."</span>
          )}
        </div>

        <div className="p-h" style={{ paddingTop: 14, paddingBottom: 8 }}>
          <p className="tx-hand-sm" style={{ textAlign: "center" }}>press &amp; hold the wax to seal. there's no undo.</p>
          <p className="tx-hand-sm" style={{ textAlign: "center", color: "var(--sage)", marginTop: 4 }}>
            {(() => {
              const who = data.to || "they";
              if (!data.unlockAt) return `${who} will see it the moment they scan.`;
              if (data.unlockAt === "tomorrow") return `${who} can open it tomorrow — the wax stays sealed until then.`;
              if (data.unlockAt === "week") return `${who} can open it in seven days — the wax stays sealed until then.`;
              if (data.unlockAt === "valentine") return `${who} can open it on feb 14 — the wax stays sealed until then.`;
              return `the wax stays sealed until you say so.`;
            })()}
          </p>
        </div>
      </div>

      <div className="screen-foot">
        <div
          className="hold-seal"
          onPointerDown={start}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
        >
          <span
            className="hold-ring"
            style={{ background: `conic-gradient(${env.seal} ${progress * 3.6}deg, var(--ink-12) 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <WaxSeal3D size={82} color={env.seal} monogram={monogram} progress={progress} phase={progress >= 100 ? "sealed" : "idle"} />
          </span>
          <span className="hold-label">{progress > 5 ? (progress >= 100 ? "sealed." : "hold…") : "hold to seal"}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── REVEAL: sealed, cracking, unfolding, opened ─── */

const EnvelopeStage = ({ phase, envSpec, recipient, monogram, onTap, hideTapHint }) => {
  // phase: "sealed" | "cracking" | "unfolding" | "opened"
  const stageCls = ["env-stage", phase].join(" ");
  const bg = envSpec.bg;
  const sealColor = envSpec.seal;
  const sealPhase = (phase === "cracking" || phase === "unfolding") ? "cracking" : "idle";
  return (
    <div className={stageCls} onClick={onTap} style={{ cursor: phase === "sealed" ? "pointer" : "default" }}>
      <div className="env-frame" style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${bg} 88%, white) 0%, ${bg} 100%)` }}>
        <div className="env-flap" style={{ background: `color-mix(in oklab, ${bg} 92%, black)` }} />
        <span className="recipient">to: {recipient}.</span>
        <div className="seal-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <WaxSeal3D size={88} color={sealColor} monogram={monogram || "t"} phase={sealPhase} />
        </div>
      </div>
      {phase === "sealed" && !hideTapHint && (
        <div className="env-tap-hint">
          <span>tap to open.</span>
          <span className="pulse-dot" />
        </div>
      )}
      {/* paper rising during unfolding */}
      <div className="paper-card">
        <span className="crease-h" />
        <span className="crease-v" />
      </div>
    </div>
  );
};

const ScreenSealed = ({ data, onTap, onBack }) => {
  const env = ENVELOPES.find(e => e.name === data.envelope) || ENVELOPES[0];
  const locked = !!data.unlockAt;
  const unlockLabel = data.unlockAt === "tomorrow" ? "unlocks tomorrow" : data.unlockAt === "week" ? "unlocks in 7 days" : data.unlockAt === "valentine" ? "unlocks on feb 14" : null;
  return (
    <div className="screen active reveal-bg">
      <Status tone={env.name === "midnight" || env.name === "clay" ? "dark" : "light"} />
      <span className="back-chev" onClick={onBack}>‹</span>
      <div className="row-between p-h" style={{ paddingTop: 4, color: env.name === "midnight" ? "var(--paper-80)" : undefined }}>
        <span />
        <span className="tx-mono">— a letter</span>
      </div>
      <div className="screen-body" style={{ position: "relative" }}>
        <EnvelopeStage phase="sealed" envSpec={env} recipient={data.to || "maya"} monogram={getMonogram(data.from)} onTap={locked ? undefined : onTap} hideTapHint={locked} />
        {locked && unlockLabel && (
          <div className="lock-cluster">
            <div className="lock-pill">
              <svg width="11" height="14" viewBox="0 0 11 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><rect x="1.8" y="6" width="7.4" height="6.6" rx="1.2"/><path d="M3.2 6 V4.2 a2.3 2.3 0 0 1 4.6 0 V6"/></svg>
              <span>{unlockLabel}</span>
            </div>
            <p className="lock-from">from {data.from || "em"} — the wax stays sealed until then.</p>
            <span className="lock-remind" onClick={() => alert("we'll send you a soft nudge when it's time to open.")}>
              ↗ remind me when it unlocks
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenCracking = ({ data }) => {
  const env = ENVELOPES.find(e => e.name === data.envelope) || ENVELOPES[0];
  return (
    <div className="screen active reveal-bg">
      <Status />
      <div className="screen-body" style={{ position: "relative" }}>
        <EnvelopeStage phase="cracking" envSpec={env} recipient={data.to || "maya"} monogram={getMonogram(data.from)} />
      </div>
    </div>
  );
};

const ScreenUnfolding = ({ data }) => {
  const env = ENVELOPES.find(e => e.name === data.envelope) || ENVELOPES[0];
  return (
    <div className="screen active reveal-bg">
      <Status />
      <div className="screen-body" style={{ position: "relative" }}>
        <EnvelopeStage phase="unfolding" envSpec={env} recipient={data.to || "maya"} monogram={getMonogram(data.from)} />
      </div>
    </div>
  );
};

const ScreenOpened = ({ data, onReplay, onRestart, fromName }) => {
  const msg = data.message || "thirty years.\nyou still make me\nread aloud.";
  const song = SONGS.find(s => s.id === (data.song || "none")) || SONGS[0];
  const hasSong = song.id !== "none";
  return (
    <div className="screen active">
      <Status />
      <div className="opened-screen show" style={{ overflowY: "auto" }}>
        <div className="ph-status-inline">
          <span className="tx-mono">a letter from {fromName || data.from || "em"}</span>
        </div>

        {data.photo !== false && (
          <div className="photo-wrap">
            <div className="photo-card">
              <div className="pic">
                {/* warm sketched scene — porch light at dusk */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8C9BA"/>
                      <stop offset="55%" stopColor="#C97B5A"/>
                      <stop offset="100%" stopColor="#5E3A2E"/>
                    </linearGradient>
                    <radialGradient id="glow" cx="0.65" cy="0.42" r="0.35">
                      <stop offset="0%" stopColor="#FFE0B2" stopOpacity="0.9"/>
                      <stop offset="60%" stopColor="#FFE0B2" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#FFE0B2" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="100" height="100" fill="url(#sky)"/>
                  <ellipse cx="65" cy="42" rx="34" ry="34" fill="url(#glow)"/>
                  {/* horizon line */}
                  <path d="M0 72 L100 70" stroke="#3B2A2F" strokeOpacity="0.32" strokeWidth="0.4"/>
                  {/* porch silhouette */}
                  <path d="M52 72 L52 56 L60 50 L78 50 L86 56 L86 72 Z" fill="#3B2A2F" opacity="0.78"/>
                  <rect x="64" y="58" width="10" height="14" fill="#FFD18A" opacity="0.85"/>
                  {/* porch light */}
                  <circle cx="65" cy="46" r="2.6" fill="#FFD18A"/>
                  <circle cx="65" cy="46" r="6" fill="#FFD18A" opacity="0.32"/>
                  {/* foreground figure */}
                  <ellipse cx="22" cy="86" rx="5" ry="2" fill="#1f1316" opacity="0.4"/>
                  <path d="M22 86 L22 72 Q18 65 22 60 Q26 65 22 72" fill="#1f1316" opacity="0.78"/>
                  <circle cx="22" cy="58" r="3.2" fill="#1f1316" opacity="0.85"/>
                </svg>
              </div>
              <span className="cap">{data.to || "maya"}, the porch '24</span>
            </div>
          </div>
        )}

        <div className="msg">
          <p className="msg-text">{msg}</p>
          <p className="msg-sig">— {fromName || data.from || "em"}</p>
          <p className="msg-meta">opened just now</p>
        </div>

        {hasSong && (
          <div className="player">
            <span className="art" style={{ background: song.art }} />
            <div className="meta">
              <span className="tx-h3" style={{ fontSize: 16 }}>{song.title}</span>
              <span className="tx-mono" style={{ fontSize: 10 }}>{song.artist}</span>
            </div>
            <span className="play">▶</span>
          </div>
        )}

        <div style={{ padding: "20px 24px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn btn-primary btn-block" onClick={() => { window.location.href = "shop.html"; }}>send one back →</button>
          <span className="tx-mono" style={{ textAlign: "center", color: "var(--ink-40)", cursor: "pointer", textTransform: "none", letterSpacing: "0.04em" }} onClick={onReplay}>↺ replay the reveal</span>
        </div>
        <div className="opened-foot">tofroms.co · k7m2x</div>
      </div>
      <style>{`
        @keyframes petalDrift {
          0% { transform: translate(0,0) rotate(-25deg); opacity: 0.85; }
          50% { transform: translate(-8px, 14px) rotate(-15deg); opacity: 1; }
          100% { transform: translate(0,0) rotate(-25deg); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

/* ─── App ─── */

const App = () => {
  const persisted = loadState();
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams("");
  const urlStep = params.get("step");
  const [step, setStep] = useState(urlStep || persisted.step || "welcome");
  const [data, setData] = useState(persisted.data || {
    to: "",
    from: "",
    message: "",
    photo: false,
    song: "none",
    envelope: "blush",
  });

  useEffect(() => { saveState({ step, data }); }, [step, data]);

  // auto-progress for transient reveal phases
  useEffect(() => {
    if (step === "cracking") {
      const t = setTimeout(() => setStep("opened"), 900);
      return () => clearTimeout(t);
    }
    if (step === "unfolding") {
      const t = setTimeout(() => setStep("opened"), 600);
      return () => clearTimeout(t);
    }
  }, [step]);

  const go = (id) => setStep(id);
  const restart = () => { setStep("welcome"); setData({ to: "", from: "", message: "", photo: false, song: "none", envelope: "blush" }); };
  const replay = () => setStep("sealed");
  const saveExit = () => setStep("welcome");
  const hasDraft = !!(data.to || data.from || data.message || data.photo || (data.song && data.song !== "none"));

  // also update the envelope CTA to read "review"
  // (handled by setting onNext to review)

  const screen = (() => {
    switch (step) {
      case "welcome":  return <ScreenWelcome onNext={() => go(hasDraft ? (data.to ? "message" : "to-from") : "to-from")} hasDraft={hasDraft} data={data} onDiscard={restart} />;
      case "to-from":  return <ScreenToFrom data={data} setData={setData} onNext={() => go("message")} onBack={() => go("welcome")} onClose={saveExit} />;
      case "message":  return <ScreenMessage data={data} setData={setData} onNext={() => go("photo")} onBack={() => go("to-from")} onClose={saveExit} />;
      case "photo":    return <ScreenPhoto data={data} setData={setData} onNext={() => go("song")} onBack={() => go("message")} onSkip={() => { setData({ ...data, photo: false }); go("song"); }} onClose={saveExit} />;
      case "song":     return <ScreenSong data={data} setData={setData} onNext={() => go("envelope")} onBack={() => go("photo")} onSkip={() => { setData({ ...data, song: "none" }); go("envelope"); }} onClose={saveExit} />;
      case "envelope": return <ScreenEnvelope data={data} setData={setData} onNext={() => go("review")} onBack={() => go("song")} onClose={saveExit} />;
      case "review":   return <ScreenReview data={data} setData={setData} onSeal={() => go("sealed")} onBack={() => go("envelope")} onEdit={(to) => go(to)} onClose={saveExit} />;
      case "sealed":   return <ScreenSealed data={data} onTap={() => go("cracking")} onBack={() => go("review")} />;
      case "cracking": return <ScreenCracking data={data} />;
      case "unfolding":return <ScreenUnfolding data={data} />;
      case "opened":   return <ScreenOpened data={data} fromName={data.from} onReplay={replay} onRestart={restart} />;
      default: return null;
    }
  })();

  const groups = [
    { id: "activation", title: "activation", steps: STEPS.filter(s => s.group === "activation") },
    { id: "reveal", title: "reveal", steps: STEPS.filter(s => s.group === "reveal") },
  ];

  return (
    <>
      <aside className="side-controls">
        <span className="title">to/froms — proto.</span>
        <span className="sub">activation + reveal · phase 3</span>
        {groups.map(g => (
          <div key={g.id} className="step-list">
            <span className="sub" style={{ marginBottom: 6 }}>{g.title}</span>
            {g.steps.map(s => (
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
          <div className={`ph-home ${step === "sealed" && (data.envelope === "midnight") ? "dark" : ""}`} />
        </div>
      </div>

      <div className="replay">
        <button onClick={restart}>start over</button>
        <button onClick={replay}>replay reveal</button>
      </div>
    </>
  );
};

window.PrototypeApp = App;

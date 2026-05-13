/* Phone frame + wireframe primitives shared across all screens */

const Phone = ({ children, tone = "cream", dashed = true, time = "9:41" }) => (
  <div className={`phone ${tone} ${dashed ? "dashed" : ""}`}>
    <div className="status">
      <span>{time}</span>
      <span>●●●●</span>
    </div>
    <div className="notch" />
    <div className="screen">{children}</div>
    <div className="home" />
  </div>
);

const Box = ({ h = 60, c = "", style = {}, children, ...rest }) => (
  <div className={`wf-block ${c}`} style={{ height: h, ...style }} {...rest}>
    {children}
  </div>
);

const Line = ({ w = "long", h = "h2", style = {} }) => (
  <div className={`wf-line ${w} ${h}`} style={style} />
);

const Stack = ({ gap = 8, style = {}, children, ...rest }) => (
  <div className="wf-stack" style={{ gap, ...style }} {...rest}>{children}</div>
);

const Row = ({ gap = 6, style = {}, children, justify = "flex-start", align = "center", ...rest }) => (
  <div className="wf-row" style={{ gap, justifyContent: justify, alignItems: align, ...style }} {...rest}>{children}</div>
);

const Pill = ({ children, c = "" }) => (
  <span className={`wf-pill ${c}`}>{children}</span>
);

const CTA = ({ children, c = "", full = true, style = {} }) => (
  <div className={`wf-cta ${c} ${full ? "full" : ""}`} style={style}>{children}</div>
);

const Input = ({ children, style = {} }) => (
  <div className="wf-input" style={style}>{children}</div>
);

const Tx = ({ children, size = 8, weight = 400, font = "sans", color, style = {}, ...rest }) => {
  const fam = font === "serif" ? "var(--serif)" : font === "hand" ? "var(--hand)" : font === "mono" ? "var(--mono)" : "var(--sans)";
  return (
    <div style={{
      fontFamily: fam,
      fontSize: size,
      fontWeight: weight,
      lineHeight: 1.3,
      color: color || "var(--ink-80)",
      ...style,
    }} {...rest}>{children}</div>
  );
};

/* ─── Annotations ─── */

const Annot = ({ x, y, side = "right", w, children, rotate = 0 }) => {
  const style = {
    left: side === "right" ? x : undefined,
    right: side === "left" ? x : undefined,
    top: y,
    width: w,
    transform: `rotate(${rotate}deg)`,
  };
  return <div className={`annot ${side}`} style={style}>{children}</div>;
};

/* curved annotation arrow drawn as SVG with dashed stroke */
const AnnotArrow = ({ from, to, curve = 30 }) => {
  const left = Math.min(from.x, to.x) - 20;
  const top = Math.min(from.y, to.y) - 20;
  const w = Math.abs(to.x - from.x) + 40;
  const h = Math.abs(to.y - from.y) + 40;
  const x1 = from.x - left, y1 = from.y - top;
  const x2 = to.x - left, y2 = to.y - top;
  const mx = (x1 + x2) / 2 + curve;
  const my = (y1 + y2) / 2 - curve;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const ah1x = x2 - 7 * Math.cos(ang - 0.4);
  const ah1y = y2 - 7 * Math.sin(ang - 0.4);
  const ah2x = x2 - 7 * Math.cos(ang + 0.4);
  const ah2y = y2 - 7 * Math.sin(ang + 0.4);
  return (
    <div className="annot-arrow" style={{ left, top, width: w, height: h }}>
      <svg width={w} height={h}>
        <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} />
        <path className="head" d={`M ${ah1x} ${ah1y} L ${x2} ${y2} L ${ah2x} ${ah2y}`} />
      </svg>
    </div>
  );
};

/* Storyboard arrow between cells */
const FlowArrow = ({ label }) => (
  <div className="arrow">
    {label && <div className="lbl">{label}</div>}
    <svg viewBox="0 0 56 80">
      <path d="M 4 40 C 18 24, 34 56, 50 40" stroke="var(--ink-40)" strokeWidth="1" strokeDasharray="3 2" fill="none" />
      <path d="M 44 34 L 50 40 L 44 46" stroke="var(--ink-40)" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

/* Cell (phone + caption + annotation overlay) */
const Cell = ({ num, label, children, annots = [] }) => (
  <div className="cell">
    <div className="cell-cap">
      {num != null && <span className="num">{num}</span>}
      <span>{label}</span>
    </div>
    <div style={{ position: "relative" }}>
      {children}
      {annots.map((a, i) => (
        <Annot key={i} {...a}>{a.text}</Annot>
      ))}
    </div>
  </div>
);

/* Strip — horizontal storyboard row for one direction */
const Strip = ({ dir = "A", name, tag, children }) => (
  <div className="strip" data-dir={dir}>
    <div className="strip-label">
      <div className="strip-letter">{dir}.</div>
      <div className="strip-name">{name}</div>
      <div className="strip-tag">{tag}</div>
    </div>
    <div className="strip-row">
      {children}
    </div>
  </div>
);

/* Section wrapper */
const Section = ({ id, num, kicker, title, blurb, children }) => (
  <section id={id} className="section">
    <div className="section-head">
      <div className="section-num">{num}</div>
      <div>
        <div className="section-kicker">{kicker}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-blurb">{blurb}</div>
    </div>
    {children}
  </section>
);

/* Tab bar primitive (reused) */
const TabBar = ({ active = 0 }) => {
  const items = ["home", "shop", "cards", "you"];
  return (
    <div style={{
      position: "absolute",
      bottom: 0, left: 0, right: 0,
      height: 32,
      borderTop: "1px dashed var(--ink-24)",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      alignItems: "center",
      padding: "0 6px",
      background: "rgba(248,241,231,0.85)",
    }}>
      {items.map((it, i) => (
        <div key={it} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: 14, height: 14, borderRadius: 4,
            border: `1px ${i === active ? "solid" : "dashed"} var(--ink-40)`,
            background: i === active ? "var(--clay)" : "transparent",
          }} />
          <div style={{ fontFamily: "var(--mono)", fontSize: 6, letterSpacing: "0.06em",
            color: i === active ? "var(--clay)" : "var(--ink-60)" }}>{it}</div>
        </div>
      ))}
    </div>
  );
};

/* expose */
Object.assign(window, {
  Phone, Box, Line, Stack, Row, Pill, CTA, Input, Tx,
  Annot, AnnotArrow, FlowArrow, Cell, Strip, Section, TabBar,
});

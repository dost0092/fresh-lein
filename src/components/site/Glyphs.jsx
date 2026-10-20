/**
 * FreshLien glyph set.
 *
 * Hand-drawn on a 24px grid with a shared stroke, round joins, and one quiet
 * accent shape per icon. The accent color comes from `--glyph-accent` so a
 * parent can tint it (e.g. white on dark tiles). Each glyph takes the same
 * props as a lucide icon, so they drop into any `icon` field.
 */

const ACCENT = 'var(--glyph-accent, #1F8A55)';

function Glyph({ children, className, strokeWidth = 1.5, title, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** Soft accent fill used inside glyphs. */
const Fill = ({ opacity = 0.22, ...p }) => <path fill={ACCENT} stroke="none" opacity={opacity} {...p} />;

/* ── Services ─────────────────────────────────────────────────────────── */

export function GlyphDataLayers(props) {
  return (
    <Glyph {...props}>
      <Fill d="M12 3.5 20 7.5 12 11.5 4 7.5Z" opacity={0.28} />
      <path d="M12 3.5 20 7.5 12 11.5 4 7.5Z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 16.5l8 4 8-4" />
      <circle cx="12" cy="7.5" r="0.9" fill={ACCENT} stroke="none" />
    </Glyph>
  );
}

export function GlyphZoning(props) {
  return (
    <Glyph {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <rect x="7" y="7" width="10" height="10" rx="1" strokeDasharray="1.6 2.2" opacity={0.55} />
      <Fill d="M9.5 9.5h5v5h-5z" opacity={0.35} />
      <path d="M9.5 9.5h5v5h-5z" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphPermit(props) {
  return (
    <Glyph {...props}>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 11h5M8.5 14h3" />
      <Fill d="M15.5 14.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5z" opacity={0.3} />
      <path d="m14.4 17 .8.8 1.5-1.6" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphRadar(props) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" opacity={0.5} />
      <Fill d="M12 12 18 6a8.5 8.5 0 0 1 2.5 6z" opacity={0.3} />
      <path d="M12 12l6-6" stroke={ACCENT} />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.2" r="1" fill={ACCENT} stroke="none" />
    </Glyph>
  );
}

export function GlyphNeural(props) {
  return (
    <Glyph {...props}>
      <path d="M7.4 7.4l2.9 2.9M16.6 7.4l-2.9 2.9M7.4 16.6l2.9-2.9M16.6 16.6l-2.9-2.9" opacity={0.6} />
      <circle cx="5.75" cy="5.75" r="2.25" />
      <circle cx="18.25" cy="5.75" r="2.25" />
      <circle cx="5.75" cy="18.25" r="2.25" />
      <circle cx="18.25" cy="18.25" r="2.25" />
      <circle cx="12" cy="12" r="2.6" fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphWorkflow(props) {
  return (
    <Glyph {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="5.5" rx="1.6" />
      <Fill d="M14.6 15h4.3a1.6 1.6 0 0 1 1.6 1.6v2.3a1.6 1.6 0 0 1-1.6 1.6h-4.3a1.6 1.6 0 0 1-1.6-1.6v-2.3a1.6 1.6 0 0 1 1.6-1.6z" opacity={0.3} />
      <rect x="13" y="15" width="7.5" height="5.5" rx="1.6" stroke={ACCENT} />
      <path d="M7.25 9v4.25a2.5 2.5 0 0 0 2.5 2.5H13" />
      <path d="m11 14 1.75 1.75L11 17.5" opacity={0.7} />
    </Glyph>
  );
}

export function GlyphSend(props) {
  return (
    <Glyph {...props}>
      <Fill d="M20.5 3.5 10.6 13.4l2.9 6.6z" opacity={0.3} />
      <path d="M20.5 3.5 3.5 10.5l7.1 2.9 2.9 7.1z" />
      <path d="M20.5 3.5 10.6 13.4" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphDashboard(props) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 8.5h18" />
      <circle cx="5.9" cy="6.25" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="7.9" cy="6.25" r="0.55" fill="currentColor" stroke="none" />
      <path d="M7.5 17v-3M12 17v-5.5M16.5 17v-2" strokeWidth={2} opacity={0.55} />
      <path d="M12 17v-5.5" strokeWidth={2} stroke={ACCENT} />
    </Glyph>
  );
}

/* ── Audiences ────────────────────────────────────────────────────────── */

export function GlyphHouseKey(props) {
  return (
    <Glyph {...props}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" />
      <Fill d="M12 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" opacity={0.35} />
      <circle cx="12" cy="13" r="2" stroke={ACCENT} />
      <path d="M12 15v3" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphSign(props) {
  return (
    <Glyph {...props}>
      <path d="M5.5 3.5v17M3.5 20.5h4M5.5 5.5h14" />
      <path d="M9.5 5.5v2M17 5.5v2" opacity={0.6} />
      <Fill d="M9 7.5h8.5a1.5 1.5 0 0 1 1.5 1.5v4.5a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5V9A1.5 1.5 0 0 1 9 7.5z" opacity={0.28} />
      <rect x="7.5" y="7.5" width="11.5" height="7.5" rx="1.5" stroke={ACCENT} />
      <path d="M10.5 11.25h5.5" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphTowers(props) {
  return (
    <Glyph {...props}>
      <path d="M3.5 20.5h17" />
      <path d="M5 20.5V10a1 1 0 0 1 1-1h4.5v11.5" />
      <Fill d="M10.5 4.5a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1v16h-8.5z" opacity={0.2} />
      <path d="M10.5 20.5v-16a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1v16" />
      <path d="M13.5 7.5h2.5M13.5 10.5h2.5M13.5 13.5h2.5" stroke={ACCENT} />
      <path d="M7.25 12.5h1M7.25 15.5h1" opacity={0.6} />
    </Glyph>
  );
}

export function GlyphCrane(props) {
  return (
    <Glyph {...props}>
      <path d="M7.5 20.5v-16M3.5 20.5h8M3.5 6.5h17" />
      <path d="M7.5 4.5 13 6.5M7.5 4.5 4.5 6.5" opacity={0.6} />
      <path d="M17.5 6.5v5" />
      <Fill d="M15.5 11.5h4v3.5h-4z" opacity={0.35} />
      <rect x="15.5" y="11.5" width="4" height="3.5" rx="0.6" stroke={ACCENT} />
      <path d="M7.5 10.5l-2 2M7.5 14.5l-2 2" opacity={0.45} />
    </Glyph>
  );
}

export function GlyphBank(props) {
  return (
    <Glyph {...props}>
      <Fill d="M3.5 9 12 4l8.5 5z" opacity={0.3} />
      <path d="M3.5 9 12 4l8.5 5z" stroke={ACCENT} />
      <path d="M6 11.5v6M10 11.5v6M14 11.5v6M18 11.5v6" />
      <path d="M3.5 20.5h17" />
    </Glyph>
  );
}

export function GlyphChip(props) {
  return (
    <Glyph {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2.25" />
      <Fill d="M10 9.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5z" opacity={0.35} />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" stroke={ACCENT} />
      <path d="M9.5 3.5V6M14.5 3.5V6M9.5 18v2.5M14.5 18v2.5M3.5 9.5H6M3.5 14.5H6M18 9.5h2.5M18 14.5h2.5" />
    </Glyph>
  );
}

export function GlyphBuilding(props) {
  return (
    <Glyph {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
      <path d="M8.5 7.5h1M11.5 7.5h1M14.5 7.5h1M8.5 10.5h1M11.5 10.5h1M14.5 10.5h1M8.5 13.5h1M14.5 13.5h1" opacity={0.65} />
      <Fill d="M10.5 16.5h3v4h-3z" opacity={0.35} />
      <path d="M10.5 20.5v-4h3v4" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphRoof(props) {
  return (
    <Glyph {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5v9.5A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V9.5" />
      <path d="M16 5.5V8" />
      <Fill d="M10 13h4v4h-4z" opacity={0.35} />
      <rect x="10" y="13" width="4" height="4" rx="0.6" stroke={ACCENT} />
    </Glyph>
  );
}

/* ── Booking / UI ─────────────────────────────────────────────────────── */

export function GlyphCompass(props) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <Fill d="m14.8 9.2-1.6 4-4 1.6 1.6-4z" opacity={0.4} />
      <path d="m14.8 9.2-1.6 4-4 1.6 1.6-4z" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphContract(props) {
  return (
    <Glyph {...props}>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 10.5h7M8.5 13.5h4" opacity={0.6} />
      <path d="M8.5 17.5c1-1.4 1.8-1.4 2.3 0s1.2 1.4 2.2 0" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphShield(props) {
  return (
    <Glyph {...props}>
      <Fill d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z" opacity={0.16} />
      <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z" />
      <path d="m9.2 12.2 2 2 3.8-4" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphKey(props) {
  return (
    <Glyph {...props}>
      <Fill d="M8.5 11a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" opacity={0.2} />
      <circle cx="8.5" cy="15.5" r="4.5" />
      <circle cx="8.5" cy="15.5" r="1.3" fill={ACCENT} stroke="none" />
      <path d="M11.7 12.3 19.5 4.5M16.5 7.5l2.5 2.5M14.5 9.5l1.8 1.8" />
    </Glyph>
  );
}

export function GlyphDemo(props) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2.5" />
      <path d="M8.5 20.5h7M12 17v3.5" />
      <Fill d="m10.5 8.3 4 2.2-4 2.2z" opacity={0.4} />
      <path d="m10.5 8.3 4 2.2-4 2.2z" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphHandoff(props) {
  return (
    <Glyph {...props}>
      <path d="M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9z" />
      <path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9" opacity={0.6} />
      <Fill d="M12 3.5 19.5 7.5 12 11.5 4.5 7.5z" opacity={0.22} />
      <path d="m8.25 5.5 7.5 4" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphSupport(props) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <Fill d="M14.5 9.5 18 6a8.5 8.5 0 0 1 0 12l-3.5-3.5a3.5 3.5 0 0 0 0-5z" opacity={0.3} />
      <path d="M6 6l3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" />
    </Glyph>
  );
}

export function GlyphCalendar(props) {
  return (
    <Glyph {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5V6.5M16 3.5V6.5" />
      <Fill d="M13.5 13h3v3h-3z" opacity={0.4} />
      <rect x="13.5" y="13" width="3" height="3" rx="0.6" stroke={ACCENT} />
      <path d="M7.5 13.5h2M7.5 16.5h2" opacity={0.5} />
    </Glyph>
  );
}

export function GlyphMail(props) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 6.5 8.2 6 8.2-6" stroke={ACCENT} />
    </Glyph>
  );
}

export function GlyphChat(props) {
  return (
    <Glyph {...props}>
      <path d="M20.5 11.5c0 4-3.8 7-8.5 7-1.2 0-2.3-.2-3.3-.5L4 19.5l1.3-3.6C4.2 14.7 3.5 13.2 3.5 11.5c0-4 3.8-7 8.5-7s8.5 3 8.5 7z" />
      <circle cx="8.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.5" r="1" fill={ACCENT} stroke="none" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
    </Glyph>
  );
}

export function GlyphClock(props) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <Fill d="M12 12V5.5a6.5 6.5 0 0 1 5.6 3.2z" opacity={0.3} />
      <path d="M12 7.5V12l3 2" stroke={ACCENT} />
    </Glyph>
  );
}

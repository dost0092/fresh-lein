const STORAGE_KEY = 'freshlien_guest_started_at';

export const GUEST_ACCESS_DAYS = 15;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function readStartedAt() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const t = Date.parse(raw);
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

/** Start the guest window on first dashboard visit. Returns start timestamp (ms). */
export function ensureGuestAccessStarted() {
  let started = readStartedAt();
  if (!started) {
    started = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, new Date(started).toISOString());
    } catch {
      /* ignore */
    }
  }
  return started;
}

export function getGuestStartedAt() {
  return readStartedAt();
}

export function getGuestAccessEndsAt() {
  const started = readStartedAt();
  if (!started) return null;
  return started + GUEST_ACCESS_DAYS * MS_PER_DAY;
}

export function getGuestDaysRemaining() {
  const endsAt = getGuestAccessEndsAt();
  if (!endsAt) return GUEST_ACCESS_DAYS;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / MS_PER_DAY));
}

export function isGuestAccessActive() {
  const started = readStartedAt();
  if (!started) return true;
  return Date.now() < started + GUEST_ACCESS_DAYS * MS_PER_DAY;
}

export function isGuestAccessExpired() {
  const started = readStartedAt();
  if (!started) return false;
  return Date.now() >= started + GUEST_ACCESS_DAYS * MS_PER_DAY;
}

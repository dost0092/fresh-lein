const CACHE_KEY = 'freshlien_landing_map_v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

export function readLandingMapCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, rows } = JSON.parse(raw);
    if (!Array.isArray(rows) || Date.now() - at > CACHE_TTL_MS) return null;
    return rows;
  } catch {
    return null;
  }
}

export function writeLandingMapCache(rows) {
  try {
    if (!rows?.length) return;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rows }));
  } catch {
    /* ignore quota errors */
  }
}

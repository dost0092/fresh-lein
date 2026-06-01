const STORAGE_KEY = 'freshlien_landing_searches';
const MAX_FREE_SEARCHES = 3;

export function getLandingSearchCount() {
  try {
    return Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  } catch {
    return 0;
  }
}

export function incrementLandingSearch() {
  const next = getLandingSearchCount() + 1;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function canSearchOnLanding() {
  return getLandingSearchCount() < MAX_FREE_SEARCHES;
}

export function getRemainingSearches() {
  return Math.max(0, MAX_FREE_SEARCHES - getLandingSearchCount());
}

export const LANDING_FREE_SEARCH_LIMIT = MAX_FREE_SEARCHES;

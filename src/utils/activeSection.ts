// A section becomes active once its top crosses this fraction of the viewport
const ACTIVE_LINE = 0.35;

/**
 * Returns the id of the section currently being read, based on real on-screen
 * positions (so the order of `ids` doesn't matter). Null when none has been reached yet.
 */
export function getActiveSection(ids: string[]): string | null {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) return ids[ids.length - 1] ?? null;

  const line = window.innerHeight * ACTIVE_LINE;
  let current: string | null = null;
  let best = -Infinity;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= line && top > best) {
      best = top;
      current = id;
    }
  }
  return current;
}

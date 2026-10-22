/** "https://www.meka.com/" → "meka.com" (falls back to the input if it isn't a URL). */
export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

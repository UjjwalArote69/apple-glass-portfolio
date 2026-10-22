const urls = [
  'https://kendall-web.vercel.app/',
  'https://schema-studio.vercel.app/',
  'http://yapster-2-0.vercel.app/welcome',
  'https://whispr-lemon.vercel.app/',
  'https://meka.com/',
  'https://amma-lines.vercel.app/',
  'https://meka-dredging.vercel.app/',
  'https://meka-consultants.vercel.app/',
  'https://nari-astra.vercel.app/'
];

async function inspectUrls() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) });
      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      console.log('=== ' + url + ' ===');
      console.log('Status:', res.status);
      console.log('Title:', titleMatch ? titleMatch[1].trim() : 'No title');
      console.log('Description:', descMatch ? descMatch[1].trim() : 'No description');
    } catch (e) {
      console.log('=== ' + url + ' === ERROR:', e.message);
    }
  }
}
inspectUrls();

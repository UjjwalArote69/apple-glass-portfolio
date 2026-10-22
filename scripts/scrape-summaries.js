import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const urls = [
  { id: 'kendall', url: 'https://kendall-web.vercel.app/' },
  { id: 'schema-studio', url: 'https://schema-studio.vercel.app/' },
  { id: 'yapster', url: 'http://yapster-2-0.vercel.app/welcome' },
  { id: 'whispr', url: 'https://whispr-lemon.vercel.app/' },
  { id: 'meka-group', url: 'https://meka.com/' },
  { id: 'amma-lines', url: 'https://amma-lines.vercel.app/' },
  { id: 'meka-dredging', url: 'https://meka-dredging.vercel.app/' },
  { id: 'meka-consultants', url: 'https://meka-consultants.vercel.app/' },
  { id: 'nari-astra', url: 'https://nari-astra.vercel.app/' }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const item of urls) {
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 12000 });
      const data = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText || '';
        const h2 = document.querySelector('h2')?.innerText || '';
        const meta = document.querySelector('meta[name="description"]')?.content || '';
        const text = document.body.innerText.slice(0, 300).replace(/\s+/g, ' ');
        return { h1, h2, meta, text };
      });
      console.log(`\n=== [${item.id}] ${item.url} ===`);
      console.log('H1:', data.h1);
      console.log('H2:', data.h2);
      console.log('Snippet:', data.text.slice(0, 180));
    } catch (e) {
      console.log(`\n=== [${item.id}] ERROR: ${e.message} ===`);
    }
  }

  await browser.close();
}

run();

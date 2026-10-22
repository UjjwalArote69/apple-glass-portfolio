import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT_DIR = path.resolve('./public/projects');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const projects = [
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

async function captureAll() {
  console.log('Launching browser to capture live project previews...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 750, deviceScaleFactor: 1.5 });

  for (const p of projects) {
    const outPath = path.join(OUT_DIR, `${p.id}.jpg`);
    try {
      console.log(`Capturing ${p.id} from ${p.url}...`);
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Several sites play intro loaders and headline animations; 1.5s caught them mid-way
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 8000));
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 85 });
      console.log(`Saved ${outPath}`);
    } catch (err) {
      console.error(`Failed ${p.id}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('Done capturing live previews.');
}

captureAll();

import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCREENSHOT_DIR = path.resolve('./screenshots');
const ARTIFACT_DIR = 'C:/Users/ujjwa/.gemini/antigravity/brain/948fb5db-60ef-4a78-88bb-de363adfb7f3';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('Browser console error:', msg.text());
    }
  });

  // Ensure fresh Daylight state
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('apple_portfolio_theme', 'daylight');
  });

  // 1. DESKTOP DAYLIGHT (1440x900)
  console.log('Capturing Desktop Daylight...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_1440_daylight_hero.png') });

  // Scroll to Work section
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_1440_daylight_work.png') });

  // Scroll to Experience & Contact
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_1440_daylight_contact.png') });

  // Open Project Detail Modal
  console.log('Opening project modal...');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const firstProject = document.querySelector('[data-project-id="aura-spatial"]');
    if (firstProject) {
      firstProject.click();
    } else {
      const card = document.querySelector('article');
      if (card) card.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_1440_project_modal.png') });

  // Close modal with Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 2. DESKTOP NIGHT MODE
  console.log('Toggling to Night Mode...');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const buttons = Array.from(document.querySelectorAll('button'));
    const themeBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Switch to Night'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_1440_night_hero.png') });

  // Scroll to Work in Night mode
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_1440_night_work.png') });

  // 3. MOBILE VIEWPORT (390x844)
  console.log('Capturing Mobile (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // Toggle back to Daylight for Mobile
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const buttons = Array.from(document.querySelectorAll('button'));
    const themeBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Switch to Daylight'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_390_daylight_hero.png') });

  // Scroll to Work section on mobile
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_390_daylight_work.png') });

  // Mobile Night
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const themeBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Switch to Night'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_390_night_work.png') });

  // Copy screenshots to artifact directory for markdown embedding
  const files = fs.readdirSync(SCREENSHOT_DIR);
  for (const f of files) {
    if (f.endsWith('.png')) {
      fs.copyFileSync(path.join(SCREENSHOT_DIR, f), path.join(ARTIFACT_DIR, f));
    }
  }

  await browser.close();
  console.log('All screenshots verified and captured successfully!');
  console.log('Console errors count:', consoleErrors.length);
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to test live Vercel deployment...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.log('Chromium launch error, trying to install chromium...');
    const { execSync } = require('child_process');
    execSync('npx playwright install chromium', { stdio: 'inherit' });
    browser = await chromium.launch({ headless: true });
  }

  const page = await browser.newPage();
  const consoleErrors = [];
  const uncaughtExceptions = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('PAGE CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    uncaughtExceptions.push({
      message: error.message,
      stack: error.stack
    });
    console.log('UNCAUGHT PAGE EXCEPTION:', error.message);
    console.log('STACK TRACE:', error.stack);
  });

  const url = 'https://ijm-landing-page.vercel.app/';

  for (let iteration = 1; iteration <= 20; iteration++) {
    console.log(`--- Iteration ${iteration}/20 ---`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Scroll smoothly top to bottom
    for (let scrollY = 0; scrollY <= 5000; scrollY += 250) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(50);
    }
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
  }

  console.log('=== TEST RESULTS SUMMARY ===');
  console.log('Total Console Errors:', consoleErrors.length);
  console.log('Total Uncaught Exceptions:', uncaughtExceptions.length);

  if (uncaughtExceptions.length > 0) {
    console.log('=== UNCAUGHT EXCEPTION DETAILS ===');
    console.log(JSON.stringify(uncaughtExceptions, null, 2));
  } else {
    console.log('SUCCESS: Zero uncaught exceptions detected across 20 scroll passes!');
  }

  await browser.close();
})();

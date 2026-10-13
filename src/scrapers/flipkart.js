const puppeteer = require('puppeteer');

async function scrapeFlipkart() {
  let browser;
  try {
    console.log('   Using Puppeteer for Flipkart...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto('https://www.flipkartcareers.com/#!/jobs', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000));

    const jobs = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      document.querySelectorAll('a').forEach(el => {
        const text = el.textContent?.trim() || '';
        const href = el.href;
        const isJob =
          text.length > 5 && text.length < 200 &&
          href &&
          href.includes('flipkartcareers') &&
          !href.endsWith('#') &&
          (href.includes('/job') || href.includes('requisitionId') || /\d{4,}/.test(href)) &&
          (
            text.toLowerCase().includes('engineer') ||
            text.toLowerCase().includes('developer') ||
            text.toLowerCase().includes('senior') ||
            text.toLowerCase().includes('lead') ||
            text.toLowerCase().includes('architect') ||
            text.toLowerCase().includes('analyst') ||
            text.toLowerCase().includes('manager') ||
            text.toLowerCase().includes('specialist') ||
            text.toLowerCase().includes('backend') ||
            text.toLowerCase().includes('frontend')
          );
        if (isJob && !seen.has(href)) {
          seen.add(href);
          results.push({ title: text, link: href, location: 'Not specified', description: text });
        }
      });
      return results.slice(0, 50);
    });

    console.log(`   Found ${jobs.length} jobs`);
    return jobs.map(j => ({ ...j, company: 'Flipkart', scrapedAt: new Date().toISOString() }));
  } catch (error) {
    console.error('   Error scraping Flipkart:', error.message);
    return [];
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

module.exports = { scrapeFlipkart };

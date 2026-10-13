const puppeteer = require('puppeteer');

async function scrapeWorkdaySite(url, companyName) {
  let browser;
  let page;
  try {
    console.log(`   Launching Puppeteer...`);

    browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 180000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    page.setDefaultNavigationTimeout(90000);
    page.setDefaultTimeout(90000);
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`   Navigating to: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
    } catch (err) {
      console.log(`   Navigation issue: ${err.message}, continuing anyway...`);
    }

    await new Promise(r => setTimeout(r, 3000));
    await page.evaluate(() => { window.scrollBy(0, window.innerHeight); });
    await new Promise(r => setTimeout(r, 2000));

    const jobs = await page.evaluate(() => {
      const results = [];
      const seen = new Set();

      // Scan all links and filter by job-like text
      const allElements = document.querySelectorAll('a');
      allElements.forEach(el => {
        try {
          const text = el.textContent?.trim() || '';
          const href = el.href;

          const isJobLike =
            text.length > 5 && text.length < 200 &&
            !text.includes('Home') && !text.includes('About') &&
            !text.includes('Contact') && !text.includes('Privacy') &&
            (
              text.toLowerCase().includes('engineer') ||
              text.toLowerCase().includes('developer') ||
              text.toLowerCase().includes('senior') ||
              text.toLowerCase().includes('manager') ||
              text.toLowerCase().includes('analyst') ||
              text.toLowerCase().includes('architect') ||
              text.toLowerCase().includes('lead') ||
              text.toLowerCase().includes('specialist') ||
              text.toLowerCase().includes('scientist') ||
              text.toLowerCase().includes('designer') ||
              text.toLowerCase().includes('backend') ||
              text.toLowerCase().includes('frontend')
            );

          if (isJobLike && href && !href.endsWith('#') && !seen.has(href)) {
            seen.add(href);
            results.push({
              title: text.substring(0, 200),
              link: href,
              location: 'Not specified',
              description: text.substring(0, 200),
            });
          }
        } catch (e) {}
      });

      // Fallback: Workday-specific selectors
      if (results.length === 0) {
        const containers = document.querySelectorAll('[data-automation-id], [role="listitem"], .job, .position');
        containers.forEach(container => {
          try {
            const link = container.querySelector('a');
            const title = container.textContent?.trim()?.substring(0, 200);
            if (link?.href && title && title.length > 5 && !seen.has(link.href)) {
              seen.add(link.href);
              results.push({ title, link: link.href, location: 'Not specified', description: title });
            }
          } catch (e) {}
        });
      }

      return results.slice(0, 100);
    });

    console.log(`   Found ${jobs.length} job listings`);

    return jobs.map(job => ({
      ...job,
      company: companyName,
      scrapedAt: new Date().toISOString(),
    }));

  } catch (error) {
    console.error(`   Error scraping ${companyName}: ${error.message}`);
    return [];
  } finally {
    try { if (page) await page.close(); } catch (e) {}
    try { if (browser) await browser.close(); } catch (e) {}
  }
}

async function scrapeAmazon() {
  return scrapeWorkdaySite(
    'https://www.amazon.jobs/en/search?base_query=software+engineer&city%5B%5D=Bengaluru&country_code%5B%5D=IN',
    'Amazon'
  );
}

async function scrapeSchneider() {
  return scrapeWorkdaySite('https://careers.se.com/jobs', 'Schneider Electric');
}

async function scrapeUber() {
  return scrapeWorkdaySite('https://www.uber.com/en-IN/careers/list/', 'Uber');
}

async function scrapeSalesforce() {
  return scrapeWorkdaySite('https://www.salesforce.com/company/careers/jobs/', 'Salesforce');
}

async function scrapeAdobe() {
  return scrapeWorkdaySite('https://careers.adobe.com/us/en/search-results?keywords=engineer&location=India', 'Adobe');
}

module.exports = { scrapeAmazon, scrapeSchneider, scrapeUber, scrapeSalesforce, scrapeAdobe };

const puppeteer = require('puppeteer');

async function scrapeWorkdaySite(url, companyName) {
  let browser;
  let page;
  try {
    console.log(`   Launching Puppeteer...`);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });

    page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
    await page.setViewport({ width: 1280, height: 720 });

    console.log(`   Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(
      () => console.log('   Navigation warning, continuing...')
    );

    // Wait for jobs
    try {
      await page.waitForSelector('[data-automation-id*="job"]', { timeout: 15000 }).catch(
        () => console.log('   Job selector not found')
      );
    } catch (e) {
      // Continue anyway
    }

    // Extract jobs
    const jobs = await page.evaluate(() => {
      const results = [];
      const jobElements = document.querySelectorAll(
        '[data-automation-id*="job"], [role="listitem"], .job-item, a[href*="jobs"]'
      );

      jobElements.forEach((el) => {
        try {
          const titleEl = el.querySelector('h2, h3, span[role="heading"]') || el;
          const linkEl = el.querySelector('a[href]') || el.closest('a');
          const locationEl = el.querySelector('[data-automation-id*="location"]');

          const title = titleEl?.textContent?.trim?.();
          const link = linkEl?.href;
          const location = locationEl?.textContent?.trim?.() || 'Not specified';

          if (title && title.length > 5 && link && link.startsWith('http')) {
            results.push({ title, link, location, description: el.textContent.substring(0, 200) });
          }
        } catch (e) {
          // Skip
        }
      });

      return results;
    });

    console.log(`   Found ${jobs.length} job listings`);

    return jobs.map((job) => ({
      ...job,
      company: companyName,
      scrapedAt: new Date().toISOString(),
    }));

  } catch (error) {
    console.error(`   Error scraping ${companyName}:`, error.message);
    return [];
  } finally {
    try {
      if (page) await page.close();
      if (browser) await browser.close();
    } catch (e) {
      // Ignore close errors
    }
  }
}

async function scrapeAmazon() {
  return scrapeWorkdaySite('https://amazon.jobs/en/search', 'Amazon');
}

async function scrapeSchneider() {
  return scrapeWorkdaySite('https://careers.se.com/jobs', 'Schneider Electric');
}

async function scrapeUber() {
  return scrapeWorkdaySite('https://www.uber.com/en-IN/careers/list/', 'Uber');
}

async function scrapeSalesforce() {
  return scrapeWorkdaySite('https://salesforce.wd1.myworkdayjobs.com/en-US/SalesforceExternalCareers/jobs', 'Salesforce');
}

async function scrapeAdobe() {
  return scrapeWorkdaySite('https://adobe.wd5.myworkdayjobs.com/en-US/careers', 'Adobe');
}

async function scrapePhonePe() {
  return scrapeWorkdaySite('https://careers.phonepe.com/jobs', 'PhonePe');
}

module.exports = { scrapeAmazon, scrapeSchneider, scrapeUber, scrapeSalesforce, scrapeAdobe, scrapePhonePe };

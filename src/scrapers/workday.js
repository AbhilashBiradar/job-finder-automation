const puppeteer = require('puppeteer');

async function scrapeWorkdaySite(url, companyName) {
  // Generic Workday scraper (used by Amazon, Uber, Salesforce, Adobe, Schneider, PhonePe)
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for GitHub Actions
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    console.log(`   Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for job listings to load
    await page.waitForSelector('[data-automation-id*="job"]', {
      timeout: 10000,
    }).catch(() => {
      console.log(`   ⚠️  Standard selector not found, trying alternatives...`);
    });

    // Extract jobs using Puppeteer's evaluate
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll(
        '[data-automation-id*="job"], [data-automation-id*="position"], .job-item, .position-item'
      );
      const result = [];

      jobElements.forEach((el) => {
        const titleEl = el.querySelector('h2, h3, [role="heading"]');
        const linkEl = el.querySelector('a');
        const locationEl = el.querySelector('[data-automation-id*="location"], .location');
        const dateEl = el.querySelector('[data-automation-id*="date"], .posted-date');

        if (titleEl && linkEl) {
          result.push({
            title: titleEl.textContent.trim(),
            link: linkEl.href,
            location: locationEl ? locationEl.textContent.trim() : 'Not specified',
            postedDate: dateEl ? dateEl.textContent.trim() : 'Unknown',
            description: el.textContent.substring(0, 200),
          });
        }
      });

      return result;
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
    if (browser) {
      await browser.close();
    }
  }
}

async function scrapeAmazon() {
  return scrapeWorkdaySite(
    'https://amazon.jobs/en/search',
    'Amazon'
  );
}

async function scrapeSchneider() {
  return scrapeWorkdaySite(
    'https://careers.se.com/jobs',
    'Schneider Electric'
  );
}

async function scrapeUber() {
  return scrapeWorkdaySite(
    'https://www.uber.com/en-IN/careers/list/',
    'Uber'
  );
}

async function scrapeSalesforce() {
  return scrapeWorkdaySite(
    'https://salesforce.wd1.myworkdayjobs.com/en-US/SalesforceExternalCareers/jobs',
    'Salesforce'
  );
}

async function scrapeAdobe() {
  return scrapeWorkdaySite(
    'https://adobe.wd5.myworkdayjobs.com/en-US/careers',
    'Adobe'
  );
}

async function scrapePhonePe() {
  return scrapeWorkdaySite(
    'https://careers.phonepe.com/jobs',
    'PhonePe'
  );
}

module.exports = {
  scrapeAmazon,
  scrapeSchneider,
  scrapeUber,
  scrapeSalesforce,
  scrapeAdobe,
  scrapePhonePe,
};

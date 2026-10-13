const axios = require('axios');

async function scrapeWorkdaySite(url, companyName) {
  // Simplified scraper: Use axios instead of Puppeteer for better reliability
  // Workday sites may not require full browser rendering for job listings
  try {
    console.log(`   Fetching ${companyName} careers page...`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    // If page is JS-rendered, try to extract job links from JSON data in page
    const jsonMatch = response.data.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);

    if (jsonMatch) {
      try {
        const state = JSON.parse(jsonMatch[1]);
        // Try to find jobs in the JSON structure
        const jobs = extractJobsFromJSON(state);
        if (jobs && jobs.length > 0) {
          console.log(`   Found ${jobs.length} jobs from JSON data`);
          return jobs.map((job) => ({
            ...job,
            company: companyName,
            scrapedAt: new Date().toISOString(),
          }));
        }
      } catch (e) {
        console.log(`   Could not parse JSON data, continuing...`);
      }
    }

    // Fallback: return empty (better than hanging)
    console.log(`   ℹ️  Unable to fully parse Workday site, returning 0 jobs`);
    return [];
  } catch (error) {
    console.error(`   Error scraping ${companyName}:`, error.message);
    return [];
  }
}

function extractJobsFromJSON(data) {
  // Helper to find jobs in Workday's JSON structure
  const jobs = [];

  try {
    // Workday usually nests jobs in specific structure
    if (data.jobOpenings && Array.isArray(data.jobOpenings)) {
      data.jobOpenings.forEach((job) => {
        if (job.title) {
          jobs.push({
            title: job.title,
            link: job.externalJobPostingUrl || job.jobPostingUrl || '#',
            location: job.locations?.[0] || 'Not specified',
            description: job.description || '',
          });
        }
      });
    }
  } catch (e) {
    // Silently continue if JSON structure doesn't match
  }

  return jobs;
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

const fs = require('fs');
const path = require('path');
const { scrapeAmazon } = require('./scrapers/amazon');
const { scrapeSchneider } = require('./scrapers/schneider');
const { scrapeFlipkart } = require('./scrapers/flipkart');
const { scrapeUber } = require('./scrapers/uber');
const { scrapePhonePe } = require('./scrapers/phonepe');
const { scrapeSalesforce } = require('./scrapers/salesforce');
const { scrapeAdobe } = require('./scrapers/adobe');
const { scrapeSAPFioneer } = require('./scrapers/sap-fioneer');
const { filterAndDeduplicate } = require('./filters');

const JOBS_FILE = path.join(__dirname, '../jobs/jobs.json');
const KEYWORDS = [
  'Senior',
  'Full Stack',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'React',
  'Backend',
  'Frontend',
  'Engineer',
];
const LOCATIONS = ['Bengaluru', 'Bangalore', 'India', 'Remote'];

async function scrapeAllJobs() {
  console.log('🚀 Starting job scraper automation...');
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

  const scrapers = [
    { name: 'Amazon', fn: scrapeAmazon },
    { name: 'Schneider Electric', fn: scrapeSchneider },
    { name: 'Flipkart', fn: scrapeFlipkart },
    { name: 'Uber', fn: scrapeUber },
    { name: 'PhonePe', fn: scrapePhonePe },
    { name: 'Salesforce', fn: scrapeSalesforce },
    { name: 'Adobe', fn: scrapeAdobe },
    { name: 'SAP Fioneer', fn: scrapeSAPFioneer },
  ];

  let allJobs = [];

  for (const scraper of scrapers) {
    try {
      console.log(`📍 Scraping ${scraper.name}...`);
      const jobs = await scraper.fn();
      console.log(`   ✅ Found ${jobs.length} jobs`);
      allJobs = allJobs.concat(jobs);
    } catch (error) {
      console.error(`   ❌ Error scraping ${scraper.name}:`, error.message);
    }
  }

  console.log(`\n📦 Total jobs scraped: ${allJobs.length}`);

  // Load previous jobs for deduplication
  let previousJobs = [];
  if (fs.existsSync(JOBS_FILE)) {
    try {
      const data = fs.readFileSync(JOBS_FILE, 'utf-8');
      previousJobs = JSON.parse(data).jobs || [];
    } catch (error) {
      console.warn('⚠️  Could not read previous jobs file, treating as fresh start');
    }
  }

  // Filter, deduplicate, and enrich
  const filtered = filterAndDeduplicate(
    allJobs,
    previousJobs,
    KEYWORDS,
    LOCATIONS
  );

  // Ensure directory exists
  const jobsDir = path.dirname(JOBS_FILE);
  if (!fs.existsSync(jobsDir)) {
    fs.mkdirSync(jobsDir, { recursive: true });
  }

  // Write results
  const output = {
    scrapedAt: new Date().toISOString(),
    totalJobs: allJobs.length,
    filteredJobs: filtered.jobs.length,
    newJobs: filtered.newJobs.length,
    jobs: filtered.jobs,
  };

  fs.writeFileSync(JOBS_FILE, JSON.stringify(output, null, 2));

  console.log(`\n📊 Results:`);
  console.log(`   Total jobs: ${output.totalJobs}`);
  console.log(`   After filtering: ${output.filteredJobs}`);
  console.log(`   New jobs: ${output.newJobs}`);
  console.log(`\n✅ Results saved to: ${JOBS_FILE}`);

  if (filtered.newJobs.length > 0) {
    console.log(`\n🆕 New Jobs:`);
    filtered.newJobs.forEach((job) => {
      console.log(`   - ${job.title} @ ${job.company}`);
      console.log(`     Link: ${job.link}`);
    });
  }

  return output;
}

scrapeAllJobs()
  .then(() => {
    console.log('\n🎉 Scraping completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

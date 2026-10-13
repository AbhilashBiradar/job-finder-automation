// Safe test mode - mocks the scrapers without hitting real sites
const fs = require('fs');
const path = require('path');

// Mock scrapers that return test data
async function mockScraperAmazon() {
  console.log('   [MOCK] Amazon scraper running...');
  return [
    {
      title: 'Senior Full Stack Engineer',
      company: 'Amazon',
      link: 'https://amazon.jobs/en/jobs/123456',
      location: 'Bengaluru, India',
      description: 'Build scalable services with Node.js and React',
      scrapedAt: new Date().toISOString(),
    },
  ];
}

async function mockScraperSalesforce() {
  console.log('   [MOCK] Salesforce scraper running...');
  return [
    {
      title: 'Senior Backend Engineer - TypeScript',
      company: 'Salesforce',
      link: 'https://salesforce.wd1.myworkdayjobs.com/789',
      location: 'Bengaluru, India',
      description: 'Node.js and cloud services',
      scrapedAt: new Date().toISOString(),
    },
  ];
}

async function mockScraperAdobe() {
  console.log('   [MOCK] Adobe scraper running...');
  return [
    {
      title: 'React Developer',
      company: 'Adobe',
      link: 'https://adobe.wd5.myworkdayjobs.com/999',
      location: 'Hyderabad, India',
      description: 'Frontend development with React',
      scrapedAt: new Date().toISOString(),
    },
  ];
}

async function mockScraperFlipkart() {
  console.log('   [MOCK] Flipkart scraper running...');
  return [
    {
      title: 'Senior Full Stack Engineer - JavaScript',
      company: 'Flipkart',
      link: 'https://flipkartcareers.com/jobs/111',
      location: 'Bengaluru, India',
      description: 'JavaScript and Node.js roles',
      scrapedAt: new Date().toISOString(),
    },
  ];
}

const { filterAndDeduplicate } = require('./src/filters');

const JOBS_FILE = path.join(__dirname, 'jobs/jobs.json');
const KEYWORDS = [
  'Senior',
  'Full Stack',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'React',
  'Engineer',
];
const LOCATIONS = ['Bengaluru', 'Bangalore', 'India', 'Remote'];

async function testScrapeInSafeMode() {
  console.log('🚀 Starting job scraper in SAFE TEST MODE...');
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

  const scrapers = [
    { name: 'Amazon', fn: mockScraperAmazon },
    { name: 'Salesforce', fn: mockScraperSalesforce },
    { name: 'Adobe', fn: mockScraperAdobe },
    { name: 'Flipkart', fn: mockScraperFlipkart },
  ];

  let allJobs = [];

  for (const scraper of scrapers) {
    try {
      console.log(`📍 Testing ${scraper.name}...`);
      const jobs = await scraper.fn();
      console.log(`   ✅ Found ${jobs.length} jobs`);
      allJobs = allJobs.concat(jobs);
    } catch (error) {
      console.error(`   ❌ Error:`, error.message);
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
      console.warn('⚠️  No previous jobs file, treating as fresh start');
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
    mode: 'SAFE_TEST_MODE',
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

testScrapeInSafeMode()
  .then((result) => {
    console.log('\n🎉 Test completed successfully!');
    console.log(`\n📄 Output file: jobs/jobs.json`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });

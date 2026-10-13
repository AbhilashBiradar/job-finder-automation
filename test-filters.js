// Test script to verify scraper logic without hitting real sites
const { filterAndDeduplicate } = require('./src/filters');

// Mock job data
const mockJobs = [
  {
    title: 'Senior Full Stack Engineer - React/Node.js',
    company: 'Salesforce',
    link: 'https://salesforce.example.com/jobs/123',
    location: 'Bengaluru, India',
    description: 'Build scalable React and Node.js applications',
    scrapedAt: new Date().toISOString(),
  },
  {
    title: 'Frontend Developer - Angular',
    company: 'Amazon',
    link: 'https://amazon.example.com/jobs/456',
    location: 'Chennai, India',
    description: 'Work with Angular framework',
    scrapedAt: new Date().toISOString(),
  },
  {
    title: 'Senior Backend Engineer - TypeScript',
    company: 'Adobe',
    link: 'https://adobe.example.com/jobs/789',
    location: 'Bengaluru, Karnataka',
    description: 'Node.js and TypeScript backend services',
    scrapedAt: new Date().toISOString(),
  },
];

const previousJobs = [
  {
    title: 'Senior Full Stack Engineer - React/Node.js',
    company: 'Salesforce',
    link: 'https://salesforce.example.com/jobs/123',
    location: 'Bengaluru, India',
  },
];

const KEYWORDS = [
  'Senior',
  'Full Stack',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'React',
];
const LOCATIONS = ['Bengaluru', 'Bangalore', 'India', 'Remote'];

console.log('📊 Testing filter and deduplication logic...\n');

const result = filterAndDeduplicate(mockJobs, previousJobs, KEYWORDS, LOCATIONS);

console.log('✅ Results:');
console.log(`   Total jobs in: ${mockJobs.length}`);
console.log(`   After filtering: ${result.jobs.length}`);
console.log(`   New jobs: ${result.newJobs.length}`);
console.log(`\n🆕 New Jobs Found:`);
result.newJobs.forEach((job) => {
  console.log(`   - ${job.title}`);
  console.log(`     Company: ${job.company}`);
  console.log(`     Location: ${job.location}`);
  console.log(`     Link: ${job.link}\n`);
});

console.log('✨ Test passed!');

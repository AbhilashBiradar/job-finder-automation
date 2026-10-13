const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSAPFioneer() {
  try {
    console.log('   Using custom SAP Fioneer scraper...');

    const url = 'https://jobs.sapfioneer.com/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs = [];

    // Adjust selectors based on SAP Fioneer site structure
    $('[data-job-id], .job-card, .job-item, .position').each((index, element) => {
      const title = $(element).find('h2, h3, .job-title').text().trim();
      const link = $(element).find('a').attr('href');
      const location = $(element).find('.location, [data-location]').text().trim();
      const description = $(element).find('.description, .job-desc').text().substring(0, 200);

      if (title && link) {
        jobs.push({
          title,
          link: link.startsWith('http') ? link : `https://jobs.sapfioneer.com${link}`,
          location: location || 'Not specified',
          description,
          company: 'SAP Fioneer',
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    console.log(`   Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('   Error scraping SAP Fioneer:', error.message);
    return [];
  }
}

module.exports = { scrapeSAPFioneer };

const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePhonePe() {
  try {
    console.log('   Using custom PhonePe scraper...');

    const url = 'https://phonepe.com/careers/jobs/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs = [];

    // Adjust selectors based on PhonePe site structure
    $('[data-job-id], .job-card, .job-item, .career-card').each((index, element) => {
      const title = $(element).find('h2, h3, .job-title').text().trim();
      const link = $(element).find('a').attr('href');
      const location = $(element).find('.location, [data-location]').text().trim();
      const description = $(element).find('.description, .job-desc').text().substring(0, 200);

      if (title && link) {
        jobs.push({
          title,
          link: link.startsWith('http') ? link : `https://phonepe.com${link}`,
          location: location || 'Not specified',
          description,
          company: 'PhonePe',
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    console.log(`   Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('   Error scraping PhonePe:', error.message);
    return [];
  }
}

module.exports = { scrapePhonePe };

const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFlipkart() {
  try {
    console.log('   Using custom Flipkart scraper...');

    // Flipkart careers page
    const url = 'https://www.flipkartcareers.com/jobs';
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs = [];

    // Adjust selectors based on actual Flipkart site structure
    $('[data-job-id], .job-card, .job-listing').each((index, element) => {
      const title = $(element).find('h2, h3, .job-title').text().trim();
      const link = $(element).find('a').attr('href');
      const location = $(element).find('.location, [data-location]').text().trim();
      const description = $(element).find('.description, .job-desc').text().substring(0, 200);

      if (title && link) {
        jobs.push({
          title,
          link: link.startsWith('http') ? link : `https://www.flipkartcareers.com${link}`,
          location: location || 'Not specified',
          description,
          company: 'Flipkart',
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    console.log(`   Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('   Error scraping Flipkart:', error.message);
    return [];
  }
}

module.exports = { scrapeFlipkart };

const axios = require('axios');

async function scrapePhonePe() {
  try {
    console.log('   Using SmartRecruiters API for PhonePe...');
    const url = 'https://api.smartrecruiters.com/v1/companies/PHONEPELIMITED/postings?limit=100&offset=0';
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
      timeout: 20000,
    });

    const jobs = res.data.content || [];
    console.log(`   Found ${jobs.length} jobs`);

    return jobs.map(j => {
      const slug = j.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return {
        title: j.name,
        link: `https://jobs.smartrecruiters.com/PHONEPELIMITED/${j.id}-${slug}`,
        location: j.location?.fullLocation || j.location?.city || 'Not specified',
        description: `${j.function?.label || ''} - ${j.typeOfEmployment?.label || ''}`.trim(),
        company: 'PhonePe',
        scrapedAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('   Error scraping PhonePe:', error.message);
    return [];
  }
}

module.exports = { scrapePhonePe };

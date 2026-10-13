const { scrapeAmazon: scrapeAmazonPuppeteer } = require('./workday');

async function scrapeAmazon() {
  return scrapeAmazonPuppeteer();
}

module.exports = { scrapeAmazon };

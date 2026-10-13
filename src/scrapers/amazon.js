const { scrapeAmazon: scrapeAmazonWD } = require('./workday');

async function scrapeAmazon() {
  return scrapeAmazonWD();
}

module.exports = { scrapeAmazon };

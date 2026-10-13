const { scrapeAdobe: scrapeAdobePuppeteer } = require('./workday');

async function scrapeAdobe() {
  return scrapeAdobePuppeteer();
}

module.exports = { scrapeAdobe };

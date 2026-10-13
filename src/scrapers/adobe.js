const { scrapeAdobe: scrapeAdobeWD } = require('./workday');

async function scrapeAdobe() {
  return scrapeAdobeWD();
}

module.exports = { scrapeAdobe };

const { scrapeSchneider: scrapeSchneiderWD } = require('./workday');

async function scrapeSchneider() {
  return scrapeSchneiderWD();
}

module.exports = { scrapeSchneider };

const { scrapeUber: scrapeUberWD } = require('./workday');

async function scrapeUber() {
  return scrapeUberWD();
}

module.exports = { scrapeUber };

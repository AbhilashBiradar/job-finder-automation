const { scrapeSalesforce: scrapeSalesforcePuppeteer } = require('./workday');

async function scrapeSalesforce() {
  return scrapeSalesforcePuppeteer();
}

module.exports = { scrapeSalesforce };

const { scrapeSalesforce: scrapeSalesforceWD } = require('./workday');

async function scrapeSalesforce() {
  return scrapeSalesforceWD();
}

module.exports = { scrapeSalesforce };

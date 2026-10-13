async function scrapeSAPFioneer() {
  // SAP Fioneer uses apply.workable.com/fioneer which is inaccessible from automated runners
  // Skip gracefully rather than hanging with timeouts
  console.log('   SAP Fioneer: skipping (Workable portal blocked in CI environment)');
  return [];
}

module.exports = { scrapeSAPFioneer };

const { prepareDb } = require('./db/pools');

module.exports = (async () => {
  await prepareDb();
});
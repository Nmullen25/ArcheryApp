const client = require('./client');
const { addDB } = require('./seedData');

addDB()
  .catch(console.error)
  .finally(() => client.end());

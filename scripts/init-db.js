const fs = require('fs');
const path = require('path');

const dataFile = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'store.json');

if (fs.existsSync(dataFile)) {
  fs.rmSync(dataFile);
}

require('../src/db');
console.log(`JSON demo data initialized: ${dataFile}`);

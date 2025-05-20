const fs = require('fs');
const path = require('path');

function readJSON(file) {
  const dataPath = path.join(__dirname, '..', 'data', file);
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data || '[]');
}

function writeJSON(file, data) {
  const dataPath = path.join(__dirname, '..', 'data', file);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJSON, writeJSON };

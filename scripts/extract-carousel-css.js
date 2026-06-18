const fs = require('fs');
const path =
  'C:/Users/angel/.cursor/projects/c-Users-angel-Desktop-AcronWeb-AVELORA-BAY-OFFICAL-avelora-bay/agent-transcripts/e6f30ae3-f4c8-4016-aed7-5348d435264a/e6f30ae3-f4c8-4016-aed7-5348d435264a.jsonl';
const line = fs.readFileSync(path, 'utf8').split('\n')[11];
const j = JSON.parse(line);
const text = j.message.content[0].text;
const start = text.indexOf('/* Hero promo carousel');
const end = text.indexOf('/* ─── Featured', start);
const chunk = text.slice(start, end > start ? end : start + 25000);
fs.writeFileSync('scripts/carousel-css-raw.txt', chunk);
console.log('len', chunk.length, 'start', start);

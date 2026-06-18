const fs = require('fs');
const path =
  'C:/Users/angel/.cursor/projects/c-Users-angel-Desktop-AcronWeb-AVELORA-BAY-OFFICAL-avelora-bay/agent-transcripts/e6f30ae3-f4c8-4016-aed7-5348d435264a/e6f30ae3-f4c8-4016-aed7-5348d435264a.jsonl';
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);

// Line 1: original component
const j0 = JSON.parse(lines[0]);
const t0 = j0.message.content[0].text;
const start = t0.indexOf("'use client'");
const end = t0.lastIndexOf('}');
fs.writeFileSync('scripts/original-carousel.tsx.txt', t0.slice(start, end + 1));

// Line 12 (index 11): original CSS - find hero-promo section
const j12 = JSON.parse(lines[11]);
const t12 = j12.message.content[0].text;
const cssStart = t12.indexOf('.hero-promo-carousel');
if (cssStart >= 0) {
  fs.writeFileSync('scripts/original-carousel-css.txt', t12.slice(cssStart, cssStart + 15000));
} else {
  fs.writeFileSync('scripts/original-carousel-css.txt', 'NOT FOUND\n' + t12.slice(0, 5000));
}

console.log('done', fs.statSync('scripts/original-carousel.tsx.txt').size);

const fs = require('fs');
const path =
  'C:/Users/angel/.cursor/projects/c-Users-angel-Desktop-AcronWeb-AVELORA-BAY-OFFICAL-avelora-bay/agent-transcripts/e6f30ae3-f4c8-4016-aed7-5348d435264a/e6f30ae3-f4c8-4016-aed7-5348d435264a.jsonl';
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);

for (let i = 0; i < lines.length; i++) {
  const j = JSON.parse(lines[i]);
  const text = j.message?.content?.[0]?.text || '';
  if (text.includes('hero-promo-card__inner') && text.includes('home.css')) {
    const m = text.match(/"contents":"([\s\S]*?)","path":"[^"]*home\.css"/);
    if (m) {
      const raw = JSON.parse('"' + m[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"');
      fs.writeFileSync('scripts/original-home.css', raw);
      console.log('found at line', i, 'size', raw.length);
      break;
    }
  }
}

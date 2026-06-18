const fs = require('fs');

function scopeSelectors(css) {
  const lines = css.split('\n');
  const out = [];
  let inKeyframes = false;

  for (const line of lines) {
    if (line.trim().startsWith('@keyframes')) {
      inKeyframes = true;
      out.push(line);
      continue;
    }
    if (inKeyframes) {
      out.push(line);
      if (line.trim() === '}') inKeyframes = false;
      continue;
    }
    if (line.trim().startsWith('@media') || line.trim().startsWith('/*')) {
      out.push(line);
      continue;
    }
    const m = line.match(/^(\s*)(\.[\w-][^{]*)\{/);
    if (m) {
      const sel = m[2]
        .split(',')
        .map((s) => {
          s = s.trim();
          if (s.startsWith('.home-page')) return s;
          return `.home-page ${s}`;
        })
        .join(', ');
      out.push(`${m[1]}${sel} {`);
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

const raw = fs.readFileSync('scripts/carousel-css-raw.txt', 'utf8');
const baseEnd = raw.indexOf('@media (max-width: 900px) {\n  .hero-section');
const base = raw.slice(0, baseEnd);

const desktopRaw = fs.readFileSync('scripts/original-carousel-css.txt', 'utf8');
const mobileCarouselStart = raw.indexOf('  .hero-promo-carousel {\n    display: block;');
const mobileCarouselEnd = raw.indexOf('  .hero-mobile-brand {', mobileCarouselStart);
const mobileCarousel = raw.slice(mobileCarouselStart, mobileCarouselEnd);

const desktopScoped = scopeSelectors(
  `@media (min-width: 901px) {\n${desktopRaw}\n}`,
);
const mobileScoped = scopeSelectors(
  `@media (max-width: 900px) {\n${mobileCarousel}\n}`,
);

const header = `/* Original Avelora hero promo carousel — home page only */\n\n.home-page .hero-promo-carousel {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n\n`;

const body = scopeSelectors(base);
const footer = `\n${desktopScoped}\n${mobileScoped}\n`;

fs.writeFileSync('app/styles/hero-promo-carousel.css', header + body + footer);
console.log('written', fs.statSync('app/styles/hero-promo-carousel.css').size);

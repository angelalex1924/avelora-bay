const fs = require('fs');

const base = fs.readFileSync('scripts/carousel-css-raw.txt', 'utf8');
const baseEnd = base.indexOf('@media (max-width: 900px) {\n  .hero-section');
let css = base.slice(0, baseEnd);

function scope(cssBlock) {
  return cssBlock.replace(/^(\s*)(\.[\w][^{]*)\{/gm, (match, indent, sel) => {
    const scoped = sel
      .split(',')
      .map((s) => {
        s = s.trim();
        return s.startsWith('.home-page') ? s : `.home-page ${s}`;
      })
      .join(', ');
    return `${indent}${scoped} {`;
  });
}

const header = `/* Original Avelora hero promo carousel */

.home-page .hero-promo-carousel {
  --hero-active: 0;
  display: block;
  position: relative;
  width: 100%;
}

.home-page .hero-promo-carousel--js .hero-promo-carousel__track {
  touch-action: pan-y pinch-zoom;
  transform: translate3d(calc(var(--hero-active, 0) * -100%), 0, 0);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

`;

const desktop = `
@media (min-width: 901px) {
  .home-page .hero-promo-carousel .hero-promo-card__brand {
    display: none;
  }

  .home-page .hero-promo-carousel__nav {
    position: absolute;
    top: 50%;
    z-index: 4;
    display: flex;
    width: 3rem;
    height: 3rem;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(184, 150, 110, 0.28);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.82);
    color: var(--charcoal);
    backdrop-filter: blur(10px);
    box-shadow: 0 14px 36px -18px rgba(44, 36, 32, 0.5);
    transform: translateY(-50%);
    cursor: pointer;
    transition:
      background 0.28s ease,
      border-color 0.28s ease,
      transform 0.28s ease,
      box-shadow 0.28s ease;
  }

  .home-page .hero-promo-carousel__nav:hover {
    border-color: rgba(184, 150, 110, 0.55);
    background: var(--white);
    box-shadow: 0 18px 40px -16px rgba(44, 36, 32, 0.55);
    transform: translateY(-50%) scale(1.05);
  }

  .home-page .hero-promo-carousel__nav--prev {
    left: -1.1rem;
  }

  .home-page .hero-promo-carousel__nav--next {
    right: -1.1rem;
  }

  .home-page .hero-promo-carousel__slide {
    min-height: clamp(460px, 64vh, 620px);
    border-radius: 2rem;
  }

  .home-page .hero-promo-card__layout {
    flex-direction: row;
    align-items: center;
    gap: clamp(1.25rem, 2.5vw, 2rem);
  }

  .home-page .hero-promo-card__stage {
    flex: 0 0 52%;
    min-height: clamp(300px, 42vh, 420px);
  }

  .home-page .hero-promo-card__frame {
    width: min(100%, 340px);
    aspect-ratio: 4 / 5;
    border-radius: 58% 42% 52% 48% / 42% 42% 58% 58%;
  }

  .home-page .hero-promo-card__float {
    left: -4%;
    bottom: 10%;
    min-width: 168px;
    padding: 1rem 1.2rem;
  }

  .home-page .hero-promo-card__seal {
    top: 4%;
    right: 2%;
    width: 82px;
    height: 82px;
  }

  .home-page .hero-promo-card__copy {
    flex: 1;
    align-items: flex-start;
    padding: 0.5rem 0.25rem 0.5rem 0;
    border: none;
    background: transparent;
    backdrop-filter: none;
    text-align: left;
  }

  .home-page .hero-promo-card__index {
    right: 0;
    top: -0.5rem;
    font-size: clamp(3.5rem, 6vw, 5rem);
  }

  .home-page .hero-promo-card__category {
    justify-content: flex-start;
  }

  .home-page .hero-promo-card__name {
    font-size: clamp(1.85rem, 2.6vw, 2.45rem);
    max-width: 14ch;
  }

  .home-page .hero-promo-card__detail {
    font-size: 0.82rem;
    line-height: 1.7;
    max-width: 32ch;
  }

  .home-page .hero-promo-card__meta {
    justify-content: flex-start;
    margin-top: 0.5rem;
  }

  .home-page .hero-promo-card__price {
    font-size: 1.85rem;
  }

  .home-page .hero-promo-card__cta {
    width: auto;
    align-self: flex-start;
    margin-top: 1.1rem;
    padding: 0.95rem 1.65rem;
    font-size: 0.64rem;
  }

  .home-page .hero-promo-carousel__footer {
    justify-content: space-between;
    margin-top: 1.15rem;
    padding-inline: 0.15rem;
  }

  .home-page .hero-promo-carousel__counter {
    display: flex;
  }
}
`;

const mobile = `
@media (max-width: 900px) {
  .home-page .hero-promo-carousel__nav {
    display: none;
  }

  .home-page .hero-promo-carousel .hero-promo-card__brand {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
  }

  .home-page .hero-promo-card__inner {
    padding: 0.85rem 1rem 1.15rem;
    text-align: center;
  }

  .home-page .hero-promo-card__copy {
    background: rgba(255, 255, 255, 0.72);
    border-top: none;
    border-radius: 0 0 1.15rem 1.15rem;
    padding-top: calc(0.85rem + 16px);
    --card-wave-h: 16px;
    -webkit-mask-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 56' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath fill='%23fff' d='M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0Z'/%3E%3C/svg%3E"),
      linear-gradient(#fff, #fff);
    mask-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 56' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath fill='%23fff' d='M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0Z'/%3E%3C/svg%3E"),
      linear-gradient(#fff, #fff);
    -webkit-mask-size: 600px var(--card-wave-h), 100% calc(100% - var(--card-wave-h));
    mask-size: 600px var(--card-wave-h), 100% calc(100% - var(--card-wave-h));
    -webkit-mask-position: 0 0, 0 var(--card-wave-h);
    mask-position: 0 0, 0 var(--card-wave-h);
    -webkit-mask-repeat: repeat-x, no-repeat;
    mask-repeat: repeat-x, no-repeat;
    animation: promo-wave-drift 12s linear infinite;
  }

  @keyframes promo-wave-drift {
    0% {
      -webkit-mask-position: 0 0, 0 var(--card-wave-h);
      mask-position: 0 0, 0 var(--card-wave-h);
    }
    100% {
      -webkit-mask-position: -600px 0, 0 var(--card-wave-h);
      mask-position: -600px 0, 0 var(--card-wave-h);
    }
  }

  .home-page .hero-promo-card__float {
    left: 6%;
    bottom: 6%;
    min-width: 132px;
    padding: 0.7rem 0.85rem;
  }

  .home-page .hero-promo-card__seal {
    width: 58px;
    height: 58px;
    top: 0;
    right: 4%;
  }

  .home-page .hero-promo-card__seal-main {
    font-size: 0.68rem;
  }

  .home-page .hero-promo-carousel__footer {
    position: relative;
    z-index: 5;
    justify-content: center;
  }
}
`;

fs.writeFileSync('app/styles/hero-promo-carousel.css', header + scope(css) + desktop + mobile);
console.log('ok', fs.statSync('app/styles/hero-promo-carousel.css').size);

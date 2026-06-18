import type { Translations } from '@/app/lib/i18n/types';

export type NavMegaItemId = 'shop' | 'discover' | 'help';

export type NavMegaLink = {
  label: string;
  href: string;
};

export type NavMegaColumn = {
  title: string;
  links: NavMegaLink[];
};

export type NavMegaSpotlight = {
  eyebrow: string;
  title: string;
  detail: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type NavMegaItem = {
  id: NavMegaItemId;
  label: string;
  columns: NavMegaColumn[];
  spotlight: NavMegaSpotlight;
};

export function getNavMegaMenu(t: Translations): NavMegaItem[] {
  const n = t.nav.mega;

  return [
    {
      id: 'shop',
      label: n.shop.label,
      columns: [
        {
          title: n.shop.categoriesTitle,
          links: [
            { label: t.home.categories[0].name, href: '/shop/jewellery' },
            { label: t.home.categories[1].name, href: '/shop/home-decor' },
            { label: t.home.categories[2].name, href: '/shop/candles-scents' },
            { label: t.home.categories[3].name, href: '/shop/textiles' },
            { label: t.home.categories[4].name, href: '/shop/gift-sets' },
            { label: t.home.categories[5].name, href: '/shop/new-arrivals' },
          ],
        },
        {
          title: n.shop.featuredTitle,
          links: [
            { label: t.home.featuredProducts[0].name, href: t.home.featuredProducts[0].href },
            { label: t.home.featuredProducts[1].name, href: t.home.featuredProducts[1].href },
            { label: t.home.featuredProducts[2].name, href: t.home.featuredProducts[2].href },
            { label: t.common.viewAll, href: '/shop' },
          ],
        },
      ],
      spotlight: {
        eyebrow: t.home.justArrived,
        title: t.home.heroPromos[0].productName,
        detail: t.home.heroPromos[0].detail,
        cta: t.home.heroPromos[0].cta,
        href: t.home.heroPromos[0].href,
        image: t.home.heroPromos[0].image,
        imageAlt: t.home.heroPromos[0].productName,
      },
    },
    {
      id: 'discover',
      label: n.discover.label,
      columns: [
        {
          title: n.discover.storyTitle,
          links: [
            { label: t.nav.ourStory, href: '/our-story' },
            { label: n.discover.about, href: '/about-us' },
            { label: n.discover.sustainability, href: '/sustainability' },
          ],
        },
        {
          title: n.discover.exploreTitle,
          links: [
            { label: t.home.exploreCollection, href: '/shop' },
            { label: t.home.shopByCategory, href: '/#categories' },
            { label: t.home.featuredPieces, href: '/#featured-products' },
          ],
        },
      ],
      spotlight: {
        eyebrow: t.home.philosophy,
        title: t.home.brandStoryTitle.replace('\n', ' '),
        detail: t.home.brandStoryBody,
        cta: t.home.discoverOurStory,
        href: '/our-story',
        image: '/hero-back.jpg',
        imageAlt: t.common.brandName,
      },
    },
    {
      id: 'help',
      label: n.help.label,
      columns: [
        {
          title: n.help.serviceTitle,
          links: [
            { label: n.help.shipping, href: '/shipping-returns' },
            { label: n.help.contact, href: '/contact' },
            { label: n.help.faq, href: '/contact#faq' },
          ],
        },
        {
          title: n.help.legalTitle,
          links: [
            { label: n.help.privacy, href: '/privacy-policy' },
            { label: n.help.terms, href: '/terms-conditions' },
          ],
        },
      ],
      spotlight: {
        eyebrow: t.footer.stayConnected,
        title: t.home.newsletterTitle,
        detail: t.footer.newsletterLead,
        cta: t.common.subscribe,
        href: '/#newsletter',
        image: '/shell.png',
        imageAlt: t.common.brandName,
      },
    },
  ];
}

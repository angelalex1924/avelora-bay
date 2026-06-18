import type { CatalogProduct, ProductCategoryKey } from './types';

export const PRODUCT_CATALOG: CatalogProduct[] = [
  { id: 1, categoryKey: 'jewellery', image: '/E79EE7E5-0793-4DD2-8E85-46B0C179540E.PNG', price: '€68', badgeKey: 'new' },
  { id: 2, categoryKey: 'candles', image: '/F3E30515-7DB8-4948-A8C3-CDC8E310FE64.PNG', price: '€42', badgeKey: 'bestseller' },
  { id: 3, categoryKey: 'homeDecor', image: '/map.png', price: '€95', badgeKey: null },
  { id: 4, categoryKey: 'jewellery', image: '/IMG_1776.jpg', price: '€38', badgeKey: 'new' },
  { id: 5, categoryKey: 'homeDecor', image: '/C3C8048A-9FAE-4DF9-8573-48242A97EF00.PNG', price: '€72', badgeKey: null },
  { id: 6, categoryKey: 'candles', image: '/F3E30515-7DB8-4948-A8C3-CDC8E310FE64.PNG', price: '€55', badgeKey: 'new' },
  { id: 7, categoryKey: 'textiles', image: '/IMG_1776.jpg', price: '€48', badgeKey: null },
  { id: 8, categoryKey: 'textiles', image: '/hero-back.jpg', price: '€89', badgeKey: null },
  { id: 9, categoryKey: 'gifts', image: '/C3C8048A-9FAE-4DF9-8573-48242A97EF00.PNG', price: '€120', badgeKey: 'bestseller' },
  { id: 10, categoryKey: 'jewellery', image: '/E79EE7E5-0793-4DD2-8E85-46B0C179540E.PNG', price: '€52', badgeKey: null },
  { id: 11, categoryKey: 'homeDecor', image: '/hero-back.jpg', price: '€64', badgeKey: null },
  { id: 12, categoryKey: 'gifts', image: '/F3E30515-7DB8-4948-A8C3-CDC8E310FE64.PNG', price: '€45', badgeKey: 'new' },
];

export const SHOP_CATEGORY_ORDER: ProductCategoryKey[] = [
  'jewellery',
  'homeDecor',
  'candles',
  'textiles',
  'gifts',
];

export const CATEGORY_SECTION_IMAGES: Record<ProductCategoryKey, string> = {
  jewellery: '/E79EE7E5-0793-4DD2-8E85-46B0C179540E.PNG',
  homeDecor: '/map.png',
  candles: '/F3E30515-7DB8-4948-A8C3-CDC8E310FE64.PNG',
  textiles: '/IMG_1776.jpg',
  gifts: '/C3C8048A-9FAE-4DF9-8573-48242A97EF00.PNG',
};

export const STATIC_PRODUCT_COPY: Record<
  number,
  { name: string; category: string }
> = {
  1: { name: 'Pearl Shell Necklace', category: 'Jewellery' },
  2: { name: 'Driftwood Candle', category: 'Candles & Scents' },
  3: { name: 'Coral Branch Decor', category: 'Home Décor' },
  4: { name: 'Starfish Earrings', category: 'Jewellery' },
  5: { name: 'Aegean Ceramic Bowl', category: 'Home Décor' },
  6: { name: 'Mediterranean Diffuser', category: 'Candles & Scents' },
  7: { name: 'Coastal Linen Cushion', category: 'Textiles' },
  8: { name: 'Sand Linen Throw', category: 'Textiles' },
  9: { name: 'Coastal Gift Set', category: 'Gift Sets' },
  10: { name: 'Sea Glass Bracelet', category: 'Jewellery' },
  11: { name: 'Wave Ceramic Vase', category: 'Home Décor' },
  12: { name: 'Sunset Candle Trio', category: 'Gift Sets' },
};

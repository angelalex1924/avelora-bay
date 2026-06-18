import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = process.cwd();
const source = path.join(root, 'public', 'IMG_1776.jpg');
const iconsDir = path.join(root, 'public', 'icons');

/** Sand background — matches site palette. */
const SAND = { r: 242, g: 236, b: 227, alpha: 1 };

async function renderFromFullImage(size) {
  return sharp(source)
    .resize(size, size, {
      fit: 'contain',
      background: SAND,
    })
    .png()
    .toBuffer();
}

async function generate() {
  await mkdir(iconsDir, { recursive: true });

  const png16 = await renderFromFullImage(16);
  const png32 = await renderFromFullImage(32);
  const png48 = await renderFromFullImage(48);
  const png180 = await renderFromFullImage(180);
  const png192 = await renderFromFullImage(192);
  const png512 = await renderFromFullImage(512);

  const favicon = await toIco([png16, png32, png48]);

  await writeFile(path.join(root, 'app', 'favicon.ico'), favicon);
  await writeFile(path.join(root, 'app', 'icon.png'), png512);
  await writeFile(path.join(root, 'app', 'apple-icon.png'), png180);
  await writeFile(path.join(iconsDir, 'icon-512.png'), png512);
  await writeFile(path.join(iconsDir, 'icon-192.png'), png192);

  console.log('Generated favicons from full IMG_1776.jpg');
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});

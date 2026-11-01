import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.resolve('public/images/products');
const outputRoot = path.join(sourceRoot, 'womens-clean-v1');
let generatedCount = 0;
const folders = ['bras', 'women-underwear', 'women-camisoles', 'women-crop-tops'];
const braStripFiles = new Set([
  'w-b06-back.jpg',
  'w-b07-back.jpg',
  'w-b09-back.jpg',
  'w-b10-back.jpg',
  'w-b11-back.jpg',
  'w-b12-back.jpg',
]);
const underwearStripCrops = new Map([
  ['w-u01-back.jpg', 30],
  ['w-u02-back.jpg', 38],
  ['w-u02-front.jpg', 45],
  ['w-u03-front.jpg', 34],
  ['w-u06-back.jpg', 28],
  ['w-u07-back.jpg', 35],
  ['w-u07-front.jpg', 41],
  ['w-u08-back.jpg', 24],
  ['w-u08-front.jpg', 32],
  ['w-u11-back.jpg', 20],
  ['w-u12-back.jpg', 42],
  ['w-u12-front.jpg', 41],
  ['w-u13-back.jpg', 24],
  ['w-u13-front.jpg', 32],
]);
const camisoleLeftCrops = new Map([
  ['w-c01-back.jpg', 101], ['w-c01-front.jpg', 105],
  ['w-c02-back.jpg', 166], ['w-c02-front.jpg', 212],
  ['w-c03-back.jpg', 132], ['w-c03-front.jpg', 204],
  ['w-c04-back.jpg', 104], ['w-c04-front.jpg', 134],
  ['w-c05-back.jpg', 62], ['w-c05-front.jpg', 145],
  ['w-c06-back.jpg', 101], ['w-c06-front.jpg', 111],
  ['w-c07-back.jpg', 163], ['w-c07-front.jpg', 220],
  ['w-c08-back.jpg', 137], ['w-c08-front.jpg', 193],
  ['w-c09-back.jpg', 104], ['w-c09-front.jpg', 154],
  ['w-c10-back.jpg', 62], ['w-c10-front.jpg', 142],
  ['w-c11-back.jpg', 94], ['w-c11-front.jpg', 96],
  ['w-c12-back.jpg', 154], ['w-c12-front.jpg', 170],
  ['w-c13-back.jpg', 137], ['w-c13-front.jpg', 198],
  ['w-c14-back.jpg', 105], ['w-c14-front.jpg', 165],
  ['w-c15-back.jpg', 66], ['w-c15-front.jpg', 146],
]);
const cropTopLeftCrops = new Map([
  ['w-ct01-back.jpg', 102], ['w-ct01-front.jpg', 83],
  ['w-ct02-back.jpg', 206], ['w-ct02-front.jpg', 228],
  ['w-ct03-back.jpg', 154], ['w-ct03-front.jpg', 228],
  ['w-ct04-back.jpg', 95], ['w-ct04-front.jpg', 164],
  ['w-ct05-back.jpg', 75], ['w-ct05-front.jpg', 139],
  ['w-ct06-back.jpg', 98], ['w-ct06-front.jpg', 92],
  ['w-ct07-back.jpg', 194], ['w-ct07-front.jpg', 228],
  ['w-ct08-back.jpg', 152], ['w-ct08-front.jpg', 216],
  ['w-ct09-back.jpg', 143], ['w-ct09-front.jpg', 193],
  ['w-ct10-back.jpg', 50], ['w-ct10-front.jpg', 101],
  ['w-ct11-back.jpg', 50], ['w-ct11-front.jpg', 84],
  ['w-ct12-back.jpg', 127], ['w-ct12-front.jpg', 182],
  ['w-ct13-front.jpg', 173],
  ['w-ct14-back.jpg', 137], ['w-ct14-front.jpg', 228],
]);
const unavailableFiles = new Set(['w-u03-back.jpg']);
const unavailableCropTopFiles = new Set([
  'w-ct10-front.jpg',
  'w-ct13-back.jpg',
  'w-ct15-back.jpg',
]);

async function saveDerivative(folder, filename, options = {}) {
  const inputPath = path.join(sourceRoot, folder, filename);
  const outputDirectory = path.join(outputRoot, folder);
  const outputPath = path.join(outputDirectory, `${path.parse(filename).name}.webp`);
  const metadata = await sharp(inputPath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Image dimensions are missing: ${folder}/${filename}`);
  }

  let left = options.left ?? 0;
  const top = options.top ?? 0;
  const right = options.right ?? 0;
  const bottom = options.bottom ?? (
    options.bottomFraction ? Math.round(metadata.height * options.bottomFraction) : 0
  );
  const width = metadata.width - left - right;
  const height = metadata.height - top - bottom;
  if (width <= 0 || height <= 0) {
    throw new Error(`Unsafe crop dimensions: ${folder}/${filename}`);
  }

  await fs.mkdir(outputDirectory, { recursive: true });
  let pipeline = sharp(inputPath);
  if (left || top || right || bottom) {
    pipeline = pipeline.extract({ left, top, width, height });
  }
  await pipeline.webp({ quality: 90, effort: 5 }).toFile(outputPath);
  generatedCount += 1;
}

for (const folder of folders) {
  const files = (await fs.readdir(path.join(sourceRoot, folder)))
    .filter((filename) => /^w-.*\.jpg$/i.test(filename))
    .sort();

  for (const filename of files) {
    if (folder === 'bras') {
      await saveDerivative(folder, filename, {
        left: braStripFiles.has(filename) ? 240 : 0,
        right: braStripFiles.has(filename) ? 180 : 0,
      });
    } else if (folder === 'women-underwear') {
      if (unavailableFiles.has(filename)) continue;
      const isBack = filename.endsWith('-back.jpg');
      await saveDerivative(folder, filename, {
        left: underwearStripCrops.get(filename) ?? 0,
        bottomFraction: 0.16,
      });
      if (!isBack && !filename.endsWith('-front.jpg')) {
        throw new Error(`Unexpected underwear view: ${filename}`);
      }
    } else if (folder === 'women-camisoles') {
      await saveDerivative(folder, filename, { left: camisoleLeftCrops.get(filename) ?? 0 });
    } else if (folder === 'women-crop-tops') {
      if (unavailableCropTopFiles.has(filename)) continue;
      await saveDerivative(folder, filename, {
        left: cropTopLeftCrops.get(filename) ?? 0,
        bottom: 144,
      });
    }
  }
}

for (const filename of [
  'bundle-01-front.jpg',
  'bundle-01-back.jpg',
  'bundle-11-front.jpg',
  'bundle-11-back.jpg',
]) {
  await saveDerivative('bundles', filename, {
    left: filename.startsWith('bundle-01') ? 24 : 26,
    bottom: 24,
  });
}

console.log(`Generated ${generatedCount} Women’s image derivatives under ${path.relative(process.cwd(), outputRoot)}.`);

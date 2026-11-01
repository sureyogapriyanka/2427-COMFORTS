const WOMENS_PRODUCT_FOLDERS = new Set([
  'bras',
  'women-underwear',
  'women-camisoles',
  'women-crop-tops',
]);

const UNAVAILABLE_WOMENS_IMAGES = new Set([
  'women-underwear/w-u03-back.jpg',
  'women-crop-tops/w-ct10-front.jpg',
  'women-crop-tops/w-ct13-back.jpg',
  'bundles/bundle-07-front.jpg',
  'bundles/bundle-07-back.jpg',
  'bundles/bundle-08-front.jpg',
  'bundles/bundle-08-back.jpg',
  'bundles/bundle-09-front.jpg',
  'bundles/bundle-09-back.jpg',
  'bundles/bundle-10-front.jpg',
  'bundles/bundle-10-back.jpg',
]);

const CLEAN_WOMENS_BUNDLES = new Set([
  'bundle-01-front.jpg',
  'bundle-01-back.jpg',
  'bundle-11-front.jpg',
  'bundle-11-back.jpg',
]);

export function productImageUrl(source: string): string {
  if (!source || /^(https?:)?\/\//i.test(source) || /^(data:|blob:)/i.test(source)) {
    return source;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalized = source.replace(/^\/+/, '').replace(/^2427-COMFORTS\//, '');
  const productPath = normalized.match(/(?:^|\/)images\/products\/(.+)$/)?.[1];
  if (!productPath) {
    return source.startsWith(base) ? source : `${base}${normalized}`;
  }

  const conceptImage = productPath.match(/^women-crop-tops\/w-ct15-(front|back)\.jpg$/);
  if (conceptImage) {
    return `${base}images/products/womens-concepts/w-ct15-${conceptImage[1]}-concept.webp`;
  }

  const [folder, filename] = productPath.split('/');
  if (!folder || !filename) return source;

  if (UNAVAILABLE_WOMENS_IMAGES.has(`${folder}/${filename}`)) return '';

  if (WOMENS_PRODUCT_FOLDERS.has(folder)) {
    const cleanFilename = `${pathWithoutExtension(filename)}.webp`;
    return `${base}images/products/womens-clean-v1/${folder}/${cleanFilename}`;
  }

  if (folder === 'bundles' && CLEAN_WOMENS_BUNDLES.has(filename)) {
    return `${base}images/products/womens-clean-v1/bundles/${pathWithoutExtension(filename)}.webp`;
  }

  return source.startsWith(base) ? source : `${base}${normalized}`;
}

export function requiresOwnerApprovedPhoto(source: string): boolean {
  const normalized = source.replace(/^\/+/, '').replace(/^2427-COMFORTS\//, '');
  const productPath = normalized.match(/(?:^|\/)images\/products\/(.+)$/)?.[1];
  if (!productPath) return false;
  const [folder, filename] = productPath.split('/');
  return Boolean(folder && filename && UNAVAILABLE_WOMENS_IMAGES.has(`${folder}/${filename}`));
}

export function isAiGeneratedConceptImage(source: string): boolean {
  return /w-ct15-(?:front|back)(?:-concept)?\.(?:jpg|webp)$/i.test(source);
}

function pathWithoutExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}

export function productImageNotice(product: {
  category: string;
  image: string;
  id: string;
}): string | null {
  if (product.id === 'w-ct15') {
    return 'AI-generated concept visuals, not verified product photos. Color, fit, branding and details may differ from the actual product.';
  }

  const unavailablePhotoProducts = new Set(['w-ct13', 'w-ct10', 'w-u03']);
  const unavailableBundle = product.category === 'bundles' &&
    /bundle-0[7-9]|bundle-10/.test(product.image);
  return unavailablePhotoProducts.has(product.id) || unavailableBundle
    ? 'Product photography coming soon.'
    : null;
}

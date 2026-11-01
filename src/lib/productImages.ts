const WOMENS_PRODUCT_FOLDERS = new Set([
  'bras',
  'women-underwear',
  'women-camisoles',
  'women-crop-tops',
]);

const UNAVAILABLE_WOMENS_IMAGES = new Set([
  'women-underwear/w-u03-back.jpg',
  'women-crop-tops/w-ct10-front.jpg',
  'women-crop-tops/w-ct15-front.jpg',
  'women-crop-tops/w-ct13-back.jpg',
  'women-crop-tops/w-ct15-back.jpg',
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

function pathWithoutExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}

export function productImageNotice(product: {
  category: string;
  image: string;
  id: string;
}): string | null {
  if (product.id === 'w-ct15') {
    return 'Product photos are unavailable: the front photo is missing and the available back image includes a partial neighboring view. Owner-approved front and back replacements are required.';
  }

  if (product.id === 'w-ct13') {
    return 'The back photo includes a partial neighboring image and is hidden. An owner-approved replacement is required for this view.';
  }

  if (product.id === 'w-ct10') {
    return 'The front photo is cropped at the image edge and is hidden. The back view is shown; an owner-approved front photo is required.';
  }

  if (product.id === 'w-u03') {
    return 'The back photo includes a partial neighboring image and is hidden. An owner-approved replacement is required.';
  }

  if (product.category === 'women-underwear') {
    return 'The source photos are low resolution. Owner-approved high-resolution replacements are required.';
  }

  if (product.category === 'bundles' && product.image.includes('bundle-01')) {
    return 'The available bundle photos are low resolution. Owner-approved high-resolution replacements are required.';
  }

  if (product.category === 'bundles' && product.image.includes('bundle-11')) {
    return 'The available bundle photos are low resolution. Owner-approved high-resolution replacements are required.';
  }

  if (product.category === 'bundles' && /bundle-0[7-9]|bundle-10/.test(product.image)) {
    return 'Product photos are unavailable pending owner-approved images that match this bundle.';
  }

  return null;
}

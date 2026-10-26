import 'dotenv/config';
import mongoose from 'mongoose';
import { MEN_CATEGORIES, PRODUCTS, WOMEN_CATEGORIES } from '../../src/data/catalog';
import { connectDB } from '../config/db';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

async function seedCatalog() {
  if (process.env.ALLOW_CATALOG_SEED !== 'true') {
    throw new Error('Set ALLOW_CATALOG_SEED=true to confirm non-destructive catalog insertion.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Set MONGODB_URI explicitly before seeding; the script will not use a local fallback.');
  }
  await connectDB();

  const categoryInput = [...MEN_CATEGORIES, ...WOMEN_CATEGORIES];
  const existingCategories = await Category.find(
    { slug: { $in: categoryInput.map((category) => category.slug) } },
    { slug: 1 }
  ).lean();
  const existingCategorySlugs = new Set(existingCategories.map(({ slug }) => slug));
  const categoriesToInsert = categoryInput
    .filter((category) => !existingCategorySlugs.has(category.slug))
    .map((category, orderIndex) => ({
      slug: category.slug,
      title: category.title,
      gender: category.gender,
      tagline: category.tagline,
      description: category.description,
      image: category.image,
      orderIndex,
      isActive: true,
    }));
  if (categoriesToInsert.length) {
    await Category.insertMany(categoriesToInsert, { ordered: true });
  }

  const existingProducts = await Product.find(
    {
      $or: [
        { catalogId: { $in: PRODUCTS.map((product) => product.id) } },
        { sku: { $in: PRODUCTS.map((product) => product.code || product.id) } },
        { slug: { $in: PRODUCTS.map((product) => product.slug) } },
      ],
    },
    { catalogId: 1, sku: 1, slug: 1 }
  ).lean();
  const existingCatalogIds = new Set(existingProducts.map(({ catalogId }) => catalogId).filter(Boolean));
  const existingSkus = new Set(existingProducts.map(({ sku }) => sku));
  const existingSlugs = new Set(existingProducts.map(({ slug }) => slug));
  const productsToInsert = PRODUCTS
    .filter((product) =>
      !existingCatalogIds.has(product.id) &&
      !existingSkus.has(product.code || product.id) &&
      !existingSlugs.has(product.slug)
    )
    .map((product) => ({
      catalogId: product.id,
      sku: product.code || product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      gender: product.gender,
      category: product.category,
      price: product.price,
      compareAt: product.compareAt,
      fabric: product.fabric,
      fabricDetails: product.fabricBadge,
      colors: product.colors.map((color) => color.name),
      sizes: product.sizes,
      badge: product.badge,
      images: [product.image, product.hoverImage].filter(Boolean),
      description: product.description,
      features: product.features,
      isDemoContent: true,
      inStock: false,
      isActive: true,
    }));
  if (productsToInsert.length) {
    await Product.insertMany(productsToInsert, { ordered: true });
  }

  console.log(
    `Non-destructive seed complete. Categories inserted: ${categoriesToInsert.length}; existing category slugs skipped: ${existingCategorySlugs.size}; products inserted: ${productsToInsert.length}; existing/conflicting products skipped: ${PRODUCTS.length - productsToInsert.length}.`
  );
}

seedCatalog()
  .catch((error) => {
    console.error('[2427 Catalog Seed] Failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

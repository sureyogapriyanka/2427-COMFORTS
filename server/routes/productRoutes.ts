import { NextFunction, Request, Response, Router } from 'express';
import { Product } from '../models/Product';

export const productRouter = Router();
const allowedSorts: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  name_asc: { name: 1 },
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const queryString = (value: unknown) => typeof value === 'string' ? value.trim() : '';

productRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = { isActive: { $ne: false } };
    const gender = queryString(req.query.gender);
    const category = queryString(req.query.category);
    const badge = queryString(req.query.badge);
    const size = queryString(req.query.size);
    const color = queryString(req.query.color);
    const fabric = queryString(req.query.fabric);
    const search = queryString(req.query.search);
    if ([category, badge, size, color, fabric].some((value) => value.length > 120)) {
      res.status(400).json({ success: false, message: 'A product filter is too long.' });
      return;
    }
    if (gender && !['men', 'women', 'unisex'].includes(gender)) {
      res.status(400).json({ success: false, message: 'Gender filter is invalid.' });
      return;
    }
    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (badge) filter.badge = badge;
    if (size) filter.sizes = size;
    if (color) filter.colors = color;
    if (fabric) filter.fabric = new RegExp(escapeRegex(fabric), 'i');
    if (search.length > 80) {
      res.status(400).json({ success: false, message: 'Search query is too long.' });
      return;
    }
    if (search) {
      const expression = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: expression }, { subtitle: expression }, { description: expression }];
    }
    const minimumRaw = queryString(req.query.minPrice);
    const maximumRaw = queryString(req.query.maxPrice);
    const minimum = minimumRaw ? Number(minimumRaw) : undefined;
    const maximum = maximumRaw ? Number(maximumRaw) : undefined;
    const sortKey = queryString(req.query.sort);
    if (
      (minimumRaw && (!Number.isFinite(minimum) || (minimum ?? -1) < 0)) ||
      (maximumRaw && (!Number.isFinite(maximum) || (maximum ?? -1) < 0)) ||
      (minimum !== undefined && maximum !== undefined && minimum > maximum)
    ) {
      res.status(400).json({ success: false, message: 'Price range is invalid.' });
      return;
    }
    if (minimum !== undefined || maximum !== undefined) {
      filter.price = {
        ...(minimum !== undefined ? { $gte: minimum } : {}),
        ...(maximum !== undefined ? { $lte: maximum } : {}),
      };
    }

    const pageRaw = queryString(req.query.page);
    const limitRaw = queryString(req.query.limit);
    const page = pageRaw ? Number(pageRaw) : 1;
    const limit = limitRaw ? Number(limitRaw) : 24;
    if (
      !Number.isSafeInteger(page) || page < 1 ||
      !Number.isSafeInteger(limit) || limit < 1 || limit > 50
    ) {
      res.status(400).json({ success: false, message: 'Pagination parameters are invalid.' });
      return;
    }
    if (sortKey && !allowedSorts[sortKey]) {
      res.status(400).json({ success: false, message: 'Sort option is invalid.' });
      return;
    }
    const sort = allowedSorts[sortKey] || allowedSorts.newest;
    const [data, total] = await Promise.all([
      Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
});

productRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: { $ne: false } }).lean();
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

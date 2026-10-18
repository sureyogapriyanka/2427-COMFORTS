import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';

export const productRouter = Router();

// GET /api/products
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { gender, category, badge } = req.query;
    const filter: Record<string, any> = {};
    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (badge) filter.badge = badge;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:slug
productRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

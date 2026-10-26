import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { Product } from '../models/Product';
import { User } from '../models/User';

export const cartRouter = Router();
cartRouter.use(authenticate);

type CartInput = { productId: string; size: string; color: string; quantity: number };

async function validateCart(value: unknown): Promise<CartInput[] | null> {
  if (!Array.isArray(value) || value.length > 100) return null;
  const items: CartInput[] = [];
  for (const item of value) {
    if (
      !item || typeof item.productId !== 'string' || item.productId.length > 120 ||
      typeof item.size !== 'string' || item.size.length > 30 ||
      typeof item.color !== 'string' || item.color.length > 60 ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
    ) return null;
    items.push({ productId: item.productId, size: item.size, color: item.color, quantity: item.quantity });
  }
  const ids = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ catalogId: { $in: ids }, isActive: { $ne: false } }).lean();
  const productMap = new Map(products.map((product) => [product.catalogId, product]));
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || !product.sizes.includes(item.size) || !product.colors.includes(item.color)) return null;
  }
  return items;
}

cartRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.authUser?.id).select('cart').lean();
    res.json({ success: true, data: user?.cart ?? [] });
  } catch (error) {
    next(error);
  }
});

cartRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await validateCart(req.body?.items);
    if (!items) {
      res.status(400).json({ success: false, message: 'Cart contains an unavailable item or invalid variant.' });
      return;
    }
    const merged = new Map<string, CartInput>();
    for (const item of items) {
      const key = `${item.productId}:${item.size}:${item.color}`;
      const existing = merged.get(key);
      merged.set(key, { ...item, quantity: Math.min(99, (existing?.quantity ?? 0) + item.quantity) });
    }
    const cart = [...merged.values()].map((item) => ({
      catalogId: item.productId,
      selectedSize: item.size,
      selectedColor: item.color,
      quantity: item.quantity,
    }));
    await User.updateOne({ _id: req.authUser?.id }, { $set: { cart } });
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.updateOne({ _id: req.authUser?.id }, { $set: { cart: [] } });
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

import { NextFunction, Request, Response, Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

export const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

const productFields = [
  'catalogId', 'sku', 'name', 'subtitle', 'slug', 'gender', 'category', 'price',
  'compareAt', 'fabric', 'fabricDetails', 'colors', 'sizes', 'badge', 'images',
  'description', 'features', 'inStock', 'stockCount', 'isDemoContent', 'isActive',
] as const;
const categoryFields = ['title', 'slug', 'gender', 'tagline', 'description', 'image', 'orderIndex', 'isActive'] as const;

function pickFields<T extends readonly string[]>(body: Record<string, unknown>, fields: T) {
  return Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));
}

adminRouter.get('/overview', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [products, categories, customers, orders, sales] = await Promise.all([
      Product.countDocuments({ isActive: { $ne: false } }),
      Category.countDocuments({ isActive: { $ne: false } }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, revenue: { $sum: '$total' } } },
      ]),
    ]);
    res.json({
      success: true,
      data: { products, categories, customers, orders, paidRevenue: sales[0]?.revenue ?? 0 },
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit) || 50)));
    const [data, total] = await Promise.all([
      Product.find().sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total } });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(pickFields(req.body ?? {}, productFields));
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fields = pickFields(req.body ?? {}, productFields);
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: fields }, { new: true, runValidators: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: { id: product.id, isActive: product.isActive } });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await Category.find().sort({ orderIndex: 1 }).lean() });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.create(pickFields(req.body ?? {}, categoryFields));
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: pickFields(req.body ?? {}, categoryFields) },
      { new: true, runValidators: true }
    );
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: { id: category.id, isActive: category.isActive } });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit) || 50)));
    const [data, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total } });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transitions: Record<string, string[]> = {
      placed: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };
    const order = await Order.findById(req.params.id);
    const nextStatus = req.body?.orderStatus;
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }
    if (typeof nextStatus !== 'string' || !transitions[order.orderStatus]?.includes(nextStatus)) {
      res.status(400).json({ success: false, message: 'Order status transition is not allowed.' });
      return;
    }
    order.orderStatus = nextStatus as typeof order.orderStatus;
    await order.save();
    res.json({ success: true, data: { id: order.id, orderStatus: order.orderStatus } });
  } catch (error) {
    next(error);
  }
});

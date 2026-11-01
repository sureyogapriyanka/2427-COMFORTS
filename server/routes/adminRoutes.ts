import { NextFunction, Request, Response, Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import {
  calculateInventorySummary,
  getInventoryProductStatus,
  validateInventoryThreshold,
  validateSizeInventory,
  type InventoryProductSnapshot,
} from '../services/sizeInventory';

export const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

const productFields = [
  'catalogId', 'sku', 'name', 'subtitle', 'slug', 'gender', 'category', 'price',
  'compareAt', 'fabric', 'fabricDetails', 'colors', 'sizes', 'badge', 'images',
  'description', 'features', 'isDemoContent', 'isActive',
] as const;
const categoryFields = ['title', 'slug', 'gender', 'tagline', 'description', 'image', 'orderIndex', 'isActive'] as const;
const DEFAULT_LOW_STOCK_THRESHOLD = 10;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function positiveQueryInteger(value: unknown, fallback: number, maximum: number) {
  const parsed = typeof value === 'string' && value.trim() ? Number(value) : fallback;
  return Number.isSafeInteger(parsed) && parsed > 0 && parsed <= maximum ? parsed : null;
}

function matchesInventoryStatus(
  product: InventoryProductSnapshot,
  status: string,
) {
  if (!status) return true;
  if (status === 'unconfirmed') {
    return product.isDemoContent !== false ||
      product.sizes.some((size) => !product.sizeInventory?.some((variant) => variant.size === size));
  }
  if (product.isDemoContent !== false || product.sizes.length === 0) return false;
  const inventory = new Map((product.sizeInventory ?? []).map(({ size, quantity }) => [size, quantity]));
  const quantities = product.sizes.map((size) => inventory.get(size));
  if (status === 'out_of_stock') return quantities.every((quantity) => quantity === 0);
  const threshold = product.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
  if (status === 'low_stock') {
    return quantities.some((quantity) =>
      typeof quantity === 'number' && quantity > 0 && quantity <= threshold
    );
  }
  return status === 'in_stock' && quantities.every((quantity) => typeof quantity === 'number') &&
    quantities.some((quantity) => typeof quantity === 'number' && quantity > threshold);
}

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

adminRouter.get('/inventory', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = positiveQueryInteger(req.query.page, 1, 100000);
    const limit = positiveQueryInteger(req.query.limit, 50, 100);
    if (!page || !limit) {
      res.status(400).json({ success: false, message: 'Inventory pagination parameters are invalid.' });
      return;
    }

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const size = typeof req.query.size === 'string' ? req.query.size.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    if (search.length > 100 || category.length > 120 || size.length > 40) {
      res.status(400).json({ success: false, message: 'An inventory filter is too long.' });
      return;
    }
    if (status && !['low_stock', 'out_of_stock', 'unconfirmed', 'in_stock'].includes(status)) {
      res.status(400).json({ success: false, message: 'Inventory status filter is invalid.' });
      return;
    }

    const products = await Product.find()
      .select('catalogId sku name category sizes images isDemoContent sizeInventory lowStockThreshold')
      .sort({ name: 1 })
      .lean() as unknown as InventoryProductSnapshot[];
    const filtered = products.filter((product) => {
      const matchesSearch = !search ||
        [product.name, product.sku, product.catalogId ?? ''].some((field) =>
          new RegExp(escapeRegex(search), 'i').test(field)
        );
      return matchesSearch &&
        (!category || product.category === category) &&
        (!size || product.sizes.includes(size)) &&
        matchesInventoryStatus(product, status);
    });
    const offset = (page - 1) * limit;
    res.json({
      success: true,
      data: {
        products: filtered.slice(offset, offset + limit).map((product) => ({
          ...product,
          inventoryStatus: getInventoryProductStatus(product),
        })),
        summary: calculateInventorySummary(products),
        pagination: { page, limit, total: filtered.length },
        categories: [...new Set(products.map((product) => product.category))].sort(),
        sizes: [...new Set(products.flatMap((product) => product.sizes))].sort(),
      },
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/inventory/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = positiveQueryInteger(req.query.limit, 100, 500);
    if (!limit) {
      res.status(400).json({ success: false, message: 'Inventory history limit is invalid.' });
      return;
    }
    const history = await Product.aggregate([
      { $unwind: '$inventoryHistory' },
      { $sort: { 'inventoryHistory.createdAt': -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          catalogId: 1,
          sku: 1,
          productName: '$name',
          size: '$inventoryHistory.size',
          previousQuantity: '$inventoryHistory.previousQuantity',
          newQuantity: '$inventoryHistory.newQuantity',
          reason: '$inventoryHistory.reason',
          adminId: '$inventoryHistory.adminId',
          adminEmail: '$inventoryHistory.adminEmail',
          createdAt: '$inventoryHistory.createdAt',
        },
      },
    ]);
    res.json({ success: true, data: history });
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

adminRouter.patch('/products/:id/inventory', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    if (product.isDemoContent !== false) {
      res.status(409).json({ success: false, message: 'Inventory cannot be confirmed for demo products.' });
      return;
    }

    const body = req.body as Record<string, unknown> | undefined;
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';
    if (!reason || reason.length > 300) {
      res.status(400).json({ success: false, message: 'Provide an inventory adjustment reason of 1–300 characters.' });
      return;
    }
    if (
      (body?.sizeInventory !== undefined && (
        body.size !== undefined || body.quantity !== undefined || body.adjustment !== undefined
      )) ||
      (body?.quantity !== undefined && body.adjustment !== undefined)
    ) {
      res.status(400).json({ success: false, message: 'Provide one inventory update format at a time.' });
      return;
    }
    const actor = req.authUser;
    if (!actor) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }
    const currentInventory = new Map(
      (product.sizeInventory ?? []).map(({ size, quantity }) => [size, quantity])
    );
    const nextInventory = new Map(currentInventory);

    if (body?.sizeInventory !== undefined) {
      const validated = validateSizeInventory(product.sizes, body.sizeInventory);
      if (validated.error || !validated.inventory) {
        res.status(400).json({ success: false, message: validated.error ?? 'Size inventory is invalid.' });
        return;
      }
      for (const [size, quantity] of Object.entries(validated.inventory)) {
        nextInventory.set(size, quantity);
      }
    } else {
      const size = body?.size;
      if (typeof size !== 'string' || !product.sizes.includes(size)) {
        res.status(400).json({ success: false, message: 'Choose a valid size variant for this product.' });
        return;
      }
      const quantity = currentInventory.get(size);
      let nextQuantity: number;
      if (body?.adjustment !== undefined) {
        if (typeof body.adjustment !== 'number' || !Number.isSafeInteger(body.adjustment)) {
          res.status(400).json({ success: false, message: 'Stock adjustment must be a whole number.' });
          return;
        }
        nextQuantity = (quantity ?? 0) + body.adjustment;
      } else if (typeof body?.quantity === 'number' && Number.isSafeInteger(body.quantity)) {
        nextQuantity = body.quantity;
      } else {
        res.status(400).json({ success: false, message: 'Provide a whole-number quantity or stock adjustment.' });
        return;
      }
      if (nextQuantity < 0 || !Number.isSafeInteger(nextQuantity)) {
        res.status(400).json({ success: false, message: 'Inventory cannot be negative or exceed the safe integer range.' });
        return;
      }
      nextInventory.set(size, nextQuantity);
    }

    const changes = [...nextInventory.entries()]
      .filter(([size, quantity]) => currentInventory.get(size) !== quantity)
      .map(([size, newQuantity]) => ({
        adminId: actor.id,
        adminEmail: actor.email,
        size,
        previousQuantity: currentInventory.get(size) ?? null,
        newQuantity,
        reason,
        createdAt: new Date(),
      }));
    if (!changes.length) {
      res.json({
        success: true,
        data: { id: product.id, sizeInventory: product.sizeInventory ?? [], inventoryHistory: [] },
      });
      return;
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id, __v: product.__v ?? 0, isDemoContent: false },
      {
        $set: {
          sizeInventory: Array.from(nextInventory, ([size, quantity]) => ({ size, quantity })),
        },
        $push: { inventoryHistory: { $each: changes } },
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      res.status(409).json({ success: false, message: 'Inventory changed during this update. Reload and try again.' });
      return;
    }
    res.json({
      success: true,
      data: {
        id: updatedProduct.id,
        sizeInventory: updatedProduct.sizeInventory,
        inventoryHistory: updatedProduct.inventoryHistory ?? [],
      },
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/products/:id/inventory/threshold', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const threshold = validateInventoryThreshold(req.body?.lowStockThreshold);
    if (threshold === null) {
      res.status(400).json({ success: false, message: 'Low-stock threshold must be a whole number from 1 to 10000.' });
      return;
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id, __v: product.__v ?? 0 },
      { $set: { lowStockThreshold: threshold }, $inc: { __v: 1 } },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      res.status(409).json({ success: false, message: 'Product changed during this update. Reload and try again.' });
      return;
    }
    res.json({ success: true, data: { id: updatedProduct.id, lowStockThreshold: updatedProduct.lowStockThreshold } });
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

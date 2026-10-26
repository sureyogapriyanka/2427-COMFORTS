import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { Order } from '../models/Order';
import { Types } from 'mongoose';

export const orderRouter = Router();

orderRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(50, Math.max(1, Math.floor(Number(req.query.limit) || 20)));
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }
    const filter = { userId: new Types.ObjectId(req.authUser.id) };
    const [data, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total } });
  } catch (error) {
    next(error);
  }
});

orderRouter.post('/', authenticate, (_req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    message: 'Order submission is disabled until shipping, inventory, and fulfillment rules are approved.',
  });
});

import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { Product } from '../models/Product';
import { User } from '../models/User';

export const wishlistRouter = Router();
wishlistRouter.use(authenticate);

wishlistRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.authUser?.id).select('wishlist').lean();
    res.json({ success: true, data: user?.wishlist ?? [] });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productIds = req.body?.productIds;
    if (
      !Array.isArray(productIds) || productIds.length > 500 ||
      productIds.some((id: unknown) => typeof id !== 'string' || id.length > 120)
    ) {
      res.status(400).json({ success: false, message: 'Wishlist data is invalid.' });
      return;
    }
    const uniqueIds = [...new Set<string>(productIds)];
    const count = await Product.countDocuments({ catalogId: { $in: uniqueIds } });
    if (count !== uniqueIds.length) {
      res.status(400).json({ success: false, message: 'Wishlist contains an unknown product.' });
      return;
    }
    await User.updateOne({ _id: req.authUser?.id }, { $set: { wishlist: uniqueIds } });
    res.json({ success: true, data: uniqueIds });
  } catch (error) {
    next(error);
  }
});

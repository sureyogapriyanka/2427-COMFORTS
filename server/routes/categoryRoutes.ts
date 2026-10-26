import { NextFunction, Request, Response, Router } from 'express';
import { Category } from '../models/Category';

export const categoryRouter = Router();

categoryRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: { $ne: false } }).sort({ orderIndex: 1, title: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

categoryRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: { $ne: false } }).lean();
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

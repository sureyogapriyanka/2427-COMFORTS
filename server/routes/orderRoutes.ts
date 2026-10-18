import { Router, Request, Response } from 'express';

export const orderRouter = Router();

orderRouter.post('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Order creation endpoint initialized. Payment gateway scheduled for Phase 2.',
  });
});

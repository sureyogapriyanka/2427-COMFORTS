import { NextFunction, Request, Response, Router } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { NewsletterSubscription } from '../models/NewsletterSubscription';

export const contactRouter = Router();
export const newsletterRouter = Router();
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

contactRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, topic, message } = req.body ?? {};
    if (
      typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 ||
      typeof email !== 'string' || !validEmail.test(email.trim()) ||
      typeof topic !== 'string' || topic.trim().length < 2 || topic.trim().length > 80 ||
      typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000
    ) {
      res.status(400).json({ success: false, message: 'Enter a valid name, email, and message.' });
      return;
    }
    await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic.trim(),
      message: message.trim(),
    });
    res.status(201).json({ success: true, message: 'Your message has been stored for review.' });
  } catch (error) {
    next(error);
  }
});

newsletterRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!validEmail.test(email) || req.body?.consent !== true) {
      res.status(400).json({ success: false, message: 'A valid email and explicit subscription consent are required.' });
      return;
    }
    const existing = await NewsletterSubscription.findOne({ email });
    if (existing) {
      res.json({ success: true, message: 'This email is already subscribed.' });
      return;
    }
    await NewsletterSubscription.create({ email });
    res.status(201).json({ success: true, message: 'Your subscription has been recorded.' });
  } catch (error) {
    next(error);
  }
});

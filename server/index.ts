import cors from 'cors';
import dotenv from 'dotenv';
import express, { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { resolve } from 'node:path';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { csrfProtection } from './middleware/csrfProtection';
import { adminRouter } from './routes/adminRoutes';
import { authRouter } from './routes/authRoutes';
import { cartRouter } from './routes/cartRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { contactRouter, newsletterRouter } from './routes/contactRoutes';
import { orderRouter } from './routes/orderRoutes';
import { productRouter } from './routes/productRoutes';
import { wishlistRouter } from './routes/wishlistRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const PREVIEW_BASE_PATH = '/2427-COMFORTS';
if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
  const configuredOrigins = (process.env.CLIENT_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const renderOrigin = new URL(process.env.RENDER_EXTERNAL_URL).origin;
  if (!configuredOrigins.includes(renderOrigin)) configuredOrigins.push(renderOrigin);
  process.env.CLIENT_ORIGINS = configuredOrigins.join(',');
}
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    if (
      process.env.NODE_ENV !== 'production' &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
}));
app.use(express.json({ limit: '20kb' }));
const apiRouter = Router();
apiRouter.use(rateLimit({
  windowMs: 60_000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));
apiRouter.use(csrfProtection);
apiRouter.use(['/auth/register', '/auth/login'], rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));
apiRouter.use(['/contact', '/newsletter'], rateLimit({
  windowMs: 15 * 60_000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));

apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/wishlist', wishlistRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/newsletter', newsletterRouter);

apiRouter.get('/health', (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'online' : 'database_unavailable',
    brand: '2427 ÉLAN',
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use((_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

app.use('/api', apiRouter);
app.use(`${PREVIEW_BASE_PATH}/api`, apiRouter);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = resolve(process.cwd(), 'dist');
  app.use(PREVIEW_BASE_PATH, express.static(frontendPath));
  app.use(PREVIEW_BASE_PATH, (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    res.sendFile(resolve(frontendPath, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== 'test') {
  void (async () => {
    if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
      throw new Error('JWT_SECRET must contain at least 32 bytes before the API can start.');
    }
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[2427 ÉLAN API] Running on port ${PORT}`);
    });
  })().catch((error) => {
    console.error('[2427 ÉLAN API] Startup failed:', error);
    process.exitCode = 1;
  });
}

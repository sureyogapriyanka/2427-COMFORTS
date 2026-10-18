import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { productRouter } from './routes/productRoutes';
import { authRouter } from './routes/authRoutes';
import { orderRouter } from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB (attempts connection, non-blocking if offline in development)
connectDB().catch((err) => console.log('[2427 Backend] DB connection skipped in offline mode:', err));

// API Routes
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: '2427',
    service: 'E-Commerce & Admin API Engine',
    timestamp: new Date().toISOString(),
  });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[2427 Backend Server] Running on http://localhost:${PORT}`);
  });
}

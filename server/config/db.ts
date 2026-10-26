import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI ||
    (process.env.NODE_ENV === 'production'
      ? ''
      : 'mongodb://127.0.0.1:27017/2427_ecommerce');
  if (!mongoURI) {
    throw new Error('MONGODB_URI must be configured in production.');
  }

  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const expectedDatabase = process.env.PREVIEW_DEMO_DATABASE;
    if (!expectedDatabase || !/^[a-zA-Z0-9_-]+$/.test(expectedDatabase)) {
      throw new Error('PREVIEW_DEMO_DATABASE must name the isolated client-preview database.');
    }

    let configuredDatabase: string;
    try {
      configuredDatabase = decodeURIComponent(new URL(mongoURI).pathname.replace(/^\/|\/$/g, ''));
    } catch {
      throw new Error('MONGODB_URI must be a valid MongoDB connection string.');
    }

    if (configuredDatabase !== expectedDatabase) {
      throw new Error('The preview database name does not match PREVIEW_DEMO_DATABASE.');
    }
  }

  const conn = await mongoose.connect(mongoURI);
  console.log(`[2427 Database] MongoDB Connected: ${conn.connection.host}`);
}

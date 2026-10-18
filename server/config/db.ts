import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/2427_ecommerce';
  
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[2427 Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[2427 Database] MongoDB Connection Error:`, error);
    // In dev mode, gracefully log without terminating app process
  }
}

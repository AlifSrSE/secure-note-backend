import mongoose from 'mongoose';

let cached = global.mongoose || {};

if (!global.mongoose) {
  global.mongoose = cached;
}

const connectDB = async () => {
  if (cached.connection) return cached.connection;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    cached.connection = conn;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const ensureDB = async () => {
  if (!cached.connection) {
    await connectDB();
  }
  return cached.connection;
};

export default connectDB;

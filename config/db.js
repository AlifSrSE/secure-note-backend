import mongoose from 'mongoose';

let cached = global.mongoose || {};

if (!global.mongoose) {
  global.mongoose = cached;
}

const connectDB = async () => {
  if (cached.connection) return cached.connection;

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
  });

  cached.connection = conn;
  return conn;
};

export default connectDB;

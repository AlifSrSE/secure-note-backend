import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ email: 'secureadmin@example.com' });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'secureadmin@example.com',
      password: 'secureadmin',
      role: 'admin',
      interests: ['coding', 'admin'],
    });

    console.log('Admin created:');
    console.log('Username: Admin');
    console.log('Password: secureadmin');
    console.log('Email:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();

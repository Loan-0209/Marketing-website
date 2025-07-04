const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heart_db');
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@heart.com' }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@heart.com',
      password: 'heart2024',
      firstName: 'HEART',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true
    });

    console.log('🎉 Admin user created successfully!');
    console.log('📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: heart2024');
    console.log('   Email: admin@heart.com');
    console.log('   Role: admin');
    console.log('');
    console.log('🔗 You can now login at:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   API: POST http://localhost:5000/api/auth/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 Admin user might already exist with duplicate username/email');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createAdminUser();
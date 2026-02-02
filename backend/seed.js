import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

// Dummy user data
const dummyUser = {
    name: 'Demo User',
    email: 'user@email.com',
    password: 'user123', // Will be hashed by the User model's pre-save hook
};

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('✅ Connected to database');

        // Check if user already exists
        const existingUser = await User.findOne({ email: dummyUser.email });

        if (existingUser) {
            console.log('⚠️  User already exists with email:', dummyUser.email);
            console.log('   Deleting existing user and creating fresh one...');
            await User.deleteOne({ email: dummyUser.email });
        }

        // Create new user
        const user = await User.create(dummyUser);

        console.log('\n🎉 Dummy user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   Email:    user@email.com');
        console.log('   Password: user123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n✅ Seed completed! You can now login with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();

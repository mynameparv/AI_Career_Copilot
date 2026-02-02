// Direct test of User model
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing User model...\n');

// Test 1: Check if user exists
const user = User.findOne({ email: 'test@example.com' });
console.log('1. User.findOne result:', user);

if (user) {
    console.log('   User ID:', user._id);
    console.log('   User email:', user.email);
    console.log('   User name:', user.name);

    // Test 2: Find by ID
    const userById = User.findById(user._id);
    console.log('\n2. User.findById result:', userById ? 'Found' : 'Not found');
    if (userById) {
        console.log('   Email:', userById.email);
    }
}

console.log('\nTest complete!');

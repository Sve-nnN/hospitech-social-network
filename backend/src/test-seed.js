import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/red_social_hoteles';

const testSeed = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('URI:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('Testing User creation...');
        await User.deleteMany({});
        const user = await User.create({
            username: 'test_user',
            email: 'test@example.com',
            password: 'password123',
            nombre: 'Test',
            apellido: 'User'
        });
        console.log('✅ User created:', user.username);

        console.log('✅ Test successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

testSeed();

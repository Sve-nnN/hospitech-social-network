import mongoose from 'mongoose';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Post from './models/Post.js';
import { actualizarRatingHotel } from './controllers/post.controller.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/red_social_hoteles';

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('Clearing database...');
        await User.deleteMany({});
        await Hotel.deleteMany({});
        await Post.deleteMany({});

        console.log('Creating test hotel...');
        const testHotel = await Hotel.create({
            nombre: 'Test Hotel',
            direccion: {
                calle: 'Test Street',
                ciudad: 'Test City',
                pais: 'Test Country',
                coordenadas: { type: 'Point', coordinates: [0, 0] }
            },
            descripcion: 'Test description',
            estrellas: 5,
            imagenes_url: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
        });
        console.log('✅ Test hotel created:', testHotel.nombre);

        console.log('✅ Test successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

seed();

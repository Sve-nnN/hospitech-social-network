import mongoose from 'mongoose';
import Hotel from './models/Hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/red_social_hoteles';

const testHotel = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('Hotel model type:', typeof Hotel);
        console.log('Is Hotel.create a function?', typeof Hotel.create);
        if (typeof Hotel.create !== 'function') {
            console.log('Hotel export:', Hotel);
        }

        console.log('Clearing hotels...');
        await Hotel.deleteMany({});

        console.log('Creating hotel without coordinates...');
        const hotel1 = await Hotel.create({
            nombre: 'Simple Hotel',
            direccion: {
                ciudad: 'Madrid',
                pais: 'España'
            }
        });
        console.log('✅ Hotel 1 created:', hotel1.nombre, hotel1.slug);

        console.log('Creating hotel with coordinates...');
        const hotel2 = await Hotel.create({
            nombre: 'Hotel with Coords',
            direccion: {
                ciudad: 'Barcelona',
                pais: 'España',
                coordenadas: {
                    type: 'Point',
                    coordinates: [2.1734, 41.3851]
                }
            }
        });
        console.log('✅ Hotel 2 created:', hotel2.nombre, hotel2.slug);

        console.log('✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
};

testHotel();

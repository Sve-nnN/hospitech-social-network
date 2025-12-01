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

    console.log('Creating users...');
    const users = await User.create([
      { username: 'alice', email: 'alice@example.com', password: 'password123', nombre: 'Alice', apellido: 'Wonderland', imagen_perfil_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { username: 'bob', email: 'bob@example.com', password: 'password123', nombre: 'Bob', apellido: 'Builder', imagen_perfil_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80' },
      { username: 'charlie', email: 'charlie@example.com', password: 'password123', nombre: 'Charlie', apellido: 'Chocolate', imagen_perfil_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }
    ]);

    console.log('Creating hotels...');
    const hotels = await Hotel.create([
      { 
        nombre: 'Grand Hotel', 
        direccion: { ciudad: 'Madrid', pais: 'Spain', calle: 'Gran Via 1' },
        imagenes_url: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
      },
      { 
        nombre: 'Beach Resort', 
        direccion: { ciudad: 'Cancun', pais: 'Mexico', calle: 'Zona Hotelera' },
        imagenes_url: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80']
      },
      { 
        nombre: 'Mountain Lodge', 
        direccion: { ciudad: 'Aspen', pais: 'USA', calle: 'Mountain Rd' },
        imagenes_url: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80']
      }
    ]);

    console.log('Creating posts...');
    const postsData = [
      { 
        user_id: users[0]._id, 
        hotel_id: hotels[0]._id, 
        contenido: 'Excelente estancia, muy recomendado. La vista desde la habitación era increíble.', 
        rating: 5,
        likes: [users[1]._id, users[2]._id],
        comments: [
            {
                user_id: users[1]._id,
                user_info: { username: users[1].username, imagen_perfil_url: users[1].imagen_perfil_url },
                contenido: '¡Se ve genial! ¿Qué tal el desayuno?',
                fecha_creacion: new Date()
            }
        ]
      },
      { 
        user_id: users[1]._id, 
        hotel_id: hotels[0]._id, 
        contenido: 'Buen hotel pero un poco ruidoso por la noche. El servicio fue excelente, sin embargo.', 
        rating: 4,
        likes: [users[0]._id]
      },
      { 
        user_id: users[2]._id, 
        hotel_id: hotels[1]._id, 
        contenido: 'La playa es increíble, arena blanca y agua cristalina. Definitivamente volveré.', 
        rating: 5,
        likes: [users[0]._id, users[1]._id],
        imagenes_url: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']
      },
      { 
        user_id: users[0]._id, 
        hotel_id: hotels[2]._id, 
        contenido: 'Vistas espectaculares de las montañas. Perfecto para esquiar.', 
        rating: 5,
        likes: []
      },
      { 
        user_id: users[1]._id, 
        hotel_id: hotels[2]._id, 
        contenido: 'Mucho frío pero acogedor. La chimenea en el lobby es un gran toque.', 
        rating: 4,
        likes: [users[2]._id]
      }
    ];

    for (const p of postsData) {
      const user = users.find(u => u._id.equals(p.user_id));
      const hotel = hotels.find(h => h._id.equals(p.hotel_id));
      
      await Post.create({
        ...p,
        user_info: { username: user.username, imagen_perfil_url: user.imagen_perfil_url },
        hotel_info: { nombre: hotel.nombre, ciudad: hotel.direccion.ciudad }
      });
      
      await actualizarRatingHotel(hotel._id);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();

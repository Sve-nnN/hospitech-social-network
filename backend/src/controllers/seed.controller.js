import mongoose from 'mongoose';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Post from '../models/Post.js';
import { actualizarRatingHotel } from './post.controller.js';
import bcrypt from 'bcryptjs';

/**
 * Seeds the database with mock data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const seedDatabase = async (req, res) => {
    try {
        console.log('Starting database seed via API...');

        // Clear existing data
        await User.deleteMany({});
        await Hotel.deleteMany({});
        await Post.deleteMany({});

        // Hash password for all users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const usersData = [
            {
                username: 'sofia_travel',
                email: 'sofia@example.com',
                password: hashedPassword,
                nombre: 'Sofía',
                apellido: 'Rodríguez',
                biografia: 'Amante de los viajes y la fotografía. Siempre buscando el próximo destino.',
                direccion: { ciudad: 'Madrid', pais: 'España' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'carlos_explorer',
                email: 'carlos@example.com',
                password: hashedPassword,
                nombre: 'Carlos',
                apellido: 'Mendoza',
                biografia: 'Explorador de hoteles boutique y gastronomía local.',
                direccion: { ciudad: 'Barcelona', pais: 'España' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'ana_wanderlust',
                email: 'ana@example.com',
                password: hashedPassword,
                nombre: 'Ana',
                apellido: 'García',
                biografia: 'Nómada digital. Trabajo desde los mejores hoteles del mundo.',
                direccion: { ciudad: 'Buenos Aires', pais: 'Argentina' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'miguel_luxury',
                email: 'miguel@example.com',
                password: hashedPassword,
                nombre: 'Miguel',
                apellido: 'Torres',
                biografia: 'Especialista en hoteles de lujo y experiencias premium.',
                direccion: { ciudad: 'Ciudad de México', pais: 'México' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'lucia_beaches',
                email: 'lucia@example.com',
                password: hashedPassword,
                nombre: 'Lucía',
                apellido: 'Martínez',
                biografia: 'Adicta a las playas paradisíacas y resorts todo incluido.',
                direccion: { ciudad: 'Cancún', pais: 'México' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'david_backpacker',
                email: 'david@example.com',
                password: hashedPassword,
                nombre: 'David',
                apellido: 'López',
                biografia: 'Viajero con presupuesto limitado pero experiencias ilimitadas.',
                direccion: { ciudad: 'Lima', pais: 'Perú' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'maria_foodie',
                email: 'maria@example.com',
                password: hashedPassword,
                nombre: 'María',
                apellido: 'Fernández',
                biografia: 'Viajo por la comida. Los hoteles con buen desayuno son mi debilidad.',
                direccion: { ciudad: 'Valencia', pais: 'España' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'javier_business',
                email: 'javier@example.com',
                password: hashedPassword,
                nombre: 'Javier',
                apellido: 'Ruiz',
                biografia: 'Viajero de negocios frecuente. Valoro la eficiencia y comodidad.',
                direccion: { ciudad: 'Santiago', pais: 'Chile' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'elena_culture',
                email: 'elena@example.com',
                password: hashedPassword,
                nombre: 'Elena',
                apellido: 'Sánchez',
                biografia: 'Historiadora del arte. Busco hoteles cerca de museos y sitios históricos.',
                direccion: { ciudad: 'Roma', pais: 'Italia' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'pablo_adventure',
                email: 'pablo@example.com',
                password: hashedPassword,
                nombre: 'Pablo',
                apellido: 'Morales',
                biografia: 'Aventurero extremo. Montañas, surf y deportes de riesgo.',
                direccion: { ciudad: 'Medellín', pais: 'Colombia' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'isabel_romantic',
                email: 'isabel@example.com',
                password: hashedPassword,
                nombre: 'Isabel',
                apellido: 'Vargas',
                biografia: 'Escapadas románticas y hoteles con encanto. Luna de miel eterna.',
                direccion: { ciudad: 'París', pais: 'Francia' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'roberto_family',
                email: 'roberto@example.com',
                password: hashedPassword,
                nombre: 'Roberto',
                apellido: 'Jiménez',
                biografia: 'Padre de tres. Experto en hoteles family-friendly.',
                direccion: { ciudad: 'Miami', pais: 'Estados Unidos' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
            },
            {
                username: 'juancarlosanguloabud@gmail.com',
                email: 'juancarlosanguloabud@gmail.com',
                password: await bcrypt.hash('juanjuan', 10),
                nombre: 'Juan',
                apellido: 'Angulo',
                biografia: 'Usuario Administrador',
                direccion: { ciudad: 'Bogota', pais: 'Colombia' },
                imagen_perfil_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            }
        ];

        const users = await User.create(usersData);

        // Establecer relaciones de seguimiento entre usuarios
        users[0].following_users = [users[1]._id, users[2]._id, users[3]._id];
        users[0].following_users_count = 3;
        users[1].following_users = [users[0]._id, users[4]._id];
        users[1].following_users_count = 2;
        users[2].following_users = [users[0]._id, users[3]._id, users[5]._id];
        users[2].following_users_count = 3;
        users[3].following_users = [users[1]._id];
        users[3].following_users_count = 1;
        users[4].following_users = [users[0]._id, users[2]._id];
        users[4].following_users_count = 2;

        // Actualizar followers
        users[0].followers = [users[1]._id, users[2]._id, users[4]._id];
        users[0].followers_count = 3;
        users[1].followers = [users[0]._id, users[3]._id];
        users[1].followers_count = 2;
        users[2].followers = [users[0]._id, users[4]._id];
        users[2].followers_count = 2;
        users[3].followers = [users[0]._id, users[2]._id];
        users[3].followers_count = 2;
        users[4].followers = [users[1]._id];
        users[4].followers_count = 1;

        await Promise.all(users.map(u => u.save()));

        const hotelsData = [
            {
                nombre: 'Hotel Ritz Paris',
                direccion: {
                    calle: '15 Place Vendôme',
                    ciudad: 'París',
                    pais: 'Francia',
                    coordenadas: { type: 'Point', coordinates: [2.3292, 48.8679] }
                },
                descripcion: 'Icónico hotel de lujo en el corazón de París, conocido por su elegancia y servicio excepcional.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'The Plaza Hotel',
                direccion: {
                    calle: 'Fifth Avenue at Central Park South',
                    ciudad: 'Nueva York',
                    pais: 'Estados Unidos',
                    coordenadas: { type: 'Point', coordinates: [-73.9744, 40.7648] }
                },
                descripcion: 'Legendario hotel de lujo con vistas a Central Park, símbolo de la hospitalidad neoyorquina.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Belmond Hotel Caruso',
                direccion: {
                    calle: 'Piazza San Giovanni del Toro 2',
                    ciudad: 'Ravello',
                    pais: 'Italia',
                    coordenadas: { type: 'Point', coordinates: [14.6125, 40.6489] }
                },
                descripcion: 'Hotel boutique en la Costa Amalfitana con vistas espectaculares al Mediterráneo.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Aman Tokyo',
                direccion: {
                    calle: 'The Otemachi Tower',
                    ciudad: 'Tokio',
                    pais: 'Japón',
                    coordenadas: { type: 'Point', coordinates: [139.7671, 35.6869] }
                },
                descripcion: 'Oasis urbano de tranquilidad con diseño minimalista japonés y vistas panorámicas.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Banyan Tree Mayakoba',
                direccion: {
                    calle: 'Carretera Federal Chetumal - Puerto Juárez Km 298',
                    ciudad: 'Playa del Carmen',
                    pais: 'México',
                    coordenadas: { type: 'Point', coordinates: [-87.0073, 20.7737] }
                },
                descripcion: 'Resort de lujo en la Riviera Maya con villas privadas y acceso directo a la playa.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Burj Al Arab',
                direccion: {
                    calle: 'Jumeirah Street',
                    ciudad: 'Dubái',
                    pais: 'Emiratos Árabes Unidos',
                    coordenadas: { type: 'Point', coordinates: [55.1854, 25.1412] }
                },
                descripcion: 'Hotel icónico en forma de vela, símbolo del lujo y la opulencia de Dubái.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Singita Kruger National Park',
                direccion: {
                    calle: 'Kruger National Park',
                    ciudad: 'Mpumalanga',
                    pais: 'Sudáfrica',
                    coordenadas: { type: 'Point', coordinates: [31.5486, -24.0094] }
                },
                descripcion: 'Lodge de safari de lujo en el corazón del Parque Nacional Kruger.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Hotel Arts Barcelona',
                direccion: {
                    calle: 'Carrer de la Marina 19-21',
                    ciudad: 'Barcelona',
                    pais: 'España',
                    coordenadas: { type: 'Point', coordinates: [2.1969, 41.3874] }
                },
                descripcion: 'Hotel contemporáneo frente al mar con arte moderno y gastronomía excepcional.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Belmond Copacabana Palace',
                direccion: {
                    calle: 'Avenida Atlântica 1702',
                    ciudad: 'Río de Janeiro',
                    pais: 'Brasil',
                    coordenadas: { type: 'Point', coordinates: [-43.1775, -22.9668] }
                },
                descripcion: 'Palacio art déco frente a la playa de Copacabana, ícono de la hospitalidad brasileña.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Marina Bay Sands',
                direccion: {
                    calle: '10 Bayfront Avenue',
                    ciudad: 'Singapur',
                    pais: 'Singapur',
                    coordenadas: { type: 'Point', coordinates: [103.8598, 1.2834] }
                },
                descripcion: 'Complejo integrado con hotel, casino y la piscina infinita más famosa del mundo.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Hostal La Buena Vida',
                direccion: {
                    calle: 'Calle Mayor 45',
                    ciudad: 'Madrid',
                    pais: 'España',
                    coordenadas: { type: 'Point', coordinates: [-3.7038, 40.4168] }
                },
                descripcion: 'Hostal acogedor en el centro de Madrid, perfecto para viajeros con presupuesto ajustado.',
                estrellas: 3,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Boutique Hotel Casa del Poeta',
                direccion: {
                    calle: 'Calle Sierpes 89',
                    ciudad: 'Sevilla',
                    pais: 'España',
                    coordenadas: { type: 'Point', coordinates: [-5.9925, 37.3891] }
                },
                descripcion: 'Hotel boutique en edificio histórico del siglo XVIII con patio andaluz.',
                estrellas: 4,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'The Sukhothai Bangkok',
                direccion: {
                    calle: '13/3 South Sathorn Road',
                    ciudad: 'Bangkok',
                    pais: 'Tailandia',
                    coordenadas: { type: 'Point', coordinates: [100.5352, 13.7248] }
                },
                descripcion: 'Hotel de lujo inspirado en la arquitectura tailandesa tradicional con jardines tropicales.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Park Hyatt Sydney',
                direccion: {
                    calle: '7 Hickson Road',
                    ciudad: 'Sídney',
                    pais: 'Australia',
                    coordenadas: { type: 'Point', coordinates: [151.2093, -33.8688] }
                },
                descripcion: 'Hotel de lujo con vistas icónicas a la Ópera de Sídney y el Harbour Bridge.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Alila Villas Uluwatu',
                direccion: {
                    calle: 'Jalan Belimbing Sari',
                    ciudad: 'Bali',
                    pais: 'Indonesia',
                    coordenadas: { type: 'Point', coordinates: [115.0861, -8.8295] }
                },
                descripcion: 'Villas de lujo en acantilado con vistas al Océano Índico y diseño contemporáneo.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Hotel Explora Patagonia',
                direccion: {
                    calle: 'Salto Chico s/n',
                    ciudad: 'Torres del Paine',
                    pais: 'Chile',
                    coordenadas: { type: 'Point', coordinates: [-72.9611, -51.1456] }
                },
                descripcion: 'Lodge de exploración en el Parque Nacional Torres del Paine con excursiones guiadas.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Atlantis The Palm',
                direccion: {
                    calle: 'Crescent Road',
                    ciudad: 'Dubái',
                    pais: 'Emiratos Árabes Unidos',
                    coordenadas: { type: 'Point', coordinates: [55.1167, 25.1304] }
                },
                descripcion: 'Resort familiar en Palm Jumeirah con parque acuático y acuario.',
                estrellas: 5,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                nombre: 'Hostel Nomad',
                direccion: {
                    calle: 'Avenida Libertador 2345',
                    ciudad: 'Buenos Aires',
                    pais: 'Argentina',
                    coordenadas: { type: 'Point', coordinates: [-58.3816, -34.6037] }
                },
                descripcion: 'Hostal moderno para mochileros con ambiente social y actividades grupales.',
                estrellas: 3,
                imagenes_url: [
                    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
                ]
            }
        ];

        const hotels = await Hotel.create(hotelsData);

        // Usuarios siguiendo hoteles
        users[0].following_hotels = [hotels[0]._id, hotels[1]._id, hotels[4]._id];
        users[0].following_hotels_count = 3;
        users[1].following_hotels = [hotels[7]._id, hotels[11]._id];
        users[1].following_hotels_count = 2;
        users[2].following_hotels = [hotels[2]._id, hotels[3]._id];
        users[2].following_hotels_count = 2;
        users[4].following_hotels = [hotels[4]._id, hotels[14]._id];
        users[4].following_hotels_count = 2;

        await Promise.all(users.map(u => u.save()));

        const postsData = [
            // Posts para Hotel Ritz Paris
            {
                user_id: users[10]._id,
                hotel_id: hotels[0]._id,
                contenido: 'Una experiencia inolvidable en el Ritz. El servicio es impecable y las habitaciones son un sueño. El desayuno en la terraza con vista a Place Vendôme es simplemente mágico. ¡Totalmente recomendado para una ocasión especial!',
                rating: 5,
                likes: [users[0]._id, users[1]._id, users[2]._id, users[8]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
                comments: [
                    {
                        user_id: users[0]._id,
                        user_info: { username: users[0].username, imagen_perfil_url: users[0].imagen_perfil_url },
                        contenido: '¡Qué envidia! Siempre he querido hospedarme ahí. ¿Cuánto tiempo estuviste?',
                        fecha_creacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                    },
                    {
                        user_id: users[10]._id,
                        user_info: { username: users[10].username, imagen_perfil_url: users[10].imagen_perfil_url },
                        contenido: 'Estuvimos 3 noches para nuestro aniversario. Valió cada euro.',
                        fecha_creacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                    }
                ],
                fecha_creacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[8]._id,
                hotel_id: hotels[0]._id,
                contenido: 'Hermoso hotel con historia en cada rincón. El bar Hemingway es una joya. Aunque el precio es elevado, la experiencia lo justifica. El personal te hace sentir como realeza.',
                rating: 5,
                likes: [users[10]._id, users[1]._id],
                fecha_creacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            },

            // Posts para The Plaza Hotel
            {
                user_id: users[0]._id,
                hotel_id: hotels[1]._id,
                contenido: 'Icónico hotel de Nueva York. La ubicación es perfecta, justo frente a Central Park. Las habitaciones son elegantes aunque un poco anticuadas. El servicio es excelente y el lobby es impresionante.',
                rating: 4,
                likes: [users[1]._id, users[3]._id, users[7]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=800&q=80'],
                comments: [
                    {
                        user_id: users[7]._id,
                        user_info: { username: users[7].username, imagen_perfil_url: users[7].imagen_perfil_url },
                        contenido: 'Me hospedé ahí en un viaje de negocios. Muy conveniente para reuniones en Manhattan.',
                        fecha_creacion: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                    }
                ],
                fecha_creacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            },

            // Posts para Belmond Hotel Caruso
            {
                user_id: users[2]._id,
                hotel_id: hotels[2]._id,
                contenido: 'Probablemente el hotel más romántico en el que he estado. Las vistas desde la piscina infinita son de otro mundo. Perfecto para luna de miel o aniversario. La Costa Amalfitana desde aquí es espectacular.',
                rating: 5,
                likes: [users[0]._id, users[10]._id, users[8]._id, users[4]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'],
                fecha_creacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
            },

            // Posts para Aman Tokyo
            {
                user_id: users[2]._id,
                hotel_id: hotels[3]._id,
                contenido: 'Oasis de tranquilidad en medio del caos de Tokio. El diseño minimalista japonés es perfecto. El spa es increíble y las vistas desde la habitación te dejan sin palabras. Un poco caro pero vale la pena.',
                rating: 5,
                likes: [users[0]._id, users[1]._id, users[8]._id],
                fecha_creacion: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[7]._id,
                hotel_id: hotels[3]._id,
                contenido: 'Excelente para viajes de negocios. Las habitaciones son espaciosas y el servicio es discreto pero atento. El desayuno japonés es auténtico y delicioso.',
                rating: 5,
                likes: [users[2]._id],
                fecha_creacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },

            // Posts para Banyan Tree Mayakoba
            {
                user_id: users[4]._id,
                hotel_id: hotels[4]._id,
                contenido: 'Paraíso en la Riviera Maya. Las villas privadas con piscina son un sueño. La playa es hermosa y el servicio es de primera. Perfecto para desconectar del mundo. ¡Ya quiero volver!',
                rating: 5,
                likes: [users[0]._id, users[1]._id, users[3]._id, users[5]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
                comments: [
                    {
                        user_id: users[0]._id,
                        user_info: { username: users[0].username, imagen_perfil_url: users[0].imagen_perfil_url },
                        contenido: '¿Hiciste alguna excursión desde ahí? Estoy planeando ir pronto.',
                        fecha_creacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
                    },
                    {
                        user_id: users[4]._id,
                        user_info: { username: users[4].username, imagen_perfil_url: users[4].imagen_perfil_url },
                        contenido: 'Sí, fuimos a Tulum y Chichén Itzá. El hotel organiza todo muy bien.',
                        fecha_creacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                    }
                ],
                fecha_creacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[11]._id,
                hotel_id: hotels[4]._id,
                contenido: 'Excelente para familias. Los niños disfrutaron mucho la playa y las actividades. El personal es muy amable con los pequeños. Las habitaciones son amplias y cómodas.',
                rating: 5,
                likes: [users[4]._id],
                fecha_creacion: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
            },

            // Posts para Burj Al Arab
            {
                user_id: users[3]._id,
                hotel_id: hotels[5]._id,
                contenido: 'El epítome del lujo. Desde el momento en que llegas en Rolls Royce hasta el mayordomo personal, todo es extraordinario. Las suites son enormes y opulentas. Una experiencia única en la vida.',
                rating: 5,
                likes: [users[0]._id, users[1]._id, users[2]._id, users[8]._id, users[10]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
                comments: [
                    {
                        user_id: users[1]._id,
                        user_info: { username: users[1].username, imagen_perfil_url: users[1].imagen_perfil_url },
                        contenido: '¡Increíble! ¿Cuál es el mejor restaurante del hotel?',
                        fecha_creacion: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
                    }
                ],
                fecha_creacion: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
            },

            // Posts para Hotel Arts Barcelona
            {
                user_id: users[1]._id,
                hotel_id: hotels[7]._id,
                contenido: 'Hotel moderno con excelente ubicación frente al mar. Las vistas desde la habitación son espectaculares. El restaurante con estrella Michelin es impresionante. Perfecto para combinar playa y ciudad.',
                rating: 5,
                likes: [users[0]._id, users[2]._id, users[6]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'],
                fecha_creacion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[6]._id,
                hotel_id: hotels[7]._id,
                contenido: 'El desayuno buffet es uno de los mejores que he probado. Variedad increíble y calidad excepcional. La piscina en la planta 43 es genial. Muy recomendado.',
                rating: 5,
                likes: [users[1]._id, users[0]._id],
                fecha_creacion: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
            },

            // Posts para Marina Bay Sands
            {
                user_id: users[0]._id,
                hotel_id: hotels[9]._id,
                contenido: 'La piscina infinita en el piso 57 es tan impresionante como en las fotos. Las vistas de Singapur son increíbles. El hotel es enorme con casino, tiendas y restaurantes. Una experiencia única.',
                rating: 5,
                likes: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'],
                comments: [
                    {
                        user_id: users[2]._id,
                        user_info: { username: users[2].username, imagen_perfil_url: users[2].imagen_perfil_url },
                        contenido: '¿Vale la pena pagar extra por habitación con vista a la bahía?',
                        fecha_creacion: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
                    },
                    {
                        user_id: users[0]._id,
                        user_info: { username: users[0].username, imagen_perfil_url: users[0].imagen_perfil_url },
                        contenido: '¡Definitivamente! Las vistas nocturnas son espectaculares.',
                        fecha_creacion: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
                    }
                ],
                fecha_creacion: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000)
            },

            // Posts para Hostal La Buena Vida
            {
                user_id: users[5]._id,
                hotel_id: hotels[10]._id,
                contenido: 'Excelente relación calidad-precio en el centro de Madrid. Las habitaciones son pequeñas pero limpias. El personal es muy amable y te dan buenos consejos para recorrer la ciudad. Perfecto para mochileros.',
                rating: 4,
                likes: [users[9]._id],
                fecha_creacion: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[9]._id,
                hotel_id: hotels[10]._id,
                contenido: 'Buen hostal para presupuesto ajustado. La ubicación es perfecta para visitar los principales sitios turísticos a pie. El wifi funciona bien. Recomendado para viajeros jóvenes.',
                rating: 4,
                likes: [users[5]._id],
                fecha_creacion: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
            },

            // Posts para Boutique Hotel Casa del Poeta
            {
                user_id: users[8]._id,
                hotel_id: hotels[11]._id,
                contenido: 'Joya escondida en Sevilla. El edificio histórico está bellamente restaurado. El patio andaluz es precioso y perfecto para relajarse. Las habitaciones tienen mucho carácter. Muy romántico.',
                rating: 5,
                likes: [users[10]._id, users[2]._id],
                fecha_creacion: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000)
            },

            // Posts para The Sukhothai Bangkok
            {
                user_id: users[1]._id,
                hotel_id: hotels[12]._id,
                contenido: 'Hotel elegante con arquitectura tailandesa tradicional. Los jardines son hermosos y el spa es excepcional. La comida tailandesa del restaurante es auténtica y deliciosa. Muy recomendado.',
                rating: 5,
                likes: [users[0]._id, users[6]._id],
                fecha_creacion: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
            },

            // Posts para Park Hyatt Sydney
            {
                user_id: users[0]._id,
                hotel_id: hotels[13]._id,
                contenido: 'Despertar con vistas a la Ópera de Sídney no tiene precio. El hotel es elegante y moderno. El servicio es impecable y la ubicación es perfecta para explorar The Rocks y Circular Quay.',
                rating: 5,
                likes: [users[1]._id, users[2]._id, users[7]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'],
                fecha_creacion: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000)
            },

            // Posts para Alila Villas Uluwatu
            {
                user_id: users[4]._id,
                hotel_id: hotels[14]._id,
                contenido: 'Villas espectaculares en acantilado con vistas al océano. La piscina privada es increíble. El diseño es moderno y minimalista. Perfecto para luna de miel. El atardecer desde aquí es mágico.',
                rating: 5,
                likes: [users[0]._id, users[2]._id, users[10]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'],
                comments: [
                    {
                        user_id: users[10]._id,
                        user_info: { username: users[10].username, imagen_perfil_url: users[10].imagen_perfil_url },
                        contenido: '¡Añadido a mi lista de deseos! ¿Cuántas noches recomendarías?',
                        fecha_creacion: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000)
                    }
                ],
                fecha_creacion: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[2]._id,
                hotel_id: hotels[14]._id,
                contenido: 'Uno de los mejores hoteles en los que me he hospedado. El servicio es excepcional, muy atento pero discreto. Las villas son amplias y lujosas. El spa con vista al mar es increíble.',
                rating: 5,
                likes: [users[4]._id, users[0]._id],
                fecha_creacion: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000)
            },

            // Posts para Hotel Explora Patagonia
            {
                user_id: users[9]._id,
                hotel_id: hotels[15]._id,
                contenido: 'Experiencia única en Torres del Paine. Las excursiones guiadas son excelentes y los guías muy conocedores. El lodge es cómodo y la comida es sorprendentemente buena. Paisajes increíbles.',
                rating: 5,
                likes: [users[0]._id, users[5]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'],
                fecha_creacion: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000)
            },

            // Posts para Atlantis The Palm
            {
                user_id: users[11]._id,
                hotel_id: hotels[16]._id,
                contenido: 'Perfecto para familias con niños. El parque acuático Aquaventure es fantástico y el acuario es impresionante. Las habitaciones son amplias. Los niños no querían irse. Muy recomendado para familias.',
                rating: 5,
                likes: [users[3]._id, users[4]._id],
                fecha_creacion: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[3]._id,
                hotel_id: hotels[16]._id,
                contenido: 'Resort enorme con muchas opciones de restaurantes. El buffet Kaleidoscope es excelente. Las instalaciones son de primera. Aunque es muy turístico, la experiencia vale la pena.',
                rating: 4,
                likes: [users[11]._id],
                fecha_creacion: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000)
            },

            // Posts para Hostel Nomad
            {
                user_id: users[5]._id,
                hotel_id: hotels[17]._id,
                contenido: 'Hostel con muy buen ambiente. Conocí a muchos viajeros interesantes. Las actividades grupales están bien organizadas. Las habitaciones compartidas son limpias. Buena opción para mochileros en Buenos Aires.',
                rating: 4,
                likes: [users[9]._id],
                fecha_creacion: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[9]._id,
                hotel_id: hotels[17]._id,
                contenido: 'Ambiente social genial. El personal organiza asados y salidas nocturnas. La cocina compartida está bien equipada. Ubicación céntrica. Perfecto para conocer gente.',
                rating: 4,
                likes: [users[5]._id],
                fecha_creacion: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            },

            // Posts adicionales para variedad
            {
                user_id: users[7]._id,
                hotel_id: hotels[1]._id,
                contenido: 'Excelente para viajes de negocios. Las salas de reuniones están bien equipadas. El servicio de habitaciones es rápido. Ubicación perfecta en Midtown Manhattan.',
                rating: 5,
                likes: [users[0]._id],
                fecha_creacion: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[6]._id,
                hotel_id: hotels[12]._id,
                contenido: 'El desayuno es espectacular. Variedad increíble de comida tailandesa e internacional. El servicio es muy atento. Las habitaciones son espaciosas y elegantes.',
                rating: 5,
                likes: [users[1]._id],
                fecha_creacion: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[10]._id,
                hotel_id: hotels[2]._id,
                contenido: 'Escapada romántica perfecta. Cenamos en la terraza con vistas al mar. El servicio es excepcional y muy personalizado. Cada detalle está cuidado. Volveremos seguro.',
                rating: 5,
                likes: [users[8]._id, users[2]._id],
                fecha_creacion: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[1]._id,
                hotel_id: hotels[5]._id,
                contenido: 'El restaurante Al Mahara bajo el mar es una experiencia única. La comida es excelente y el ambiente es mágico. Aunque es caro, vale la pena para una ocasión especial.',
                rating: 5,
                likes: [users[3]._id, users[6]._id],
                fecha_creacion: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[8]._id,
                hotel_id: hotels[13]._id,
                contenido: 'La ubicación es inmejorable. Puedes caminar a la Ópera, al Jardín Botánico y a muchos restaurantes. El personal es muy profesional. Habitaciones cómodas con vistas increíbles.',
                rating: 5,
                likes: [users[0]._id],
                fecha_creacion: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[3]._id,
                hotel_id: hotels[9]._id,
                contenido: 'El casino es enorme y las tiendas de lujo son impresionantes. El hotel tiene de todo. Puedes pasar días sin salir. La ubicación es central para explorar Singapur.',
                rating: 4,
                likes: [users[0]._id, users[1]._id],
                fecha_creacion: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[4]._id,
                hotel_id: hotels[8]._id,
                contenido: 'Hotel clásico con mucha historia. La piscina es hermosa y la playa de Copacabana está justo enfrente. El servicio es excelente. Perfecto para disfrutar de Río con estilo.',
                rating: 5,
                likes: [users[0]._id, users[2]._id],
                imagenes_url: ['https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80'],
                fecha_creacion: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[6]._id,
                hotel_id: hotels[0]._id,
                contenido: 'El afternoon tea en el Ritz es una experiencia que no te puedes perder. Elegante, delicioso y con un servicio impecable. Reserva con anticipación.',
                rating: 5,
                likes: [users[8]._id, users[10]._id],
                fecha_creacion: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[2]._id,
                hotel_id: hotels[7]._id,
                contenido: 'La playa de la Barceloneta está a pocos pasos. El hotel tiene acceso directo. Las instalaciones del spa son excelentes. Muy recomendado para combinar ciudad y playa.',
                rating: 5,
                likes: [users[1]._id],
                fecha_creacion: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000)
            },
            {
                user_id: users[5]._id,
                hotel_id: hotels[10]._id,
                contenido: 'El desayuno es básico pero suficiente. La ubicación cerca de Sol es perfecta. Buen punto de partida para explorar Madrid sin gastar mucho. Recomendado para viajeros con presupuesto.',
                rating: 4,
                likes: [],
                fecha_creacion: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000)
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

        res.json({
            success: true,
            message: 'Database seeded successfully',
            stats: {
                users: users.length,
                hotels: hotels.length,
                posts: postsData.length
            }
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding database',
            error: error.message
        });
    }
};

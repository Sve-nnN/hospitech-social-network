import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

// Crear Post (Complejo: Denormalización + Actualización de Promedio)
export const createPost = async (req, res) => {
  try {
    const { contenido, rating, hotel_id } = req.body;
    const user_id = req.userId || req.body.user_id;

    // Validar IDs
    if (!mongoose.isValidObjectId(user_id) || !mongoose.isValidObjectId(hotel_id)) {
      return res.status(400).json({ msg: 'user_id o hotel_id inválido' });
    }

    // 1. Buscar datos actuales del usuario y hotel para denormalizar (copiar)
    const user = await User.findById(user_id);
    const hotel = await Hotel.findById(hotel_id);

    if (!user || !hotel) return res.status(404).json({ msg: "User o Hotel no encontrado" });

    // 2. Crear el Post con los datos copiados
    const newPost = await Post.create({
      contenido,
      rating,
      user_id,
      hotel_id,
      user_info: {
        username: user.username,
        imagen_perfil_url: user.imagen_perfil_url
      },
      hotel_info: {
        nombre: hotel.nombre,
        ciudad: hotel.direccion.ciudad
      }
    });

    // 3. Recalcular el Rating del Hotel (Lógica clave)
    await actualizarRatingHotel(hotel_id);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función auxiliar para recalcular promedio
const actualizarRatingHotel = async (hotelId) => {
  if (!mongoose.isValidObjectId(hotelId)) return;
  // Usamos MongoDB Aggregation para calcular el promedio real
  const stats = await Post.aggregate([
    { $match: { hotel_id: new mongoose.Types.ObjectId(hotelId) } },
    {
      $group: {
        _id: '$hotel_id',
        nReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      num_reviews: stats[0].nReviews,
      avg_rating: stats[0].avgRating
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, rating } = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });

    const beforeRating = post.rating;
    if (contenido !== undefined) post.contenido = contenido;
    if (rating !== undefined) post.rating = rating;
    await post.save();

    // Si cambió el rating, recalculamos el promedio del hotel
    if (rating !== undefined && rating !== beforeRating) {
      await actualizarRatingHotel(post.hotel_id);
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    const hotelId = post.hotel_id;
    await post.remove();
    // Recalcular rating del hotel
    await actualizarRatingHotel(hotelId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { actualizarRatingHotel };

// List posts (global feed / discovery) with pagination and filters
export const getPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.user_id && mongoose.isValidObjectId(req.query.user_id)) filter.user_id = req.query.user_id;
    if (req.query.hotel_id && mongoose.isValidObjectId(req.query.hotel_id)) filter.hotel_id = req.query.hotel_id;
    if (req.query.min_rating) filter.rating = { ...(filter.rating || {}), $gte: parseInt(req.query.min_rating, 10) };
    if (req.query.max_rating) filter.rating = { ...(filter.rating || {}), $lte: parseInt(req.query.max_rating, 10) };

    let sort = { fecha_creacion: -1 };
    if (req.query.sort) {
      // simple sort: '-fecha_creacion' or 'rating'
      const s = req.query.sort;
      if (s.startsWith('-')) sort = { [s.slice(1)]: -1 };
      else sort = { [s]: 1 };
    }

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter).sort(sort).skip(skip).limit(limit)
    ]);

    res.json({ page, limit, total, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List posts for a specific user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ msg: 'userId inválido' });
    // forward to getPosts logic with user_id filter
    req.query.user_id = userId;
    return getPosts(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * @fileoverview Post controller handling CRUD operations and social interactions
 * @author Juan Carlos Angulo
 * @module post.controller
 */

import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

/**
 * Creates a new post with denormalized user and hotel data
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.contenido - Post content
 * @param {number} req.body.rating - Hotel rating (1-5)
 * @param {string} req.body.hotel_id - Hotel ID
 * @param {string} [req.body.imagenes_url] - Optional image URLs
 * @param {string} req.userId - Authenticated user ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createPost = async (req, res) => {
  try {
    const { contenido, rating, hotel_id, imagenes_url } = req.body;
    const user_id = req.userId || req.body.user_id;

    if (!mongoose.isValidObjectId(user_id) || !mongoose.isValidObjectId(hotel_id)) {
      return res.status(400).json({ msg: 'user_id o hotel_id inválido' });
    }

    const user = await User.findById(user_id);
    const hotel = await Hotel.findById(hotel_id);

    if (!user || !hotel) return res.status(404).json({ msg: "User o Hotel no encontrado" });

    const newPost = await Post.create({
      contenido,
      rating,
      user_id,
      hotel_id,
      imagenes_url: imagenes_url || [],
      user_info: {
        username: user.username,
        imagen_perfil_url: user.imagen_perfil_url
      },
      hotel_info: {
        nombre: hotel.nombre,
        ciudad: hotel.direccion?.ciudad,
        slug: hotel.slug
      }
    });

    await actualizarRatingHotel(hotel_id);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Updates hotel average rating based on all posts
 * @param {string} hotelId - Hotel ID
 * @returns {Promise<void>}
 * @private
 */
export const actualizarRatingHotel = async (hotelId) => {
  const result = await Post.aggregate([
    { $match: { hotel_id: new mongoose.Types.ObjectId(hotelId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);
  const avgRating = result.length > 0 ? result[0].avgRating : 0;
  await Hotel.findByIdAndUpdate(hotelId, { rating: avgRating });
};

/**
 * Retrieves all posts with pagination
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ fecha_creacion: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a single post by ID
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all posts by a specific user
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - User ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getPostsByUser = async (req, res) => {
  try {
    console.log('[PostController] getPostsByUser:', req.params.userId);
    const posts = await Post.find({ user_id: req.params.userId })
      .sort({ fecha_creacion: -1 });
    console.log('[PostController] Found posts:', posts.length);
    res.json({ posts });
  } catch (error) {
    console.error('[PostController] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all posts for a specific hotel
 * @param {Object} req - Express request object
 * @param {string} req.params.hotelId - Hotel ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getPostsByHotel = async (req, res) => {
  try {
    console.log('[PostController] getPostsByHotel:', req.params.hotelId);
    const posts = await Post.find({ hotel_id: req.params.hotelId })
      .sort({ fecha_creacion: -1 });
    console.log('[PostController] Found posts:', posts.length);
    res.json({ posts });
  } catch (error) {
    console.error('[PostController] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates a post
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {Object} req.body - Updated post data
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Deletes a post
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
    res.json({ msg: 'Post eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Toggles like on a post
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {string} req.userId - Authenticated user ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Adds a comment to a post
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {Object} req.body - Comment data
 * @param {string} req.body.contenido - Comment content
 * @param {string} req.userId - Authenticated user ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { contenido } = req.body;

    console.log('[PostController] addComment:', { postId, userId, contenido });

    if (!contenido) return res.status(400).json({ msg: 'Contenido requerido' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });

    post.comments.push({
      user_id: userId,
      contenido,
      user_info: {
        username: user.username,
        imagen_perfil_url: user.imagen_perfil_url
      }
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Toggles share (repost) for a post by the authenticated user
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {string} req.userId - Authenticated user ID
 * @param {Object} res - Express response object
 */
export const sharePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post no encontrado' });

    const shareIndex = post.shares.indexOf(userId);
    if (shareIndex > -1) {
      post.shares.splice(shareIndex, 1);
    } else {
      post.shares.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export aliases para mantener compatibilidad con las rutas existentes
// Export aliases para mantener compatibilidad con las rutas existentes
export { getPostById as getPost, getAllPosts as getPosts, getPostsByUser as getUserPosts };


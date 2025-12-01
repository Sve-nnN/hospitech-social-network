import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import bcrypt from 'bcryptjs';

// Helper: try to resolve a user by ObjectId first, then fall back to username or email
const findUserFlexible = async (identifier) => {
  if (!identifier) return null;
  // if it's a valid ObjectId try findById
  if (mongoose.isValidObjectId(identifier)) {
    try {
      const u = await User.findById(identifier);
      if (u) return u;
    } catch (e) {
      // fall through to try username/email
    }
  }
  // fallback: try username or email
  return await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
};

// Crear Usuario
export const createUser = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    // if password provided, hash it
    if (payload.password) {
      payload.password = await new Promise((res, rej) => bcrypt.hash(payload.password, 10, (err, h) => err ? rej(err) : res(h)));
    }
    const user = await User.create(payload);
    res.status(201).json(user);
  } catch (error) {
    // delegate to global error handler for consistent formatting (e.g., E11000)
    next(error);
  }
};

// Obtener Feed (Posts de gente y hoteles que sigo)
export const getFeed = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;
    const user = await findUserFlexible(userId);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Lógica del Feed: Buscar posts donde el autor O el hotel estén en mis listas
    const posts = await Post.find({
      $or: [
        { user_id: { $in: user.following_users } },
        { hotel_id: { $in: user.following_hotels } }
      ]
    }).sort({ fecha_creacion: -1 }).limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seguir a un Usuario
export const followUser = async (req, res) => {
  try {
    const followerId = req.userId; // authenticated user
    const { targetId } = req.body; // target user to follow

    const user = await findUserFlexible(followerId);
    const target = await findUserFlexible(targetId);
    if (!user || !target) return res.status(404).json({ msg: 'Usuario origen o destino no encontrado' });

    // Si ya lo sigue, no hacemos nada
    if (user.following_users && user.following_users.some(id => id.toString() === target._id.toString())) {
      return res.status(200).json({ msg: 'Ya sigues a este usuario' });
    }

    // Añadir y actualizar contadores
    user.following_users.push(target._id);
    user.following_users_count = (user.following_users_count || 0) + 1;
    await user.save();

    // Añadir follower al array si no existe (mantenemos lista y contador)
    if (!target.followers) target.followers = [];
    if (!target.followers.some(id => id.toString() === followerId)) {
      target.followers.push(followerId);
      target.followers_count = (target.followers_count || 0) + 1;
    }
    await target.save();

    res.json({ msg: "Usuario seguido con éxito", user: target });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seguir a un Hotel
export const followHotel = async (req, res) => {
  try {
    const userId = req.userId;
    const { hotelId } = req.body;

    const user = await findUserFlexible(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    if (user.following_hotels && user.following_hotels.some(id => id.toString() === hotelId)) {
      return res.status(200).json({ msg: 'Ya sigues a este hotel' });
    }

    user.following_hotels.push(hotelId);
    user.following_hotels_count = (user.following_hotels_count || 0) + 1;
    await user.save();

    res.json({ msg: "Hotel seguido con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Public user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserFlexible(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by username (for friendly URLs)
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await findUserFlexible(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await new Promise((res, rej) => bcrypt.hash(updates.password, 10, (err, h) => err ? rej(err) : res(h)));
    }

    // resolve actual user document first to obtain _id if token used a username/email
    const resolved = await findUserFlexible(userId);
    if (!resolved) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const user = await User.findByIdAndUpdate(resolved._id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.userId;

    // resolve user (allow token to carry username/email)
    const resolved = await findUserFlexible(userId);
    if (!resolved) return res.status(404).json({ msg: 'Usuario no encontrado' });

    // Find posts by user to recalculate hotel ratings after deletion
    const posts = await Post.find({ user_id: resolved._id });
    const hotelIds = [...new Set(posts.map(p => p.hotel_id.toString()))];
    // Delete posts
    await Post.deleteMany({ user_id: resolved._id });

    // Delete user
    await User.findByIdAndDelete(resolved._id);

    // Recalculate ratings for affected hotels
    const { actualizarRatingHotel } = await import('./post.controller.js');
    for (const hid of hotelIds) {
      await actualizarRatingHotel(hid);
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
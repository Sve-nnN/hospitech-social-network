import mongoose from 'mongoose';
import Hotel from '../models/Hotel.js';
import Post from '../models/Post.js';

export const createHotel = async (req, res) => {
  try {
    console.log('[HotelController] createHotel body:', JSON.stringify(req.body));
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    console.error('[HotelController] createHotel error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    console.log('[HotelController] getHotel searching for ID:', id);
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        console.log('[HotelController] Hotel not found for ID:', id);
        return res.status(404).json({ msg: 'Hotel no encontrado' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHotelBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const hotel = await Hotel.findOne({ slug });
    if (!hotel) return res.status(404).json({ msg: 'Hotel no encontrado' });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHotelPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    const skip = (page - 1) * limit;
    const posts = await Post.find({ hotel_id: id }).sort({ fecha_creacion: -1 }).skip(skip).limit(limit);
    res.json({ page, limit, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    const updates = req.body;
    const hotel = await Hotel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ msg: 'Hotel no encontrado' });
    res.json(hotel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'id inválido' });
    // Remove hotel and its posts
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel no encontrado' });
    await Post.deleteMany({ hotel_id: id });
    await hotel.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHotels = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.city) filter['direccion.ciudad'] = req.query.city;
    if (req.query.country) filter['direccion.pais'] = req.query.country;
    if (req.query.min_rating) filter.avg_rating = { $gte: parseFloat(req.query.min_rating) };

    const [total, hotels] = await Promise.all([
      Hotel.countDocuments(filter),
      Hotel.find(filter).sort({ avg_rating: -1 }).skip(skip).limit(limit)
    ]);

    res.json({ page, limit, total, hotels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
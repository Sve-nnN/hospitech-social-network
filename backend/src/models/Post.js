import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  contenido: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },

  // Referencias
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },

  // Social Features
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user_info: {
      username: String,
      imagen_perfil_url: String
    },
    contenido: { type: String, required: true },
    imagen_url: { type: String }, // Optional image in comment
    fecha_creacion: { type: Date, default: Date.now }
  }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  original_post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null }, // For reposts

  // Denormalización (Copias de datos)
  user_info: {
    username: String,
    imagen_perfil_url: String
  },
  hotel_info: {
    nombre: String,
    ciudad: String
  }
}, { timestamps: { createdAt: 'fecha_creacion', updatedAt: true } });

// Índices útiles para agregaciones/consultas por hotel o usuario
postSchema.index({ hotel_id: 1, fecha_creacion: -1 });
postSchema.index({ user_id: 1, fecha_creacion: -1 });

export default mongoose.model('Post', postSchema);
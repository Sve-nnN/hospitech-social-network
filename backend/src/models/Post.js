import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  contenido: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },

  // Referencias
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },

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
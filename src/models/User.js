import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /.+@.+\..+/ },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  password: { type: String, select: false },
  imagen_perfil_url: { type: String, default: 'https://via.placeholder.com/150' },
  biografia: { type: String, default: '' },
  direccion: { ciudad: String, pais: String },

  // Relaciones
  following_users: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  following_hotels: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }], default: [] },
  followers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },

  // Contadores (derivables, pero útiles para consultas rápidas)
  following_users_count: { type: Number, default: 0 },
  following_hotels_count: { type: Number, default: 0 },
  followers_count: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes para consultas comunes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Remove password field from JSON output
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model('User', userSchema);
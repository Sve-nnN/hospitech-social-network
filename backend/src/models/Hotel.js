import mongoose from 'mongoose';

const geoPoint = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: [0, 0] } // [long, lat]
};

const hotelSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true },
  direccion: {
    calle: { type: String, default: '' },
    ciudad: { type: String, required: true, trim: true },
    pais: { type: String, required: true, trim: true },
    coordenadas: { ...geoPoint }
  },
  imagenes_url: { type: [String], default: [] },
  descripcion: { type: String, default: '' },
  estrellas: { type: Number, default: 0 },
  
  // Datos calculados
  avg_rating: { type: Number, default: 0 },
  num_reviews: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug from nombre before saving
hotelSchema.pre('save', function(next) {
  if (this.isModified('nombre') && !this.slug) {
    const baseSlug = this.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

hotelSchema.index({ 'direccion.coordenadas': '2dsphere' });
hotelSchema.index({ nombre: 1 });
hotelSchema.index({ slug: 1 });

export default mongoose.model('Hotel', hotelSchema);
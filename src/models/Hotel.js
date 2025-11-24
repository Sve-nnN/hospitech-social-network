import mongoose from 'mongoose';

const geoPoint = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: [0, 0] } // [long, lat]
};

const hotelSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  direccion: {
    calle: { type: String, default: '' },
    ciudad: { type: String, required: true, trim: true },
    pais: { type: String, required: true, trim: true },
    coordenadas: { ...geoPoint }
  },
  imagenes_url: { type: [String], default: [] },
  
  // Datos calculados
  avg_rating: { type: Number, default: 0 },
  num_reviews: { type: Number, default: 0 }
}, { timestamps: true });

hotelSchema.index({ 'direccion.coordenadas': '2dsphere' });
hotelSchema.index({ nombre: 1 });

export default mongoose.model('Hotel', hotelSchema);
import mongoose from 'mongoose';

const avanceSchema = new mongoose.Schema({
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  porcentajeAvance: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Avance = mongoose.model('Avance', avanceSchema);

export default Avance;

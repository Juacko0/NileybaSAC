import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'proyecto', required: false },
  tipo: {
    type: String,
    enum: ['Ingreso', 'Gasto'],
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: [0, 'El monto debe ser un valor positivo']
  },
  fecha: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  notas: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Factura', FacturaSchema, 'facturacion_db');

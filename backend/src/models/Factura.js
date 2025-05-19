import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: false },
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
  estado: {
    type: String,
    enum: ['pendiente', 'pagada', 'cancelada'],
    default: 'pendiente'
  },
  formaPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    required: true
  },
  numeroDocumento: {
    type: String,
    required: false
  },
  rucDni: {
    type: String,
    required: false
  },
  clienteProveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona', // Puedes cambiarlo a 'Cliente', 'Proveedor' o ambos si tienes una colección separada
    required: false
  },
  categoria: {
    type: String,
    required: false
  },
  periodoContable: {
    type: String, // formato "YYYY-MM"
    required: false
  },
  archivosAdjuntos: [{
    type: String // URLs o rutas a archivos
  }],
  usuarioResponsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  notas: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Factura', FacturaSchema, 'facturacion_db');

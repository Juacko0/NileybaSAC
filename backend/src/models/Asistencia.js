// models/Asistencia.js
import mongoose from 'mongoose';

const EntregaEPPSubSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 1 },
  estado: { type: String, enum: ['nuevo', 'usado', 'reemplazado'], default: 'nuevo' }
});

const AsistenciaSchema = new mongoose.Schema({
  idEmpleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  presente: {
    type: Boolean,
    required: true
  },
  observacion: {
    type: String,
    trim: true,
    default: ''
  },
  entregasEPP: {
    entregado: { type: Boolean, default: false }, // si se entregó o no
    items: [EntregaEPPSubSchema] // lista de EPP entregados ese día
  }
}, {
  timestamps: true
});

export default mongoose.model('Asistencia', AsistenciaSchema, 'asistencias_db');

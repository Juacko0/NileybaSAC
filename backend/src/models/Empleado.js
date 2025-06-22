import mongoose from "mongoose";

const AsistenciaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['Presente', 'Ausente', 'Tarde'],
    required: true
  }
}, { _id: false });

const EmpleadoSchema = new mongoose.Schema({
  dni: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{8}$/,
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String
  },
  rol: {
    type: String,
    enum: ['Operativo', 'Supervisor', 'Gerente', 'Jefe de Área', 'Ayudante'],
    required: true
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Proyecto',
    trim: true
  },
  fechaIngreso: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Suspendido'],
    default: 'Activo'
  },
  asistencia: {
    type: [AsistenciaSchema],
    default: []
  },
  implementos: {
    type: [String], // Para mostrar visualmente en el frontend
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt automáticamente
EmpleadoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Empleado', EmpleadoSchema, 'gestor_empleados_db');

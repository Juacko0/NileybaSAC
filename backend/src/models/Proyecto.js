import mongoose from "mongoose";

const TareaSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    estado: {
        type: String,
        enum: ['pendiente', 'en progreso', 'completada'],
        default: 'pendiente'
    }
});

const ProyectoSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    descripcion: String,
    fechaInicio: Date,
    fechaFin: {
        type: Date,
        validate: {
          validator: function (value) {
            // Solo validar si ambas fechas están definidas
            return !this.fechaInicio || !value || value >= this.fechaInicio;
          },
          message: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        }
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en progreso', 'completado'],
        default: 'pendiente'
    },
    tareas: [TareaSchema],
    empleadosAsignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' }],
    progreso: Number,
    presupuesto: Number
}, { timestamps: true });

export default mongoose.model('Proyecto', ProyectoSchema, 'gestor_proyectos_db');

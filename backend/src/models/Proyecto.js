import mongoose from "mongoose";

const TareaSchema = new mongoose.Schema({
    título: String,
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
    fechaFin: Date,
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

export default mongoose.model('Proyecto', ProyectoSchema);

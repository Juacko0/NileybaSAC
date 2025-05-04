import mongoose from 'mongoose';

const EntregaEPPSchema = new mongoose.Schema({
    idEmpleado: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Empleado', 
        require: true 
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
    type: Number,
    required: true,
    min: 1
    },
    fecha_entrega: {
    type: Date,
    default: Date.now
    },
    estado: {
    type: String,
    enum: ['nuevo', 'usado', 'reemplazado'],
    default: 'nuevo'
    },
    observaciones: {
    type: String,
    trim: true
    }
    }, {
    timestamps: true
    });

export default mongoose.model('EntregaEPP', EntregaEPPSchema, 'entregas_epp_db');
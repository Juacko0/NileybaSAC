import express from 'express';
import {
    crearEntrega,
    obtenerHistorial,
    actualizarEntrega,
    eliminarEntrega
} from '../controllers/epp.controller.js';
const router = express.Router();

// Crear entrega para un empleado específico
router.post('/:id', crearEntrega);

// Obtener historial de entregas de un empleado
router.get('/:id', obtenerHistorial);

// Actualizar entrega
router.put('/actualizar/:id', actualizarEntrega);

// Eliminar entrega
router.delete('/eliminar/:id', eliminarEntrega);

export default router;
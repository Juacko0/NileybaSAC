// routes/asistencia.router.js
import express from 'express';
import { registrarAsistencia, obtenerAsistencias, actualizarAsistencia, eliminarAsistencia } from '../controllers/asistencia.controller.js';

const router = express.Router();

// Registrar asistencia con opción de entrega EPP
router.post('/:id', registrarAsistencia);

// Opcional: obtener todas las asistencias de un empleado
router.get('/:id', obtenerAsistencias);

// Opcional: actualizar una asistencia por su ID
router.put('/actualizar/:id', actualizarAsistencia);

// Opcional: eliminar una asistencia por su ID
router.delete('/eliminar/:id', eliminarAsistencia);

export default router;

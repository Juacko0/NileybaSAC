// routes/asistencia.router.js
import express from 'express';
import { registrarAsistencia, obtenerAsistencias, actualizarAsistencia, eliminarAsistencia } from '../controllers/asistencia.controller.js';
import { filtrarAsistenciasPorProyectoYFecha, verificarAsistenciaRegistrada } from '../controllers/asistencia.controller.js';
const router = express.Router();

// Filtrar asistencias por proyecto y fecha
router.get('/filtrar', filtrarAsistenciasPorProyectoYFecha);

// Registrar asistencia con opción de entrega EPP
router.post('/:id', registrarAsistencia);

// Obtener todas las asistencias de un empleado
router.get('/:id', obtenerAsistencias);

// Actualizar una asistencia por su ID
router.put('/actualizar/:id', actualizarAsistencia);

// Eliminar una asistencia por su ID
router.delete('/eliminar/:id', eliminarAsistencia);

// Verificar asistencia
router.get('/registrada/:fecha', verificarAsistenciaRegistrada);


export default router;

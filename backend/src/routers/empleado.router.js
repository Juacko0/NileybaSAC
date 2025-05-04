import express from 'express';
import { 
    crearEmpleado, 
    obtenerEmpleados, 
    obtenerEmpleadoPorId, 
    actualizarEmpleado, 
    eliminarEmpleado } from '../controllers/empleado.controller.js';
const router = express.Router();

// CRUD de empleados
router.post('/', crearEmpleado);
router.get('/', obtenerEmpleados);
router.get('/:id', obtenerEmpleadoPorId);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

export default router;


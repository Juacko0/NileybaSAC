import express from 'express';
import {
    crearProyecto,
    listarProyectos,
    obtenerProyecto,
    actualizarProyecto,
    eliminarProyecto,
    agregarTarea,
    eliminarTarea,
    generarReporteProyecto,
    actualizarEstadoTarea,
    obtenerTareasProyecto,
    nombresProyectos
} from '../controllers/proyecto.controller.js';
const router = express.Router();

router.get('/nombres', nombresProyectos); // Obtener los nombres de todos los proyectos

// Rutas para los proyectos
router.post('/', crearProyecto); // Crear un nuevo proyecto
router.get('/', listarProyectos); // Listar todos los proyectos
router.get('/:id', obtenerProyecto); // Obtener un proyecto por ID
router.put('/:id', actualizarProyecto); // Actualizar un proyecto por ID
router.delete('/:id', eliminarProyecto); // Eliminar un proyecto por ID
router.get('/:id/reporte', generarReporteProyecto); // Generar un reporte de avance del proyecto


//Tareas dentro de proyectos
router.post('/:id/tareas', agregarTarea); // Agregar una tarea a un proyecto
router.delete('/:id/tareas/:tareaId', eliminarTarea); // Eliminar una tarea de un proyecto
router.put('/:idProyecto/tareas/:idTarea', actualizarEstadoTarea); // Actualizar el estado de una tarea dentro de un proyecto
router.get('/:id/tareas', obtenerTareasProyecto); // Obtener todas las tareas de un proyecto    


export default router;
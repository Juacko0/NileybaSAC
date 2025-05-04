import { Router } from 'express';
import { registrarAvance, obtenerAvancesProyecto } from '../controllers/avance.controller.js';

const router = Router();

// Registrar un nuevo avance
router.post('/', registrarAvance);

// Obtener todos los avances de un proyecto
router.get('/:idProyecto', obtenerAvancesProyecto);

export default router;

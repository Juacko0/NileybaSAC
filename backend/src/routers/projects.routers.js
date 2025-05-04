const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller'); // Asumiendo que tienes un controlador para proyectos

// Ruta para obtener todos los proyectos
router.get('/projects', ProjectController.getProjects);

module.exports = router;

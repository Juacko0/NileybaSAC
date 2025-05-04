const Project = require('../models/project.model');  // Suponiendo que tienes un modelo Project

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();  // Obtenemos todos los proyectos
    res.status(200).json(projects);          // Respondemos con los proyectos
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

module.exports = {
  getProjects,
};

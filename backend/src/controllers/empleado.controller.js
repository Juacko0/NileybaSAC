import Empleado from "../models/Empleado.js";

// Crear empleado
export const crearEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const guardado = await nuevoEmpleado.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los empleados
export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener empleado por ID
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const actualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const eliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.status(200).json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

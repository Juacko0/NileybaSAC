import Asistencia from '../models/Asistencia.js';
import Empleado from '../models/Empleado.js';

export const registrarAsistencia = async (req, res) => {
  try {
    const idEmpleado = req.params.id;

    // 1. Buscar al empleado por su ID
    const empleado = await Empleado.findById(idEmpleado);

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // 2. Crear asistencia incluyendo el proyecto del empleado
    const nuevaAsistencia = new Asistencia({
      idEmpleado: empleado._id,
      proyecto: empleado.proyecto, // Aquí se asocia automáticamente
      presente: req.body.presente,
      observacion: req.body.observacion,
      entregasEPP: req.body.entregasEPP
    });

    // 3. Guardar
    await nuevaAsistencia.save();

    res.status(201).json(nuevaAsistencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerAsistencias = async (req, res) => {
  try {
    console.log('Query recibida:', req.query);
    const asistencias = await Asistencia.find({ idEmpleado: req.params.id });
    res.status(200).json(asistencias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarAsistencia = async (req, res) => {
  try {
    const asistenciaActualizada = await Asistencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asistenciaActualizada) return res.status(404).json({ message: 'Asistencia no encontrada' });
    res.status(200).json(asistenciaActualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarAsistencia = async (req, res) => {
  try {
    const asistenciaEliminada = await Asistencia.findByIdAndDelete(req.params.id);
    if (!asistenciaEliminada) return res.status(404).json({ message: 'Asistencia no encontrada' });
    res.status(200).json({ message: 'Asistencia eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const filtrarAsistenciasPorProyectoYFecha = async (req, res) => {
  try {
    const { proyecto, desde, hasta } = req.query;

    // Validación básica
    if (!proyecto || !desde || !hasta) {
      return res.status(400).json({ mensaje: 'Se requiere proyecto, desde y hasta como parámetros' });
    }

    // Convertimos las fechas a objetos Date
    const fechaInicio = new Date(desde);
    const fechaFin = new Date(hasta);
    fechaFin.setHours(23, 59, 59, 999); // Para incluir todo el día final

    const asistencias = await Asistencia.find({
      proyecto,
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    })
    .populate('idEmpleado', 'nombre apellido rol') // Opcional: para mostrar info del empleado
    .populate('proyecto', 'nombre'); // Opcional: para mostrar nombre del proyecto

    res.status(200).json(asistencias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al filtrar asistencias' });
  }
};

export const verificarAsistenciaRegistrada = async (req, res) => {
  const { fecha } = req.params;
  try {
    const inicioDia = new Date(fecha);
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    const asistencias = await Asistencia.find({
      fecha: { $gte: inicioDia, $lte: finDia }
    });

    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
};

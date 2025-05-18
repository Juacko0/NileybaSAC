import Asistencia from '../models/Asistencia.js';

export const registrarAsistencia = async (req, res) => {
  try {
    // Se espera que en el body venga: presente, observacion, entregasEPP: { entregado, items }
    const nuevaAsistencia = new Asistencia({
      idEmpleado: req.params.id,
      ...req.body
    });
    await nuevaAsistencia.save();
    res.status(201).json(nuevaAsistencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerAsistencias = async (req, res) => {
  try {
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

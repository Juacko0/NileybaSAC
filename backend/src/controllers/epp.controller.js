import EntregaEPP from '../models/EntregaEPP.js';

export const crearEntrega = async (req, res) => {
  try {
    const nuevaEntrega = new EntregaEPP({
      idEmpleado: req.params.id,
      ...req.body
    });
    await nuevaEntrega.save();
    res.status(201).json(nuevaEntrega);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerHistorial = async (req, res) => {
  try {
    const entregas = await EntregaEPP.find({ idEmpleado: req.params.id });
    res.json(entregas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarEntrega = async (req, res) => {
  try {
    const actualizada = await EntregaEPP.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarEntrega = async (req, res) => {
  try {
    await EntregaEPP.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Registro eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

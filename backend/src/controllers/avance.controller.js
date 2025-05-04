import AvanceObra from '../models/avance.model.js';

export const registrarAvance = async (req, res) => {
    try {
        const nuevoAvance = new AvanceObra(req.body);
        await nuevoAvance.save();
        res.status(201).json(nuevoAvance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar avance' });
    }
};

export const obtenerAvancesProyecto = async (req, res) => {
    try {
        const { idProyecto } = req.params;
        const avances = await AvanceObra.find({ proyecto: idProyecto }).sort({ fecha: 1 });
        res.status(200).json(avances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener avances' });
    }
};

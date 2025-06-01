import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import Documento from '../models/documental.js';

let gfs;
const conn = mongoose.connection;

// Inicializar GridFS una vez que se abre la conexión
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); // misma colección que usas en multer-gridfs-storage
});

// Subida del archivo ya la maneja multer en las rutas, pero registramos el documento
export const registrarDocumento = async (req, res) => {
  try {
    const { proyecto, descripcion, categoria } = req.body;

    const nuevoDoc = new Documento({
      nombreArchivo: req.file.filename,
      tipo: req.file.mimetype.split('/')[1],
      proyecto,
      descripcion,
      categoria,
    });

    const docGuardado = await nuevoDoc.save();
    res.status(201).json(docGuardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el documento', detalles: error.message });
  }
};

// Obtener lista de documentos registrados
export const listarDocumentos = async (req, res) => {
  try {
    const documentos = await Documento.find().populate('proyecto').sort({ fechaSubida: -1 });
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener documentos', detalles: error.message });
  }
};

// Obtener archivo por nombre
export const obtenerArchivo = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
};

// Eliminar archivo y metadatos
export const eliminarDocumento = async (req, res) => {
  try {
    const filename = req.params.filename;

    // Eliminar archivo físico de GridFS
    gfs.remove({ filename, root: 'uploads' }, async (err) => {
      if (err) return res.status(500).json({ error: 'Error al eliminar archivo' });

      // Eliminar metadatos del documento
      await Documento.findOneAndDelete({ nombreArchivo: filename });
      res.json({ mensaje: 'Documento eliminado correctamente' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar documento', detalles: error.message });
  }
};

// Actualizar metadatos del documento
export const actualizarDocumento = async (req, res) => {
  try {
    const { descripcion, categoria, estado, version } = req.body;
    const docActualizado = await Documento.findOneAndUpdate(
      { nombreArchivo: req.params.filename },
      {
        descripcion,
        categoria,
        estado,
        version,
        ultimaModificacion: Date.now(),
      },
      { new: true }
    );

    if (!docActualizado) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json(docActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar documento', detalles: error.message });
  }
};

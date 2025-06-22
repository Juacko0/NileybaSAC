import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import Documento from '../models/documental.js';

let gfs;
let bucket;
const conn = mongoose.connection;


// Inicializar GridFS una vez que se abre la conexión
conn.once('open', () => {
  bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads', // Nombre del bucket que usas en multer-gridfs-storage
  });
  console.log('Conexión a GridFS establecida');
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
export const obtenerArchivo = async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Buscar el archivo en la colección 'uploads.files'
    const files = await conn.db.collection('uploads.files').find({ filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado en GridFS' });
    }

    const file = files[0];

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${file.filename}"`,
    });

    // Crear stream de lectura
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on('error', (error) => {
      console.error('Error al leer archivo desde GridFS:', error);
      res.status(500).json({ error: 'Error al leer archivo desde GridFS' });
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('Error general en obtenerArchivo:', error);
    res.status(500).json({ error: 'Error interno', detalles: error.message });
  }
};

// Eliminar archivo y metadatos
export const eliminarDocumento = async (req, res) => {
  try {
    const filename = req.params.filename;
    const files = await mongoose.connection.db.collection('uploads.files').find({ filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const fileId = files[0]._id;

    await bucket.delete(fileId);

    await Documento.findOneAndDelete({ nombreArchivo: filename });

    res.json({ mensaje: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
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
        categoria
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

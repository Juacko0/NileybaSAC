import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import {
  registrarDocumento,
  listarDocumentos,
  obtenerArchivo,
  eliminarDocumento,
  actualizarDocumento,
} from '../controllers/documental.controller.js';
const router = express.Router();

// 📦 Configurar almacenamiento con GridFS
const storage = new GridFsStorage({
  url: 'mongodb+srv://jdelacruzramos0:8Ge05jrLqVoqYtMW@nileyba.hnosixb.mongodb.net/', // Reemplaza con tu string de conexión real
  file: (req, file) => {
    return {
      filename: `${Date.now()}_${file.originalname}`,
      bucketName: 'uploads', // debe coincidir con gfs.collection()
    };
  },
});

const upload = multer({ storage });

router.post('/subir', upload.single('archivo'), registrarDocumento); // Subir un documento
router.get('/', listarDocumentos); // Obtener todos los documentos
router.get('/archivo/:filename', obtenerArchivo); // Obtener archivo por nombre
router.delete('/:filename', eliminarDocumento); // Eliminar archivo y metadatos
router.put('/:filename', actualizarDocumento); // Actualizar metadatos

export default router;

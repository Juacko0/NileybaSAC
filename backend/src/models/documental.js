import mongoose from 'mongoose';

const DocumentoSchema = new mongoose.Schema({
  nombreArchivo: String,
  tipo: String, // ej. 'pdf', 'docx', 'imagen', etc.
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' },

  descripcion: { type: String }, // Una breve descripción del contenido
  categoria: { type: String }, // ej. 'finanzas', 'legal', 'informes', 'contratos'
  estado: { type: String, enum: ['activo', 'archivado', 'eliminado'], default: 'activo' },

  version: { type: Number, default: 1 }, // control de versiones
  ultimaModificacion: { type: Date, default: Date.now },
  fechaSubida: { type: Date, default: Date.now },
});

export default mongoose.model('Documento', DocumentoSchema, 'documentos_db'); // 'documentos_db' es el nombre de la colección en MongoDB


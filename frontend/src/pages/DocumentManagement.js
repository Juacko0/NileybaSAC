import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Link
} from '@mui/material';
import {
  listarDocumentos,
  registrarDocumento,
  eliminarDocumento,
  obtenerArchivo
} from '../services/documentosServices';

const Documentacion = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [formulario, setFormulario] = useState({
    proyecto: '',
    descripcion: '',
    categoria: '',
    archivo: null
  });

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    try {
      const docs = await listarDocumentos();
      setDocumentos(docs);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
    }
  };

  const handleArchivoChange = (e) => {
    setFormulario({ ...formulario, archivo: e.target.files[0] });
  };

  const handleCrearDocumento = async () => {
    const { archivo, proyecto, descripcion, categoria } = formulario;
    if (!archivo || !proyecto) {
      alert("Archivo y proyecto son obligatorios.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('proyecto', proyecto);
      formData.append('descripcion', descripcion);
      formData.append('categoria', categoria);

      const nuevoDoc = await registrarDocumento(formData);
      setDocumentos([nuevoDoc, ...documentos]);
      setFormulario({ proyecto: '', descripcion: '', categoria: '', archivo: null });
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al crear documento:", error);
    }
  };

  const handleVisualizarArchivo = (filename) => {
  const url = `http://localhost:5000/api/documentos/archivo/${filename}`;
  window.open(url, '_blank');
};

  const handleEliminarDocumento = async (filename) => {
  console.log('Eliminar documento:', filename);
  if (!window.confirm("¿Seguro que quieres eliminar este documento?")) return;
  try {
    await eliminarDocumento(filename);
    setDocumentos(doc => doc.filter(d => d.nombreArchivo !== filename));
  } catch (error) {
    console.error("Error al eliminar documento:", error);
  }
};

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" mb={2}>Módulo Documental</Typography>
      <Button variant="contained" onClick={() => setModalAbierto(true)}>Agregar Documento</Button>

      <Grid container spacing={2} mt={1}>
        {documentos.map(doc => (
          <Grid item xs={12} md={6} key={doc._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{doc.nombreArchivo}</Typography>
              <Typography variant="body2"><strong>Proyecto:</strong> {doc.proyecto?.nombre || doc.proyecto}</Typography>
              <Typography variant="body2"><strong>Categoría:</strong> {doc.categoria}</Typography>
              {doc.descripcion && <Typography variant="body2"><strong>Descripción:</strong> {doc.descripcion}</Typography>}
              <Button size="small" sx={{ mt: 1, mr: 1 }} variant="outlined"
                onClick={() => handleVisualizarArchivo(doc.nombreArchivo)}>
                Visualizar
              </Button>
              <Button size="small" color="error" sx={{ mt: 1 }}
                onClick={() => handleEliminarDocumento(doc.nombreArchivo)}>
                Eliminar
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <DialogTitle>Nuevo Documento</DialogTitle>
        <DialogContent>
          <TextField
            label="Proyecto"
            fullWidth margin="dense"
            value={formulario.proyecto}
            onChange={e => setFormulario({ ...formulario, proyecto: e.target.value })}
          />
          <TextField
            label="Categoría"
            fullWidth margin="dense"
            value={formulario.categoria}
            onChange={e => setFormulario({ ...formulario, categoria: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth multiline margin="dense"
            value={formulario.descripcion}
            onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })}
          />
          <input
            type="file"
            accept="*/*"
            onChange={handleArchivoChange}
            style={{ marginTop: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearDocumento}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Documentacion;

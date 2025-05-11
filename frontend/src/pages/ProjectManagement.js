import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, TextField, Grid, List, ListItem, ListItemText } from '@mui/material';
import { obtenerProyectos, crearProyecto, eliminarProyecto, obtenerProyectoPorId, agregarTarea, eliminarTarea, actualizarProyecto } from '../services/proyectosServices'; 
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material'; // asegúrate de importar estos

const ProjectManagement = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
const [formularioProyecto, setFormularioProyecto] = useState({
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'pendiente',
  presupuesto: '',
  progreso: ''
});
  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState('');
  const [tareas, setTareas] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false); // Estado para controlar el modo de edición
  const [proyectoId, setProyectoId] = useState(null); // Estado para almacenar el ID del proyecto a editar  
  const [idProyectoEditando, setIdProyectoEditando] = useState(null);


  // Cargar proyectos cuando el componente se monta
  useEffect(() => {
    obtenerProyectos().then((data) => {
      setProyectos(data);
    }).catch(error => {
      console.error("Error al obtener los proyectos:", error);
    });
  }, []);

  // Función para crear un proyecto
  const handleCrearProyecto = async () => {
    if (!nuevoProyecto) return;
    try {
      const data = await crearProyecto({ nombre: nuevoProyecto });
      setProyectos((prevProyectos) => [...prevProyectos, data]);
      setNuevoProyecto('');
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
    }
  };

  const handleEditarProyecto = (proyecto) => {
    setFormularioProyecto({
      nombre: proyecto.nombre || '',
      descripcion: proyecto.descripcion || '',
      fechaInicio: proyecto.fechaInicio || '',
      fechaFin: proyecto.fechaFin || '',
      estado: proyecto.estado || 'pendiente',
      presupuesto: proyecto.presupuesto || '',
      progreso: proyecto.progreso || '',
    });
    setProyectoId(proyecto._id);
    setIdProyectoEditando(proyecto._id);
    setModoEdicion(true);
    setModalAbierto(true);
  };
  
  // Función para eliminar un proyecto
  const handleEliminarProyecto = async (id) => {
    try {
      await eliminarProyecto(id);
      setProyectos((prevProyectos) => prevProyectos.filter((proyecto) => proyecto._id !== id));
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  // Función para seleccionar un proyecto y cargar sus tareas
  const handleSeleccionarProyecto = async (id) => {
    try {
      const data = await obtenerProyectoPorId(id);
      setProyectoSeleccionado(data);
      setTareas(data.tareas); // Asumiendo que las tareas vienen en el proyecto
    } catch (error) {
      console.error("Error al obtener el proyecto:", error);
    }
  };

  // Función para agregar una tarea a un proyecto
  const handleAgregarTarea = async () => {
    if (!nuevaTarea || !proyectoSeleccionado) return;
    try {
      const tarea = await agregarTarea(proyectoSeleccionado._id, { descripcion: nuevaTarea });
      setTareas((prevTareas) => [...prevTareas, tarea]);
      setNuevaTarea('');
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // Función para eliminar una tarea
  const handleEliminarTarea = async (idTarea) => {
    try {
      await eliminarTarea(proyectoSeleccionado._id, idTarea);
      setTareas((prevTareas) => prevTareas.filter((tarea) => tarea._id !== idTarea));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: '20px', borderRadius: 2, backgroundColor: '#FFF', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Módulo de Gestión de Proyectos
      </Typography>

      <Button onClick={() => setModalAbierto(true)} color="primary" variant="contained" sx={{ marginTop: '10px' }}>
        Crear Proyecto
      </Button>

      {/* Lista de proyectos */}
      <Typography variant="h5" sx={{ marginTop: '20px' }}>
        Proyectos
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
  {proyectos.map((proyecto) => (
    <Grid item xs={12} md={6} lg={4} key={proyecto._id}>
      <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
        <Typography variant="h6">{proyecto.nombre}</Typography>
        {proyecto.descripcion && (
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            {proyecto.descripcion.slice(0, 100)}...
          </Typography>
        )}
        {proyecto.fechaInicio && proyecto.fechaFin && (
          <Typography variant="body2">
            <strong>Fechas:</strong> {proyecto.fechaInicio} – {proyecto.fechaFin}
          </Typography>
        )}
        {proyecto.estado && (
          <Typography variant="body2">
            <strong>Estado:</strong> {proyecto.estado}
          </Typography>
        )}
        {proyecto.tecnologias?.length > 0 && (
          <Typography variant="body2">
            <strong>Tecnologías:</strong> {proyecto.tecnologias.join(', ')}
          </Typography>
        )}
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleSeleccionarProyecto(proyecto._id)}
          sx={{ marginTop: 1, marginRight: 1 }}
        >
          Ver tareas
          </Button>
          <Button
          variant="outlined"
          size="small"
          color="secondary"
          onClick={() => handleEditarProyecto(proyecto)}
          sx={{ marginTop: 1, marginRight: 1 }}
        >
          Editar
        
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleEliminarProyecto(proyecto._id)}
          sx={{ marginTop: 1 }}
        >
          Eliminar
        </Button>
        <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth maxWidth="sm">
  <DialogTitle>Nuevo Proyecto</DialogTitle>
  <DialogContent>
    <TextField
      label="Nombre"
      fullWidth
      margin="dense"
      value={formularioProyecto.nombre}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, nombre: e.target.value })}
    />
    <TextField
      label="Descripción"
      fullWidth
      multiline
      margin="dense"
      value={formularioProyecto.descripcion}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, descripcion: e.target.value })}
    />
    <TextField
      label="Fecha de Inicio"
      type="date"
      fullWidth
      margin="dense"
      InputLabelProps={{ shrink: true }}
      value={formularioProyecto.fechaInicio}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, fechaInicio: e.target.value })}
    />
    <TextField
      label="Fecha de Fin"
      type="date"
      fullWidth
      margin="dense"
      InputLabelProps={{ shrink: true }}
      value={formularioProyecto.fechaFin}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, fechaFin: e.target.value })}
    />
    <TextField
      select
      label="Estado"
      fullWidth
      margin="dense"
      value={formularioProyecto.estado}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, estado: e.target.value })}
    >
      <MenuItem value="pendiente">Pendiente</MenuItem>
      <MenuItem value="en progreso">En progreso</MenuItem>
      <MenuItem value="completado">Completado</MenuItem>
    </TextField>
    <TextField
      label="Presupuesto"
      type="number"
      fullWidth
      margin="dense"
      value={formularioProyecto.presupuesto}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, presupuesto: e.target.value })}
    />
    <TextField
      label="Progreso (%)"
      type="number"
      fullWidth
      margin="dense"
      value={formularioProyecto.progreso}
      onChange={(e) => setFormularioProyecto({ ...formularioProyecto, progreso: e.target.value })}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
    <Button
  onClick={async () => {
    try {
      if (modoEdicion) {
        const actualizado = await actualizarProyecto(idProyectoEditando, formularioProyecto);
        setProyectos((prev) =>
          prev.map((p) => (p._id === idProyectoEditando ? actualizado : p))
        );
      } else {
        const nuevo = await crearProyecto(formularioProyecto);
        setProyectos((prev) => [...prev, nuevo]);
      }

      // Limpiar
      setFormularioProyecto({
        nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', estado: 'pendiente', presupuesto: '', progreso: ''
      });
      setIdProyectoEditando(null);
      setModoEdicion(false);
      setModalAbierto(false);
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    }
  }}
  variant="contained"
>
  {modoEdicion ? 'Actualizar' : 'Guardar'}
</Button>

  </DialogActions>
</Dialog>

      </Paper>
    </Grid>
  ))}
</Grid>


      {/* Detalles del proyecto seleccionado */}
      {proyectoSeleccionado && (
        <div>
          <Typography variant="h6" sx={{ marginTop: '20px' }}>
            Tareas del Proyecto: {proyectoSeleccionado.nombre}
          </Typography>

          {/* Formulario para agregar tarea */}
          <TextField
            label="Nueva Tarea"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px' }}
          />
          <Button onClick={handleAgregarTarea} color="primary" variant="contained">
            Agregar Tarea
          </Button>

          {/* Lista de tareas */}
          <List>
            {tareas.map((tarea) => (
              <ListItem key={tarea._id}>
                <ListItemText primary={tarea.descripcion} />
                <Button onClick={() => handleEliminarTarea(tarea._id)} color="error">
                  Eliminar Tarea
                </Button>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Paper>
  );
};

export default ProjectManagement;

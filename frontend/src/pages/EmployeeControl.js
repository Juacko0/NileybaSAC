import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, TextField, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { obtenerEmpleados, crearEmpleado, eliminarEmpleado, obtenerEmpleadoPorId, actualizarEmpleado } from '../services/empleadosServices';

const EmployeeManagement = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formularioEmpleado, setFormularioEmpleado] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    rol: 'Operativo',
    fechaIngreso: '',
    estado: 'Activo',
    implementos: []
  });
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(null);

  // Cargar empleados cuando el componente se monta
  useEffect(() => {
    obtenerEmpleados().then((data) => {
      setEmpleados(data);
    }).catch(error => {
      console.error("Error al obtener los empleados:", error);
    });
  }, []);

  const handleNuevoEmpleado = () => {
  setFormularioEmpleado({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    rol: 'Operativo',
    fechaIngreso: '',
    estado: 'Activo',
    implementos: []
  });
  setEmpleadoId(null);
  setModoEdicion(false);
  setModalAbierto(true);
};

  // Función para crear un empleado
  const handleCrearEmpleado = async () => {
    try {
      const data = await crearEmpleado(formularioEmpleado);
      setEmpleados((prevEmpleados) => [...prevEmpleados, data]);
      setFormularioEmpleado({
        dni: '', nombre: '', apellido: '', telefono: '', direccion: '', rol: 'Operativo', fechaIngreso: '', estado: 'Activo', implementos: []
      });
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al crear el empleado:", error);
    }
  };

  // Función para editar un empleado
  const handleEditarEmpleado = (empleado) => {
    setFormularioEmpleado({
      dni: empleado.dni || '',
      nombre: empleado.nombre || '',
      apellido: empleado.apellido || '',
      telefono: empleado.telefono || '',
      direccion: empleado.direccion || '',
      rol: empleado.rol || 'Operativo',
      fechaIngreso: empleado.fechaIngreso || '',
      estado: empleado.estado || 'Activo',
      implementos: empleado.implementos || []
    });
    setEmpleadoId(empleado._id);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  // Función para eliminar un empleado
  const handleEliminarEmpleado = async (id) => {
    try {
      await eliminarEmpleado(id);
      setEmpleados((prevEmpleados) => prevEmpleados.filter((empleado) => empleado._id !== id));
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: '20px', borderRadius: 2, backgroundColor: '#FFF', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Módulo de Gestión de Empleados
      </Typography>

      <Button onClick={handleNuevoEmpleado} color="primary" variant="contained" sx={{ marginTop: '10px' }}>
  Crear Empleado
</Button>

      {/* Lista de empleados */}
      <Typography variant="h5" sx={{ marginTop: '20px' }}>
        Empleados
      </Typography>
      <List sx={{ marginTop: 1 }}>
        {empleados.map((empleado) => (
          <ListItem key={empleado._id} sx={{ padding: 2, borderBottom: '1px solid #ddd' }}>
            <ListItemText
              primary={`${empleado.nombre} ${empleado.apellido}`}
              secondary={`Puesto: ${empleado.rol} | Estado: ${empleado.estado}`}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEditarEmpleado(empleado)}
              sx={{ marginRight: 1 }}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleEliminarEmpleado(empleado._id)}
            >
              Eliminar
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Modal para crear/editar empleado */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth maxWidth="sm">
        <DialogTitle>{modoEdicion ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
        <DialogContent>
          <TextField
            label="DNI"
            fullWidth
            margin="dense"
            value={formularioEmpleado.dni}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, dni: e.target.value })}
          />
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={formularioEmpleado.nombre}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, nombre: e.target.value })}
          />
          <TextField
            label="Apellido"
            fullWidth
            margin="dense"
            value={formularioEmpleado.apellido}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, apellido: e.target.value })}
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="dense"
            value={formularioEmpleado.telefono}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, telefono: e.target.value })}
          />
          <TextField
            label="Dirección"
            fullWidth
            margin="dense"
            value={formularioEmpleado.direccion}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, direccion: e.target.value })}
          />
          <TextField
            select
            label="Rol"
            fullWidth
            margin="dense"
            value={formularioEmpleado.rol}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, rol: e.target.value })}
          >
            <MenuItem value="Operativo">Operativo</MenuItem>
            <MenuItem value="Supervisor">Supervisor</MenuItem>
            <MenuItem value="Gerente">Gerente</MenuItem>
            <MenuItem value="Jefe de Área">Jefe de Área</MenuItem>
            <MenuItem value="Ayudante">Ayudante</MenuItem>
          </TextField>
          <TextField
            label="Fecha de Ingreso"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={formularioEmpleado.fechaIngreso}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, fechaIngreso: e.target.value })}
          />
          <TextField
            select
            label="Estado"
            fullWidth
            margin="dense"
            value={formularioEmpleado.estado}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, estado: e.target.value })}
          >
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Inactivo">Inactivo</MenuItem>
            <MenuItem value="Suspendido">Suspendido</MenuItem>
          </TextField>
          {/* Aquí puedes agregar más campos si lo necesitas, como los implementos */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button
            onClick={async () => {
              try {
                if (modoEdicion) {
                  const actualizado = await actualizarEmpleado(empleadoId, formularioEmpleado);
                  setEmpleados((prev) =>
                    prev.map((e) => (e._id === empleadoId ? actualizado : e))
                  );
                } else {
                  await handleCrearEmpleado();
                }
              } catch (error) {
                console.error('Error al guardar empleado:', error);
              }
            }}
            variant="contained"
          >
            {modoEdicion ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmployeeManagement;

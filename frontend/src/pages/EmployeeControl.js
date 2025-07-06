import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import { Paper, Typography, Button, TextField, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { obtenerEmpleados, crearEmpleado, eliminarEmpleado, obtenerEmpleadoPorId, actualizarEmpleado } from '../services/empleadosServices';
import { crearAsistencia } from '../services/empleadosServices';
import {Checkbox, FormControlLabel} from '@mui/material';
import AsistenciasFiltradas from '../components/AsistenciasFiltradas';

const EmployeeManagement = () => {
  const [modalAsistenciaAbierto, setModalAsistenciaAbierto] = useState(false);
  const [registroAsistencia, setRegistroAsistencia] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formularioEmpleado, setFormularioEmpleado] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    rol: 'Operativo',
    proyecto: '',
    fechaIngreso: '',
    estado: 'Activo',
    implementos: []
  });
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(null);
  const [mostrarFiltroAsistencias, setMostrarFiltroAsistencias] = useState(false);
  const [abrirModalFiltro, setAbrirModalFiltro] = useState(false);
  const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const empleadosData = await obtenerEmpleados();
      setEmpleados(empleadosData);

      const proyectosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/proyectos/nombres`);
      setProyectos(proyectosResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  fetchData();
}, []);

  const handleGuardarAsistencia = async () => {
  try {
    for (const empleadoId in registroAsistencia) {
      const { estado, observacion, entregasEPP } = registroAsistencia[empleadoId];

      const presente = estado === 'Presente';

      const asistenciaData = {
        presente,
        observacion: observacion || '',
        entregasEPP: entregasEPP || { entregado: false, items: [] }
      };

      await crearAsistencia(empleadoId, asistenciaData);
    }
    setModalAsistenciaAbierto(false);
  } catch (error) {
    console.error("Error al guardar la asistencia:", error);
  }
};

  const handleNuevoEmpleado = () => {
  setFormularioEmpleado({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    rol: 'Operativo',
    proyecto: '',
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
      proyecto: empleado.proyecto || '',
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
  const exportarAExcel = () => {
  const data = empleados.map(emp => ({
    DNI: emp.dni,
    Nombre: emp.nombre,
    Apellido: emp.apellido,
    Teléfono: emp.telefono,
    Dirección: emp.direccion,
    Rol: emp.rol,
    Proyecto: emp.proyecto?.nombre || emp.proyecto,
    FechaIngreso: emp.fechaIngreso?.substring(0, 10),
    Estado: emp.estado
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `Empleados_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportarAsistenciasFiltradas = () => {
  if (asistenciasFiltradas.length === 0) {
    alert("No hay asistencias filtradas para exportar.");
    return;
  }

  const data = asistenciasFiltradas.map((asis) => ({
    Nombre: asis.idEmpleado?.nombre || "Desconocido",
    Apellido: asis.idEmpleado?.apellido || "",
    Fecha: new Date(asis.fecha).toLocaleDateString(),
    Estado: asis.presente ? "Presente" : "Ausente",
    Observación: asis.observacion || "",
    EPP_Entregado: asis.entregasEPP?.entregado ? "Sí" : "No",
    EPP_Items: asis.entregasEPP?.items?.map(item =>
      `${item.nombre} (${item.cantidad}) [${item.estado}]`
    ).join(", ") || "Ninguno"
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias Filtradas");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `Asistencias_Filtradas_${new Date().toISOString().split('T')[0]}.xlsx`);
};

  return (
    <Paper elevation={3} sx={{ padding: '20px', borderRadius: 2, backgroundColor: '#FFF', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Módulo de Gestión de Empleados
      </Typography>
      

      <Button onClick={handleNuevoEmpleado} color="primary" variant="contained" sx={{ marginTop: '10px' }}>
      Crear Empleado
      </Button>
      
      <Button
      
  onClick={async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/asistencias/registrada/${hoy}`);

      if (response.data?.length > 0) {
        const confirmar = window.confirm("⚠️ Ya se ha tomado asistencia hoy. ¿Deseas modificarla?");
        if (!confirmar) return;

        const asistenciaExistente = {};
        response.data.forEach((asis) => {
          asistenciaExistente[asis.idEmpleado] = {
            estado: asis.presente ? 'Presente' : 'Ausente',
            observacion: asis.observacion || '',
            entregasEPP: asis.entregasEPP || { entregado: false, items: [] }
          };
        });

        setRegistroAsistencia(asistenciaExistente);
        setModalAsistenciaAbierto(true);
      } else {
        const asistenciaInicial = {};
        empleados.forEach(emp => {
          asistenciaInicial[emp._id] = { estado: 'Presente', observacion: '', entregasEPP: { entregado: false, items: [] } };
        });
        setRegistroAsistencia(asistenciaInicial);
        setModalAsistenciaAbierto(true);
      }
    } catch (error) {
      console.error("❌ Error al verificar asistencias:", error);
      alert("Error al verificar asistencias. Intenta nuevamente.");
    }
  }}
  color="secondary"
  variant="outlined"
  sx={{ marginTop: '10px', marginLeft: '10px' }}
>
  Tomar Asistencia
</Button>
      <Button
  onClick={() => setAbrirModalFiltro(true)}
  color="info"
  variant="outlined"
  sx={{ marginTop: '10px', marginLeft: '10px' }}
>
  Filtrar Asistencias
</Button>
<Button
  onClick={exportarAExcel}
  color="success"
  variant="outlined"
  sx={{ marginTop: '10px', marginLeft: '10px' }}
>
  Exportar a Excel
</Button>

<Dialog
  open={abrirModalFiltro}
  onClose={() => setAbrirModalFiltro(false)}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>Filtrar Asistencias</DialogTitle>
  <DialogContent>
    <AsistenciasFiltradas
      onClose={() => setAbrirModalFiltro(false)}
      setAsistenciasGlobal={setAsistenciasFiltradas}
    />
    {asistenciasFiltradas.length > 0 && (
    <Button
      onClick={exportarAsistenciasFiltradas}
      variant="outlined"
      color="success"
      sx={{ mt: 2 }}
    >
      Exportar Asistencias a Excel
    </Button>
  )}
  </DialogContent>
</Dialog>

    {mostrarFiltroAsistencias && (
  <div style={{ marginTop: '20px' }}>
    <AsistenciasFiltradas />
  </div>
)}
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
            select
            label="Proyecto"
            fullWidth
            margin="dense"
            value={formularioEmpleado.proyecto}
            onChange={(e) => setFormularioEmpleado({ ...formularioEmpleado, proyecto: e.target.value })}
          >
            {proyectos.map((proy) => (
              <MenuItem key={proy._id} value={proy._id}>
                {proy.nombre}
              </MenuItem>
            ))}
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
      <Dialog open={modalAsistenciaAbierto} onClose={() => setModalAsistenciaAbierto(false)} fullWidth maxWidth="md">
  <DialogTitle>Registrar Asistencia</DialogTitle>
  <DialogContent>
    {empleados.map((empleado) => (
      <div key={empleado._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Typography variant="h6" gutterBottom>{empleado.nombre} {empleado.apellido}</Typography>

        <TextField
          select
          label="Estado"
          value={registroAsistencia[empleado._id]?.estado || ''}
          onChange={(e) => setRegistroAsistencia({
            ...registroAsistencia,
            [empleado._id]: {
              ...registroAsistencia[empleado._id],
              estado: e.target.value
            }
          })}
          sx={{ width: 150, marginRight: 2, marginBottom: 2 }}
        >
          <MenuItem value="Presente">Presente</MenuItem>
          <MenuItem value="Ausente">Ausente</MenuItem>
          <MenuItem value="Tardanza">Tardanza</MenuItem>
        </TextField>

        <TextField
          label="Observación"
          value={registroAsistencia[empleado._id]?.observacion || ''}
          onChange={(e) => setRegistroAsistencia({
            ...registroAsistencia,
            [empleado._id]: {
              ...registroAsistencia[empleado._id],
              observacion: e.target.value
            }
          })}
          sx={{ width: 300, marginBottom: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={registroAsistencia[empleado._id]?.entregasEPP?.entregado || false}
              onChange={(e) => setRegistroAsistencia({
                ...registroAsistencia,
                [empleado._id]: {
                  ...registroAsistencia[empleado._id],
                  entregasEPP: {
                    ...registroAsistencia[empleado._id]?.entregasEPP,
                    entregado: e.target.checked,
                    items: registroAsistencia[empleado._id]?.entregasEPP?.items || []
                  }
                }
              })}
            />
          }
          label="EPP entregado"
          sx={{ marginBottom: 1 }}
        />

        {(registroAsistencia[empleado._id]?.entregasEPP?.items || []).map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <TextField
              label="Nombre EPP"
              value={item.nombre}
              onChange={(e) => {
                const newItems = [...registroAsistencia[empleado._id].entregasEPP.items];
                newItems[index].nombre = e.target.value;
                setRegistroAsistencia({
                  ...registroAsistencia,
                  [empleado._id]: {
                    ...registroAsistencia[empleado._id],
                    entregasEPP: {
                      ...registroAsistencia[empleado._id].entregasEPP,
                      items: newItems
                    }
                  }
                });
              }}
              sx={{ width: 180 }}
            />
            <TextField
              type="number"
              label="Cantidad"
              value={item.cantidad}
              onChange={(e) => {
                const newItems = [...registroAsistencia[empleado._id].entregasEPP.items];
                newItems[index].cantidad = parseInt(e.target.value) || 0;
                setRegistroAsistencia({
                  ...registroAsistencia,
                  [empleado._id]: {
                    ...registroAsistencia[empleado._id],
                    entregasEPP: {
                      ...registroAsistencia[empleado._id].entregasEPP,
                      items: newItems
                    }
                  }
                });
              }}
              sx={{ width: 100 }}
            />
            <TextField
              select
              label="Estado"
              value={item.estado}
              onChange={(e) => {
                const newItems = [...registroAsistencia[empleado._id].entregasEPP.items];
                newItems[index].estado = e.target.value;
                setRegistroAsistencia({
                  ...registroAsistencia,
                  [empleado._id]: {
                    ...registroAsistencia[empleado._id],
                    entregasEPP: {
                      ...registroAsistencia[empleado._id].entregasEPP,
                      items: newItems
                    }
                  }
                });
              }}
              sx={{ width: 130 }}
            >
              <MenuItem value="nuevo">Nuevo</MenuItem>
              <MenuItem value="usado">Usado</MenuItem>
              <MenuItem value="reemplazado">Reemplazado</MenuItem>
            </TextField>
            <Button
              color="error"
              onClick={() => {
                const newItems = [...registroAsistencia[empleado._id].entregasEPP.items];
                newItems.splice(index, 1);
                setRegistroAsistencia({
                  ...registroAsistencia,
                  [empleado._id]: {
                    ...registroAsistencia[empleado._id],
                    entregasEPP: {
                      ...registroAsistencia[empleado._id].entregasEPP,
                      items: newItems
                    }
                  }
                });
              }}
            >
              Eliminar
            </Button>
          </div>
        ))}

        <Button
          variant="outlined"
          onClick={() => {
            const currentItems = registroAsistencia[empleado._id]?.entregasEPP?.items || [];
            setRegistroAsistencia({
              ...registroAsistencia,
              [empleado._id]: {
                ...registroAsistencia[empleado._id],
                entregasEPP: {
                  entregado: true,
                  items: [...currentItems, { nombre: '', cantidad: 1, estado: 'nuevo' }]
                }
              }
            });
          }}
        >
          Añadir EPP
        </Button>

      </div>
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setModalAsistenciaAbierto(false)}>Cancelar</Button>
    <Button onClick={handleGuardarAsistencia} variant="contained" color="primary">Guardar Asistencias</Button>
  </DialogActions>
</Dialog>
    </Paper>
  );
};

  
export default EmployeeManagement;

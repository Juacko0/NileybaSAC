import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, MenuItem, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';

const AsistenciasFiltradas = ( {setAsistenciasGlobal}) => {
  const [proyectos, setProyectos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [filtros, setFiltros] = useState({
    proyecto: '',
    desde: '',
    hasta: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/proyectos/nombres')
      .then(res => setProyectos(res.data))
      .catch(err => console.error('Error al obtener proyectos:', err));
  }, []);

  const manejarFiltro = async () => {
    const { proyecto, desde, hasta } = filtros;

    try {
      const res = await axios.get(`http://localhost:5000/api/asistencias/filtrar`, {
        params: { proyecto, desde, hasta }
      });
      setAsistencias(res.data);
      setAsistenciasGlobal(res.data); // Actualizar el estado global de asistencias
    } catch (error) {
      console.error('Error al filtrar asistencias:', error);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>📅 Filtro de Asistencias</Typography>

      <TextField
        select
        label="Proyecto"
        fullWidth
        margin="normal"
        value={filtros.proyecto}
        onChange={(e) => setFiltros({ ...filtros, proyecto: e.target.value })}
      >
        {proyectos.map(proy => (
          <MenuItem key={proy._id} value={proy._id}>
            {proy.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Desde"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={filtros.desde}
        onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
      />

      <TextField
        label="Hasta"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={filtros.hasta}
        onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={manejarFiltro}
      >
        Buscar
      </Button>
      
      {/* Mostrar resultados dentro del mismo modal */}
      {asistencias.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">📋 Resultados</Typography>
          <List>
            {asistencias.map((asis, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={`👤 ${asis.idEmpleado?.nombre || 'Sin nombre'} (${asis.idEmpleado?.rol || ''}) - ${asis.presente ? 'Presente' : 'Ausente'}`}
                  secondary={`🗓️ ${new Date(asis.fecha).toLocaleDateString()} | 📝 ${asis.observacion || 'Sin observación'}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
};

export default AsistenciasFiltradas;
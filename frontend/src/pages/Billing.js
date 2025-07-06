import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import BalanceChart from '../components/BalanceChart';
import {
  Paper, Typography, Button, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  obtenerFacturas,
  crearFactura,
  eliminarFactura,
  obtenerBalances,
  obtenerBalancesMensuales,
  actualizarFactura
} from '../services/facturacionServices';

const Facturacion = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [balances, setBalances] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [balancesMensuales, setBalancesMensuales] = useState([]);
  const [editandoFactura, setEditandoFactura] = useState(null);
  const [paginaIngreso, setPaginaIngreso] = useState(1);
const [paginaGasto, setPaginaGasto] = useState(1);
const facturasPorPagina = 3;

  const facturaInicial = {
    fecha: '',
    monto: '',
    descripcion: '',
    proyecto: '',
    tipo: '',
    notas: ''
  };

  const obtenerNombreProyecto = (id) => {
  const proyecto = proyectos.find(p => p._id === id);
  return proyecto ? proyecto.nombre : 'Proyecto desconocido'; // Si no se encuentra, muestra el ID como fallback
};
  const exportarFacturasAExcel = () => {
  const datos = facturas.map((f) => ({
    Cliente: f.cliente || 'Sin cliente',
    Fecha: f.fecha,
    Monto: f.monto,
    Tipo: f.tipo,
    Proyecto: obtenerNombreProyecto(f.proyecto),
    Descripción: f.descripcion,
    Notas: f.notas,
  }));

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Facturas');

  const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
  const archivo = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(archivo, 'facturas.xlsx');
};
  const [formularioFactura, setFormularioFactura] = useState(facturaInicial);

  useEffect(() => {
    obtenerFacturas()
      .then(setFacturas)
      .catch(error => console.error("Error al obtener las facturas:", error));

    obtenerBalances()
      .then(setBalances)
      .catch(error => console.error("Error al obtener los balances:", error));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/proyectos/nombres`)
      .then(res => setProyectos(res.data))
      .catch(err => console.error('Error al cargar proyectos', err));
  }, []);

  useEffect(() => {
    if (proyectoSeleccionado) {
      obtenerBalancesMensuales(proyectoSeleccionado)
        .then(setBalancesMensuales)
        .catch(err => console.error("Error al obtener balances mensuales:", err));
    }
  }, [proyectoSeleccionado]);

  const abrirModalCrear = () => {
    setFormularioFactura(facturaInicial);
    setEditandoFactura(null);
    setModalAbierto(true);
  };

  const handleGuardarFactura = async () => {
    const { fecha, monto } = formularioFactura;
    if (!fecha || !monto) {
      alert("Por favor completa los campos obligatorios: Fecha, Monto");
      return;
    }

    try {
      if (editandoFactura) {
        const actualizada = await actualizarFactura(editandoFactura._id, formularioFactura);
        setFacturas(prev => prev.map(f => f._id === actualizada._id ? actualizada : f));
      } else {
        const nueva = await crearFactura(formularioFactura);
        setFacturas(prev => [...prev, nueva]);
      }

      setFormularioFactura(facturaInicial);
      setEditandoFactura(null);
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al guardar la factura:", error);
    }
  };

  const handleEliminarFactura = async (id) => {
    try {
      await eliminarFactura(id);
      setFacturas(prev => prev.filter(factura => factura._id !== id));
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
    }
  };

  const facturasIngreso = facturas.filter(f => f.tipo === 'Ingreso');
const facturasGasto = facturas.filter(f => f.tipo === 'Gasto');

const ingresosPaginados = facturasIngreso.slice(
  (paginaIngreso - 1) * facturasPorPagina,
  paginaIngreso * facturasPorPagina
);

const gastosPaginados = facturasGasto.slice(
  (paginaGasto - 1) * facturasPorPagina,
  paginaGasto * facturasPorPagina
);

  const dataParaChart = balances ? [
    { name: "Total", ingreso: balances.ingresos, gasto: balances.gastos }
  ] : [];

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Módulo de Facturación</Typography>

      <Button variant="contained" color="primary" onClick={abrirModalCrear}>
        Crear Factura
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={exportarFacturasAExcel}
        sx={{ ml: 2 }}
      >
        Exportar a Excel
      </Button>

      <Grid container spacing={4} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Ingresos</Typography>
          {ingresosPaginados.map(factura => (
            <Paper key={factura._id} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">{factura.cliente || 'Sin cliente'}</Typography>
              <Typography variant="body2"><strong>Fecha:</strong> {factura.fecha}</Typography>
              <Typography variant="body2"><strong>Monto:</strong> S/ {factura.monto}</Typography>
              <Typography variant="body2">
                <strong>Proyecto:</strong> {obtenerNombreProyecto(factura.proyecto)}
              </Typography>
              {factura.descripcion && (
                <Typography variant="body2"><strong>Descripción:</strong> {factura.descripcion}</Typography>
              )}
              <Button
                size="small"
                onClick={() => {
                  setFormularioFactura(factura);
                  setEditandoFactura(factura);
                  setModalAbierto(true);
                }}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleEliminarFactura(factura._id)}
                sx={{ ml: 1 }}
              >
                Eliminar
              </Button>
            </Paper>
          ))}
          <Grid container justifyContent="center" spacing={1}>
  <Button
    onClick={() => setPaginaIngreso(p => p - 1)}
    disabled={paginaIngreso === 1}
  >
    Anterior
  </Button>
  <Button
    onClick={() => setPaginaIngreso(p => p + 1)}
    disabled={paginaIngreso * facturasPorPagina >= facturasIngreso.length}
  >
    Siguiente
  </Button>
</Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Gastos</Typography>
          {gastosPaginados.map(factura => (
            <Paper key={factura._id} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">{factura.cliente || 'Sin cliente'}</Typography>
              <Typography variant="body2"><strong>Fecha:</strong> {factura.fecha}</Typography>
              <Typography variant="body2"><strong>Monto:</strong> S/ {factura.monto}</Typography>
              <Typography variant="body2">
                <strong>Proyecto:</strong> {obtenerNombreProyecto(factura.proyecto)}
              </Typography>
              {factura.descripcion && (
                <Typography variant="body2"><strong>Descripción:</strong> {factura.descripcion}</Typography>
              )}
              <Button
                size="small"
                onClick={() => {
                  setFormularioFactura(factura);
                  setEditandoFactura(factura);
                  setModalAbierto(true);
                }}
                >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleEliminarFactura(factura._id)}
                sx={{ ml: 1 }}
              >
                Eliminar
              </Button>
            </Paper>
          ))}
          <Grid container justifyContent="center" spacing={1}>
  <Button
    onClick={() => setPaginaGasto(p => p - 1)}
    disabled={paginaGasto === 1}
  >
    Anterior
  </Button>
  <Button
    onClick={() => setPaginaGasto(p => p + 1)}
    disabled={paginaGasto * facturasPorPagina >= facturasGasto.length}
  >
    Siguiente
  </Button>
</Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Balance General</Typography>
          <BalanceChart data={dataParaChart} />
        </Grid>
      </Grid>

      {/* Modal Crear/Editar Factura */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editandoFactura ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Proyecto"
            fullWidth
            margin="normal"
            name="proyecto"
            value={formularioFactura.proyecto}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, proyecto: e.target.value })}
          >
            {proyectos.map((proy) => (
              <MenuItem key={proy._id} value={proy._id}>
                {proy.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tipo"
            select
            fullWidth
            margin="dense"
            SelectProps={{ native: true }}
            value={formularioFactura.tipo}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, tipo: e.target.value })}
          >
            <option value="">Seleccione un tipo</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </TextField>
          <TextField
            label="Fecha"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={formularioFactura.fecha}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, fecha: e.target.value })}
          />
          <TextField
            label="Monto"
            type="number"
            fullWidth
            margin="dense"
            value={formularioFactura.monto}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, monto: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            margin="dense"
            value={formularioFactura.descripcion}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, descripcion: e.target.value })}
          />
          <TextField
            label="Notas"
            fullWidth
            multiline
            margin="dense"
            value={formularioFactura.notas}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, notas: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarFactura}>
            {editandoFactura ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Facturacion;

import React, { useState, useEffect } from 'react';
import BalanceChart from '../components/BalanceChart'; // Asegúrate de tener este componente para mostrar balances
import {
  Paper, Typography, Button, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { obtenerFacturas, crearFactura, eliminarFactura, obtenerBalances } from '../services/facturacionServices';
const Facturacion = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [balances, setBalances] = useState([]);
  const [formularioFactura, setFormularioFactura] = useState({
    cliente: '',
    fecha: '',
    monto: '',
    descripcion: '',
    tipo: '',
    formaPago: '',
    estado: 'pendiente',
    rucDni: '',
    numeroDocumento: '',
    categoria: '',
    periodoContable: '',
    notas: '',
    usuarioResponsable: ''
  });

  useEffect(() => {
    obtenerFacturas()
      .then((data) => setFacturas(data))
      .catch(error => console.error("Error al obtener las facturas:", error));

     obtenerBalances()
      .then((data) => setBalances(data))
      .catch(error => console.error("Error al obtener los balances:", error));
  }, []);

  const handleCrearFactura = async () => {
    const { cliente, fecha, monto, tipo } = formularioFactura;

    if (!cliente || !fecha || !monto || !tipo) {
      alert("Por favor completa los campos obligatorios: Cliente, Fecha, Monto y Tipo.");
      return;
    }

    try {
      const nuevaFactura = await crearFactura(formularioFactura);
      setFacturas((prev) => [...prev, nuevaFactura]);
      setFormularioFactura({
        cliente: '', fecha: '', monto: '', descripcion: '',
        tipo: '', formaPago: '', estado: 'pendiente',
        rucDni: '', numeroDocumento: '', categoria: '',
        periodoContable: '', notas: ''
      });
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al crear la factura:", error);
    }
  };

  const handleEliminarFactura = async (id) => {
    try {
      await eliminarFactura(id);
      setFacturas((prev) => prev.filter(factura => factura._id !== id));
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
    }
  };

  const dataParaChart = balances ?[
    { name: "Total", ingreso: balances.ingresos, gasto: balances.gastos }
  ] : [];

  const facturasIngreso = facturas.filter(f => f.tipo === 'Ingreso');
  const facturasGasto = facturas.filter(f => f.tipo === 'Gasto');

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Módulo de Facturación</Typography>

      <Button variant="contained" color="primary" onClick={() => setModalAbierto(true)}>
        Crear Factura
      </Button>

      <Grid container spacing={4} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Ingresos</Typography>
          {facturasIngreso.map(factura => (
            <Paper key={factura._id} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">{factura.cliente}</Typography>
              <Typography variant="body2"><strong>Fecha:</strong> {factura.fecha}</Typography>
              <Typography variant="body2"><strong>Monto:</strong> S/ {factura.monto}</Typography>
              {factura.descripcion && (
                <Typography variant="body2"><strong>Descripción:</strong> {factura.descripcion}</Typography>
              )}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleEliminarFactura(factura._id)}
                sx={{ marginTop: 1 }}
              >
                Eliminar
              </Button>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Gastos</Typography>
          {facturasGasto.map(factura => (
            <Paper key={factura._id} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">{factura.cliente}</Typography>
              <Typography variant="body2"><strong>Fecha:</strong> {factura.fecha}</Typography>
              <Typography variant="body2"><strong>Monto:</strong> S/ {factura.monto}</Typography>
              {factura.descripcion && (
                <Typography variant="body2"><strong>Descripción:</strong> {factura.descripcion}</Typography>
              )}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleEliminarFactura(factura._id)}
                sx={{ marginTop: 1 }}
              >
                Eliminar
              </Button>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Balance General</Typography>
          <BalanceChart data={dataParaChart}/>
        </Grid>
      </Grid>

      {/* Modal */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nueva Factura</DialogTitle>
        <DialogContent>
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
            label="Cliente"
            fullWidth
            margin="dense"
            value={formularioFactura.cliente}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, cliente: e.target.value })}
          />

          <TextField
            label="Forma de Pago"
            select
            fullWidth
            margin="dense"
            SelectProps={{ native: true }}
            value={formularioFactura.formaPago}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, formaPago: e.target.value })}
          >
            <option value="">Seleccione forma de pago</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </TextField>

          <TextField
            label="Estado"
            select
            fullWidth
            margin="dense"
            SelectProps={{ native: true }}
            value={formularioFactura.estado}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, estado: e.target.value })}
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
            <option value="cancelada">Cancelada</option>
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
            label="RUC/DNI"
            fullWidth
            margin="dense"
            value={formularioFactura.rucDni}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, rucDni: e.target.value })}
          />

          <TextField
            label="Número de Documento"
            fullWidth
            margin="dense"
            value={formularioFactura.numeroDocumento}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, numeroDocumento: e.target.value })}
          />

          <TextField
            label="Categoría"
            fullWidth
            margin="dense"
            value={formularioFactura.categoria}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, categoria: e.target.value })}
          />

          <TextField
            label="Periodo Contable (YYYY-MM)"
            fullWidth
            margin="dense"
            value={formularioFactura.periodoContable}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, periodoContable: e.target.value })}
          />

          <TextField
            label="Notas"
            fullWidth
            multiline
            margin="dense"
            value={formularioFactura.notas}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, notas: e.target.value })}
          />
          <TextField
            label="Usuario Responsable"
            fullWidth
            margin="dense"
            value={formularioFactura.usuarioResponsable}
            onChange={(e) => setFormularioFactura({ ...formularioFactura, usuarioResponsable: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearFactura}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Facturacion;

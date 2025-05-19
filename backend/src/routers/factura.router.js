import express from 'express';
import {
  crearFactura,
  listarFacturas,
  obtenerFactura,
  actualizarFactura,
  eliminarFactura,
  buscarFacturas,
  reporteIngresos,
  actualizarEstadoPago
} from '../controllers/factura.controller.js';

const router = express.Router();

// Rutas CRUD para facturas
router.post('/', crearFactura); // Crear nueva factura
router.get('/', listarFacturas); // Listar todas las facturas
router.get('/:id', obtenerFactura); // Obtener una factura por ID
router.put('/:id', actualizarFactura); // Actualizar una factura por ID
router.delete('/:id', eliminarFactura); // Eliminar una factura por ID

// Rutas adicionales
router.get('/busqueda/filtro', buscarFacturas); // Buscar por cliente o rango de fechas
router.get('/reportes/ingresos', reporteIngresos); // Reporte de ingresos por fechas
router.patch('/:id/estado-pago', actualizarEstadoPago); // Actualizar solo estado de pago

export default router;

import mongoose from "mongoose";
import Factura from "../models/Factura.js";

// Crear nueva factura
export const crearFactura = async (req, res) => {
  try {
    const nuevaFactura = new Factura(req.body);
    await nuevaFactura.save();
    res.status(201).json(nuevaFactura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la factura" });
  }
};

// Listar todas las facturas
export const listarFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find();
    res.status(200).json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las facturas" });
  }
};

// Obtener factura por ID
export const obtenerFactura = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de factura no válido" });
    }

    const factura = await Factura.findById(id);

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    res.status(200).json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la factura" });
  }
};

// Actualizar factura
export const actualizarFactura = async (req, res) => {
  try {
    const facturaActualizada = await Factura.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!facturaActualizada) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    res.json(facturaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar la factura" });
  }
};

// Eliminar factura
export const eliminarFactura = async (req, res) => {
  try {
    const facturaEliminada = await Factura.findByIdAndDelete(req.params.id);

    if (!facturaEliminada) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    res.json({ mensaje: "Factura eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la factura" });
  }
};

// Buscar facturas por cliente o por rango de fechas
export const buscarFacturas = async (req, res) => {
  try {
    const { cliente, fechaInicio, fechaFin } = req.query;

    if (!cliente && !(fechaInicio && fechaFin)) {
      return res.status(400).json({ mensaje: "Debe proporcionar un cliente o un rango de fechas" });
    }

    const filtro = {};

    if (cliente) {
      filtro.cliente = new RegExp(cliente, "i"); // búsqueda insensible a mayúsculas
    }

    if (fechaInicio && fechaFin) {
      filtro.fechaEmision = {
        $gte: new Date(fechaInicio + "T00:00:00Z"),
        $lte: new Date(fechaFin + "T23:59:59Z"),
      };
    }

    const facturas = await Factura.find(filtro);
    res.status(200).json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar las facturas" });
  }
};

// Actualizar estado de pago de una factura
export const actualizarEstadoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoPago } = req.body;

    const estadosValidos = ["Pagado", "Pendiente", "Vencido"];
    if (!estadosValidos.includes(estadoPago)) {
      return res.status(400).json({ mensaje: "Estado de pago no válido" });
    }

    const factura = await Factura.findByIdAndUpdate(
      id,
      { estadoPago },
      { new: true, runValidators: true }
    );

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    res.json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el estado de pago" });
  }
};



// Reporte de ingresos por rango de fechas
export const reporteIngresos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const filtro = {};
    if (fechaInicio && fechaFin) {
      filtro.fechaEmision = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    const facturas = await Factura.find(filtro);

    const totalIngresos = facturas.reduce((total, factura) => total + factura.total, 0);

    res.json({
      cantidadFacturas: facturas.length,
      totalIngresos,
      detalles: facturas,
    });

    // Luego podrías usar PDFKit o Puppeteer para generar un PDF si lo deseas.
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al generar el reporte de ingresos" });
  }
};

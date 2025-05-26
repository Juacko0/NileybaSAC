import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/facturas'; // Ajusta esto a tu backend real

export const obtenerFacturas = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    throw error;
  }
};

export const crearFactura = async (factura) => {
  try {
    const response = await axios.post(API_BASE_URL, factura);
    return response.data;
  } catch (error) {
    console.error("Error al crear la factura:", error);
    throw error;
  }
};

export const eliminarFactura = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    throw error;
  }
};

export const obtenerBalances = async () => {
  try {
    const response = await axios.get(API_BASE_URL + '/balances');
    return response.data; // Esperamos un objeto { ingresos: number, gastos: number }
  } catch (error) {
    console.error("Error al obtener balances:", error);
    throw error;
  }
};
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/empleados'; // Asegúrate de usar la URL correcta para tu API

// Funciones para manejar empleados
export const obtenerEmpleados = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const obtenerEmpleadoPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const crearEmpleado = async (empleadoData) => {
  const response = await axios.post(API_URL, empleadoData);
  return response.data;
};

export const actualizarEmpleado = async (id, empleadoData) => {
  const response = await axios.put(`${API_URL}/${id}`, empleadoData);
  return response.data;
};

export const eliminarEmpleado = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

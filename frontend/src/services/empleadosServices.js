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

// Obtener todas las asistencias
export const obtenerAsistencias = async () => {
  const response = await axios.get(`http://localhost:5000/api/asistencias`);
  return response.data;
};

// Obtener asistencias por ID de empleado
export const obtenerAsistenciasPorEmpleado = async (empleadoId) => {
  const response = await axios.get(`http://localhost:5000/api/asistencias/${empleadoId}`);
  return response.data;
};

// Crear una nueva asistencia
export const crearAsistencia = async (empleadoId, asistenciaData) => {
  const response = await axios.post(`http://localhost:5000/api/asistencias/${empleadoId}`, asistenciaData);
  return response.data;
};

// Actualizar una asistencia específica por su ID
export const actualizarAsistencia = async (asistenciaId, asistenciaData) => {
  const response = await axios.put(`http://localhost:5000/api/asistencias/actualizar/${asistenciaId}`, asistenciaData);
  return response.data;
};

// Eliminar una asistencia específica por su ID
export const eliminarAsistencia = async (asistenciaId) => {
  const response = await axios.delete(`http://localhost:5000/api/asistencias/eliminar/${asistenciaId}`);
  return response.data;
};


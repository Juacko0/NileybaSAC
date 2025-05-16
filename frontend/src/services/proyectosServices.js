import axios from 'axios';

const API_URL = 'http://localhost:5000/api/proyectos';

// Funciones para manejar proyectos
export const obtenerProyectos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const obtenerProyectoPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const crearProyecto = async (proyectoData) => {
  const response = await axios.post(API_URL, proyectoData);
  return response.data;
};

export const actualizarProyecto = async (id, proyectoData) => {
  const response = await axios.put(`${API_URL}/${id}`, proyectoData);
  return response.data;
};

export const eliminarProyecto = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const generarReporteProyecto = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/reporte`);
  return response.data;
};

// Funciones para manejar tareas dentro de proyectos
export const obtenerTareasProyecto = async (idProyecto) => {
  const response = await axios.get(`${API_URL}/${idProyecto}/tareas`);
  return response.data;
};

export const agregarTarea = async (idProyecto, tareaData) => {
  const response = await axios.post(`${API_URL}/${idProyecto}/tareas`, tareaData);
  return response.data;
};

export const eliminarTarea = async (idProyecto, idTarea) => {
  const response = await axios.delete(`${API_URL}/${idProyecto}/tareas/${idTarea}`);
  return response.data;
};

export const actualizarEstadoTarea = async (idProyecto, idTarea, nuevoEstado) => {
  const response = await axios.put(`${API_URL}/${idProyecto}/tareas/${idTarea}`, { estado: nuevoEstado });
  return response.data;
};
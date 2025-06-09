import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documentos'; // Cambia a tu backend real

// Registrar un nuevo documento (el archivo se envía con FormData)
export const registrarDocumento = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/subir`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Listar todos los documentos
export const listarDocumentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtener archivo por nombre
export const obtenerArchivo = async (filename) => {
  try {
    const response = await axios.get(`${API_URL}/archivo/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Eliminar documento
export const eliminarDocumento = async (filename) => {
  const res = await fetch(`http://localhost:5000/api/documentos/${filename}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Error al eliminar documento');
  }
  return await res.json();
};

// Actualizar metadatos de un documento
export const actualizarDocumento = async (filename, datosActualizados) => {
  try {
    const response = await axios.put(`${API_URL}/${filename}`, datosActualizados);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

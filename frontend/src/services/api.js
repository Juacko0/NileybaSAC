import axios from 'axios';

const api = axios.create({
  baseURL: '${process.env.REACT_APP_API_URL}/api',
});

export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('API request failed');
  }
};

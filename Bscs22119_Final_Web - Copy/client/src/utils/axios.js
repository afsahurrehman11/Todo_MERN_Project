import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Updated port to 5173
  headers: {
    'Content-Type': 'application/json'
  }
});
// Add a request interceptor with error logging
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request:', config.method.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add a response interceptor for debugging
  api.interceptors.response.use(
    (response) => {
      console.log('Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
  
  export default api;
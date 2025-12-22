import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user'); // Clear user data
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

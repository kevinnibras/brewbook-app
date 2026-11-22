import axios from 'axios';

// Inisialisasi axios instance
// Mengambil baseURL dari variabel lingkungan VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

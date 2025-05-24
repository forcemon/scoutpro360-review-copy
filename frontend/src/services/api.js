// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // URL base de tu API Django
  headers: {
    'Content-Type': 'application/json',
    // Aquí podrías añadir headers de autenticación si los tuvieras
    // 'Authorization': `Bearer ${token}`
  }
});

export default apiClient;
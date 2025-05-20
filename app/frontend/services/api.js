import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://192.168.1.52:5000/api',
  timeout: 5000,
});

// Ajouter un interceptor pour injecter le token dans chaque requête
API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

API.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('Erreur réseau : impossible de joindre le serveur.');
    } else {
      console.error(`Erreur ${error.response.status} :`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;

// src/axiosConfig.js
import axios from 'axios';

const baseURL = import.meta.env.PROD 
  ? 'https://webnarland.vercel.app/api'  
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;

// src/api.js
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;;

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // your backend URL
  withCredentials: true,
});


export default api;

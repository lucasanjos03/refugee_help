import axios from 'axios';

// Aqui apontamos diretamente para a porta 8080 do seu Spring Boot!
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default api;
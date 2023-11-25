import axios from 'axios';

export const ADDRESS = '192.168.1.130:8000';

const api = axios.create({
  baseURL: 'http://' + ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

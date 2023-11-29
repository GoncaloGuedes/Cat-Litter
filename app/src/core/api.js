import axios from 'axios';
import secure from './secure';

export const ADDRESS = '192.168.1.204:8000'; // '192.168.56.102:8000'; // '192.168.1.130:8000';

const api = axios.create({
  baseURL: 'http://' + ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async config => {
    // Fetch tokens
    const tokens = await secure.get('tokens');

    // Set Authorization header if tokens are available
    if (tokens) {
      config.headers.Authorization = `JWT ${tokens.access}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;

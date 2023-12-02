import axios from 'axios';
import secure from './secure';

export const ADDRESS = '192.168.1.219:8000'; //'192.168.1.204:8000';

const api = axios.create({
  baseURL: 'http://' + ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh tokens
const refreshTokens = async () => {
  try {
    // Check if refresh tokens exist
    const storedTokens = await secure.get('tokens');
    if (!storedTokens || !storedTokens.refresh) {
      throw new Error('No refresh token available');
    }

    // Your logic to refresh tokens
    const response = await axios.post(
      'http://' + ADDRESS + '/auth/jwt/refresh/',
      {
        refresh: storedTokens.refresh,
      },
    );

    const newTokens = response.data;

    // Save the new tokens
    await secure.set('tokens', newTokens);

    return newTokens.access;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    throw error;
  }
};

// Add a request interceptor
api.interceptors.request.use(
  async config => {
    // Fetch tokens
    const tokens = await secure.get('tokens');

    // Set Authorization header if tokens are available
    if (tokens && tokens.access) {
      config.headers.Authorization = `JWT ${tokens.access}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the token and retry the original request
        const newToken = await refreshTokens();

        // Update the Authorization header with the new token
        originalRequest.headers.Authorization = `JWT ${newToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh error or re-throw it
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

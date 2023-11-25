import {create} from 'zustand';
import secure from './secure';
import api from './api';

// Authentication store
const useAuthStore = create(set => ({
  initialized: false,
  authenticated: false,
  user: {},

  init: async () => {
    // Get credentials
    const credentials = await secure.get('credentials');
    if (credentials) {
      try {
        const response = await api({
          method: 'POST',
          url: '/auth/jwt/create/',
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        });
        const user = response.data.user;
        set(state => ({
          initialized: true,
          authenticated: true,
          user,
        }));
        return;
      } catch (error) {
        console.log(error);
      }
    }
    set(state => ({
      initialized: true,
    }));
  },

  login: (credentials, user) => {
    secure.set('credentials', credentials);
    set({authenticated: true, user});
  },
  logout: () => {
    secure.wipe();
    set({authenticated: false, user: {}});
  },
}));

export default useAuthStore;

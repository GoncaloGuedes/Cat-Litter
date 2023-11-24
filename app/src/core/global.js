import {create} from 'zustand';

// Authentication store
export const useAuthStore = create(set => ({
  authenticated: false,
  user: {},

  login: user => {
    set({authenticated: true, user});
  },
  logout: () => {
    set({authenticated: false, user: {}});
  },
}));

export default useAuthStore;

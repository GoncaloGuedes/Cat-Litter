import {create} from 'zustand';

// Authentication store
export const useAuthStore = create(set => ({
  authenticated: true,
  user: {},

  login: user => {
    set({authenticated: true, user});
  },
  logout: () => {
    set({authenticated: false, user: {}});
  },
}));

export default useAuthStore;

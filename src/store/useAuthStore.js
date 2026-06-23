import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,

  login: (userData, role, token) => {
    localStorage.setItem('token', token);
    set({ user: userData, role, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, role: null, token: null, isAuthenticated: false });
  },

  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;

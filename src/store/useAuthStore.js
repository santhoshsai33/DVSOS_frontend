import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  menus: [],
  token: null,
  isAuthenticated: false,

  login: (userData, role, token, menus = []) => {
    localStorage.setItem('token', token);
    set({ user: userData, role, menus, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, role: null, menus: [], token: null, isAuthenticated: false });
  },

  setUser: (userData) => set({ user: userData }),
  setMenus: (menus = []) => set({ menus }),
}));

export default useAuthStore;

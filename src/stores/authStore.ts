import { create } from 'zustand';

interface IAuthState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  isLoggedIn: false,
  username: null,

  login: (username: string) => {
    set({
      isLoggedIn: true,
      username,
    });
  },

  logout: () => {
    set({
      isLoggedIn: false,
      username: null,
    });
  },
}));
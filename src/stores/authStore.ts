import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '../types/auth';

interface IAuthState {
  isLoggedIn: boolean;
  user: IUser | null;
  token: string | null;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      login: (user: IUser, token: string) => {
        set({
          isLoggedIn: true,
          user,
          token,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'lskk-auth',
    },
  ),
);

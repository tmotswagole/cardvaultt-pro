import { create } from 'zustand';

export type Role = 'TELLER' | 'BR_MANAGER' | 'CARD_OPS' | 'SYS_ADMIN' | 'AUDITOR';

interface User {
  id: number;
  employee_id: string;
  full_name: string;
  role: Role;
  branch_id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  switchRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role } : null
  })),
}));

import { create } from "zustand";

export type Role = "super_admin" | "restaurant_admin" | null;

interface AuthState {
  role: Role;
  userName: string;
  userEmail: string;
  enseigneId: string | null;
  login: (role: Exclude<Role, null>) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

export const useAuth = create<AuthState>((set) => ({
  role: null,
  userName: "",
  userEmail: "",
  enseigneId: null,
  login: (role) =>
    set(
      role === "super_admin"
        ? {
            role,
            userName: "Admin Lovable",
            userEmail: "admin@qrmenu.io",
            enseigneId: null,
          }
        : {
            role,
            userName: "Karim Bennani",
            userEmail: "karim@elgrotte.ma",
            enseigneId: "ens_1",
          },
    ),
  logout: () => set({ role: null, userName: "", userEmail: "", enseigneId: null }),
  setRole: (role) => set({ role }),
}));

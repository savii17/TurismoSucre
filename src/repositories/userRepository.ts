import { authRepository } from "./authRepository";
import type { ManagedUser, ManagedUserInput } from "../types/userManagement";

const requireAdmin = () => {
  if (!authRepository.canManage()) throw new Error("Se requiere una sesión ADMIN activa para gestionar usuarios.");
};

/** Management operations always use the account store and never expose credential material. */
export const userRepository = {
  list(): ManagedUser[] {
    requireAdmin();
    return authRepository.listManagedAccounts();
  },
  update(id: string, input: ManagedUserInput): ManagedUser | null {
    requireAdmin();
    return authRepository.updateManagedAccount(id, input);
  },
  remove(id: string): boolean {
    requireAdmin();
    return authRepository.removeManagedAccount(id);
  },
  toggleStatus(id: string): ManagedUser | null {
    requireAdmin();
    return authRepository.toggleManagedAccount(id);
  },
};

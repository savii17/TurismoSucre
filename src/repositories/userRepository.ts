import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type { ManagedUser, ManagedUserInput } from "../types/userManagement";

const USERS_KEY = "usuarios";
type StoredUser = Partial<ManagedUser> & {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  edad: number;
  email: string;
  nacionalidad: string;
  idioma: string;
  rol: ManagedUser["rol"];
  estado: ManagedUser["estado"];
  password?: string;
  fecha_registrro?: string;
};

const toManagedUser = (user: StoredUser, index: number): ManagedUser => ({
  PK_id: user.PK_id ?? `usuario-${index + 1}`,
  nombres: user.nombres,
  apellido_paterno: user.apellido_paterno,
  apellido_materno: user.apellido_materno,
  edad: user.edad,
  email: user.email,
  nacionalidad: user.nacionalidad,
  idioma: user.idioma,
  numero_identidad: user.numero_identidad ?? "No registrado",
  rol: user.rol,
  estado: user.estado,
  fecha_registro: user.fecha_registro ?? user.fecha_registrro ?? "",
});

const initialRecords = () => (initialUsers as unknown as StoredUser[]).map(toManagedUser);
const readAll = (): ManagedUser[] => storageService.get<ManagedUser[]>(USERS_KEY) ?? initialRecords();
const writeAll = (items: ManagedUser[]) => storageService.set(USERS_KEY, items);

export const userRepository = {
  list: readAll,
  create(input: ManagedUserInput): ManagedUser {
    const item: ManagedUser = { ...input, PK_id: crypto.randomUUID(), fecha_registro: input.fecha_registro ?? new Date().toISOString() };
    writeAll([item, ...readAll()]);
    return item;
  },
  update(id: string, input: ManagedUserInput): ManagedUser | null {
    let updated: ManagedUser | null = null;
    writeAll(readAll().map((item) => {
      if (item.PK_id !== id) return item;
      updated = { ...item, ...input, PK_id: item.PK_id, fecha_registro: input.fecha_registro ?? item.fecha_registro };
      return updated;
    }));
    return updated;
  },
  remove(id: string) { writeAll(readAll().filter((item) => item.PK_id !== id)); },
  toggleStatus(id: string): ManagedUser | null {
    const item = readAll().find((entry) => entry.PK_id === id);
    return item ? this.update(id, { ...item, estado: item.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" }) : null;
  },
};

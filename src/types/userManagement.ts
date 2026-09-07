import type { UserRole, UserStatus } from "./auth";

/** User data safe for administration screens: it deliberately excludes passwords. */
export type ManagedUser = {
  PK_id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  edad: number;
  email: string;
  nacionalidad: string;
  idioma: string;
  numero_identidad: string;
  rol: UserRole;
  estado: UserStatus;
  fecha_registro: string;
};

export type ManagedUserInput = Omit<ManagedUser, "PK_id" | "fecha_registro"> & {
  fecha_registro?: string;
};

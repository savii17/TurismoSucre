export type UserRole = "ADMIN" | "USUARIO" | "INVITADO";
export type UserStatus = "ACTIVO" | "INACTIVO";

export interface User {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  edad: number;
  email: string;
  nacionalidad: string;
  idioma: string;
  rol: UserRole;
  estado: UserStatus;
  fecha_registrro: string;
}

export interface UserRecord extends User {
  password: string;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationInput {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
}

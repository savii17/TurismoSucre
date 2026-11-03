import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";


import type {
  LoginCredentials,
  RegistrationInput,
  User,
  UserRecord,
} from "../types/auth";


const SESSION_KEY = "app_session";
const REGISTERED_USERS_KEY = "registered_users_v1";


const users = initialUsers as UserRecord[];

type StoredAccount = Omit<UserRecord, "password"> & { passwordHash: string; passwordSalt: string };
const readAccounts = (): StoredAccount[] => storageService.get<StoredAccount[]>(REGISTERED_USERS_KEY) ?? [];
const toSessionUser = (record: UserRecord | StoredAccount): User => ({
  nombres: record.nombres, apellido_paterno: record.apellido_paterno, apellido_materno: record.apellido_materno,
  edad: record.edad, email: record.email, nacionalidad: record.nacionalidad, idioma: record.idioma,
  rol: record.rol, estado: record.estado, fecha_registrro: record.fecha_registrro,
});
const derivePassword = async (password: string, salt: string) => {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: Uint8Array.from(atob(salt), (char) => char.charCodeAt(0)), iterations: 120000, hash: "SHA-256" }, material, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
};
const saveSession = (user: User) => storageService.set<User>(SESSION_KEY, user);


export const authRepository = {
  async login(credentials: LoginCredentials, role?: "ADMIN" | "USUARIO"): Promise<User | null> {
    const email = credentials.email.trim().toLocaleLowerCase();
    const foundUser = users.find(
      (user) =>
        user.email.toLocaleLowerCase() === email && user.password === credentials.password
    );
    const registered = readAccounts().find((account) => account.email.toLocaleLowerCase() === email);
    let sessionUser: User | null = null;
    if (foundUser && foundUser.password === credentials.password) sessionUser = toSessionUser(foundUser);
    else if (registered && await derivePassword(credentials.password, registered.passwordSalt) === registered.passwordHash) sessionUser = toSessionUser(registered);
    if (!sessionUser || sessionUser.estado !== "ACTIVO" || (role && sessionUser.rol !== role)) {
      return null;
    }
    saveSession(sessionUser);
    return sessionUser;
  },

  async register(input: RegistrationInput): Promise<{ user: User | null; error?: "invalid" | "duplicate" }> {
    const email = input.email.trim().toLocaleLowerCase();
    if (!input.nombres.trim() || !input.apellido_paterno.trim() || !input.apellido_materno.trim() || !email || input.password.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { user: null, error: "invalid" };
    if (users.some((user) => user.email.toLocaleLowerCase() === email) || readAccounts().some((user) => user.email.toLocaleLowerCase() === email)) return { user: null, error: "duplicate" };
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const salt = btoa(String.fromCharCode(...saltBytes));
    const record: StoredAccount = {
      nombres: input.nombres.trim(), apellido_paterno: input.apellido_paterno.trim(), apellido_materno: input.apellido_materno.trim(),
      edad: 18, email, nacionalidad: "No especificada", idioma: "es", rol: "USUARIO", estado: "ACTIVO",
      fecha_registrro: new Date().toISOString(), passwordSalt: salt, passwordHash: await derivePassword(input.password, salt),
    };
    storageService.set(REGISTERED_USERS_KEY, [...readAccounts(), record]);
    const user = toSessionUser(record);
    saveSession(user);
    return { user };
  },


  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },


  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.estado === "ACTIVO";
  },

  canManage(): boolean {
    const user = this.getCurrentUser();
    return user?.estado === "ACTIVO" && user.rol === "ADMIN";
  },

  isRole(role: "ADMIN" | "USUARIO"): boolean { return this.getCurrentUser()?.rol === role && this.isAuthenticated(); },


  logout(): void {
    storageService.remove(SESSION_KEY);
  },
};

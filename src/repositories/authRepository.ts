import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";


import type {
  LoginCredentials,
  RegistrationInput,
  User,
  UserRecord,
} from "../types/auth";
import type { ManagedUser, ManagedUserInput } from "../types/userManagement";


const SESSION_KEY = "app_session";
const REGISTERED_USERS_KEY = "registered_users_v1";
const ACCOUNT_OVERRIDES_KEY = "account_overrides_v1";
const DELETED_SEED_USERS_KEY = "deleted_seed_users_v1";
const LEGACY_USERS_KEY = "usuarios";


const users = initialUsers as UserRecord[];

type StoredAccount = Omit<UserRecord, "password"> & { passwordHash: string; passwordSalt: string; accountId?: string };
const readAccounts = (): StoredAccount[] => storageService.get<StoredAccount[]>(REGISTERED_USERS_KEY) ?? [];
const readOverrides = (): Record<string, Partial<UserRecord>> => storageService.get<Record<string, Partial<UserRecord>>>(ACCOUNT_OVERRIDES_KEY) ?? {};
const readDeletedSeedIds = (): string[] => storageService.get<string[]>(DELETED_SEED_USERS_KEY) ?? [];
const readLegacyUsers = (): ManagedUser[] => storageService.get<ManagedUser[]>(LEGACY_USERS_KEY) ?? [];
const seedId = (email: string) => `seed:${email.toLocaleLowerCase()}`;
const registeredId = (account: StoredAccount) => `registered:${account.accountId ?? account.email.toLocaleLowerCase()}`;
const effectiveSeedAccounts = (): UserRecord[] => {
  const overrides = readOverrides();
  const legacyUsers = readLegacyUsers();
  return users.map((user, index) => {
    const legacy = legacyUsers.find((account) => account.PK_id === `usuario-${index + 1}`);
    const override = overrides[seedId(user.email)];
    return {
      ...user,
      nombres: override?.nombres ?? legacy?.nombres ?? user.nombres,
      apellido_paterno: override?.apellido_paterno ?? legacy?.apellido_paterno ?? user.apellido_paterno,
      apellido_materno: override?.apellido_materno ?? legacy?.apellido_materno ?? user.apellido_materno,
      edad: override?.edad ?? legacy?.edad ?? user.edad,
      email: override?.email ?? legacy?.email ?? user.email,
      nacionalidad: override?.nacionalidad ?? legacy?.nacionalidad ?? user.nacionalidad,
      idioma: override?.idioma ?? legacy?.idioma ?? user.idioma,
      estado: user.rol === "ADMIN" ? user.estado : override?.estado ?? legacy?.estado ?? user.estado,
      fecha_registrro: override?.fecha_registrro ?? legacy?.fecha_registro ?? user.fecha_registrro,
    };
  });
};
const isAdminSession = () => {
  const session = storageService.get<User>(SESSION_KEY);
  if (!session?.email) return false;
  const deleted = readDeletedSeedIds();
  return effectiveSeedAccounts().some((account, index) => !deleted.includes(seedId(users[index].email)) && account.email.toLocaleLowerCase() === session.email.toLocaleLowerCase() && account.rol === "ADMIN" && account.estado === "ACTIVO");
};
const requireAdmin = () => { if (!isAdminSession()) throw new Error("Se requiere una sesión ADMIN activa para gestionar usuarios."); };
const safeRecord = (record: UserRecord | StoredAccount, id: string): ManagedUser => ({
  PK_id: id, nombres: record.nombres, apellido_paterno: record.apellido_paterno, apellido_materno: record.apellido_materno,
  edad: record.edad, email: record.email, nacionalidad: record.nacionalidad, idioma: record.idioma,
  numero_identidad: "numero_identidad" in record && typeof record.numero_identidad === "string" ? record.numero_identidad : "No registrado",
  rol: record.rol, estado: record.estado, fecha_registro: record.fecha_registrro,
});
const toSessionUser = (record: UserRecord | StoredAccount): User => ({
  nombres: record.nombres, apellido_paterno: record.apellido_paterno, apellido_materno: record.apellido_materno,
  edad: record.edad, email: record.email, nacionalidad: record.nacionalidad, idioma: record.idioma,
  rol: record.rol, estado: record.estado, fecha_registrro: record.fecha_registrro,
});
const readManagedAccounts = (): ManagedUser[] => {
  const deleted = readDeletedSeedIds();
  const effectiveSeeds = effectiveSeedAccounts();
  const seedRecords = effectiveSeeds.filter((_, index) => !deleted.includes(seedId(users[index].email))).map((user, index) => safeRecord(user, seedId(users[index].email)));
  const registeredRecords = readAccounts().map((account) => safeRecord(account, registeredId(account)));
  const knownEmails = new Set([...registeredRecords, ...seedRecords].map((account) => account.email.toLocaleLowerCase()));
  const seededLegacyIds = new Set(users.map((_, index) => `usuario-${index + 1}`));
  const legacyRecords = readLegacyUsers()
    .filter((account) => !seededLegacyIds.has(account.PK_id) && !knownEmails.has(account.email.toLocaleLowerCase()))
    .map((account) => ({ ...account, PK_id: account.PK_id.startsWith("legacy:") ? account.PK_id : `legacy:${account.PK_id}` }));
  return [...registeredRecords, ...seedRecords, ...legacyRecords];
};
const derivePassword = async (password: string, salt: string) => {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: Uint8Array.from(atob(salt), (char) => char.charCodeAt(0)), iterations: 120000, hash: "SHA-256" }, material, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
};
const saveSession = (user: User) => storageService.set<User>(SESSION_KEY, user);


export const authRepository = {
  async login(credentials: LoginCredentials, role?: "ADMIN" | "USUARIO"): Promise<User | null> {
    const email = credentials.email.trim().toLocaleLowerCase();
    const deleted = readDeletedSeedIds();
    const seedAccounts = effectiveSeedAccounts().filter((_, index) => !deleted.includes(seedId(users[index].email)));
    const foundUser = seedAccounts.find((user) => user.email.toLocaleLowerCase() === email && user.password === credentials.password);
    const registered = readAccounts().find((account) => account.email.toLocaleLowerCase() === email);
    let sessionUser: User | null = null;
    if (foundUser) sessionUser = toSessionUser(foundUser);
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
    if (readManagedAccounts().some((user) => user.email.toLocaleLowerCase() === email)) return { user: null, error: "duplicate" };
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const salt = btoa(String.fromCharCode(...saltBytes));
    const record: StoredAccount = {
      nombres: input.nombres.trim(), apellido_paterno: input.apellido_paterno.trim(), apellido_materno: input.apellido_materno.trim(),
      edad: 18, email, nacionalidad: "No especificada", idioma: "es", rol: "USUARIO", estado: "ACTIVO",
      fecha_registrro: new Date().toISOString(), accountId: crypto.randomUUID(), passwordSalt: salt, passwordHash: await derivePassword(input.password, salt),
    };
    storageService.set(REGISTERED_USERS_KEY, [...readAccounts(), record]);
    const user = toSessionUser(record);
    saveSession(user);
    return { user };
  },


  getCurrentUser(): User | null {
    const session = storageService.get<User>(SESSION_KEY);
    if (!session?.email) return null;
    const email = session.email.toLocaleLowerCase();
    const deleted = readDeletedSeedIds();
    const seedIndex = effectiveSeedAccounts().findIndex((account, index) => !deleted.includes(seedId(users[index].email)) && account.email.toLocaleLowerCase() === email);
    if (seedIndex >= 0) return toSessionUser(effectiveSeedAccounts()[seedIndex]);
    const account = readAccounts().find((entry) => entry.email.toLocaleLowerCase() === email);
    if (account) return toSessionUser({ ...account, rol: "USUARIO" });
    return null;
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

  listManagedAccounts(): ManagedUser[] {
    requireAdmin();
    return readManagedAccounts();
  },

  updateManagedAccount(id: string, input: ManagedUserInput): ManagedUser | null {
    requireAdmin();
    const current = this.listManagedAccounts().find((account) => account.PK_id === id);
    if (!current || current.rol === "ADMIN") return null;
    const email = input.email.trim().toLocaleLowerCase();
    if (this.listManagedAccounts().some((account) => account.PK_id !== id && account.email.toLocaleLowerCase() === email)) throw new Error("Ya existe una cuenta con ese correo.");
    const safeInput = { ...input, email, rol: current.rol, estado: current.estado };
    if (id.startsWith("seed:")) {
      storageService.set(ACCOUNT_OVERRIDES_KEY, { ...readOverrides(), [id]: { ...readOverrides()[id], ...safeInput, fecha_registrro: input.fecha_registro ?? current.fecha_registro } });
    } else if (id.startsWith("registered:")) {
      const next = readAccounts().map((account) => registeredId(account) === id ? { ...account, accountId: account.accountId ?? account.email.toLocaleLowerCase(), ...safeInput, fecha_registrro: input.fecha_registro ?? current.fecha_registro } : account);
      storageService.set(REGISTERED_USERS_KEY, next);
    } else {
      storageService.set(LEGACY_USERS_KEY, (storageService.get<ManagedUser[]>(LEGACY_USERS_KEY) ?? []).map((account) => `legacy:${account.PK_id}` === id ? { ...account, ...safeInput, PK_id: account.PK_id } : account));
    }
    return this.listManagedAccounts().find((account) => account.PK_id === id) ?? null;
  },

  toggleManagedAccount(id: string): ManagedUser | null {
    requireAdmin();
    const current = this.listManagedAccounts().find((account) => account.PK_id === id);
    if (!current || current.rol === "ADMIN") return null;
    const estado = current.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    if (id.startsWith("seed:")) storageService.set(ACCOUNT_OVERRIDES_KEY, { ...readOverrides(), [id]: { ...readOverrides()[id], estado } });
    else if (id.startsWith("registered:")) storageService.set(REGISTERED_USERS_KEY, readAccounts().map((account) => registeredId(account) === id ? { ...account, estado } : account));
    else storageService.set(LEGACY_USERS_KEY, (storageService.get<ManagedUser[]>(LEGACY_USERS_KEY) ?? []).map((account) => `legacy:${account.PK_id}` === id ? { ...account, estado } : account));
    return this.listManagedAccounts().find((account) => account.PK_id === id) ?? null;
  },

  removeManagedAccount(id: string): boolean {
    requireAdmin();
    const current = this.listManagedAccounts().find((account) => account.PK_id === id);
    if (!current || current.rol === "ADMIN") return false;
    if (id.startsWith("seed:")) storageService.set(DELETED_SEED_USERS_KEY, [...new Set([...readDeletedSeedIds(), id])]);
    else if (id.startsWith("registered:")) storageService.set(REGISTERED_USERS_KEY, readAccounts().filter((account) => registeredId(account) !== id));
    else storageService.set(LEGACY_USERS_KEY, (storageService.get<ManagedUser[]>(LEGACY_USERS_KEY) ?? []).filter((account) => `legacy:${account.PK_id}` !== id));
    return true;
  },


  logout(): void {
    storageService.remove(SESSION_KEY);
  },
};

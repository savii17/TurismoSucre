import { accommodations, restaurants } from "../data/secondaryListings";
import { entertainment } from "../data/entertainment";
import { events } from "../data/events";
import { storageService } from "../services/storageService";
import { authRepository } from "./authRepository";
import type { AccommodationListing, RestaurantListing, EntertainmentRecord } from "../types/listing";
import type { EventRecord } from "../types/event";
import { publishNewContentNotification } from "./personalRepository";

export type CatalogKind = "hospedajes" | "restaurantes" | "entretenimiento" | "eventos";
export type CatalogItem = AccommodationListing | RestaurantListing | EntertainmentRecord | EventRecord;
const keys: Record<CatalogKind, string> = { hospedajes: "catalog_hospedajes_v1", restaurantes: "catalog_restaurantes_v1", entretenimiento: "catalog_entretenimiento_v1", eventos: "catalog_eventos_v1" };
const seeds: Record<CatalogKind, CatalogItem[]> = { hospedajes: accommodations, restaurantes: restaurants, entretenimiento: entertainment, eventos: events };
const idOf = (item: CatalogItem) => "id" in item ? item.id : item._id;
const requireAdmin = () => { if (!authRepository.canManage()) throw new Error("Se requiere una sesión ADMIN activa para modificar el catálogo."); };
const slug = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categoryNames: Record<CatalogKind, string> = { hospedajes: "Hospedajes", restaurantes: "Restaurantes", entretenimiento: "Entretenimiento", eventos: "Eventos y festividades" };
const publicPath = (kind: CatalogKind, id: string) => `/${kind}/${encodeURIComponent(id)}`;

export const catalogRepository = {
  list(kind: CatalogKind): CatalogItem[] {
    const saved = storageService.get<CatalogItem[]>(keys[kind]);
    return saved ?? seeds[kind].map((item) => ({ ...item }));
  },
  create(kind: CatalogKind, value: Record<string, unknown>): CatalogItem {
    requireAdmin();
    const list = this.list(kind);
    const name = String(value.name ?? value.nombre_lugar ?? "Registro turístico").trim();
    const idKey = kind === "entretenimiento" ? "_id" : "id";
    const base = slug(name) || crypto.randomUUID();
    let id = base;
    let suffix = 2;
    while (list.some((item) => idOf(item) === id)) id = `${base}-${suffix++}`;
    const now = new Date().toISOString();
    let item: CatalogItem;
    if (kind === "eventos") item = { id, name, category: String(value.category ?? "Evento cultural"), description: String(value.description ?? ""), location: String(value.location ?? "Sucre, Bolivia"), latitude: typeof value.latitude === "number" ? value.latitude : undefined, longitude: typeof value.longitude === "number" ? value.longitude : undefined, locationVerificationStatus: value.locationVerificationStatus as EventRecord["locationVerificationStatus"], status: "RECURRENTE", source: String(value.source ?? ""), phone: String(value.phone ?? ""), periodicity: String(value.periodicity ?? value.hours ?? ""), startDate: String(value.startDate ?? "") || undefined, endDate: String(value.endDate ?? "") || undefined, createdAt: now, ...(value.image ? { image: String(value.image) } : {}) };
    else if (kind === "entretenimiento") item = { _id: id, nombre_lugar: name, tipo: String(value.category ?? "Otros") as EntertainmentRecord["tipo"], ubicacion: String(value.location ?? ""), latitud: typeof value.latitud === "number" ? value.latitud : undefined, longitud: typeof value.longitud === "number" ? value.longitud : undefined, locationVerificationStatus: value.locationVerificationStatus as EntertainmentRecord["locationVerificationStatus"], descripcion: String(value.description ?? ""), telefono: String(value.phone ?? ""), horario_inicio: String(value.startTime ?? value.hours ?? ""), horario_fin: String(value.endTime ?? ""), estado: "ACTIVO", imagenes_url: value.image ? [String(value.image)] : [], servicios: Array.isArray(value.services) ? value.services as string[] : [], fecha_registro: now };
    else item = { id, name, category: String(value.category ?? (kind === "hospedajes" ? "Hospedaje" : "Restaurante")), status: "ACTIVO", location: String(value.location ?? ""), address: String(value.address ?? value.location ?? ""), latitude: typeof value.latitude === "number" ? value.latitude : undefined, longitude: typeof value.longitude === "number" ? value.longitude : undefined, locationVerificationStatus: value.locationVerificationStatus as AccommodationListing["locationVerificationStatus"], description: String(value.description ?? ""), image: String(value.image ?? ""), phone: String(value.phone ?? ""), hours: String(value.hours ?? ""), services: Array.isArray(value.services) ? value.services as string[] : [], registeredAt: now } as CatalogItem;
    if (idKey === "_id" && "_id" in item) item = { ...item, _id: id };
    const updated = [item, ...list];
    if (!storageService.set(keys[kind], updated)) throw new Error("No se pudo guardar el registro.");
    const recipients = authRepository.listManagedAccounts().filter((account) => account.rol === "USUARIO" && account.estado === "ACTIVO").map((account) => account.email);
    publishNewContentNotification(recipients, categoryNames[kind], id, name, publicPath(kind, id));
    return item;
  },
  update(kind: CatalogKind, id: string, value: Record<string, unknown>): CatalogItem | null {
    requireAdmin();
    let result: CatalogItem | null = null;
    const list = this.list(kind).map((item) => {
      if (idOf(item) !== id) return item;
      if (kind === "eventos") result = { ...item, ...value, id, updatedAt: new Date().toISOString() } as EventRecord;
      else if (kind === "entretenimiento") result = { ...item, ...value, _id: id } as EntertainmentRecord;
      else result = { ...item, ...value, id } as AccommodationListing | RestaurantListing;
      return result;
    });
    storageService.set(keys[kind], list);
    return result;
  },
  remove(kind: CatalogKind, id: string): void {
    requireAdmin();
    storageService.set(keys[kind], this.list(kind).filter((item) => idOf(item) !== id));
  },
};

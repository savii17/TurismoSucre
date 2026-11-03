import { touristPlaces as initialPlaces } from "../data/touristPlaces";
import { storageService } from "../services/storageService";
import { authRepository } from "./authRepository";
import type { TouristPlace } from "../types/listing";

const PLACES_KEY = "lugares-turisticos-v1";

export type TouristPlaceInput = Pick<TouristPlace,
  "name" | "category" | "address" | "hours" | "image" | "shortDescription" | "description" | "highlights" | "services"
> & Pick<TouristPlace, "estado"> & Partial<Pick<TouristPlace,
  "latitud" | "longitud" | "telefono" | "precio_entrada" | "registrado_por"
>>;

const seed = (): TouristPlace[] => initialPlaces.map((place) => ({
  ...place,
  estado: place.estado ?? "ACTIVO",
  nombre_lugar: place.nombre_lugar ?? place.name,
  ubicacion: place.ubicacion ?? place.address,
  descripcion: place.descripcion ?? place.description,
  imagenes_url: place.imagenes_url ?? (place.image ? [place.image] : []),
}));

const readAll = (): TouristPlace[] => {
  const stored = storageService.get<TouristPlace[]>(PLACES_KEY);
  if (stored) return stored;
  const initial = seed();
  storageService.set(PLACES_KEY, initial);
  return initial;
};

const writeAll = (items: TouristPlace[]) => storageService.set(PLACES_KEY, items);
const requireAdmin = () => {
  if (!authRepository.canManage()) throw new Error("Se requiere una sesión ADMIN activa para gestionar lugares turísticos.");
};
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const touristPlaceRepository = {
  list: readAll,
  getById(id: string | undefined) { return readAll().find((place) => place.id === id); },
  create(input: TouristPlaceInput): TouristPlace {
    requireAdmin();
    const existing = readAll();
    const baseId = slugify(input.name) || crypto.randomUUID();
    let id = baseId;
    let suffix = 2;
    while (existing.some((place) => place.id === id)) id = `${baseId}-${suffix++}`;
    const item: TouristPlace = {
      ...input,
      id,
      _id: id,
      nombre_lugar: input.name,
      ubicacion: input.address,
      descripcion: input.description,
      imagenes_url: input.image ? [input.image] : [],
      fecha_registro: new Date().toISOString(),
      locationVerificationStatus: input.latitud != null && input.longitud != null ? "VERIFICADA" : "PENDIENTE_VERIFICACION",
    };
    writeAll([item, ...existing]);
    return item;
  },
  update(id: string, input: TouristPlaceInput): TouristPlace | null {
    requireAdmin();
    let updated: TouristPlace | null = null;
    writeAll(readAll().map((place) => {
      if (place.id !== id) return place;
      updated = {
        ...place,
        ...input,
        id: place.id,
        _id: place._id ?? place.id,
        nombre_lugar: input.name,
        ubicacion: input.address,
        descripcion: input.description,
        imagenes_url: input.image ? [input.image] : [],
        locationVerificationStatus: input.latitud != null && input.longitud != null ? "VERIFICADA" : "PENDIENTE_VERIFICACION",
      };
      return updated;
    }));
    return updated;
  },
  remove(id: string): void {
    requireAdmin();
    writeAll(readAll().filter((place) => place.id !== id));
  },
};

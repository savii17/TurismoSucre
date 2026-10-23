import type { AccommodationCategory, EntertainmentCategory, RestaurantCategory, TouristPlaceCategory } from "../data/listingCategories";

export type ListingStatus = "ACTIVO" | "INACTIVO";

/** Common fields used by the existing card/detail view model. */
export type AdministrativeListing = {
  id: string;
  name: string;
  category: string;
  status: ListingStatus;
  location: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  locationVerificationStatus?: "VERIFICADA" | "PENDIENTE_VERIFICACION" | "SIN_SEDE_FIJA";
  locationSourceUrl?: string;
  phone?: string;
  hours?: string;
  openingTime?: string;
  closingTime?: string;
  image?: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  price?: string;
  services?: string[];
  registeredBy?: string;
  registeredAt?: string;
  date?: string;
};

/** Names for the existing local/mock listing view format. */
export type AccommodationListing = AdministrativeListing;
export type RestaurantListing = AdministrativeListing;

/** Existing tourist page view model, kept compatible with current components and mocks. */
export type TouristPlace = {
  id: string;
  name: string;
  category: string;
  address: string;
  hours: string;
  image: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  services: string[];
  /** Optional persisted-entity fields used by the current detail adapter. */
  _id?: string;
  nombre_lugar?: string;
  ubicacion?: string;
  localizacion?: string;
  latitud?: number;
  longitud?: number;
  locationVerificationStatus?: "VERIFICADA" | "PENDIENTE_VERIFICACION" | "SIN_SEDE_FIJA";
  locationSourceUrl?: string;
  descripcion?: string;
  horario_inicio?: string;
  horario_fin?: string;
  telefono?: string;
  precio_entrada?: number;
  calificacion?: number;
  imagenes_url?: string[];
  registrado_por?: string;
  estado?: ListingStatus;
  fecha_registro?: string;
};

/** Mongo-shaped catalog fields shared by the four future data sources. */
export type CatalogRecord = {
  _id?: string;
  nombre_lugar: string;
  ubicacion: string;
  latitud?: number;
  longitud?: number;
  locationVerificationStatus?: "VERIFICADA" | "PENDIENTE_VERIFICACION" | "SIN_SEDE_FIJA";
  locationSourceUrl?: string;
  descripcion: string;
  horario_inicio?: string;
  horario_fin?: string;
  telefono?: string;
  tipo?: string;
  calificacion?: number;
  imagenes_url?: string[];
  /** Serialized service/user references or labels until the database adapter is connected. */
  servicios?: string[];
  registrado_por?: string;
  estado: ListingStatus;
  fecha_registro?: string;
};

export type TouristPlaceRecord = Omit<CatalogRecord, "tipo"> & {
  tipo?: TouristPlaceCategory;
  precio_entrada?: number;
};

export type Accommodation = Omit<CatalogRecord, "tipo"> & {
  tipo?: AccommodationCategory;
};

export type Restaurant = Omit<CatalogRecord, "tipo"> & {
  tipo?: RestaurantCategory;
};

export type AccommodationRecord = Accommodation;
export type RestaurantRecord = Restaurant;

/** Shape of the entretenimiento collection; optional values may be absent in existing mock data. */
export type Entertainment = Omit<CatalogRecord, "_id" | "tipo" | "imagenes_url" | "servicios"> & {
  _id: string;
  tipo: EntertainmentCategory;
  imagenes_url: string[];
  servicios: string[];
};

/** Backwards-compatible name used by the current entertainment mock module. */
export type EntertainmentRecord = Entertainment;

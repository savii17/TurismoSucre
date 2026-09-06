export type ListingStatus = "ACTIVO" | "INACTIVO";

export type AdministrativeListing = {
  id: string;
  name: string;
  category: string;
  status: ListingStatus;
  location: string;
  description: string;
  image?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  services?: string[];
  date?: string;
};

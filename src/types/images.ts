export type ImageCategory =
  | "tourist-place"
  | "accommodation"
  | "restaurant"
  | "entertainment"
  | "event"
  | "emergency";

export type ImageRole = "main" | "gallery";

export type ImageItem = {
  src: string;
  source?: string;
  attribution?: string;
  license?: string;
  sourceConsultedAt?: string;
  alt: string;
  order: number;
  role: ImageRole;
};

export type ImageSet = {
  category: ImageCategory;
  main?: ImageItem;
  gallery: ImageItem[];
  fallback: string;
};

/** Keys combine category + the existing record id to prevent cross-collection collisions. */
export type ImageCatalog = Record<string, ImageSet>;

import { emergencyDirectory } from "./emergencies";
import { entertainment } from "./entertainment";
import { events as calendarEvents } from "./events";
import { accommodations, restaurants } from "./secondaryListings";
import { touristPlaces } from "./touristPlaces";
import { touristPlaceImages } from "./touristImages";
import type { ImageCatalog, ImageCategory, ImageItem, ImageSet } from "../types/images";

const fallbackByCategory: Record<ImageCategory, string> = {
  "tourist-place": "/images/fallback/fallback-tourist-place.svg",
  accommodation: "/images/fallback/fallback-accommodation.svg",
  restaurant: "/images/fallback/fallback-restaurant.svg",
  entertainment: "/images/fallback/fallback-entertainment.svg",
  event: "/images/fallback/fallback-event.svg",
  emergency: "/images/fallback/fallback-emergency.svg",
};

const knownTouristAlts: Record<string, string> = {
  "casa-de-la-libertad": "Fachada de la Casa de la Libertad en el centro histórico de Sucre",
  "parque-cretacico": "Huellas de dinosaurio de Cal Orck'o, junto al Parque Cretácico de Sucre",
  "la-recoleta": "Convento franciscano de La Recoleta en Sucre",
  "castillo-de-la-glorieta": "Castillo de La Glorieta, atractivo histórico cercano a Sucre",
  "museo-arte-indigena-asur": "Tejido tradicional expuesto por el Museo de Arte Indígena ASUR en Sucre",
  "san-felipe-neri": "Templo de San Felipe Neri en el centro histórico de Sucre",
};

const knownTouristCredits: Record<string, { source: string; attribution?: string; license?: string }> = {
  "casa-de-la-libertad": {
    source: "https://commons.wikimedia.org/wiki/File:Sucre_casa-de-la-Libertad.jpg",
    attribution: "Marcelo Claros Marzana",
    license: "CC BY-SA 3.0",
  },
  "parque-cretacico": {
    source: "https://commons.wikimedia.org/wiki/File:Parque_Cret%C3%A1cico_Cal_orcko10.jpg",
  },
  "la-recoleta": {
    source: "https://commons.wikimedia.org/wiki/File:La_Recoleta_Sucre.jpg",
    attribution: "Haruko28",
    license: "CC BY-SA 4.0",
  },
  "castillo-de-la-glorieta": {
    source: "https://commons.wikimedia.org/wiki/File:Castillo_La_Glorieta%2C_Sucre.jpg",
    attribution: "Parallelepiped09",
    license: "CC BY-SA 4.0",
  },
  "museo-arte-indigena-asur": {
    source: "https://commons.wikimedia.org/wiki/File:Tejido_Ind%C3%ADgena.jpg",
    attribution: "LuiLZ1993",
    license: "CC BY-SA 4.0",
  },
  "san-felipe-neri": {
    source: "https://commons.wikimedia.org/wiki/File:Sucre_San-Felipe-Neri.jpg",
    attribution: "Marcelo Claros",
    license: "CC BY-SA 3.0",
  },
};

const keyFor = (category: ImageCategory, id: string) => `${category}:${id}`;

type ImageCredit = Pick<ImageItem, "source" | "attribution" | "license">;

function makeImageSet(category: ImageCategory, alt: string, sources: Array<string | undefined | null>, credit?: ImageCredit): ImageSet {
  const uniqueSources = [...new Set(sources.map((source) => source?.trim()).filter((source): source is string => Boolean(source)))];
  const [mainSource, ...gallerySources] = uniqueSources;
  const main: ImageItem | undefined = mainSource
    ? { src: mainSource, source: credit?.source ?? (mainSource.startsWith("http") ? mainSource : undefined), attribution: credit?.attribution, license: credit?.license, alt, order: 0, role: "main" }
    : undefined;

  return {
    category,
    main,
    gallery: gallerySources.map((src, index) => ({ src, source: src.startsWith("http") ? src : undefined, alt: `${alt} · imagen ${index + 2}`, order: index + 1, role: "gallery" })),
    fallback: fallbackByCategory[category],
  };
}

export const imageCatalog: ImageCatalog = {
  ...Object.fromEntries(touristPlaces.map((place) => {
    const name = place.nombre_lugar ?? place.name;
    return [keyFor("tourist-place", place.id), makeImageSet(
      "tourist-place",
      knownTouristAlts[place.id] ?? `${name} en Sucre, Bolivia`,
      [touristPlaceImages[place.id], ...(place.imagenes_url ?? []), ...(place.image && !place.image.startsWith("/") ? [place.image] : [])],
      knownTouristCredits[place.id],
    )];
  })),
  ...Object.fromEntries(accommodations.map((item) => [keyFor("accommodation", item.id), makeImageSet(
    "accommodation", `Exterior o espacio interior de ${item.name}, hospedaje en Sucre`, [item.image, ...(item.images ?? [])],
  )])),
  ...Object.fromEntries(restaurants.map((item) => [keyFor("restaurant", item.id), makeImageSet(
    "restaurant", `${item.name}, restaurante en Sucre`, [item.image, ...(item.images ?? [])],
  )])),
  ...Object.fromEntries(entertainment.map((item) => [keyFor("entertainment", item._id), makeImageSet(
    "entertainment", `${item.nombre_lugar}, establecimiento de entretenimiento en Sucre`, item.imagenes_url,
  )])),
  ...Object.fromEntries(calendarEvents.map((item) => [keyFor("event", item.id), makeImageSet(
    "event", `${item.name}, celebración realizada en Sucre`, [item.image],
  )])),
  ...Object.fromEntries(emergencyDirectory.map((item) => [keyFor("emergency", item.PK_id), makeImageSet(
    "emergency", `${item.nombre_lugar}, servicio de emergencia de Sucre`, [],
  )])),
};

export const getImageSet = (category: ImageCategory, id: string, extraSources: string[] = []): ImageSet => {
  const found = imageCatalog[keyFor(category, id)];
  if (found) {
    if (!extraSources.length) return found;
    const knownSources = new Set([found.main?.src, ...found.gallery.map((image) => image.src)]);
    const additions = extraSources
      .map((src) => src.trim())
      .filter((src) => src && !knownSources.has(src))
      .map((src, index) => ({
        src,
        source: src.startsWith("http") ? src : undefined,
        alt: `${found.main?.alt ?? id} · imagen adicional ${index + 1}`,
        order: found.gallery.length + index + 1,
        role: "gallery" as const,
      }));
    return additions.length ? { ...found, gallery: [...found.gallery, ...additions] } : found;
  }
  return makeImageSet(category, `${id} en Sucre, Bolivia`, extraSources);
};

export const getFallbackImage = (category: ImageCategory) => fallbackByCategory[category];

export type ImageCatalogIssue = {
  record: string;
  issue: "missing-main" | "missing-gallery" | "missing-alt" | "duplicate-source" | "unavailable-asset";
  src?: string;
};

/** Structural audit; pass an asset checker to also verify local or remote URLs. */
export function validateImageCatalog(
  catalog: ImageCatalog = imageCatalog,
  assetExists?: (src: string) => boolean,
): ImageCatalogIssue[] {
  const issues: ImageCatalogIssue[] = [];
  const seenSources = new Map<string, string>();

  Object.entries(catalog).forEach(([record, set]) => {
    if (!set.main) issues.push({ record, issue: "missing-main" });
    if (!set.gallery.length) issues.push({ record, issue: "missing-gallery" });
    const images = [...(set.main ? [set.main] : []), ...set.gallery];
    images.forEach((image) => {
      if (!image.alt.trim()) issues.push({ record, issue: "missing-alt", src: image.src });
      const previousRecord = seenSources.get(image.src);
      if (previousRecord && previousRecord !== record) issues.push({ record, issue: "duplicate-source", src: image.src });
      else seenSources.set(image.src, record);
      if (assetExists && !assetExists(image.src)) issues.push({ record, issue: "unavailable-asset", src: image.src });
    });
    if (assetExists && !assetExists(set.fallback)) issues.push({ record, issue: "unavailable-asset", src: set.fallback });
  });

  return issues;
}

/** Browser-side check can verify image load errors without requiring cross-origin fetch/CORS. */
export async function validateImageLoads(catalog: ImageCatalog = imageCatalog): Promise<ImageCatalogIssue[]> {
  const sources = new Map<string, string>();
  Object.entries(catalog).forEach(([record, set]) => {
    [...(set.main ? [set.main] : []), ...set.gallery].forEach((image) => sources.set(image.src, record));
    sources.set(set.fallback, record);
  });

  return Promise.all([...sources].map(([src, record]) => new Promise<ImageCatalogIssue | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(null);
    image.onerror = () => resolve({ record, issue: "unavailable-asset", src });
    image.src = src;
  }))).then((issues) => issues.filter((issue): issue is ImageCatalogIssue => issue !== null));
}

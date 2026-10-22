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
  "casa-de-la-libertad": "Patio histórico de la Casa de la Libertad en Sucre, Bolivia",
  "parque-cretacico": "Escultura de dinosaurio en el Parque Cretácico de Sucre, Bolivia",
  "la-recoleta": "Convento franciscano de La Recoleta en Sucre",
  "castillo-de-la-glorieta": "Castillo de La Glorieta, atractivo histórico cercano a Sucre",
  "museo-arte-indigena-asur": "Tejido tradicional expuesto por el Museo de Arte Indígena ASUR en Sucre",
  "san-felipe-neri": "Templo de San Felipe Neri en el centro histórico de Sucre",
  "plaza-25-de-mayo": "Plaza 25 de Mayo en el centro histórico de Sucre, Bolivia",
  "catedral-metropolitana-de-sucre": "Fachada de la Catedral Metropolitana de Sucre, Bolivia",
  "parque-simon-bolivar": "Torre Eiffel ornamental del Parque Simón Bolívar en Sucre",
  "cementerio-general-de-sucre": "Alameda arbolada del Cementerio General de Sucre",
  "teatro-gran-mariscal-sucre": "Fachada del Teatro Gran Mariscal de Sucre",
  "templo-santo-domingo": "Interior del templo histórico de Santo Domingo en Sucre",
  "templo-santa-clara": "Claustro del Convento de Santa Clara en Sucre",
  "templo-museo-san-francisco-de-asis": "Fachada de la Basílica de San Francisco en Sucre",
};

const knownTouristCredits: Record<string, { source: string; attribution?: string; license?: string; sourceConsultedAt: string }> = {
  "casa-de-la-libertad": {
    source: "https://commons.wikimedia.org/wiki/File:Casa_de_la_Libertad_Sucre.jpg",
    attribution: "Henry Ponce Barco",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "parque-cretacico": {
    source: "https://commons.wikimedia.org/wiki/File:Parque_Cret%C3%A1cico_Cal_orcko.jpg",
    attribution: "Caleidoscopic",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "la-recoleta": {
    source: "https://commons.wikimedia.org/wiki/File:La_Recoleta_Sucre.jpg",
    attribution: "Haruko28",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "castillo-de-la-glorieta": {
    source: "https://commons.wikimedia.org/wiki/File:Castillo_La_Glorieta%2C_Sucre.jpg",
    attribution: "Parallelepiped09",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "museo-arte-indigena-asur": {
    source: "https://commons.wikimedia.org/wiki/File:Tejido_Ind%C3%ADgena.jpg",
    attribution: "LuiLZ1993",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "san-felipe-neri": {
    source: "https://commons.wikimedia.org/wiki/File:Sucre_San-Felipe-Neri.jpg",
    attribution: "Marcelo Claros",
    license: "CC BY-SA 3.0",
    sourceConsultedAt: "2026-10-22",
  },
  "plaza-25-de-mayo": {
    source: "https://commons.wikimedia.org/wiki/File:The_25th_of_May_Plaza.jpg",
    attribution: "THE WORLDWIDE BOX",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "catedral-metropolitana-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Catedral_Sucre.jpg",
    attribution: "AbbyCF12",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "parque-simon-bolivar": {
    source: "https://commons.wikimedia.org/wiki/File:Parque_Sim%C3%B3n_Bol%C3%ADvar,_Sucre.jpg",
    attribution: "Mx._Granger",
    license: "CC0 1.0",
    sourceConsultedAt: "2026-10-22",
  },
  "cementerio-general-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Cementerio_General_de_Sucre.jpg",
    attribution: "Mx._Granger",
    license: "CC0 1.0",
    sourceConsultedAt: "2026-10-22",
  },
  "teatro-gran-mariscal-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Teatro_de_Sucre,_Bolivia.jpg",
    attribution: "Parallelepiped09",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "templo-santo-domingo": {
    source: "https://commons.wikimedia.org/wiki/File:Iglesia_Santo_Domingo_Sucre_Bolivia.jpg",
    attribution: "Yamuzine",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "templo-santa-clara": {
    source: "https://commons.wikimedia.org/wiki/File:Vista_amplia_del_Convento_Santa_Clara.jpg",
    attribution: "Pablo Torrez",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "templo-museo-san-francisco-de-asis": {
    source: "https://commons.wikimedia.org/wiki/File:Iglesia_de_San_francisco2.jpg",
    attribution: "Noverth",
    license: "CC BY-SA 3.0",
    sourceConsultedAt: "2026-10-22",
  },
};

const keyFor = (category: ImageCategory, id: string) => `${category}:${id}`;

type ImageCredit = Pick<ImageItem, "source" | "attribution" | "license" | "sourceConsultedAt">;

function makeImageSet(category: ImageCategory, alt: string, sources: Array<string | undefined | null>, credit?: ImageCredit): ImageSet {
  const uniqueSources = [...new Set(sources.map((source) => source?.trim()).filter((source): source is string => Boolean(source)))];
  const [mainSource, ...gallerySources] = uniqueSources;
  const main: ImageItem | undefined = mainSource
    ? { src: mainSource, source: credit?.source ?? (mainSource.startsWith("http") ? mainSource : undefined), attribution: credit?.attribution, license: credit?.license, sourceConsultedAt: credit?.sourceConsultedAt, alt, order: 0, role: "main" }
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

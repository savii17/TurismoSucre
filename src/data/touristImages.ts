/**
 * Fotografías reales de atractivos turísticos de Sucre.
 * Imágenes principales locales de atractivos de Sucre. La procedencia,
 * autoría y licencia se conservan en imageCatalog.ts.
 */
export const touristPlaceImages: Record<string, string> = {
  "casa-de-la-libertad":
    "/images/tourist-places/casa-de-la-libertad.jpg",
  "parque-cretacico":
    "/images/tourist-places/parque-cretacico.jpg",
  "la-recoleta":
    "/images/tourist-places/la-recoleta.jpg",
  "castillo-de-la-glorieta":
    "/images/tourist-places/castillo-de-la-glorieta.jpg",
  "museo-arte-indigena-asur":
    "/images/tourist-places/museo-arte-indigena-asur.jpg",
  "san-felipe-neri":
    "/images/tourist-places/san-felipe-neri.jpg",
  "plaza-25-de-mayo": "/images/tourist-places/plaza-25-de-mayo.jpg",
  "catedral-metropolitana-de-sucre": "/images/tourist-places/catedral-metropolitana-de-sucre.jpg",
  "parque-simon-bolivar": "/images/tourist-places/parque-simon-bolivar.jpg",
  "cementerio-general-de-sucre": "/images/tourist-places/cementerio-general-de-sucre.jpg",
  "teatro-gran-mariscal-sucre": "/images/tourist-places/teatro-gran-mariscal-sucre.jpg",
  "templo-santo-domingo": "/images/tourist-places/templo-santo-domingo.jpg",
  "templo-santa-clara": "/images/tourist-places/templo-santa-clara.jpg",
  "templo-museo-san-francisco-de-asis": "/images/tourist-places/templo-museo-san-francisco-de-asis.jpg",
};

export const getTouristPlaceImage = (id: string, fallback: string) =>
  touristPlaceImages[id] ?? fallback;

export const touristHeroImages = [
  touristPlaceImages["casa-de-la-libertad"],
  touristPlaceImages["parque-cretacico"],
  touristPlaceImages["la-recoleta"],
  touristPlaceImages["castillo-de-la-glorieta"],
] as const;

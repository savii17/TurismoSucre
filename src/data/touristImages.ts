/**
 * Fotografías reales de atractivos turísticos de Sucre.
 * Imágenes principales locales de atractivos de Sucre. La procedencia,
 * autoría y licencia se conservan en imageCatalog.ts.
 */
export const touristPlaceImages: Record<string, string> = {
  "casa-de-la-libertad":
    "/images/tourist-places/casa-de-la-libertad-main.jpg",
  "parque-cretacico":
    "/images/tourist-places/parque-cretacico-main.jpg",
  "la-recoleta":
    "/images/tourist-places/la-recoleta-main.jpg",
  "castillo-de-la-glorieta":
    "/images/tourist-places/castillo-de-la-glorieta-main.jpg",
  "museo-arte-indigena-asur":
    "/images/tourist-places/museo-arte-indigena-asur-main.jpg",
  "san-felipe-neri":
    "/images/tourist-places/san-felipe-neri-main.jpg",
  "plaza-25-de-mayo": "/images/tourist-places/plaza-25-de-mayo-main.jpg",
  "catedral-metropolitana-de-sucre": "/images/tourist-places/catedral-metropolitana-de-sucre-main.jpg",
  "parque-simon-bolivar": "/images/tourist-places/parque-simon-bolivar-main.jpg",
  "cementerio-general-de-sucre": "/images/tourist-places/cementerio-general-de-sucre-main.jpg",
  "teatro-gran-mariscal-sucre": "/images/tourist-places/teatro-gran-mariscal-sucre-main.jpg",
  "templo-santo-domingo": "/images/tourist-places/templo-santo-domingo-main.jpg",
  "templo-santa-clara": "/images/tourist-places/templo-santa-clara-main.jpg",
  "templo-museo-san-francisco-de-asis": "/images/tourist-places/templo-museo-san-francisco-de-asis-main.jpg",
  "plaza-pedro-de-anzures": "/images/tourist-places/plaza-pedro-de-anzures-main.jpg",
  "palacete-el-guereo": "/images/tourist-places/palacete-el-guereo-main.jpg",
  "museo-santa-teresa": "/images/tourist-places/museo-santa-teresa-main.jpg",
  "templo-san-lazaro": "/images/tourist-places/templo-san-lazaro-main.jpg",
  "archivo-y-biblioteca-nacionales-de-bolivia": "/images/tourist-places/archivo-y-biblioteca-nacionales-de-bolivia-main.jpg",
  "casa-municipal-de-cultura-simon-roncal": "/images/tourist-places/casa-municipal-de-cultura-simon-roncal-main.jpg",
  "obelisco-de-sucre": "/images/tourist-places/obelisco-de-sucre-main.jpg",
  "ex-estacion-ferroviaria-de-sucre": "/images/tourist-places/ex-estacion-ferroviaria-de-sucre-main.jpg",
  "museo-colonial-charcas": "/images/tourist-places/museo-colonial-charcas-main.jpg",
  "mercado-central-de-sucre": "/images/tourist-places/mercado-central-de-sucre-main.jpg",
  "arco-del-triunfo-de-sucre": "/images/tourist-places/arco-del-triunfo-de-sucre-main.jpg",
  "museo-de-la-catedral-de-sucre": "/images/tourist-places/museo-de-la-catedral-de-sucre-main.jpg",
  "callejones-de-los-gatos": "/images/tourist-places/callejones-de-los-gatos-main.jpg",
  "museo-del-tesoro": "/images/tourist-places/museo-del-tesoro-main.jpg",
  "museo-antropologico-usfx": "/images/tourist-places/museo-antropologico-usfx-main.png",
  "museo-alfredo-gutierrez-valenzuela": "/images/tourist-places/museo-alfredo-gutierrez-valenzuela-main.jpg",
  "templo-san-miguel": "/images/tourist-places/templo-san-miguel-main.jpg",
  "templo-santa-ana": "/images/tourist-places/templo-santa-ana-main.jpg",
  "palacio-consistorial-de-sucre": "/images/tourist-places/palacio-consistorial-de-sucre-main.jpg",
};

export const getTouristPlaceImage = (id: string, fallback: string) =>
  touristPlaceImages[id] ?? fallback;

export const touristHeroImages = [
  touristPlaceImages["casa-de-la-libertad"],
  touristPlaceImages["parque-cretacico"],
  touristPlaceImages["la-recoleta"],
  touristPlaceImages["castillo-de-la-glorieta"],
] as const;

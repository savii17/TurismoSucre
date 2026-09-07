/**
 * Fotografías reales de atractivos turísticos de Sucre.
 * Las imágenes se cargan desde Wikimedia Commons para evitar depender
 * de archivos locales que todavía no estén dentro de public/.
 */
export const touristPlaceImages: Record<string, string> = {
  "casa-de-la-libertad":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sucre_casa-de-la-Libertad.jpg",
  "parque-cretacico":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Parque_Cret%C3%A1cico_Cal_orcko10.jpg",
  "la-recoleta":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/La_recoleta_Sucre.jpg",
  "castillo-de-la-glorieta":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Castillo_La_Glorieta%2C_Sucre.jpg",
  "museo-arte-indigena-asur":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tejido_Ind%C3%ADgena.jpg",
  "san-felipe-neri":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sucre_San-Felipe-Neri.jpg",
};

export const getTouristPlaceImage = (id: string, fallback: string) =>
  touristPlaceImages[id] ?? fallback;

export const touristHeroImages = [
  touristPlaceImages["casa-de-la-libertad"],
  touristPlaceImages["parque-cretacico"],
  touristPlaceImages["la-recoleta"],
  touristPlaceImages["castillo-de-la-glorieta"],
] as const;

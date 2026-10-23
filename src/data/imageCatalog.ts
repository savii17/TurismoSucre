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
  "plaza-pedro-de-anzures": "Vista de la Plaza Pedro de Anzúres desde los arcos del convento de La Recoleta en Sucre, Bolivia",
  "palacete-el-guereo": "Fachada del Palacete del Guereo en Sucre, Bolivia",
  "museo-santa-teresa": "Patio interior del Convento y Museo Santa Teresa en Sucre, Bolivia",
  "templo-san-lazaro": "Fachada principal del Templo de San Lázaro en Sucre, Bolivia",
  "archivo-y-biblioteca-nacionales-de-bolivia": "Fachada del Archivo y Biblioteca Nacionales de Bolivia en Sucre",
  "casa-municipal-de-cultura-simon-roncal": "Fachada de la Casa Municipal de Cultura Simeón Tadeo Roncal Gallardo en Sucre",
  "obelisco-de-sucre": "Obelisco en un jardín del centro histórico de Sucre, Bolivia",
  "ex-estacion-ferroviaria-de-sucre": "Edificio de la antigua estación ferroviaria de Sucre, Bolivia",
  "museo-colonial-charcas": "Fuente del segundo patio del Museo Universitario Colonial Charcas en Sucre",
  "mercado-central-de-sucre": "Puestos y actividad comercial del Mercado Central de Sucre, Bolivia",
  "arco-del-triunfo-de-sucre": "Arco del Triunfo en el Parque Simón Bolívar de Sucre, Bolivia",
  "museo-de-la-catedral-de-sucre": "Interior del Museo de la Catedral de Sucre, Bolivia",
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
  "plaza-pedro-de-anzures": {
    source: "https://commons.wikimedia.org/wiki/File:La_Recoleta_-_plaza.jpg",
    attribution: "Mx._Granger",
    license: "CC0 1.0",
    sourceConsultedAt: "2026-10-22",
  },
  "palacete-el-guereo": {
    source: "https://commons.wikimedia.org/wiki/File:Palacete_del_Guereo.jpg",
    attribution: "Ev.anabelc",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "museo-santa-teresa": {
    source: "https://commons.wikimedia.org/wiki/File:Convento_Santa_Teresa_Sucre.jpg",
    attribution: "Pablo Torrez",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "templo-san-lazaro": {
    source: "https://commons.wikimedia.org/wiki/File:Templo_de_San_L%C3%A1zaro_Sucre-Bolivia.jpg",
    attribution: "Ev.anabelc",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "archivo-y-biblioteca-nacionales-de-bolivia": {
    source: "https://commons.wikimedia.org/wiki/File:Archivo_y_Biblioteca_Nacionales_de_Bolivia_1.jpg",
    attribution: "Mx._Granger",
    license: "CC0 1.0",
    sourceConsultedAt: "2026-10-22",
  },
  "casa-municipal-de-cultura-simon-roncal": {
    source: "https://commons.wikimedia.org/wiki/File:Casa_Municipal_de_la_cultura_%22Sime%C3%B3n_Tadeo_Roncal_Gallardo%22_-_Sucre.jpg",
    attribution: "Vanett Graneros",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "obelisco-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:El_Obelisco_de_la_Ciudad_de_Sucre.jpg",
    attribution: "Parallelepiped09",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "ex-estacion-ferroviaria-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Sucre_Old_Station.JPG",
    attribution: "Nils Öberg",
    license: "CC BY-SA 3.0",
    sourceConsultedAt: "2026-10-22",
  },
  "museo-colonial-charcas": {
    source: "https://commons.wikimedia.org/wiki/File:Vista_de_segundo_patio_del_Museo.jpg",
    attribution: "Belcc",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "mercado-central-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Mercado_Central_de_la_ciudad_de_Sucre.jpg",
    attribution: "Vanett Graneros",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "arco-del-triunfo-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Triomfboog_parque_bolivar.jpg",
    attribution: "BraveNewWorld",
    license: "CC BY-SA 2.0 Belgium",
    sourceConsultedAt: "2026-10-22",
  },
  "museo-de-la-catedral-de-sucre": {
    source: "https://commons.wikimedia.org/wiki/File:Museo_de_la_catedral_Sucre.jpg",
    attribution: "Pablo Torrez",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
};

const keyFor = (category: ImageCategory, id: string) => `${category}:${id}`;

type ImageCredit = Pick<ImageItem, "source" | "attribution" | "license" | "sourceConsultedAt">;

const knownEventImages: Record<string, { main: string; gallery?: string[] }> = {
  "festividad-virgen-guadalupe": {
    main: "/images/events/festividad-virgen-guadalupe-main.jpg",
    gallery: ["/images/events/festividad-virgen-guadalupe-gallery-01.jpg"],
  },
  "entrada-folklorica-virgen-guadalupe": {
    main: "/images/events/entrada-folklorica-virgen-guadalupe-main.jpg",
    gallery: [
      "/images/events/entrada-folklorica-virgen-guadalupe-gallery-01.jpg",
      "/images/events/entrada-folklorica-virgen-guadalupe-gallery-02.jpg",
    ],
  },
  "todos-santos-sucre": {
    main: "/images/events/todos-santos-sucre-main.jpg",
  },
};

const knownEventCredits: Record<string, ImageCredit> = {
  "/images/events/festividad-virgen-guadalupe-main.jpg": {
    source: "https://commons.wikimedia.org/wiki/File:DANZA_DE_LOS_THANTA_MORENOS_DE_LA_COMUNIDAD_DE_THAQOS_PARTICIPANDO_EN_LA_ENTRADA_DE_LA_VIRGEN_DE_GUADALUPE_EN_LA_CIUDAD_DE_SUCRE_DONDE_SE_%C3%99EDE_APRECIAR_AL_PERSONAJE_DEL_DIABLO%2C_DEL_AWELO_Y_EL_LE%C3%92N.jpg",
    attribution: "Quisromtomy",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "/images/events/festividad-virgen-guadalupe-gallery-01.jpg": {
    source: "https://commons.wikimedia.org/wiki/File:DANZA_DE_LOS_THANTA_MORENOS_DE_LA_COMUNIDAD_DE_THAQOS_PARTICIPANDO_EN_LA_ENTRADA_DE_LA_VIRGEN_DE_GUADALUPE_EN_LA_CIUDAD_DE_SUCRE_DONDE_SE_APRECIA_AL_PERSONAJE_DEL_MONITO_Y_EL_LE%C3%92N.jpg",
    attribution: "Quisromtomy",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "/images/events/entrada-folklorica-virgen-guadalupe-main.jpg": {
    source: "https://commons.wikimedia.org/wiki/File:Caporales_Centralistas_(37177760406).jpg",
    attribution: "Freddy Bayo (Flickr: freddy7arte); imagen redimensionada desde Wikimedia Commons",
    license: "CC BY-SA 2.0",
    sourceConsultedAt: "2026-10-22",
  },
  "/images/events/entrada-folklorica-virgen-guadalupe-gallery-01.jpg": {
    source: "https://commons.wikimedia.org/wiki/File:Caporales_en_la_Entrada_de_la_Virgen_de_Guadalupe_2025.jpg",
    attribution: "LuiLZ1993",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "/images/events/entrada-folklorica-virgen-guadalupe-gallery-02.jpg": {
    source: "https://commons.wikimedia.org/wiki/File:Morenada_en_la_Entrada_Virgen_de_Guadalupe_(Sucre)_2025.jpg",
    attribution: "LuiLZ1993",
    license: "CC BY-SA 4.0",
    sourceConsultedAt: "2026-10-22",
  },
  "/images/events/todos-santos-sucre-main.jpg": {
    source: "https://commons.wikimedia.org/wiki/File:Panala_de_Todos_Santos_Chuquisaque%C3%B1a.jpg",
    attribution: "Aleledezma",
    license: "CC BY 4.0",
    sourceConsultedAt: "2026-10-22",
  },
};

const knownAccommodationImages: Record<string, string> = {
  "hotel-independencia": "/images/accommodations/hotel-independencia-main.jpg",
  "hostal-colonial": "/images/accommodations/hostal-colonial-main.webp",
  "mi-pueblo-samary": "/images/accommodations/mi-pueblo-samary-main.jpg",
  "hotel-villa-antigua": "/images/accommodations/hotel-villa-antigua-main.jpg",
  "parador-santa-maria-la-real": "/images/accommodations/parador-santa-maria-la-real-main.jpg",
  "hotel-de-su-merced": "/images/accommodations/hotel-de-su-merced-main.webp",
  "on-hotel-boutique": "/images/accommodations/on-hotel-boutique-main.jpg",
  "hotel-boutique-la-posada": "/images/accommodations/hotel-boutique-la-posada-main.webp",
  "san-marino-royal-hotel": "/images/accommodations/san-marino-royal-hotel-main.jpg",
  "hotel-san-felipe": "/images/accommodations/hotel-san-felipe-main.jpg",
  "hotel-premier": "/images/accommodations/hotel-premier-main.jpg",
  "hotel-real-audiencia": "/images/accommodations/hotel-real-audiencia-main.webp",
  "hotel-monasterio": "/images/accommodations/hotel-monasterio-main.jpg",
  "hostal-sucre": "/images/accommodations/hostal-sucre-main.jpg",
  "hostal-pachamama": "/images/accommodations/hostal-pachamama-main.jpg",
  "hospedaje-sarabia": "/images/accommodations/hospedaje-sarabia-main.jpg",
  "cittadella-hostal": "/images/accommodations/cittadella-hostal-main.png",
  "la-escondida-hostal": "/images/accommodations/la-escondida-hostal-main.jpg",
};

const knownAccommodationCredits: Record<string, ImageCredit> = {
  "hotel-independencia": { source: "https://www.tripadvisor.es/Hotel_Review-g295432-d632188-Reviews-Hotel_Independencia-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "hostal-colonial": { source: "https://destinia.com/es/hoteles/america-del-sur/bolivia/sucre/sucre/hostal-colonial/ho-23703", sourceConsultedAt: "2026-10-22" },
  "mi-pueblo-samary": { source: "https://www.minube.com/rincon/mi-pueblo-samary-hotel-boutique-a2059780", sourceConsultedAt: "2026-10-22" },
  "hotel-villa-antigua": { source: "https://correodelsur.com/ecos/20190210/hotel-villa-antigua-mas-de-400-anos-de-historia.html", sourceConsultedAt: "2026-10-22" },
  "parador-santa-maria-la-real": { source: "https://www.vanverre.nl/bolivia/hotels", sourceConsultedAt: "2026-10-22" },
  "hotel-de-su-merced": { source: "https://hoteldesumerced.com/es/inicio/", sourceConsultedAt: "2026-10-22" },
  "on-hotel-boutique": { source: "https://www.myboutiquehotel.com/en/boutique-hotels-sucre/on-hotel-boutique.html", sourceConsultedAt: "2026-10-22" },
  "hotel-boutique-la-posada": { source: "https://hotellaposada.com.bo/", sourceConsultedAt: "2026-10-22" },
  "san-marino-royal-hotel": { source: "https://www.boliviaentusmanos.com/amarillas/businesscard/san-marino-royal.html", sourceConsultedAt: "2026-10-22" },
  "hotel-san-felipe": { source: "https://www.agoda.com/hotel-san-felipe/hotel/sucre-bo.html", sourceConsultedAt: "2026-10-22" },
  "hotel-premier": { source: "https://www.soysucre.info/es/hotel-premier/", sourceConsultedAt: "2026-10-22" },
  "hotel-real-audiencia": { source: "https://destinia.com/es/hoteles/america-del-sur/bolivia/sucre/sucre/real-audiencia/ho-85018", sourceConsultedAt: "2026-10-22" },
  "hotel-monasterio": { source: "https://www.centraldereservas.com/hoteles/bolivia/chuquisaca/sucre/hotel-monasterio", sourceConsultedAt: "2026-10-22" },
  "hostal-sucre": { source: "https://www.tripadvisor.com/Hotel_Review-g295432-d607377-Reviews-Hostal_Sucre-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "hostal-pachamama": { source: "https://www.skyscanner.gg/hotels/bolivia/sucre-hotels/hostal-pachamama/ht-160813331", sourceConsultedAt: "2026-10-22" },
  "hospedaje-sarabia": { source: "https://hotelsbolivia.com/sucre/hospedaje-sarabia", sourceConsultedAt: "2026-10-22" },
  "cittadella-hostal": { source: "https://www.cittadellahostal.com/Cittadella/Index.html", sourceConsultedAt: "2026-10-22" },
  "la-escondida-hostal": { source: "https://www.tripadvisor.com/Hotel_Review-g295432-d15137635-Reviews-Hostal_La_Escondida-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
};

const knownAccommodationAlts: Record<string, string> = {
  "hotel-independencia": "Fachada de Hotel Independencia en Sucre, Bolivia",
  "hostal-colonial": "Habitación doble del Hostal Colonial en Sucre, Bolivia",
  "mi-pueblo-samary": "Fachada colonial de Mi Pueblo Samary Hotel Boutique en Sucre",
  "hotel-villa-antigua": "Fachada patrimonial del Hotel Villa Antigua en Sucre",
  "parador-santa-maria-la-real": "Patio colonial del Parador Santa María La Real en Sucre",
  "hotel-de-su-merced": "Terraza y patio del Hotel de Su Merced en Sucre",
  "on-hotel-boutique": "Terraza de On Hotel Boutique en Sucre",
  "hotel-boutique-la-posada": "Patio interior del Hotel Boutique La Posada en Sucre",
  "san-marino-royal-hotel": "Fachada del San Marino Royal Hotel en Sucre",
  "hotel-san-felipe": "Patio y comedor del Hotel San Felipe en Sucre",
  "hotel-premier": "Recepción interior del Hotel Premier en Sucre",
  "hotel-real-audiencia": "Patio interior del Hotel Real Audiencia en Sucre",
  "hotel-monasterio": "Fachada colonial del Hotel Monasterio en Sucre",
  "hostal-sucre": "Patio colonial del Hostal Sucre en Sucre, Bolivia",
  "hostal-pachamama": "Fachada del Hostal Pachamama en Sucre",
  "hospedaje-sarabia": "Habitación del Hospedaje Sarabia en Sucre",
  "cittadella-hostal": "Fachada de Cittadella Hostal en Sucre",
  "la-escondida-hostal": "Patio exterior de La Escondida Hostal en Sucre",
};

const knownRestaurantImages: Record<string, string> = {
  "restaurant-el-solar": "/images/restaurants/restaurant-el-solar-main.jpg",
  "la-taverne": "/images/restaurants/la-taverne-main.jpg",
  "el-huerto-restaurante": "/images/restaurants/el-huerto-restaurante-main.jpg",
  "pizzeria-napolitana": "/images/restaurants/pizzeria-napolitana-main.jpg",
  "time-coffee-parque-bolivar": "/images/restaurants/time-coffee-parque-bolivar-main.jpg",
  "time-coffee-recoleta": "/images/restaurants/time-coffee-recoleta-main.jpg",
  "cafe-mirador-san-miguel": "/images/restaurants/cafe-mirador-san-miguel-main.jpg",
  "cafe-florin": "/images/restaurants/cafe-florin-main.jpg",
  "cosmo-cafe-restaurante": "/images/restaurants/cosmo-cafe-restaurante-main.jpg",
  "picanteria-dona-irma": "/images/restaurants/picanteria-dona-irma-main.jpg",
  "la-posada-restaurante": "/images/restaurants/la-posada-restaurante-main.jpg",
  "antojos-cafe": "/images/restaurants/antojos-cafe-main.jpg",
  "el-germen": "/images/restaurants/el-germen-main.jpg",
  "restaurante-rolos": "/images/restaurants/restaurante-rolos-main.jpg",
  "azafran-restaurant": "/images/restaurants/azafran-restaurant-main.jpg",
};

const knownRestaurantCredits: Record<string, ImageCredit> = {
  "restaurant-el-solar": { source: "https://www.tripadvisor.com/Restaurant_Review-g295432-d10179078-Reviews-Restaurant_El_Solar-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "la-taverne": { source: "https://www.tripadvisor.com/Restaurant_Review-g295432-d1069738-Reviews-La_Taverne-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "el-huerto-restaurante": { source: "https://www.tripadvisor.co/Restaurants-g295432-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "pizzeria-napolitana": { source: "https://www.tripadvisor.es/Restaurant_Review-g295432-d6961081-Reviews-Pizzeria_Napolitana-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "time-coffee-parque-bolivar": { source: "https://www.sluurpy.com/es/sucre/restaurant/5474558/caf%C3%A9-time-and-coffee", sourceConsultedAt: "2026-10-23" },
  "time-coffee-recoleta": { source: "https://www.tripadvisor.es/LocationPhotoDirectLink-g295432-d12378584-i416186172-Cafe_Time_Coffee-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-23" },
  "cafe-mirador-san-miguel": { source: "https://www.soysucre.info/es/cafe-mirador-san-miguel/", sourceConsultedAt: "2026-10-22" },
  "cafe-florin": { source: "https://cafe-restaurant-florin.goto-where.com/", sourceConsultedAt: "2026-10-22" },
  "cosmo-cafe-restaurante": { source: "https://www.soysucre.info/cosmo-cafe/", sourceConsultedAt: "2026-10-22" },
  "picanteria-dona-irma": { source: "https://pedidosdeuna.com/4246307-picanteria-dona-irma.html", sourceConsultedAt: "2026-10-23" },
  "antojos-cafe": { source: "https://gacetamunicipalsucre.gob.bo/docs/normas/reglamento/33508/rg.m-054-2022-reglamento-de-anuncios-y-letreros-para-el-centro-historico-de-sucre.pdf", sourceConsultedAt: "2026-10-23" },
  "el-germen": { source: "https://www.happycow.net/reviews/el-germen-sucre-15722", sourceConsultedAt: "2026-10-23" },
  "restaurante-rolos": { source: "https://www.tripadvisor.es/Restaurant_Review-g295432-d10666883-Reviews-Rolo_s_Restaurante-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-23" },
  "la-posada-restaurante": { source: "https://www.tripadvisor.com/Hotel_Review-g295432-d1603959-Reviews-Hotel_Boutique_La_Posada-Sucre_Chuquisaca_Department.html", sourceConsultedAt: "2026-10-22" },
  "azafran-restaurant": { source: "https://correodelsur.com/capitales/20211207/azafran-restaurant-catering-vuelve-renovado.html", sourceConsultedAt: "2026-10-22" },
};

const knownRestaurantAlts: Record<string, string> = {
  "restaurant-el-solar": "Interior del Restaurant El Solar en Sucre, Bolivia",
  "la-taverne": "Patio del restaurante La Taverne en Sucre, Bolivia",
  "el-huerto-restaurante": "Jardín del restaurante El Huerto en Sucre, Bolivia",
  "pizzeria-napolitana": "Entrada de Pizzería Napolitana en la Plaza 25 de Mayo de Sucre",
  "time-coffee-parque-bolivar": "Fachada nocturna de Café Time & Coffee junto a su letrero en Sucre, Bolivia",
  "time-coffee-recoleta": "Interior de Café Time & Coffee en su sucursal de La Recoleta, Sucre",
  "cafe-mirador-san-miguel": "Acceso al Café Mirador San Miguel en la iglesia San Miguel de Sucre",
  "cafe-florin": "Fachada del Café Florin en Sucre, Bolivia",
  "cosmo-cafe-restaurante": "Fachada de Cosmo Café Restaurante en la Plaza 25 de Mayo de Sucre",
  "picanteria-dona-irma": "Puchero del menú de Picantería Doña Irma, Sucre",
  "la-posada-restaurante": "Patio comedor del restaurante La Posada en Sucre, Bolivia",
  "antojos-cafe": "Letrero colgante de Café Antojos en Sucre, Bolivia",
  "el-germen": "Letrero del menú del día de El Germen Café en Sucre, Bolivia",
  "restaurante-rolos": "Comedor de Rolo's Restaurante con el rótulo del local en Sucre",
  "azafran-restaurant": "Comedor del Azafrán Restaurant en Sucre, Bolivia",
};

function makeImageSet(
  category: ImageCategory,
  alt: string,
  sources: Array<string | undefined | null>,
  credit?: ImageCredit,
  galleryCredits: Record<string, ImageCredit> = {},
): ImageSet {
  const uniqueSources = [...new Set(sources.map((source) => source?.trim()).filter((source): source is string => Boolean(source)))];
  const [mainSource, ...gallerySources] = uniqueSources;
  const main: ImageItem | undefined = mainSource
    ? { src: mainSource, source: credit?.source ?? (mainSource.startsWith("http") ? mainSource : undefined), attribution: credit?.attribution, license: credit?.license, sourceConsultedAt: credit?.sourceConsultedAt, alt, order: 0, role: "main" }
    : undefined;

  return {
    category,
    main,
    gallery: gallerySources.map((src, index) => {
      const galleryCredit = galleryCredits[src];
      return {
        src,
        source: galleryCredit?.source ?? (src.startsWith("http") ? src : undefined),
        attribution: galleryCredit?.attribution,
        license: galleryCredit?.license,
        sourceConsultedAt: galleryCredit?.sourceConsultedAt,
        alt: `${alt} · imagen ${index + 2}`,
        order: index + 1,
        role: "gallery" as const,
      };
    }),
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
    "accommodation", knownAccommodationAlts[item.id] ?? `Exterior o espacio interior de ${item.name}, hospedaje en Sucre`, [knownAccommodationImages[item.id], item.image, ...(item.images ?? [])], knownAccommodationCredits[item.id],
  )])),
  ...Object.fromEntries(restaurants.map((item) => [keyFor("restaurant", item.id), makeImageSet(
    "restaurant", knownRestaurantAlts[item.id] ?? `${item.name}, restaurante en Sucre, Bolivia`, [knownRestaurantImages[item.id], item.image, ...(item.images ?? [])], knownRestaurantCredits[item.id],
  )])),
  ...Object.fromEntries(entertainment.map((item) => [keyFor("entertainment", item._id), makeImageSet(
    "entertainment", `${item.nombre_lugar}, establecimiento de entretenimiento en Sucre`, item.imagenes_url,
  )])),
  ...Object.fromEntries(calendarEvents.map((item) => [keyFor("event", item.id), makeImageSet(
    "event",
    item.id === "festividad-virgen-guadalupe"
      ? "Danza Thanta Morenos de la comunidad de Thaqos durante la Entrada de la Virgen de Guadalupe en Sucre, Bolivia"
      : item.id === "entrada-folklorica-virgen-guadalupe"
        ? "Danzarinas caporales durante la Entrada de la Virgen de Guadalupe en Sucre, Bolivia"
        : item.id === "todos-santos-sucre"
          ? "Panala chuquisaqueña, preparación tradicional de Todos Santos para ofrendar a los difuntos"
          : `${item.name}, celebración realizada en Sucre`,
    [knownEventImages[item.id]?.main, ...(knownEventImages[item.id]?.gallery ?? []), item.image],
    knownEventCredits[knownEventImages[item.id]?.main ?? ""],
    knownEventCredits,
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

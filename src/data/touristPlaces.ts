import type { TouristPlace } from "../types/listing";
import { additionalTouristPlaces, touristPlaceSources } from "./touristPlacesAdditional";

export type { TouristPlace } from "../types/listing";

export const touristPlaces: TouristPlace[] = [
  {
    id: "casa-de-la-libertad",
    name: "Casa de la Libertad",
    category: "Patrimonio histórico",
    address: "Plaza 25 de Mayo N.º 11, Sucre",
    latitud: -19.0474713,
    longitud: -65.2603846,
    hours: "",
    image: "/images/tourist-places/casa-de-la-libertad-main.jpg",
    shortDescription:
      "Museo histórico donde se conserva la memoria de la independencia de Bolivia.",
    description:
      "La Casa de la Libertad es uno de los principales espacios históricos de Sucre. El edificio está vinculado a la historia de la independencia de Bolivia y conserva salas, documentos y objetos relacionados con la historia colonial y republicana del país.",
    highlights: [
      "Salón de la Independencia",
      "Patrimonio histórico",
      "Colecciones históricas",
    ],
    services: [],
  },
  {
    id: "parque-cretacico",
    name: "Parque Cretácico",
    category: "Paleontología",
    address: "Carretera a Cochabamba km 5, Sucre",
    latitud: -19.0066667,
    longitud: -65.2361111,
    hours: "Lun. a vie. · 09:00 – 17:00 · Sáb. y dom. · 10:00 – 17:00",
    image: "/images/tourist-places/parque-cretacico-main.jpg",
    shortDescription:
      "Parque paleontológico ubicado junto al yacimiento de huellas de dinosaurios de Cal Orck'o.",
    description:
      "El Parque Cretácico se encuentra a unos 5 kilómetros del centro de Sucre, en la zona de Cal Orck'o. Su principal atractivo es el gran farallón con miles de huellas de dinosaurios del período Cretácico, uno de los yacimientos icnológicos más importantes de Bolivia.",
    highlights: [
      "Huellas de dinosaurios",
      "Cal Orck'o",
      "Museo paleontológico",
    ],
    services: [],
  },
  {
    id: "la-recoleta",
    name: "La Recoleta",
    category: "Miradores",
    address: "Plaza Pedro de Anzúrez, Cerro Churuquella, Sucre",
    latitud: -19.054687,
    longitud: -65.25343,
    hours: "",
    image: "/images/tourist-places/la-recoleta-main.jpg",
    shortDescription:
      "Conjunto histórico franciscano y uno de los miradores más conocidos de Sucre.",
    description:
      "La Recoleta se encuentra en las faldas del cerro Churuquella y reúne el templo y antiguo convento franciscano, la plaza Pedro de Anzúrez y un mirador con una vista amplia de la ciudad de Sucre.",
    highlights: [
      "Mirador de La Recoleta",
      "Plaza Pedro de Anzúrez",
      "Templo y convento franciscano",
    ],
    services: [],
  },
  {
    id: "castillo-de-la-glorieta",
    name: "Castillo de La Glorieta",
    category: "Patrimonio histórico",
    address: "Km 5, carretera Sucre – Potosí",
    latitud: -19.08466,
    longitud: -65.26861,
    hours: "",
    image: "/images/tourist-places/castillo-de-la-glorieta-main.jpg",
    shortDescription:
      "Monumento histórico de arquitectura singular ubicado a pocos kilómetros de Sucre.",
    description:
      "El Castillo de La Glorieta fue construido para Francisco Argandoña y Clotilde Urioste de Argandoña. Su arquitectura combina diferentes estilos europeos y el conjunto incluye jardines y espacios históricos. Se encuentra aproximadamente a 5 kilómetros de Sucre, sobre la carretera a Potosí.",
    highlights: [
      "Arquitectura ecléctica",
      "Jardines históricos",
      "Monumento Nacional",
    ],
    services: [],
  },
  {
    id: "museo-arte-indigena-asur",
    name: "Museo de Arte Indígena ASUR",
    category: "Museos",
    address: "Pasaje Agustín Iturricha N.º 314, Sucre",
    latitud: -19.0538,
    longitud: -65.253884,
    hours: "Mon. to Fri. · 09:00 – 12:15 and 14:30 – 18:00 · Sat. · 09:00 – 12:00 and 14:30 – 18:00",
    image: "/images/tourist-places/museo-arte-indigena-asur-main.jpg",
    shortDescription:
      "Museo dedicado a los tejidos tradicionales y a las expresiones culturales indígenas de Chuquisaca.",
    description:
      "El Museo de Arte Indígena ASUR presenta tejidos y expresiones textiles de comunidades jalq'a y tarabuco. El museo forma parte de un programa de revitalización del arte indígena y permite conocer técnicas, diseños y significados de la tradición textil de la región.",
    highlights: [
      "Textiles jalq'a",
      "Textiles tarabuco",
      "Arte indígena boliviano",
    ],
    services: [],
  },
  {
    id: "san-felipe-neri",
    name: "Templo de San Felipe Neri",
    category: "Iglesias y templos",
    address: "Calle Nicolás Ortiz N.º 165, esquina Colón, Sucre",
    latitud: -19.0499986,
    longitud: -65.2611267,
    hours: "Mon. to Sat. · 14:30 – 17:30",
    image: "/images/tourist-places/san-felipe-neri-main.jpg",
    shortDescription:
      "Templo neoclásico con una terraza que ofrece una vista panorámica del centro de Sucre.",
    description:
      "El Templo de San Felipe Neri fue construido entre finales del siglo XVIII y comienzos del XIX. Destaca por su arquitectura neoclásica, sus elementos artísticos y su terraza, desde donde se puede observar parte del centro histórico de Sucre.",
    highlights: [
      "Arquitectura neoclásica",
      "Terraza panorámica",
      "Patrimonio histórico",
    ],
    services: [],
  },
  ...additionalTouristPlaces,
];

const verifiedTouristLocationSources: Record<string, string> = {
  "casa-de-la-libertad": "https://es.wikipedia.org/wiki/Casa_de_la_Libertad",
  "parque-cretacico": "https://es.wikipedia.org/wiki/Parque_Cret%C3%A1cico",
  "la-recoleta": "https://es.wikipedia.org/wiki/La_Recoleta",
  "castillo-de-la-glorieta": "https://es.wikipedia.org/wiki/Castillo_de_La_Glorieta",
  "museo-arte-indigena-asur": "https://www.fundacionasur.org.bo/museo/direccion_museo.html",
  "san-felipe-neri": "https://es.wikipedia.org/wiki/Convento_de_San_Felipe_de_Neri_(Sucre)",
};
touristPlaces.forEach((place) => {
  place.locationVerificationStatus = place.latitud != null && place.longitud != null
    ? "VERIFICADA"
    : "PENDIENTE_VERIFICACION";
  place.locationSourceUrl = verifiedTouristLocationSources[place.id] ?? touristPlaceSources[place.id];
});

export const getTouristPlaceById = (id: string | undefined) =>
  touristPlaces.find((place) => place.id === id);

const englishPlaces: Record<
  string,
  Omit<TouristPlace, "id" | "image">
> = {
  "casa-de-la-libertad": {
    name: "House of Liberty",
    category: "Historic heritage",
    address: "25 de Mayo Square No. 11, Sucre",
    hours: "",
    shortDescription:
      "Historic museum preserving the memory of Bolivia's independence.",
    description:
      "The House of Liberty is one of Sucre's main historic spaces. The building is closely connected with Bolivia's independence and preserves rooms, documents and objects related to the country's colonial and republican history.",
    highlights: [
      "Independence Hall",
      "Historic heritage",
      "Historical collections",
    ],
    services: [],
  },
  "parque-cretacico": {
    name: "Cretaceous Park",
    category: "Paleontology",
    address: "Cochabamba Highway km 5, Sucre",
    hours: "Mon. to Fri. · 09:00 – 17:00 · Sat. and Sun. · 10:00 – 17:00",
    shortDescription:
      "Paleontological park located beside the Cal Orck'o dinosaur tracksite.",
    description:
      "Cretaceous Park is located about 5 kilometers from downtown Sucre, in the Cal Orck'o area. Its main attraction is the large cliff containing thousands of dinosaur footprints from the Cretaceous period, one of Bolivia's most important ichnological sites.",
    highlights: [
      "Dinosaur footprints",
      "Cal Orck'o",
      "Paleontological museum",
    ],
    services: [],
  },
  "la-recoleta": {
    name: "La Recoleta",
    category: "Viewpoints",
    address: "Pedro de Anzúrez Square, Churuquella Hill, Sucre",
    hours: "",
    shortDescription:
      "Historic Franciscan complex and one of Sucre's best-known viewpoints.",
    description:
      "La Recoleta is located on the slopes of Churuquella Hill and includes the Franciscan temple and former convent, Pedro de Anzúrez Square and a viewpoint with broad views over Sucre.",
    highlights: [
      "La Recoleta viewpoint",
      "Pedro de Anzúrez Square",
      "Franciscan temple and convent",
    ],
    services: [],
  },
  "castillo-de-la-glorieta": {
    name: "La Glorieta Castle",
    category: "Historic heritage",
    address: "Km 5, Sucre – Potosí Highway",
    hours: "",
    shortDescription:
      "Historic monument with distinctive architecture located a few kilometers from Sucre.",
    description:
      "La Glorieta Castle was built for Francisco Argandoña and Clotilde Urioste de Argandoña. Its architecture combines different European styles, and the complex includes historic gardens and spaces. It is located approximately 5 kilometers from Sucre on the road to Potosí.",
    highlights: [
      "Eclectic architecture",
      "Historic gardens",
      "National Monument",
    ],
    services: [],
  },
  "museo-arte-indigena-asur": {
    name: "ASUR Museum of Indigenous Art",
    category: "Museums",
    address: "Agustín Iturricha Passage No. 314, Sucre",
    hours: "Mon. to Fri. · 09:00 – 12:15 and 14:30 – 18:00 · Sat. · 09:00 – 12:00 and 14:30 – 18:00",
    shortDescription:
      "Museum dedicated to traditional textiles and indigenous cultural expressions of Chuquisaca.",
    description:
      "The ASUR Museum of Indigenous Art presents textiles and cultural expressions from Jalq'a and Tarabuco communities. The museum is part of a program that promotes the revitalization of indigenous art and allows visitors to learn about textile techniques, designs and meanings.",
    highlights: [
      "Jalq'a textiles",
      "Tarabuco textiles",
      "Bolivian indigenous art",
    ],
    services: [],
  },
  "san-felipe-neri": {
    name: "San Felipe Neri Temple",
    category: "Churches and temples",
    address: "Nicolás Ortiz Street No. 165, corner of Colón, Sucre",
    hours: "Mon. to Sat. · 14:30 – 17:30",
    shortDescription:
      "Neoclassical temple with a terrace offering panoramic views of central Sucre.",
    description:
      "San Felipe Neri Temple was built between the late eighteenth and early nineteenth centuries. It stands out for its neoclassical architecture, artistic elements and terrace, which offers views over part of Sucre's historic center.",
    highlights: [
      "Neoclassical architecture",
      "Panoramic terrace",
      "Historic heritage",
    ],
    services: [],
  },
};

export const getLocalizedTouristPlace = (
  place: TouristPlace,
  language: "es" | "en"
): TouristPlace => {
  if (language === "en") {
    const englishPlace = englishPlaces[place.id];

    if (englishPlace) {
      return {
        ...place,
        ...englishPlace,
      };
    }
  }

  return place;
};

/** Compatibilidad con HomePage: usa los primeros registros existentes sin duplicarlos. */
export const featuredTouristPlaces: TouristPlace[] = touristPlaces.slice(0, 4);

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
  /** Campos de la entidad lugar_turistico. */
  nombre_lugar?: string;
  ubicacion?: string;
  localizacion?: string;
  latitud?: number;
  longitud?: number;
  descripcion?: string;
  horario_inicio?: string;
  horario_fin?: string;
  precio_entrada?: number;
  calificacion?: number;
  imagenes_url?: string[];
  registrado_por?: string;
  estado?: string;
  fecha_registro?: string;
};

export const touristPlaces: TouristPlace[] = [
  {
    id: "casa-de-la-libertad",
    name: "Casa de la Libertad",
    category: "Historia",
    address: "Plaza 25 de Mayo N.º 11, Sucre",
    hours: "Lun. a vie. · 08:30 – 16:30 · Sáb. y dom. · 09:00 – 13:00",
    image: "/images/lugares-turisticos/casa-de-la-libertad.jpg",
    shortDescription:
      "Museo histórico donde se conserva la memoria de la independencia de Bolivia.",
    description:
      "La Casa de la Libertad es uno de los principales espacios históricos de Sucre. El edificio está vinculado a la historia de la independencia de Bolivia y conserva salas, documentos y objetos relacionados con la historia colonial y republicana del país.",
    highlights: [
      "Salón de la Independencia",
      "Patrimonio histórico",
      "Colecciones históricas",
    ],
    services: [
      "Visitas guiadas",
      "Información histórica",
      "Exposiciones",
    ],
  },
  {
    id: "parque-cretacico",
    name: "Parque Cretácico",
    category: "Paleontología",
    address: "Carretera a Cochabamba km 5, Sucre",
    hours: "Lun. a vie. · 09:00 – 17:00 · Sáb. y dom. · 10:00 – 17:00",
    image: "/images/lugares-turisticos/parque-cretacico.jpg",
    shortDescription:
      "Parque paleontológico ubicado junto al yacimiento de huellas de dinosaurios de Cal Orck'o.",
    description:
      "El Parque Cretácico se encuentra a unos 5 kilómetros del centro de Sucre, en la zona de Cal Orck'o. Su principal atractivo es el gran farallón con miles de huellas de dinosaurios del período Cretácico, uno de los yacimientos icnológicos más importantes de Bolivia.",
    highlights: [
      "Huellas de dinosaurios",
      "Cal Orck'o",
      "Museo paleontológico",
    ],
    services: [
      "Guías",
      "Estacionamiento",
      "Recorrido turístico",
    ],
  },
  {
    id: "la-recoleta",
    name: "La Recoleta",
    category: "Patrimonio religioso",
    address: "Plaza Pedro de Anzúrez, Cerro Churuquella, Sucre",
    hours: "Horario de visita sujeto a la atención del templo y museo",
    image: "/images/lugares-turisticos/la-recoleta.jpg",
    shortDescription:
      "Conjunto histórico franciscano y uno de los miradores más conocidos de Sucre.",
    description:
      "La Recoleta se encuentra en las faldas del cerro Churuquella y reúne el templo y antiguo convento franciscano, la plaza Pedro de Anzúrez y un mirador con una vista amplia de la ciudad de Sucre.",
    highlights: [
      "Mirador de La Recoleta",
      "Plaza Pedro de Anzúrez",
      "Templo y convento franciscano",
    ],
    services: [
      "Mirador",
      "Espacios de descanso",
      "Cafeterías cercanas",
    ],
  },
  {
    id: "castillo-de-la-glorieta",
    name: "Castillo de La Glorieta",
    category: "Arquitectura histórica",
    address: "Km 5, carretera Sucre – Potosí",
    hours: "Mar. a vie. · 09:00 – 17:00 · Sáb. y dom. · 10:00 – 16:00",
    image: "/images/lugares-turisticos/castillo-de-la-glorieta.jpg",
    shortDescription:
      "Monumento histórico de arquitectura singular ubicado a pocos kilómetros de Sucre.",
    description:
      "El Castillo de La Glorieta fue construido para Francisco Argandoña y Clotilde Urioste de Argandoña. Su arquitectura combina diferentes estilos europeos y el conjunto incluye jardines y espacios históricos. Se encuentra aproximadamente a 5 kilómetros de Sucre, sobre la carretera a Potosí.",
    highlights: [
      "Arquitectura ecléctica",
      "Jardines históricos",
      "Monumento Nacional",
    ],
    services: [
      "Visitas guiadas",
      "Recorrido histórico",
      "Áreas exteriores",
    ],
  },
  {
    id: "museo-arte-indigena-asur",
    name: "Museo de Arte Indígena ASUR",
    category: "Arte y cultura",
    address: "Pasaje Agustín Iturricha N.º 314, Sucre",
    hours: "Lun. a vie. · 09:00 – 12:15 y 14:30 – 18:00 · Sáb. · 09:00 – 12:00 y 14:30 – 18:00",
    image: "/images/lugares-turisticos/museo-arte-indigena-asur.jpg",
    shortDescription:
      "Museo dedicado a los tejidos tradicionales y a las expresiones culturales indígenas de Chuquisaca.",
    description:
      "El Museo de Arte Indígena ASUR presenta tejidos y expresiones textiles de comunidades jalq'a y tarabuco. El museo forma parte de un programa de revitalización del arte indígena y permite conocer técnicas, diseños y significados de la tradición textil de la región.",
    highlights: [
      "Textiles jalq'a",
      "Textiles tarabuco",
      "Arte indígena boliviano",
    ],
    services: [
      "Exposición permanente",
      "Información cultural",
      "Venta de artesanías",
    ],
  },
  {
    id: "san-felipe-neri",
    name: "Templo de San Felipe Neri",
    category: "Patrimonio religioso",
    address: "Calle Nicolás Ortiz N.º 165, esquina Colón, Sucre",
    hours: "Lun. a sáb. · 14:30 – 17:30",
    image: "/images/lugares-turisticos/san-felipe-neri.jpg",
    shortDescription:
      "Templo neoclásico con una terraza que ofrece una vista panorámica del centro de Sucre.",
    description:
      "El Templo de San Felipe Neri fue construido entre finales del siglo XVIII y comienzos del XIX. Destaca por su arquitectura neoclásica, sus elementos artísticos y su terraza, desde donde se puede observar parte del centro histórico de Sucre.",
    highlights: [
      "Arquitectura neoclásica",
      "Terraza panorámica",
      "Patrimonio histórico",
    ],
    services: [
      "Visitas",
      "Información histórica",
      "Vista panorámica",
    ],
  },
];

export const getTouristPlaceById = (id: string | undefined) =>
  touristPlaces.find((place) => place.id === id);

const englishPlaces: Record<
  string,
  Omit<TouristPlace, "id" | "image">
> = {
  "casa-de-la-libertad": {
    name: "House of Liberty",
    category: "History",
    address: "25 de Mayo Square No. 11, Sucre",
    hours: "Mon. to Fri. · 08:30 – 16:30 · Sat. and Sun. · 09:00 – 13:00",
    shortDescription:
      "Historic museum preserving the memory of Bolivia's independence.",
    description:
      "The House of Liberty is one of Sucre's main historic spaces. The building is closely connected with Bolivia's independence and preserves rooms, documents and objects related to the country's colonial and republican history.",
    highlights: [
      "Independence Hall",
      "Historic heritage",
      "Historical collections",
    ],
    services: [
      "Guided visits",
      "Historical information",
      "Exhibitions",
    ],
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
    services: [
      "Guides",
      "Parking",
      "Tourist route",
    ],
  },
  "la-recoleta": {
    name: "La Recoleta",
    category: "Religious heritage",
    address: "Pedro de Anzúrez Square, Churuquella Hill, Sucre",
    hours: "Visiting hours subject to temple and museum service",
    shortDescription:
      "Historic Franciscan complex and one of Sucre's best-known viewpoints.",
    description:
      "La Recoleta is located on the slopes of Churuquella Hill and includes the Franciscan temple and former convent, Pedro de Anzúrez Square and a viewpoint with broad views over Sucre.",
    highlights: [
      "La Recoleta viewpoint",
      "Pedro de Anzúrez Square",
      "Franciscan temple and convent",
    ],
    services: [
      "Viewpoint",
      "Rest areas",
      "Nearby cafés",
    ],
  },
  "castillo-de-la-glorieta": {
    name: "La Glorieta Castle",
    category: "Historic architecture",
    address: "Km 5, Sucre – Potosí Highway",
    hours: "Tue. to Fri. · 09:00 – 17:00 · Sat. and Sun. · 10:00 – 16:00",
    shortDescription:
      "Historic monument with distinctive architecture located a few kilometers from Sucre.",
    description:
      "La Glorieta Castle was built for Francisco Argandoña and Clotilde Urioste de Argandoña. Its architecture combines different European styles, and the complex includes historic gardens and spaces. It is located approximately 5 kilometers from Sucre on the road to Potosí.",
    highlights: [
      "Eclectic architecture",
      "Historic gardens",
      "National Monument",
    ],
    services: [
      "Guided visits",
      "Historical tour",
      "Outdoor areas",
    ],
  },
  "museo-arte-indigena-asur": {
    name: "ASUR Museum of Indigenous Art",
    category: "Art and culture",
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
    services: [
      "Permanent exhibition",
      "Cultural information",
      "Handicraft sales",
    ],
  },
  "san-felipe-neri": {
    name: "San Felipe Neri Temple",
    category: "Religious heritage",
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
    services: [
      "Visits",
      "Historical information",
      "Panoramic view",
    ],
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

/**
 * Registros de muestra con la forma de la entidad `lugar_turistico`.
 * `imagenes_url` queda vacío hasta que las imágenes reales estén disponibles
 * en el almacenamiento o en public/.
 */
export const featuredTouristPlaces: TouristPlace[] = [
  {
    id: "casa-de-la-libertad",
    name: "Casa de la Libertad",
    nombre_lugar: "Casa de la Libertad",
    category: "Historia",
    address: "Plaza 25 de Mayo N.º 11, Sucre",
    ubicacion: "Plaza 25 de Mayo N.º 11, Sucre",
    localizacion: "Sucre, Chuquisaca, Bolivia",
    latitud: -19.0472,
    longitud: -65.2594,
    hours: "Lun. a vie. · 08:30 – 16:30 · Sáb. y dom. · 09:00 – 13:00",
    horario_inicio: "08:30",
    horario_fin: "16:30",
    image: "/images/lugares-turisticos/casa-de-la-libertad.jpg",
    imagenes_url: ["/images/lugares-turisticos/casa-de-la-libertad.jpg"],
    shortDescription: "Museo histórico vinculado a la independencia de Bolivia.",
    descripcion: "Museo histórico ubicado en la Plaza 25 de Mayo de Sucre y relacionado con la historia de la independencia de Bolivia.",
    description: "Museo histórico ubicado en la Plaza 25 de Mayo de Sucre y relacionado con la historia de la independencia de Bolivia.",
    precio_entrada: 20,
    calificacion: 4.8,
    highlights: ["Salón de la Independencia", "Patrimonio histórico"],
    services: ["Visitas guiadas", "Exposiciones"],
    registrado_por: "Administrador",
    estado: "ACTIVO",
    fecha_registro: "2026-09-07",
  },
  {
    id: "parque-cretacico",
    name: "Parque Cretácico",
    nombre_lugar: "Parque Cretácico",
    category: "Paleontología",
    address: "Carretera a Cochabamba km 5, Sucre",
    ubicacion: "Cal Orck'o, carretera a Cochabamba km 5",
    localizacion: "Sucre, Chuquisaca, Bolivia",
    latitud: -19.0897,
    longitud: -65.2364,
    hours: "Lun. a vie. · 09:00 – 17:00 · Sáb. y dom. · 10:00 – 17:00",
    horario_inicio: "09:00",
    horario_fin: "17:00",
    image: "/images/lugares-turisticos/parque-cretacico.jpg",
    imagenes_url: ["/images/lugares-turisticos/parque-cretacico.jpg"],
    shortDescription: "Parque paleontológico junto al yacimiento de huellas de Cal Orck'o.",
    descripcion: "El Parque Cretácico se encuentra a unos 5 km del centro de Sucre y permite conocer el yacimiento de huellas de dinosaurios de Cal Orck'o.",
    description: "El Parque Cretácico se encuentra a unos 5 km del centro de Sucre y permite conocer el yacimiento de huellas de dinosaurios de Cal Orck'o.",
    precio_entrada: 20,
    calificacion: 4.7,
    highlights: ["Huellas de dinosaurios", "Cal Orck'o"],
    services: ["Guías", "Estacionamiento", "Recorrido turístico"],
    registrado_por: "Administrador",
    estado: "ACTIVO",
    fecha_registro: "2026-09-07",
  },
  {
    id: "la-recoleta",
    name: "La Recoleta",
    nombre_lugar: "La Recoleta",
    category: "Patrimonio religioso",
    address: "Plaza Pedro de Anzúrez, Cerro Churuquella, Sucre",
    ubicacion: "Plaza Pedro de Anzúrez, Cerro Churuquella",
    localizacion: "Sucre, Chuquisaca, Bolivia",
    latitud: -19.0551,
    longitud: -65.2626,
    hours: "Horario de visita sujeto a la atención del templo y museo",
    horario_inicio: "",
    horario_fin: "",
    image: "/images/lugares-turisticos/la-recoleta.jpg",
    imagenes_url: ["/images/lugares-turisticos/la-recoleta.jpg"],
    shortDescription: "Conjunto franciscano y mirador histórico de Sucre.",
    descripcion: "La Recoleta reúne el templo y antiguo convento franciscano, la plaza Pedro de Anzúrez y un mirador con vistas de la ciudad.",
    description: "La Recoleta reúne el templo y antiguo convento franciscano, la plaza Pedro de Anzúrez y un mirador con vistas de la ciudad.",
    precio_entrada: 0,
    calificacion: 4.8,
    highlights: ["Mirador", "Plaza Pedro de Anzúrez", "Patrimonio franciscano"],
    services: ["Mirador", "Espacios de descanso"],
    registrado_por: "Administrador",
    estado: "ACTIVO",
    fecha_registro: "2026-09-07",
  },
  {
    id: "castillo-de-la-glorieta",
    name: "Castillo de La Glorieta",
    nombre_lugar: "Castillo de La Glorieta",
    category: "Arquitectura histórica",
    address: "Km 5, carretera Sucre – Potosí",
    ubicacion: "Km 5, carretera Sucre – Potosí",
    localizacion: "Sucre, Chuquisaca, Bolivia",
    latitud: -19.0906,
    longitud: -65.2684,
    hours: "Mar. a vie. · 09:00 – 17:00 · Sáb. y dom. · 10:00 – 16:00",
    horario_inicio: "09:00",
    horario_fin: "17:00",
    image: "/images/lugares-turisticos/castillo-de-la-glorieta.jpg",
    imagenes_url: ["/images/lugares-turisticos/castillo-de-la-glorieta.jpg"],
    shortDescription: "Monumento histórico de arquitectura singular en las afueras de Sucre.",
    descripcion: "El Castillo de La Glorieta es un monumento histórico ubicado aproximadamente a 5 km de Sucre, sobre la carretera a Potosí.",
    description: "El Castillo de La Glorieta es un monumento histórico ubicado aproximadamente a 5 km de Sucre, sobre la carretera a Potosí.",
    precio_entrada: 10,
    calificacion: 4.6,
    highlights: ["Arquitectura ecléctica", "Jardines históricos"],
    services: ["Visitas guiadas", "Recorrido histórico"],
    registrado_por: "Administrador",
    estado: "ACTIVO",
    fecha_registro: "2026-09-07",
  },
];

import type { TouristPlace } from "../types/listing";

type VerifiedPlace = Pick<TouristPlace, "id" | "name" | "category" | "address" | "shortDescription" | "description"> & {
  latitud?: number;
  longitud?: number;
  source: string;
  status?: "ACTIVO" | "INACTIVO";
};

const ministryGuide = "https://conocebolivia.turismoyculturas.gob.bo/wp-content/uploads/2025/11/P-BoliviaTeEspera.pdf";
const municipalTourism = "https://sucre.bo/la-direccion-municipal-de-turismo-realiza-la-apertura-del-corredor-turistico-del-barrio-santa-ana/";
const municipalMuseumEvent = "https://sucre.bo/la-florida-el-guereo-y-el-parque-cretacico-se-preparan-para-la-noche-de-museos/";
const municipalHeritage = "https://sucre.bo/fachadas-y-monumentos-historicos-cuentan-con-iluminacion-decorativa/";
const municipalGuide = "https://sucre.bo/wp-content/uploads/2024/04/GUIA-TURISTICA.pdf";

/** Fuentes verificadas separadas del modelo persistido lugar_turistico. */
export const touristPlaceSources: Record<string, string> = {};
Object.assign(touristPlaceSources, {
  "casa-de-la-libertad": "https://casadelalibertad.org.bo/sobre-el-museo/",
  "parque-cretacico": "https://parquecretacicosucre.com/esp/parque-horarios.html",
  "castillo-de-la-glorieta": ministryGuide,
  "la-recoleta": municipalTourism,
  "museo-arte-indigena-asur": "https://www.fundacionasur.org.bo/museo/direccion_museo.html",
  "san-felipe-neri": municipalGuide,
});

const place = ({ id, name, category, address, shortDescription, description, latitud, longitud, source, status = "ACTIVO" }: VerifiedPlace): TouristPlace => {
  touristPlaceSources[id] = source;
  return {
    id,
    name,
    nombre_lugar: name,
    category,
    address,
    latitud,
    longitud,
    ubicacion: address,
    hours: "",
    image: "",
    shortDescription,
    description,
    descripcion: description,
    highlights: [],
    services: [],
    imagenes_url: [],
    estado: status,
  };
};

/** Atractivos que no estaban en el inventario inicial y cuentan con fuente institucional. */
export const additionalTouristPlaces: TouristPlace[] = [
  place({ id: "plaza-25-de-mayo", name: "Plaza 25 de Mayo", category: "Plazas y espacios urbanos", address: "Plaza 25 de Mayo, Sucre, Bolivia", latitud: -19.0479, longitud: -65.25952, shortDescription: "Plaza principal del centro histórico de Sucre.", description: "Espacio urbano patrimonial situado en el centro histórico de Sucre e incluido entre los atractivos turísticos de la ciudad.", source: "https://mapcarta.com/es/28024210" }),
  place({ id: "catedral-metropolitana-de-sucre", name: "Catedral Metropolitana de Sucre", category: "Iglesias y templos", address: "Plaza 25 de Mayo, Sucre, Bolivia", latitud: -19.04854, longitud: -65.26021, shortDescription: "Templo histórico del centro de Sucre.", description: "La Catedral Metropolitana forma parte del patrimonio religioso y arquitectónico de Sucre y fue incluida por el Gobierno Municipal entre las siete maravillas turísticas de la ciudad.", source: "https://es.wikipedia.org/wiki/Catedral_bas%C3%ADlica_de_Nuestra_Se%C3%B1ora_de_Guadalupe_(Sucre)" }),
  place({ id: "mercado-central-de-sucre", name: "Mercado Central de Sucre", category: "Plazas y espacios urbanos", address: "Centro de Sucre, Bolivia", shortDescription: "Mercado tradicional incluido entre los atractivos urbanos de Sucre.", description: "El Mercado Central es un espacio comercial tradicional de la ciudad, mencionado entre los atractivos turísticos de Sucre en material oficial de promoción nacional.", source: ministryGuide }),
  place({ id: "parque-simon-bolivar", name: "Parque Simón Bolívar", category: "Plazas y espacios urbanos", address: "Sucre, Bolivia", latitud: -19.0418969, longitud: -65.2643732, shortDescription: "Espacio recreativo urbano reconocido como atractivo turístico de Sucre.", description: "El Parque Simón Bolívar figura entre los atractivos urbanos de Sucre en la guía turística del Ministerio de Culturas y Turismo.", source: "https://es.wikipedia.org/wiki/Parque_Sim%C3%B3n_Bol%C3%ADvar_(Sucre)" }),
  place({ id: "cementerio-general-de-sucre", name: "Cementerio General de Sucre", category: "Patrimonio histórico", address: "Sucre, Bolivia", latitud: -19.05243, longitud: -65.26861, shortDescription: "Cementerio histórico que forma parte de recorridos turísticos municipales.", description: "El Gobierno Autónomo Municipal de Sucre organiza recorridos turísticos y actividades culturales en el Cementerio General.", source: "https://mapcarta.com/W111545261" }),
  place({ id: "plaza-pedro-de-anzures", name: "Plaza Pedro de Anzúres", category: "Plazas y espacios urbanos", address: "Barrio Santa Ana, Sucre, Bolivia", shortDescription: "Plaza histórica que forma parte del corredor turístico del barrio Santa Ana.", description: "La Dirección Municipal de Turismo incluyó la Plaza Pedro de Anzúres como punto del corredor turístico del barrio Santa Ana.", source: municipalTourism }),
  place({ id: "capilla-tata-solano", name: "Capilla Tata Solano", category: "Iglesias y templos", address: "Barrio Santa Ana, Sucre, Bolivia", shortDescription: "Capilla histórica del barrio Santa Ana, incluida en un recorrido municipal.", description: "La Capilla Tata Solano es uno de los puntos del corredor turístico del barrio Santa Ana identificado por la Dirección Municipal de Turismo.", source: municipalTourism }),
  place({ id: "callejones-de-los-gatos", name: "Callejones de los Gatos", category: "Plazas y espacios urbanos", address: "Barrio Santa Ana, Sucre, Bolivia", shortDescription: "Conjunto de callejones tradicionales del barrio Santa Ana.", description: "Los Callejones de los Gatos forman parte del recorrido turístico barrial promovido por la Dirección Municipal de Turismo de Sucre.", source: municipalTourism }),
  place({ id: "palacete-el-guereo", name: "Palacete El Guereo", category: "Patrimonio histórico", address: "Barrio Santa Ana, Sucre, Bolivia", shortDescription: "Edificación patrimonial de 1892 incluida en el corredor turístico de Santa Ana.", description: "El Palacete El Guereo, construido en 1892 según el Gobierno Municipal, forma parte del corredor turístico del barrio Santa Ana.", source: municipalTourism }),
  place({ id: "museo-del-nino-tanga-tanga", name: "Museo del Niño Tanga Tanga", category: "Museos", address: "Plazuela de La Recoleta, Sucre, Bolivia", shortDescription: "Espacio cultural municipal actualmente en proceso de recuperación.", description: "En mayo de 2026 el GAMS informó que el museo estaba deteriorado y anunció su recuperación y futura reapertura. Se marca inactivo hasta que se confirme su reapertura.", source: "https://sucre.bo/%F0%9D%97%94%F0%9D%97%9F%F0%9D%97%96%F0%9D%97%94%F0%9D%97%9F%F0%9D%97%97i%F0%9D%97%94-%F0%9D%97%98%F0%9D%97%AB%F0%9D%97%A3%F0%9D%97%A2%F0%9D%97%A1%F0%9D%97%98-%F0%9D%97%98%F0%9D%97%9F-%F0%9D%97%98/", status: "INACTIVO" }),
  place({ id: "museo-del-tesoro", name: "Museo del Tesoro", category: "Museos", address: "Plaza 25 de Mayo N.º 59, Sucre, Bolivia", shortDescription: "Museo especializado ubicado frente a la plaza principal de Sucre.", description: "El Museo del Tesoro presenta colecciones vinculadas con minerales, metales y piedras preciosas bolivianas. Su sede se encuentra en la Plaza 25 de Mayo N.º 59.", source: "https://museotesoro.com/" }),
  place({ id: "museo-colonial-charcas", name: "Museo Colonial Charcas", category: "Museos", address: "Calle Bolívar N.º 698, Sucre, Bolivia", shortDescription: "Museo universitario de arte colonial administrado por la USFX.", description: "El Museo Colonial Charcas, dependiente de la Universidad Mayor, Real y Pontificia de San Francisco Xavier, conserva y exhibe colecciones de arte colonial.", source: "https://culturaydeporte.usfx.bo/project/museo-colonial-charcas/" }),
  place({ id: "museo-antropologico-usfx", name: "Museo Antropológico de la USFX", category: "Museos", address: "Calle Bolívar N.º 698, Sucre, Bolivia", shortDescription: "Museo universitario con colecciones arqueológicas y antropológicas.", description: "El museo de la USFX reúne colecciones arqueológicas y antropológicas y se encuentra en la calle Bolívar N.º 698 de Sucre.", source: "https://culturaydeporte.usfx.bo/antropologico/principal/historia/" }),
  place({ id: "museo-alfredo-gutierrez-valenzuela", name: "Museo Alfredo Gutiérrez Valenzuela", category: "Museos", address: "Sucre, Bolivia", shortDescription: "Museo de Sucre incluido en la programación municipal de la Noche de Museos.", description: "El Gobierno Municipal identificó al Museo Alfredo Gutiérrez Valenzuela entre los espacios participantes de la Noche de Museos de Sucre.", source: municipalMuseumEvent }),
  place({ id: "museo-santa-teresa", name: "Museo Santa Teresa", category: "Museos", address: "Sucre, Bolivia", shortDescription: "Museo incluido en la programación municipal de la Noche de Museos.", description: "El Museo Santa Teresa figura entre las instituciones culturales que participaron en la Noche de Museos de Sucre organizada en 2024.", source: municipalMuseumEvent }),
  place({ id: "templo-museo-san-francisco-de-asis", name: "Templo Museo San Francisco de Asís", category: "Museos", address: "Sucre, Bolivia", shortDescription: "Conjunto religioso y museístico incluido en la Noche de Museos de Sucre.", description: "El Templo Museo San Francisco de Asís fue incluido por el Gobierno Municipal en la programación de la Noche de Museos de Sucre.", source: municipalMuseumEvent }),
  place({ id: "teatro-gran-mariscal-sucre", name: "Teatro Gran Mariscal Sucre", category: "Cultura", address: "Plazuela Libertad N.º 20, Sucre, Bolivia", latitud: -19.046537487104832, longitud: -65.2617848850116, shortDescription: "Teatro patrimonial incluido entre los atractivos turísticos de Sucre.", description: "El Teatro Gran Mariscal Sucre forma parte de la oferta cultural y turística de la ciudad según la guía oficial del Ministerio de Culturas y Turismo.", source: "https://culturaydeporte.usfx.bo/project/teatro-gran-mariscal-sucre/" }),
  place({ id: "archivo-y-biblioteca-nacionales-de-bolivia", name: "Archivo y Biblioteca Nacionales de Bolivia", category: "Cultura", address: "Sucre, Bolivia", shortDescription: "Institución patrimonial y cultural con sede en Sucre.", description: "El Archivo y Biblioteca Nacionales de Bolivia tiene sede en Sucre y recibe actividades culturales incluidas en la agenda municipal.", source: "https://sucre.bo/wp-content/uploads/2026/05/Programa_Mayo_2026.pdf" }),
  place({ id: "casa-municipal-de-cultura-simon-roncal", name: "Casa Municipal de Cultura Simón Roncal", category: "Cultura", address: "Sucre, Bolivia", shortDescription: "Espacio cultural municipal que alberga actividades públicas en Sucre.", description: "La agenda oficial del Gobierno Municipal registra actividades culturales en la Casa Municipal de Cultura Simón Roncal.", source: "https://sucre.bo/wp-content/uploads/2026/05/Programa_Mayo_2026.pdf" }),
  place({ id: "templo-san-lazaro", name: "Templo de San Lázaro", category: "Iglesias y templos", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Templo histórico incluido en el inventario patrimonial municipal.", description: "El Gobierno Municipal lo identifica entre las fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "templo-san-miguel", name: "Templo de San Miguel", category: "Iglesias y templos", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Templo histórico incluido en el inventario patrimonial municipal.", description: "El Gobierno Municipal lo identifica entre las fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "templo-santo-domingo", name: "Templo de Santo Domingo", category: "Iglesias y templos", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Templo histórico incluido en el inventario patrimonial municipal.", description: "El Gobierno Municipal lo identifica entre las fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "templo-santa-ana", name: "Templo de Santa Ana", category: "Iglesias y templos", address: "Barrio Santa Ana, Sucre, Bolivia", shortDescription: "Templo histórico del barrio Santa Ana.", description: "El Gobierno Municipal lo identifica entre las fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "templo-santa-clara", name: "Templo de Santa Clara", category: "Iglesias y templos", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Templo histórico incluido en el inventario patrimonial municipal.", description: "El Gobierno Municipal lo identifica entre las fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "templo-del-carmen", name: "Templo del Carmen", category: "Iglesias y templos", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Templo histórico incluido en el inventario patrimonial municipal.", description: "El Gobierno Municipal lo identifica entre las fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "palacio-consistorial-de-sucre", name: "Palacio Consistorial de Sucre", category: "Patrimonio histórico", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Edificio patrimonial del centro histórico.", description: "El Palacio Consistorial aparece en el inventario municipal de fachadas históricas y monumentos emblemáticos de Sucre.", source: municipalHeritage }),
  place({ id: "arco-del-triunfo-de-sucre", name: "Arco del Triunfo de Sucre", category: "Patrimonio histórico", address: "Centro histórico de Sucre, Bolivia", shortDescription: "Monumento histórico identificado por el Gobierno Municipal.", description: "El Arco del Triunfo forma parte de los monumentos emblemáticos de Sucre identificados por el Gobierno Municipal.", source: municipalHeritage }),
  place({ id: "obelisco-de-sucre", name: "Obelisco de Sucre", category: "Patrimonio histórico", address: "Sucre, Bolivia", shortDescription: "Monumento urbano incluido en el inventario patrimonial municipal.", description: "El Obelisco figura entre los monumentos emblemáticos de Sucre identificados por el Gobierno Municipal.", source: municipalHeritage }),
  place({ id: "ex-estacion-ferroviaria-de-sucre", name: "Ex Estación Ferroviaria de Sucre", category: "Patrimonio histórico", address: "Sucre, Bolivia", shortDescription: "Edificio histórico incluido en el inventario patrimonial municipal.", description: "La Ex Estación aparece entre las fachadas históricas y monumentos emblemáticos de Sucre identificados por el Gobierno Municipal.", source: municipalHeritage }),
  place({ id: "museo-de-la-catedral-de-sucre", name: "Museo de la Catedral de Sucre", category: "Museos", address: "Plaza 25 de Mayo, Sucre, Bolivia", shortDescription: "Museo religioso identificado dentro del inventario patrimonial municipal.", description: "El Museo de la Catedral fue identificado por el Gobierno Municipal entre los espacios patrimoniales y culturales de Sucre.", source: municipalHeritage }),
  place({ id: "museo-de-anatomia-usfx", name: "Museo de Anatomía de la Universidad", category: "Museos", address: "Sucre, Bolivia", shortDescription: "Museo universitario identificado en el inventario patrimonial municipal.", description: "El Gobierno Municipal identifica el Museo de Anatomía de la Universidad entre los espacios culturales y patrimoniales de Sucre.", source: municipalHeritage }),
];

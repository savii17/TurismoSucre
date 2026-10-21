import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LanguageContext } from "./languageStore";

export type Language = "es" | "en";

const translations = {
  es: {
    language: "Idioma",
    spanish: "Español",
    english: "English",
    dashboard: "Dashboard",
    systemTitle: "Sistema de Gestión Turística",
    hideSidebar: "Ocultar menú lateral",
    showSidebar: "Mostrar menú lateral",
    navigation: "Navegación lateral",
    home: "Inicio",
    management: "Gestión",
    configuration: "Configuración",

    touristPlaces: "Lugares turísticos",
    accommodations: "Hospedajes",
    restaurants: "Restaurantes",
    entertainment: "Entretenimiento",
    nightclubs: "Discotecas",
    danceClubs: "Boliches",
    bars: "Bares",
    pubs: "Pub",
    eventVenues: "Salas de eventos",
    featuredEntertainment: "Lugares destacados",
    allEntertainment: "Todos los lugares",
    entertainmentDetails: "Ver detalles",
    events: "Eventos y Festividades",
    emergencies: "Emergencias",
    user: "Usuario",
    users: "Usuarios",
    categories: "Categorías",
    services: "Servicios",
    reports: "Reportes",
    settings: "Configuración",
    administrator: "Administrador",

    notifications: "Notificaciones",
    noSearchResults: "No se encontraron resultados en los datos disponibles.",
    viewNotifications: "Ver notificaciones",
    accountProfile: "Perfil de la cuenta",
    guest: "Invitado",
    noSession: "Sin sesión",

    heroKicker: "Bienvenido a Sucre",
    heroTitleLineOne: "Descubre la",
    heroTitleLineTwo: "Ciudad Blanca",
    heroDescription:
      "Historia, cultura y experiencias que hacen único a Sucre.",
    heroInformation: "Información turística de Sucre",
    sunny: "Soleado",
    sucreLocation: "Sucre, Chuquisaca",
    altitude: "2.790 msnm",
    exploreSucre: "Explorar lugares",
    weatherUnavailable: "Clima no disponible",
    heroSlides: "Imágenes del hero turístico",
    heroSlide: "Imagen",

    discover: "Descubre la región",
    homeTitle: "Lugares para inspirar tu próxima visita",
    homeDescription:
      "Explora una selección de destinos con la información esencial para tus visitantes.",
    allPlaces: "Ver todos los lugares",
    featuredKicker: "Selección especial",
    featuredPlaces: "Lugares Turísticos Destacados",
    featuredDescription: "Descubre los sitios más emblemáticos de Sucre",
    viewDetails: "Ver detalles",

    active: "Activos",
    dashboardStatistics: "Estadísticas del panel",

    explore: "Explora el destino",
    placesDescription:
      "Consulta todos los atractivos registrados y sus datos para planificar cada visita.",
    placesCount: "lugares",
    location: "Ubicación",
    hours: "Horario",
    seeMore: "Ver más",

    backToPlaces: "Volver a lugares turísticos",
    placeNotFound: "Lugar no encontrado",
    placeNotFoundDescription:
      "No encontramos este lugar turístico.",
    aboutPlace: "Sobre este lugar",
    memorableExperience: "Una experiencia para recordar",
    highlights: "Lo más destacado",
    availableServices: "Servicios disponibles",
    planVisit: "Planifica tu visita",
    address: "Dirección",
    savePlace: "Guardar lugar",

    module: "Módulo",
    signIn: "Iniciar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    emailPlaceholder: "Ingrese su correo electrónico",
    passwordPlaceholder: "Ingrese su contraseña",
    login: "Ingresar",
    invalidLogin:
      "El correo electrónico o la contraseña son incorrectos.",

    accommodationsDescription:
      "Administración de hoteles, hostales y alojamientos.",
    restaurantsDescription:
      "Gestión de restaurantes y opciones gastronómicas.",
    eventsDescription:
      "Gestión de eventos y festividades turísticas.",
    emergenciesDescription:
      "Directorio y control de servicios de emergencia.",
    userDescription:
      "Administración de usuarios del sistema.",
    categoriesDescription:
      "Configuración de categorías para clasificar información turística.",
    servicesDescription:
      "Configuración de servicios disponibles en la plataforma.",
    reportsDescription:
      "Consulta y generación de reportes del sistema.",
    settingsDescription:
      "Opciones generales de configuración del sistema.",
    administratorDescription:
      "Panel de configuración para el administrador.",
  },

  en: {
    language: "Language",
    spanish: "Español",
    english: "English",
    dashboard: "Dashboard",
    systemTitle: "Tourism Management System",
    hideSidebar: "Hide side menu",
    showSidebar: "Show side menu",
    navigation: "Side navigation",
    home: "Home",
    management: "Management",
    configuration: "Settings",

    touristPlaces: "Tourist places",
    accommodations: "Accommodations",
    restaurants: "Restaurants",
    entertainment: "Entertainment",
    nightclubs: "Nightclubs",
    danceClubs: "Dance clubs",
    bars: "Bars",
    pubs: "Pubs",
    eventVenues: "Event venues",
    featuredEntertainment: "Featured places",
    allEntertainment: "All places",
    entertainmentDetails: "View details",
    events: "Events and festivities",
    emergencies: "Emergencies",
    user: "User",
    users: "Users",
    categories: "Categories",
    services: "Services",
    reports: "Reports",
    settings: "Settings",
    administrator: "Administrator",

    notifications: "Notifications",
    noSearchResults: "No results found in the available data.",
    viewNotifications: "View notifications",
    accountProfile: "Account profile",
    guest: "Guest",
    noSession: "No session",

    heroKicker: "Welcome to Sucre",
    heroTitleLineOne: "Discover the",
    heroTitleLineTwo: "White City",
    heroDescription:
      "History, culture and experiences that make Sucre unique.",
    heroInformation: "Sucre tourism information",
    sunny: "Sunny",
    sucreLocation: "Sucre, Chuquisaca",
    altitude: "2,790 m a.s.l.",
    exploreSucre: "Explore places",
    weatherUnavailable: "Weather unavailable",
    heroSlides: "Tourism hero images",
    heroSlide: "Image",

    discover: "Discover the region",
    homeTitle: "Places to inspire your next visit",
    homeDescription:
      "Explore a selection of destinations with the essential information for your visitors.",
    allPlaces: "View all places",
    featuredKicker: "Featured selection",
    featuredPlaces: "Featured tourist places",
    featuredDescription: "Discover Sucre’s most emblematic sites",
    viewDetails: "View details",

    active: "Active",
    dashboardStatistics: "Dashboard statistics",

    explore: "Explore the destination",
    placesDescription:
      "Browse every registered attraction and its details to plan each visit.",
    placesCount: "places",
    location: "Location",
    hours: "Hours",
    seeMore: "See more",

    backToPlaces: "Back to tourist places",
    placeNotFound: "Place not found",
    placeNotFoundDescription:
      "We could not find this tourist place.",
    aboutPlace: "About this place",
    memorableExperience: "An experience to remember",
    highlights: "Highlights",
    availableServices: "Available services",
    planVisit: "Plan your visit",
    address: "Address",
    savePlace: "Save place",

    module: "Module",
    signIn: "Sign in",
    email: "Email",
    password: "Password",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    login: "Sign in",
    invalidLogin:
      "The email or password is incorrect.",

    accommodationsDescription:
      "Manage hotels, hostels and accommodations.",
    restaurantsDescription:
      "Manage restaurants and dining options.",
    eventsDescription:
      "Manage tourism events and festivities.",
    emergenciesDescription:
      "Directory and control of emergency services.",
    userDescription:
      "System user management.",
    categoriesDescription:
      "Configure categories for classifying tourist information.",
    servicesDescription:
      "Configure services available on the platform.",
    reportsDescription:
      "View and generate system reports.",
    settingsDescription:
      "General configuration options for the system.",
    administratorDescription:
      "Configuration panel for the administrator.",
  },
} as const;

type TranslationKey = keyof typeof translations.es;

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem("sis-language") === "en" ? "en" : "es"
  );

  useEffect(() => {
    localStorage.setItem("sis-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

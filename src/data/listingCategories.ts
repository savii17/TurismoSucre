export const touristPlaceCategories = [
  "Patrimonio histórico",
  "Iglesias y templos",
  "Museos",
  "Miradores",
  "Plazas y espacios urbanos",
  "Naturaleza",
  "Paleontología",
  "Cultura",
  "Otros atractivos",
] as const;

export const accommodationCategories = [
  "Hotel",
  "Hostal",
  "Residencial",
  "Hotel boutique",
  "Apart hotel",
  "Casa de huéspedes",
] as const;

export const restaurantCategories = [
  "Comida típica",
  "Comida boliviana",
  "Internacional",
  "Cafetería",
  "Pizzería",
  "Parrillada",
  "Vegetariano",
  "Comida rápida",
  "Otros",
] as const;

export const entertainmentCategories = [
  "Discoteca",
  "Boliche",
  "Bar",
  "Pub",
  "Sala de eventos",
  "Otros",
] as const;

export type TouristPlaceCategory = (typeof touristPlaceCategories)[number];
export type AccommodationCategory = (typeof accommodationCategories)[number];
export type RestaurantCategory = (typeof restaurantCategories)[number];
export type EntertainmentCategory = (typeof entertainmentCategories)[number];

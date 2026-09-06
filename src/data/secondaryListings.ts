import type { AdministrativeListing } from "../types/listing";

export const accommodations: AdministrativeListing[] = [
  { id: "hotel-independencia", name: "Hotel Independencia", category: "Hotel", status: "ACTIVO", location: "Calle España 173, Sucre", description: "Hospedaje céntrico con atención personalizada y vista a la ciudad.", rating: 4.7, reviews: 124, price: "Bs 320 / noche", services: ["Wi‑Fi", "Desayuno", "Estacionamiento"] },
  { id: "hostal-colonial", name: "Hostal Colonial", category: "Hostal", status: "ACTIVO", location: "Calle Dalence 109, Sucre", description: "Ambiente colonial y acogedor a pasos de la Plaza 25 de Mayo.", rating: 4.5, reviews: 89, price: "Bs 180 / noche", services: ["Wi‑Fi", "Desayuno"] },
  { id: "casona-blanca", name: "Casona Blanca", category: "Casa de huéspedes", status: "INACTIVO", location: "Zona Recoleta, Sucre", description: "Una casona tranquila para descubrir la ciudad con comodidad.", rating: 4.6, reviews: 61, price: "Bs 240 / noche", services: ["Terraza", "Lavandería"] },
];

export const restaurants: AdministrativeListing[] = [
  { id: "la-tablada", name: "La Tablada", category: "Comida tradicional", status: "ACTIVO", location: "Calle San Alberto 18, Sucre", description: "Sabores chuquisaqueños preparados con recetas tradicionales.", rating: 4.8, reviews: 212, price: "Bs 35 – 90" },
  { id: "cafe-dalence", name: "Café Dalence", category: "Cafetería", status: "ACTIVO", location: "Calle Dalence 47, Sucre", description: "Café de especialidad, repostería local y un ambiente relajado.", rating: 4.6, reviews: 156, price: "Bs 20 – 65" },
  { id: "terraza-25", name: "Terraza 25", category: "Internacional", status: "INACTIVO", location: "Plaza 25 de Mayo, Sucre", description: "Cocina contemporánea con una vista privilegiada del centro histórico.", rating: 4.4, reviews: 73, price: "Bs 45 – 120" },
];

export const events: AdministrativeListing[] = [
  { id: "carnaval-sucrense", name: "Carnaval Sucrense", category: "Festividad", status: "ACTIVO", location: "Centro histórico de Sucre", description: "Celebración de música, danzas y tradiciones de la ciudad.", date: "21 – 23 de febrero de 2027" },
  { id: "festival-chuquisaca", name: "Festival de Cultura Chuquisaqueña", category: "Cultural", status: "ACTIVO", location: "Teatro Gran Mariscal, Sucre", description: "Encuentro de arte, gastronomía y expresiones culturales locales.", date: "15 de abril de 2027" },
  { id: "feria-artesanal", name: "Feria Artesanal de Sucre", category: "Artesanía", status: "INACTIVO", location: "Plaza Anzures, Sucre", description: "Espacio para conocer y adquirir creaciones de artesanos locales.", date: "6 – 8 de junio de 2027" },
];

export type EntertainmentRecord = {
  _id: string;
  nombre_lugar: string;
  ubicacion: string;
  latitud?: number;
  longitud?: number;
  descripcion: string;
  horario_inicio?: string;
  horario_fin?: string;
  telefono?: string;
  tipo: string;
  calificacion?: number;
  imagenes_url: string[];
  servicios: string[];
  registrado_por?: string;
  estado: "ACTIVO" | "INACTIVO";
  fecha_registro?: string;
};

// Local demonstration records mirror the entertainment collection's field names.
export const entertainment: EntertainmentRecord[] = [
  { _id: "la-casona", nombre_lugar: "La Casona", ubicacion: "Calle Calvo 270, Sucre", latitud: -19.0473, longitud: -65.2598, descripcion: "Discoteca céntrica con música para bailar y una pista animada durante el fin de semana.", horario_inicio: "21:00", horario_fin: "03:00", tipo: "Discoteca", calificacion: 4.6, imagenes_url: ["https://images.unsplash.com/photo-1571266028243-d220c9c3b77b?auto=format&fit=crop&w=1000&q=85"], servicios: ["Música en vivo", "Barra", "Pista de baile"], registrado_por: "administrador", estado: "ACTIVO", fecha_registro: "2026-08-12" },
  { _id: "zona-6", nombre_lugar: "Zona 6", ubicacion: "Av. Jaime Mendoza, Sucre", latitud: -19.0458, longitud: -65.2532, descripcion: "Boliche con sesiones de DJ, luces y ambiente para compartir con amigos.", horario_inicio: "20:00", horario_fin: "02:30", tipo: "Boliche", calificacion: 4.4, imagenes_url: ["https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=1000&q=85"], servicios: ["DJ", "Barra", "Reservas"], registrado_por: "administrador", estado: "ACTIVO", fecha_registro: "2026-08-14" },
  { _id: "el-patio", nombre_lugar: "El Patio", ubicacion: "Calle Aniceto Arce, Sucre", latitud: -19.0495, longitud: -65.2611, descripcion: "Bar de ambiente cálido con coctelería y espacios para conversar.", horario_inicio: "18:00", horario_fin: "01:00", tipo: "Bar", calificacion: 4.3, imagenes_url: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=85"], servicios: ["Coctelería", "Terraza", "Wi‑Fi"], registrado_por: "administrador", estado: "ACTIVO", fecha_registro: "2026-08-18" },
  { _id: "el-kiosco", nombre_lugar: "El Kiosco", ubicacion: "Plaza 25 de Mayo, Sucre", latitud: -19.0476, longitud: -65.2591, descripcion: "Pub junto al centro histórico, ideal para disfrutar bebidas y buena música.", horario_inicio: "17:00", horario_fin: "00:30", tipo: "Pub", calificacion: 4.5, imagenes_url: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85"], servicios: ["Cervezas artesanales", "Música", "Wi‑Fi"], registrado_por: "administrador", estado: "ACTIVO", fecha_registro: "2026-08-20" },
  { _id: "la-trastienda", nombre_lugar: "La Trastienda", ubicacion: "Calle Lemoine, Sucre", descripcion: "Bar pequeño con propuestas musicales y una carta de bebidas para descubrir.", horario_inicio: "19:00", horario_fin: "01:00", tipo: "Bar", calificacion: 4.2, imagenes_url: ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85"], servicios: ["Coctelería", "Música en vivo"], estado: "ACTIVO" },
  { _id: "nova-club", nombre_lugar: "Nova Club", ubicacion: "Av. Las Américas, Sucre", descripcion: "Club nocturno con pista amplia y noches temáticas.", horario_inicio: "21:00", horario_fin: "03:00", tipo: "Discoteca", calificacion: 4.7, imagenes_url: ["https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=85"], servicios: ["DJ", "Pista de baile", "Reservas"], estado: "ACTIVO" },
  { _id: "cafe-concert", nombre_lugar: "Café Concert", ubicacion: "Calle Destacamento, Sucre", descripcion: "Un escenario íntimo para conciertos, encuentros y noches culturales.", tipo: "Sala de eventos", calificacion: 4.1, imagenes_url: ["https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85"], servicios: ["Música en vivo", "Eventos privados"], estado: "ACTIVO" },
  { _id: "cielo-lounge", nombre_lugar: "Cielo Lounge", ubicacion: "Calle Bolívar, Sucre", descripcion: "Lounge con ambiente relajado y vista a los tejados de la ciudad.", tipo: "Pub", calificacion: 4.3, imagenes_url: ["https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1000&q=85"], servicios: ["Terraza", "Coctelería"], estado: "ACTIVO" },
  { _id: "la-terraza", nombre_lugar: "La Terraza", ubicacion: "Calle Junín, Sucre", descripcion: "Espacio nocturno para bailar y disfrutar música con amistades.", tipo: "Discoteca", calificacion: 4.5, imagenes_url: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85"], servicios: ["DJ", "Pista de baile"], estado: "ACTIVO" },
  { _id: "salon-mariscal", nombre_lugar: "Salón Mariscal", ubicacion: "Centro, Sucre", descripcion: "Salón adaptable para celebraciones y encuentros sociales.", tipo: "Sala de eventos", imagenes_url: [], servicios: ["Eventos privados", "Reservas"], estado: "ACTIVO" },
];

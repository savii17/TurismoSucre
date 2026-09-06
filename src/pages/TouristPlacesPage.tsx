import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { touristPlaces } from "../data/touristPlaces";

function TouristPlacesPage() {
  const places = touristPlaces.map((place) => ({
    id: place.id, name: place.nombre_lugar ?? place.name, category: place.category,
    status: (place.estado === "INACTIVO" ? "INACTIVO" : "ACTIVO") as "ACTIVO" | "INACTIVO",
    location: place.ubicacion ?? place.address, description: place.descripcion ?? place.shortDescription,
    image: place.imagenes_url?.[0] ?? place.image, rating: place.calificacion ?? 4.5,
    price: place.precio_entrada ? `Bs ${place.precio_entrada}` : "Gratuito",
  }));
  return <AdministrativeListingPage title="Lugares Turísticos" description="Gestiona y consulta todos los lugares turísticos registrados en el sistema." actionLabel="Nuevo Lugar Turístico" items={places} />;
}

export default TouristPlacesPage;

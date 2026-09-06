import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { restaurants } from "../data/secondaryListings";
export default function RestaurantsPage() { return <AdministrativeListingPage title="Restaurantes" description="Administra y consulta todos los restaurantes registrados en el sistema." actionLabel="Nuevo Restaurante" items={restaurants} />; }

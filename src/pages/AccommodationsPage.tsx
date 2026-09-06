import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { accommodations } from "../data/secondaryListings";
export default function AccommodationsPage() { return <AdministrativeListingPage title="Hospedajes" description="Administra y consulta todos los hospedajes registrados en el sistema." actionLabel="Nuevo Hospedaje" items={accommodations} />; }

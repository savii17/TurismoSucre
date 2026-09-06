import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { events } from "../data/secondaryListings";
export default function EventsPage() { return <AdministrativeListingPage title="Eventos y Festividades" description="Administra y consulta todos los eventos y festividades registrados en el sistema." actionLabel="Nuevo Evento" items={events} showDate />; }

import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { catalogRepository } from "../repositories/catalogRepository";
import type { AccommodationListing } from "../types/listing";
export default function AccommodationsPage() { const items = (catalogRepository.list("hospedajes") as AccommodationListing[]).filter((item) => item.status === "ACTIVO"); return <AdministrativeListingPage title="Hospedajes" description="Explora hospedajes registrados en Sucre." actionLabel="Nuevo Hospedaje" items={items} detailPath="/hospedajes" kind="accommodations" />; }

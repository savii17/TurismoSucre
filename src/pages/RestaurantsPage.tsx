import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { catalogRepository } from "../repositories/catalogRepository";
import type { RestaurantListing } from "../types/listing";
export default function RestaurantsPage() { const items = (catalogRepository.list("restaurantes") as RestaurantListing[]).filter((item) => item.status === "ACTIVO"); return <AdministrativeListingPage title="Restaurantes" description="Explora restaurantes de Sucre." actionLabel="Nuevo Restaurante" items={items} detailPath="/restaurantes" kind="restaurants" />; }

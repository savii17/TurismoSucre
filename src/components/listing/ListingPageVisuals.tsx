import type { AdministrativeListing } from "../../types/listing";
import { touristHeroImages } from "../../data/touristImages";
import { useLanguage } from "../../i18n/useLanguage";
import ImageWithFallback from "../ImageWithFallback";
import { getImageSet } from "../../data/imageCatalog";
import CategoryLocationMap from "./CategoryLocationMap";

export type ListingPageKind = "places" | "accommodations" | "restaurants";

const pageCopy = {
  places: {
    es: ["Explora", "Los mejores lugares de Sucre", "Desde su historia colonial hasta sus paisajes naturales, vive una experiencia única.", "Ver todos los lugares"],
    en: ["Explore", "The best places in Sucre", "From colonial history to natural landscapes, discover a unique experience.", "Explore all places"],
  },
  accommodations: {
    es: ["Descansa en Sucre", "Encuentra el hospedaje ideal", "Comodidad, tradición y una ubicación para disfrutar cada día de tu viaje.", "Ver hospedajes"],
    en: ["Stay in Sucre", "Find your ideal accommodation", "Comfort, tradition and a location to enjoy every day of your trip.", "View accommodations"],
  },
  restaurants: {
    es: ["Sabores de Sucre", "La gastronomía sucrense te espera", "Descubre sabores locales y opciones para disfrutar la cocina de la Ciudad Blanca.", "Ver restaurantes"],
    en: ["Taste Sucre", "Sucre's gastronomy awaits", "Discover local flavors and places to enjoy the cuisine of the White City.", "View restaurants"],
  },
} as const;

function ListingPageVisuals({ kind }: { kind: ListingPageKind }) {
  const { language } = useLanguage();
  const [kicker, heading, description, action] = pageCopy[kind][language];
  const imageCategory = kind === "accommodations" ? "accommodation" : kind === "restaurants" ? "restaurant" : "tourist-place";
  const heroImageSet = kind === "places" ? getImageSet("tourist-place", "casa-de-la-libertad", [touristHeroImages[0]]) : getImageSet(imageCategory, `listing-hero-${kind}`);

  return <div className="listing-top-layout">
    <section className={`listing-hero listing-hero--${kind}`} aria-labelledby="listing-hero-title">
      <ImageWithFallback imageSet={heroImageSet} category={imageCategory} className="listing-hero__image" alt={kind === "places" ? "Casa de la Libertad en Sucre" : `${kind === "accommodations" ? "Hospedajes" : "Restaurantes"} de Sucre`} />
      <div className="listing-hero__copy"><p>{kicker}</p><h2 id="listing-hero-title">{heading}</h2><span>{description}</span><a href="#listing-title">{action} <b aria-hidden="true">→</b></a></div>
    </section>
  </div>;
}

export function ListingCategoryMap({ kind, items }: { kind: ListingPageKind; items: AdministrativeListing[] }) {
  const { language } = useLanguage();
  const title = kind === "places" ? (language === "es" ? "Mapa de lugares turísticos" : "Tourist places map") : kind === "accommodations" ? (language === "es" ? "Mapa de hospedajes" : "Accommodation map") : (language === "es" ? "Mapa de restaurantes" : "Restaurant map");
  return <aside className="listing-map-panel"><CategoryLocationMap title={title} items={items.map((item) => ({ id: item.id, name: item.name, latitude: item.latitude, longitude: item.longitude, href: `/${kind === "places" ? "lugares-turisticos" : kind === "accommodations" ? "hospedajes" : "restaurantes"}/${encodeURIComponent(item.id)}` }))} /></aside>;
}

export default ListingPageVisuals;

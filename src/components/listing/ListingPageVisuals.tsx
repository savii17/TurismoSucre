import { useMemo } from "react";
import type { AdministrativeListing } from "../../types/listing";
import { touristHeroImages } from "../../data/touristImages";
import { useLanguage } from "../../i18n/useLanguage";
import ImageWithFallback from "../ImageWithFallback";
import { getImageSet } from "../../data/imageCatalog";

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

const mapEmbedUrl = "https://www.openstreetmap.org/export/embed.html?bbox=-65.285%2C-19.067%2C-65.235%2C-19.027&layer=mapnik&marker=-19.0472%2C-65.2594";
const mapUrl = "https://www.openstreetmap.org/?mlat=-19.0472&mlon=-65.2594#map=14/-19.0472/-65.2594";

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
    <aside className="listing-map-panel"><div className="listing-aside-heading"><div><h2>{language === "es" ? "Mapa de Sucre" : "Map of Sucre"}</h2><p>{language === "es" ? "Explora el centro turístico" : "Explore the tourist center"}</p></div><span aria-hidden="true">⌖</span></div><iframe title={language === "es" ? "Mapa del centro de Sucre" : "Map of central Sucre"} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer" /><a href={mapUrl} target="_blank" rel="noreferrer">{language === "es" ? "Ver mapa" : "Open map"} <span aria-hidden="true">→</span></a></aside>
  </div>;
}

export function ListingRatedList({ kind, items }: { kind: ListingPageKind; items: AdministrativeListing[] }) {
  const { language } = useLanguage();
  const ratedItems = useMemo(() => items.filter((item) => item.rating != null).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5), [items]);
  const title = kind === "places" ? (language === "es" ? "Lugares mejor valorados" : "Top-rated places") : kind === "accommodations" ? (language === "es" ? "Hospedajes mejor valorados" : "Top-rated stays") : (language === "es" ? "Mejor valorados" : "Top-rated restaurants");

  if (!ratedItems.length) return null;

  return <aside className="listing-rated-panel"><div className="listing-aside-heading"><h2>{title}</h2><span aria-hidden="true">★</span></div><ol>{ratedItems.map((item) => <li key={item.id}><b>{item.name.slice(0, 1)}</b><span>{item.name}</span><strong>★ {item.rating?.toFixed(1)}</strong></li>)}</ol></aside>;
}

export default ListingPageVisuals;

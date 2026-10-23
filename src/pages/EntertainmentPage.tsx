import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { entertainment } from "../data/entertainment";
import { entertainmentCategories } from "../data/listingCategories";
import { useLanguage } from "../i18n/useLanguage";
import ImageWithFallback from "../components/ImageWithFallback";
import { getImageSet } from "../data/imageCatalog";
import CategoryLocationMap from "../components/listing/CategoryLocationMap";

const categories = [...entertainmentCategories];
const categoryLabels: Record<(typeof entertainmentCategories)[number], { es: string; en: string }> = {
  Discoteca: { es: "Discotecas", en: "Nightclubs" },
  Boliche: { es: "Boliches", en: "Dance clubs" },
  Bar: { es: "Bares", en: "Bars" },
  Pub: { es: "Pubs", en: "Pubs" },
  Karaoke: { es: "Karaokes", en: "Karaoke" },
  "Centro de entretenimiento": { es: "Centros de entretenimiento", en: "Entertainment centers" },
  "Sala de eventos": { es: "Salas de eventos", en: "Event venues" },
  "Música en vivo": { es: "Música en vivo", en: "Live music" },
  Peña: { es: "Peñas", en: "Peñas" },
  Otros: { es: "Otros", en: "Other" },
};

export default function EntertainmentPage() {
  const { language } = useLanguage();
  const es = language === "es";
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  const visible = useMemo(() => entertainment.filter((place) => (category === "Todas" || place.tipo === category) && normalize(`${place.nombre_lugar} ${place.ubicacion} ${place.descripcion} ${place.tipo} ${place.servicios.join(" ")}`).includes(normalize(query))), [category, query]);
  const popular = [...entertainment].filter((place) => place.calificacion != null).sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0)).slice(0, 5);
  const featured = [...entertainment].slice(0, 4);
  const card = (place: typeof entertainment[number]) => <article className="entertainment-card" key={place._id}>
    <div className="entertainment-card__image"><ImageWithFallback imageSet={getImageSet("entertainment", place._id, place.imagenes_url)} category="entertainment" alt={`${place.nombre_lugar}, ${place.tipo.toLocaleLowerCase()} en Sucre, Bolivia`} /><b>{place.tipo}</b></div>
    <div className="entertainment-card__body"><h3>{place.nombre_lugar}</h3>{place.calificacion != null && <p className="entertainment-card__rating">★ <strong>{place.calificacion.toFixed(1)}</strong></p>}<p className="entertainment-card__location">⌖ {place.ubicacion}</p><p className="entertainment-card__description">{place.descripcion}</p>{place.horario_inicio && place.horario_fin && <p className="entertainment-card__hours">◷ {place.horario_inicio}–{place.horario_fin}</p>}<Link to={`/entretenimiento/${encodeURIComponent(place._id)}`}>{es ? "Ver detalles" : "View details"} <span>→</span></Link></div>
  </article>;

  return <section className="entertainment-page">
    <div className="entertainment-layout"><div className="entertainment-main">
      <section className="entertainment-hero"><div><p className="entertainment-hero__kicker">✧ {es ? "VIVE LA NOCHE SUCRENSE" : "EXPERIENCE SUCRE AT NIGHT"}</p><h2>{es ? "Discotecas, boliches y mucho más" : "Nightclubs, dance clubs and more"}</h2><p>{es ? "Descubre lugares para disfrutar la vida nocturna de Sucre: música, amigos y experiencias inolvidables." : "Discover Sucre nightlife: music, friends and memorable experiences."}</p><a href="#entretenimiento-listado">{es ? "Explorar lugares" : "Explore places"} →</a></div></section>
      <section className="entertainment-categories" aria-label={es ? "Categorías" : "Categories"}>{categories.map((item, index) => <button key={item} className={category === item ? "is-selected" : ""} onClick={() => setCategory(category === item ? "Todas" : item)}><span className={`entertainment-categories__icon entertainment-categories__icon--${index % 5}`}>{["♫", "◉", "♧", "▣", "✦"][index % 5]}</span><span>{categoryLabels[item][language]}</span><strong>{entertainment.filter((place) => place.tipo === item).length}</strong></button>)}</section>
      <div className="entertainment-heading"><div><h2>⭐ {es ? "Lugares destacados" : "Featured places"}</h2><p>{es ? "Recomendados para una gran noche en Sucre." : "Recommended for a great night in Sucre."}</p></div><a href="#entretenimiento-listado">{es ? "Ver todos los lugares" : "See all places"} →</a></div>
      <div className="entertainment-grid entertainment-grid--featured">{featured.map(card)}</div>
      <div className="entertainment-heading" id="entretenimiento-listado"><div><h2>☆ {es ? "Todos los lugares" : "All places"}</h2><p>{visible.length} {es ? "lugares disponibles" : "places available"}</p></div></div>
      <div className="entertainment-filters"><label><span className="sr-only">{es ? "Buscar entretenimiento" : "Search entertainment"}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={es ? "Buscar por nombre, ubicación o servicio…" : "Search name, location or service…"} /></label><button type="button" onClick={() => { setCategory("Todas"); setQuery(""); }}>{es ? "Limpiar filtros" : "Clear filters"}</button></div>
      <div className="entertainment-filter-chips"><button className={category === "Todas" ? "is-selected" : ""} onClick={() => setCategory("Todas")}>{es ? "Todas" : "All"}</button>{categories.map((item) => <button key={item} className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)}>{categoryLabels[item][language]}</button>)}</div>
      <div className="entertainment-grid">{visible.map(card)}</div>{visible.length === 0 && <p className="admin-empty">{es ? "No se encontraron lugares con esos filtros." : "No places match those filters."}</p>}
    </div><aside className="entertainment-aside"><CategoryLocationMap title={es ? "Mapa de entretenimiento" : "Entertainment map"} items={entertainment.map((place) => ({ id: place._id, name: place.nombre_lugar, latitude: place.latitud, longitude: place.longitud, href: `/entretenimiento/${encodeURIComponent(place._id)}` }))} /><section className="entertainment-popular"><h2> {es ? "Más populares" : "Most popular"}</h2>{popular.map((place, index) => <Link key={place._id} to={`/entretenimiento/${encodeURIComponent(place._id)}`}><b>{index + 1}</b><span>{place.nombre_lugar}<small>{place.tipo}</small></span>{place.calificacion != null && <strong>★ {place.calificacion.toFixed(1)}</strong>}</Link>)}</section></aside></div>
  </section>;
}

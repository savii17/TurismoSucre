import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AdministrativeListing } from "../../types/listing";
import ListingCategoryCards from "./ListingCategoryCards";
import ListingPageVisuals, { ListingRatedList, type ListingPageKind } from "./ListingPageVisuals";
import ImageWithFallback from "../ImageWithFallback";
import { getImageSet } from "../../data/imageCatalog";

type Props = { title: string; description: string; actionLabel: string; items: AdministrativeListing[]; showDate?: boolean; detailPath?: string; kind?: ListingPageKind };

export default function AdministrativeListingPage({ title, description, actionLabel, items, showDate, detailPath, kind }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const categories = useMemo(() => ["Todas", ...new Set(items.map((item) => item.category))], [items]);
  const imageCategory = kind === "places" ? "tourist-place" : kind === "accommodations" ? "accommodation" : "restaurant";
  const categoryCards = useMemo(() => categories.slice(1).map((value) => {
    const matchingItems = items.filter((item) => item.category === value);
    const representative = matchingItems[0];
    return { value, label: value, count: matchingItems.length, imageSet: representative ? getImageSet(imageCategory, representative.id, [representative.image ?? "", ...(representative.images ?? [])]) : undefined };
  }), [categories, imageCategory, items]);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleItems = items.filter((item) => `${item.name} ${item.category} ${item.location} ${item.description}`.toLocaleLowerCase().includes(normalizedQuery) && (category === "Todas" || item.category === category) && (status === "Todos" || item.status === status));

  return <section className="admin-listing" aria-labelledby="listing-title">
    {kind && <ListingPageVisuals kind={kind} />}
    <ListingCategoryCards categories={categoryCards} totalCount={items.length} selectedCategory={category} onSelect={setCategory} allLabel="Todos" imageCategory={imageCategory} />
    <div className="listing-results-layout">
      <div className="listing-results-main">
        <div className="admin-listing__heading"><div><p className="eyebrow">{kind ? "Selección destacada" : "Gestión turística"}</p><h1 id="listing-title">{kind ? `${title} destacados` : title}</h1><p>{description}</p></div><button className="admin-button" type="button">+ {actionLabel}</button></div>
        <div className="admin-filters" aria-label={`Filtros de ${title}`}><label><span className="sr-only">Buscar</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o ubicación" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoría">{categories.map((value) => <option key={value}>{value}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar por estado"><option>Todos</option><option>ACTIVO</option><option>INACTIVO</option></select>{showDate && <input type="date" aria-label="Filtrar por fecha" />}<button className="admin-filter-button" type="button">⚙ Más filtros</button></div>
        <p className="admin-listing__count" aria-live="polite">{visibleItems.length} registros encontrados</p>
        <div className="admin-cards">{visibleItems.map((item) => {
          const imageCategory = kind === "places" ? "tourist-place" : kind === "accommodations" ? "accommodation" : "restaurant";
          const imageSet = getImageSet(imageCategory, item.id, [item.image ?? "", ...(item.images ?? [])]);
          return <article className="admin-card" key={item.id}><div className="admin-card__media"><ImageWithFallback imageSet={imageSet} category={imageCategory} alt={imageSet.main?.alt ?? `${item.name} en Sucre, Bolivia`} /><b className={`status-badge status-badge--${item.status.toLowerCase()}`}>{item.status === "ACTIVO" ? "Activo" : "Inactivo"}</b></div><div className="admin-card__body"><p className="admin-card__category">{item.category}</p><h2>{item.name}</h2>{showDate && <p className="admin-card__date">◷ {item.date}</p>}<p className="admin-card__location">⌖ {item.location}</p><p className="admin-card__description">{item.description}</p>{item.services && <div className="admin-card__services">{item.services.slice(0, 3).map((service) => <span key={service}>{service}</span>)}</div>}<div className="admin-card__meta">{item.rating != null && <span>★ {item.rating.toFixed(1)} {item.reviews != null && <small>({item.reviews})</small>}</span>}{item.price && <strong>{item.price}</strong>}</div>{detailPath ? <Link className="admin-card__details" to={`${detailPath}/${encodeURIComponent(item.id)}`}>Ver detalles <span>→</span></Link> : <button className="admin-card__details" type="button">Ver detalles <span>→</span></button>}</div></article>;
        })}</div>
        {visibleItems.length === 0 && <p className="admin-empty">No se encontraron registros con los filtros seleccionados.</p>}
        <nav className="pagination" aria-label="Paginación"><button type="button" disabled>← Anterior</button><button type="button" className="active">1</button><button type="button">Siguiente →</button></nav>
      </div>
      {kind && <ListingRatedList kind={kind} items={items} />}
    </div>
  </section>;
}

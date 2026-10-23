import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AdministrativeListing } from "../../types/listing";
import ListingCategoryCards from "./ListingCategoryCards";
import ListingPageVisuals, { ListingCategoryMap, type ListingPageKind } from "./ListingPageVisuals";
import ImageWithFallback from "../ImageWithFallback";
import { getImageSet } from "../../data/imageCatalog";

type Props = { title: string; description: string; actionLabel: string; items: AdministrativeListing[]; showDate?: boolean; detailPath?: string; kind?: ListingPageKind };
const isDisplayable = (value?: string) => Boolean(value?.trim()) && !/(?:no disponible|sin informaci[oó]n|no especificad[oa]|no registrado|pendiente de verificaci[oó]n)/i.test(value ?? "");
const pageSize = 8;

export default function AdministrativeListingPage({ title, description, actionLabel: _actionLabel, items, showDate, detailPath, kind }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [page, setPage] = useState(1);
  const categories = useMemo(() => ["Todas", ...new Set(items.map((item) => item.category))], [items]);
  const imageCategory = kind === "places" ? "tourist-place" : kind === "accommodations" ? "accommodation" : "restaurant";
  const categoryCards = useMemo(() => categories.slice(1).map((value) => {
    const matchingItems = items.filter((item) => item.category === value);
    const representative = matchingItems[0];
    return { value, label: value, count: matchingItems.length, imageSet: representative ? getImageSet(imageCategory, representative.id, [representative.image ?? "", ...(representative.images ?? [])]) : undefined };
  }), [categories, imageCategory, items]);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleItems = items.filter((item) => `${item.name} ${item.category} ${item.location} ${item.description}`.toLocaleLowerCase().includes(normalizedQuery) && (category === "Todas" || item.category === category) && (status === "Todos" || item.status === status));
  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginatedItems = visibleItems.slice((safePage - 1) * pageSize, safePage * pageSize);
  const resetFilters = () => {
    setQuery("");
    setCategory("Todas");
    setStatus("Todos");
    setPage(1);
  };

  return <section className="admin-listing" aria-labelledby="listing-title">
    {kind && <ListingPageVisuals kind={kind} />}
    <ListingCategoryCards categories={categoryCards} totalCount={items.length} selectedCategory={category} onSelect={(value) => { setCategory(value); setPage(1); }} allLabel="Todos" imageCategory={imageCategory} />
    <div className="listing-results-layout">
      <div className="listing-results-main">
        <div className="admin-listing__heading"><div><p className="eyebrow">{kind ? "Selección destacada" : "Gestión turística"}</p><h1 id="listing-title">{kind ? `${title} destacados` : title}</h1><p>{description}</p></div></div>
        <div className="admin-filters" aria-label={`Filtros de ${title}`}>
          <label><span className="sr-only">Buscar</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar por nombre o ubicación" /></label>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} aria-label="Filtrar por categoría">{categories.map((value) => <option key={value}>{value}</option>)}</select>
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filtrar por estado"><option>Todos</option><option>ACTIVO</option><option>INACTIVO</option></select>
          {showDate && <input type="date" aria-label="Filtrar por fecha" />}
          {(query || category !== "Todas" || status !== "Todos") && <button className="admin-filter-button" type="button" onClick={resetFilters}>Limpiar filtros</button>}
        </div>
        <p className="admin-listing__count" aria-live="polite">{visibleItems.length} registros encontrados</p>
        <div className="admin-cards">{paginatedItems.map((item) => {
          const itemImageCategory = kind === "places" ? "tourist-place" : kind === "accommodations" ? "accommodation" : "restaurant";
          const imageSet = getImageSet(itemImageCategory, item.id, [item.image ?? "", ...(item.images ?? [])]);
          return <article className="admin-card" key={item.id}><div className="admin-card__media"><ImageWithFallback imageSet={imageSet} category={itemImageCategory} alt={imageSet.main?.alt ?? `${item.name} en Sucre, Bolivia`} /><b className={`status-badge status-badge--${item.status.toLowerCase()}`}>{item.status === "ACTIVO" ? "Activo" : "Inactivo"}</b></div><div className="admin-card__body"><p className="admin-card__category">{item.category}</p><h2>{item.name}</h2>{showDate && isDisplayable(item.date) && <p className="admin-card__date">◷ {item.date}</p>}{isDisplayable(item.location) && <p className="admin-card__location">⌖ {item.location}</p>}{isDisplayable(item.description) && <p className="admin-card__description">{item.description}</p>}{item.services?.length ? <div className="admin-card__services">{item.services.slice(0, 3).map((service) => <span key={service}>{service}</span>)}</div> : null}<div className="admin-card__meta">{item.rating != null && <span>★ {item.rating.toFixed(1)} {item.reviews != null && <small>({item.reviews})</small>}</span>}{item.price && <strong>{item.price}</strong>}</div>{detailPath ? <Link className="admin-card__details" to={`${detailPath}/${encodeURIComponent(item.id)}`}>Ver detalles <span>→</span></Link> : null}</div></article>;
        })}</div>
        {visibleItems.length === 0 && <p className="admin-empty">No se encontraron registros con los filtros seleccionados.</p>}
        {visibleItems.length > 0 && <nav className="pagination" aria-label="Paginación"><button type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>← Anterior</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" className={safePage === pageNumber ? "active" : ""} aria-current={safePage === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}<button type="button" disabled={safePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Siguiente →</button></nav>}
      </div>
      {kind && <ListingCategoryMap kind={kind} items={items} />}
    </div>
  </section>;
}

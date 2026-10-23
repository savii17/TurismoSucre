import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ListingCategoryCards from "../components/listing/ListingCategoryCards";
import { events } from "../data/events";
import type { EventStatus } from "../types/event";
import ImageWithFallback from "../components/ImageWithFallback";
import { getImageSet } from "../data/imageCatalog";

const eventStatuses: Array<"Todos" | EventStatus> = ["Todos", "RECURRENTE", "PROXIMO", "EN_CURSO", "FINALIZADO", "CANCELADO"];
const statusLabels: Record<EventStatus, string> = {
  RECURRENTE: "Evento recurrente",
  PROXIMO: "Próximo",
  EN_CURSO: "En curso",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};
const getStatus = (event: (typeof events)[number], today: string): EventStatus => {
  if (!event.startDate || !event.endDate) return event.status === "CANCELADO" ? "CANCELADO" : "RECURRENTE";
  if (event.status === "CANCELADO") return "CANCELADO";
  if (today < event.startDate) return "PROXIMO";
  if (today > event.endDate) return "FINALIZADO";
  return "EN_CURSO";
};
const todayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};
const formatDate = (date: string) => new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState<"Todos" | EventStatus>("Todos");
  const [date, setDate] = useState("");
  const today = todayString();
  const categories = useMemo(() => [...new Set(events.map((event) => event.category))], []);
  const visibleEvents = useMemo(() => events.filter((event) => {
      const eventStatus = getStatus(event, today);
      const matchesQuery = `${event.name} ${event.category} ${event.location} ${event.description} ${event.organizer ?? ""}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().includes(query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase());
      const matchesDate = !date || (event.startDate && event.endDate
        ? date >= event.startDate && date <= event.endDate
        : Boolean(event.usualMonth && Number(date.slice(5, 7)) === event.usualMonth));
      return matchesQuery && (category === "Todas" || event.category === category) && (status === "Todos" || eventStatus === status) && matchesDate;
    }), [category, date, query, status, today]);
  const categoryCards = categories.map((value) => {
    const matchingEvents = events.filter((event) => event.category === value);
    return { value, label: value, count: matchingEvents.length, imageSet: matchingEvents[0] ? getImageSet("event", matchingEvents[0].id) : undefined };
  });

  return <section className="admin-listing events-page" aria-labelledby="events-title">
    <ListingCategoryCards categories={categoryCards} totalCount={events.length} selectedCategory={category} onSelect={setCategory} allLabel="Todos los eventos" imageCategory="event" />
    <div className="admin-listing__heading"><div><p className="eyebrow">Agenda de Sucre</p><h1 id="events-title">Eventos y Festividades</h1><p>Festividades, tradiciones y acontecimientos cívicos y culturales propios de Sucre.</p></div></div>
    <div className="admin-filters events-page__filters" aria-label="Filtros de eventos">
      <label><span className="sr-only">Buscar eventos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, categoría, ubicación u organizador" /></label>
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoría"><option value="Todas">Todas las categorías</option>{categories.map((value) => <option key={value}>{value}</option>)}</select>
      <select value={status} onChange={(event) => setStatus(event.target.value as "Todos" | EventStatus)} aria-label="Filtrar por estado">{eventStatuses.map((value) => <option key={value} value={value}>{value === "Todos" ? "Todos los estados" : statusLabels[value]}</option>)}</select>
      <label className="events-page__date-label"><span>Fecha</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filtrar por fecha" /></label>
      <button type="button" className="events-page__clear" onClick={() => { setQuery(""); setCategory("Todas"); setStatus("Todos"); setDate(""); }}>Limpiar filtros</button>
    </div>
    <p className="admin-listing__count" aria-live="polite">{visibleEvents.length} eventos encontrados</p>
    <div className="admin-cards events-page__cards">{visibleEvents.map((event) => {
      const eventStatus = getStatus(event, today);
      const dateText = event.startDate && event.endDate
        ? event.startDate === event.endDate ? formatDate(event.startDate) : `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
        : `${event.usualMonthLabel ?? event.periodicity ?? "Calendario local"} · fecha publicada en el programa anual`;
      return <article className="admin-card" key={event.id}>
        <div className="admin-card__media"><ImageWithFallback imageSet={getImageSet("event", event.id, event.image ? [event.image] : [])} category="event" alt={`${event.name}, evento cultural en Sucre, Bolivia`} /><b className={`status-badge events-status events-status--${eventStatus.toLowerCase()}`}>{statusLabels[eventStatus]}</b></div>
        <div className="admin-card__body"><p className="admin-card__category">{event.category}</p><h2>{event.name}</h2><p className="admin-card__date">◷ {dateText}{event.startTime ? ` · ${event.startTime}` : ""}{event.endTime ? `–${event.endTime}` : ""}</p><p className="admin-card__location">⌖ {event.location}</p><p className="admin-card__description">{event.description}</p>{event.price && <div className="admin-card__meta"><strong>{event.price}</strong></div>}<Link className="admin-card__details" to={`/eventos/${encodeURIComponent(event.id)}`}>Ver detalles <span>→</span></Link></div>
      </article>;
    })}</div>
    {visibleEvents.length === 0 && <p className="admin-empty">No se encontraron eventos con los filtros seleccionados.</p>}
  </section>;
}

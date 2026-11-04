import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ListingCategoryCards from "../components/listing/ListingCategoryCards";
import { catalogRepository } from "../repositories/catalogRepository";
import type { EventRecord } from "../types/event";
import type { EventStatus } from "../types/event";
import ImageWithFallback from "../components/ImageWithFallback";
import { getImageSet } from "../data/imageCatalog";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";

const eventStatuses: Array<"Todos" | EventStatus> = ["Todos", "RECURRENTE", "PROXIMO", "EN_CURSO", "FINALIZADO", "CANCELADO"];
const statusLabels: Record<EventStatus, string> = { RECURRENTE: "Evento recurrente", PROXIMO: "Próximo", EN_CURSO: "En curso", FINALIZADO: "Finalizado", CANCELADO: "Cancelado" };
const getStatus = (event: EventRecord, today: string): EventStatus => {
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
export default function EventsPage() {
  const { language, tx } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState<"Todos" | EventStatus>("Todos");
  const [date, setDate] = useState("");
  const events = catalogRepository.list("eventos") as EventRecord[];
  const today = todayString();
  const categories = useMemo(() => [...new Set(events.map((event) => event.category))], [events]);
  const visibleEvents = useMemo(() => events.filter((event) => {
      const eventStatus = getStatus(event, today);
      const matchesQuery = `${event.name} ${event.category} ${event.location} ${event.description} ${event.organizer ?? ""}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().includes(query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase());
      const matchesDate = !date || (event.startDate && event.endDate
        ? date >= event.startDate && date <= event.endDate
        : Boolean(event.usualMonth && Number(date.slice(5, 7)) === event.usualMonth));
      return matchesQuery && (category === "Todas" || event.category === category) && (status === "Todos" || eventStatus === status) && matchesDate;
    }), [category, date, events, query, status, today]);
  const categoryCards = categories.map((value) => {
    const matchingEvents = events.filter((event) => event.category === value);
    return { value, label: tx(value), count: matchingEvents.length, imageSet: matchingEvents[0] ? getImageSet("event", matchingEvents[0].id) : undefined };
  });
  const formatDate = (date: string) => new Intl.DateTimeFormat(language === "es" ? "es-BO" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));

  return <section className="admin-listing events-page" aria-labelledby="events-title">
    <ListingCategoryCards categories={categoryCards} totalCount={events.length} selectedCategory={category} onSelect={setCategory} allLabel={tx("Todos los eventos")} imageCategory="event" />
    <div className="admin-listing__heading"><div><p className="eyebrow">{tx("Agenda de Sucre")}</p><h1 id="events-title">{tx("Eventos y Festividades")}</h1><p>{tx("Festividades, tradiciones y acontecimientos cívicos y culturales propios de Sucre.")}</p></div></div>
    <div className="admin-filters events-page__filters" aria-label={tx("Filtros de eventos")}>
      <label><span className="sr-only">{tx("Buscar eventos")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tx("Buscar por nombre, categoría, ubicación u organizador")} /></label>
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={tx("Filtrar por categoría")}><option value="Todas">{tx("Todas las categorías")}</option>{categories.map((value) => <option key={value} value={value}>{tx(value)}</option>)}</select>
      <select value={status} onChange={(event) => setStatus(event.target.value as "Todos" | EventStatus)} aria-label={tx("Filtrar por estado")}>{eventStatuses.map((value) => <option key={value} value={value}>{value === "Todos" ? tx("Todos los estados") : tx(statusLabels[value])}</option>)}</select>
      <label className="events-page__date-label"><span>{tx("Fecha")}</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label={tx("Filtrar por fecha")} /></label>
      <button type="button" className="events-page__clear" onClick={() => { setQuery(""); setCategory("Todas"); setStatus("Todos"); setDate(""); }}>{tx("Limpiar filtros")}</button>
    </div>
    <p className="admin-listing__count" aria-live="polite">{tx(`${visibleEvents.length} eventos encontrados`)}</p>
    <div className="admin-cards events-page__cards">{visibleEvents.map((event) => {
      const eventStatus = getStatus(event, today);
      const dateText = event.startDate && event.endDate
        ? event.startDate === event.endDate ? formatDate(event.startDate) : `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
        : `${translateRecordText("event", event.id, "month", event.usualMonthLabel, language) || translateRecordText("event", event.id, "periodicity", event.periodicity ?? "Calendario local", language)} · ${tx("fecha publicada en el programa anual")}`;
      const category = translateRecordText("event", event.id, "category", event.category, language);
      const description = translateRecordText("event", event.id, "description", event.description, language);
      const location = translateRecordText("event", event.id, "location", event.location, language);
      return <article className="admin-card" key={event.id}>
        <div className="admin-card__media"><ImageWithFallback imageSet={getImageSet("event", event.id, event.image ? [event.image] : [])} category="event" alt={`${event.name}, cultural event in Sucre, Bolivia`} /><b className={`status-badge events-status events-status--${eventStatus.toLowerCase()}`}>{tx(statusLabels[eventStatus])}</b></div>
        <div className="admin-card__body"><p className="admin-card__category">{category}</p><h2>{event.name}</h2><p className="admin-card__date">◷ {dateText}{event.startTime ? ` · ${event.startTime}` : ""}{event.endTime ? `–${event.endTime}` : ""}</p><p className="admin-card__location">⌖ {location}</p><p className="admin-card__description">{description}</p>{event.price && <div className="admin-card__meta"><strong>{translateRecordText("event", event.id, "price", event.price, language)}</strong></div>}<Link className="admin-card__details" to={`/eventos/${encodeURIComponent(event.id)}`}>{tx("Ver detalles")} <span>→</span></Link></div>
      </article>;
    })}</div>
    {visibleEvents.length === 0 && <p className="admin-empty">{tx("No se encontraron eventos con los filtros seleccionados.")}</p>}
  </section>;
}

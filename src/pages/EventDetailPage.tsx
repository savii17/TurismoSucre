import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { events } from "../data/events";
import type { EventStatus } from "../types/event";
import { getImageSet } from "../data/imageCatalog";

const statusLabels: Record<EventStatus, string> = { RECURRENTE: "Anual · próxima fecha por confirmar", PROXIMO: "Próximo", EN_CURSO: "En curso", FINALIZADO: "Finalizado", CANCELADO: "Cancelado" };
const getCurrentStatus = (startDate: string | undefined, endDate: string | undefined, fallback: EventStatus): EventStatus => {
  if (!startDate || !endDate) return fallback === "CANCELADO" ? fallback : "RECURRENTE";
  if (fallback === "CANCELADO") return fallback;
  const today = new Date();
  const currentDate = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  if (currentDate < startDate) return "PROXIMO";
  if (currentDate > endDate) return "FINALIZADO";
  return "EN_CURSO";
};
const formatDate = (value: string) => new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value + "T12:00:00"));

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find((item) => item.id === eventId);
  const currentStatus = event && getCurrentStatus(event.startDate, event.endDate, event.status);
  const dateRange = event && (event.startDate && event.endDate
    ? event.startDate === event.endDate ? formatDate(event.startDate) : formatDate(event.startDate) + " – " + formatDate(event.endDate)
    : `${event.periodicity ?? "Recurrente"}${event.usualMonthLabel ? ` · ${event.usualMonthLabel}` : ""}; próxima fecha por confirmar`);
  const hours = event && [event.startTime, event.endTime].filter(Boolean).join(" – ");
  const statusIsInactive = currentStatus === "FINALIZADO" || currentStatus === "CANCELADO";
  const eventHasCoordinates = event?.latitude != null && event.longitude != null;
  const eventLocationIsBroad = Boolean(event && /(recorrido|calles? (de la|y)|circuito anunciado|escenario anunciado|otros espacios|espacios de la ciudad|por confirmar|anunciad[oa]s? para cada edici[oó]n|programa por gesti[oó]n)/i.test(event.location));
  const eventHasPhysicalLocation = Boolean(event && (eventHasCoordinates || (event.location.trim() && !eventLocationIsBroad)));
  const record: DetailRecord | undefined = event && currentStatus && {
    id: event.id,
    name: event.name,
    category: event.category,
    status: statusIsInactive ? "INACTIVO" : "ACTIVO",
    statusLabel: statusLabels[currentStatus],
    location: event.location,
    address: eventHasPhysicalLocation ? event.location : undefined,
    showLocationMap: eventHasPhysicalLocation,
    description: event.description,
    image: event.image,
    images: event.image ? [event.image] : [],
    phone: event.phone,
    action: event.source ? { label: "Consultar información del evento", href: event.source } : undefined,
    imageSet: getImageSet("event", event.id, event.image ? [event.image] : []),
    latitude: event.latitude,
    longitude: event.longitude,
    fields: [
      { label: "Estado del evento", value: statusLabels[currentStatus] },
      { label: "Periodicidad", value: event.periodicity },
      { label: "Mes habitual", value: event.usualMonthLabel },
      { label: "Fecha de inicio", value: event.startDate ? formatDate(event.startDate) : undefined },
      { label: "Fecha de finalización", value: event.endDate ? formatDate(event.endDate) : undefined },
      { label: "Horario", value: hours },
      { label: "Organizador", value: event.organizer },
      { label: "Teléfono", value: event.phone },
      { label: "Precio / entrada", value: event.price },
      { label: "Fuente", value: event.source },
    ],
  };

  const related = event ? events.filter((item) => item.id !== event.id).slice(0, 4).map((item) => ({ id: item.id, name: item.name, category: item.category, location: item.location, imageSet: getImageSet("event", item.id, item.image ? [item.image] : []), to: `/eventos/${item.id}` })) : [];

  return <RecordDetailPage
    record={record}
    related={related}
    moduleName="Eventos"
    detailTitle="evento"
    backTo="/eventos"
    imageCategory="event"
    summary={{ rating: currentStatus ? statusLabels[currentStatus] : undefined, price: event?.organizer, hours: dateRange ? dateRange + (hours ? " · " + hours : "") : undefined }}
    summaryLabels={{ rating: "Estado", price: "Organizador", hours: "Fecha y horario" }}
  />;
}

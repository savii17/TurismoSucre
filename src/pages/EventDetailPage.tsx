import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { events } from "../data/events";
import type { EventStatus } from "../types/event";
import { getImageSet } from "../data/imageCatalog";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";

const statusLabels: Record<EventStatus, string> = { RECURRENTE: "Evento recurrente", PROXIMO: "Próximo", EN_CURSO: "En curso", FINALIZADO: "Finalizado", CANCELADO: "Cancelado" };
const getCurrentStatus = (startDate: string | undefined, endDate: string | undefined, fallback: EventStatus): EventStatus => {
  if (!startDate || !endDate) return fallback === "CANCELADO" ? fallback : "RECURRENTE";
  if (fallback === "CANCELADO") return fallback;
  const today = new Date();
  const currentDate = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  if (currentDate < startDate) return "PROXIMO";
  if (currentDate > endDate) return "FINALIZADO";
  return "EN_CURSO";
};
export default function EventDetailPage() {
  const { language, tx } = useLanguage();
  const { eventId } = useParams<{ eventId: string }>();
  const formatDate = (value: string) => new Intl.DateTimeFormat(language === "es" ? "es-BO" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value + "T12:00:00"));
  const event = events.find((item) => item.id === eventId);
  const currentStatus = event && getCurrentStatus(event.startDate, event.endDate, event.status);
  const dateRange = event && (event.startDate && event.endDate
    ? event.startDate === event.endDate ? formatDate(event.startDate) : formatDate(event.startDate) + " – " + formatDate(event.endDate)
    : `${translateRecordText("event", event.id, "periodicity", event.periodicity ?? "Evento recurrente", language)}${event.usualMonthLabel ? ` · ${translateRecordText("event", event.id, "month", event.usualMonthLabel, language)}` : ""}; ${tx("fecha publicada en el programa anual")}`);
  const hours = event && [event.startTime, event.endTime].filter(Boolean).join(" – ");
  const statusIsInactive = currentStatus === "FINALIZADO" || currentStatus === "CANCELADO";
  const eventHasCoordinates = event?.latitude != null && event.longitude != null;
  const eventLocationIsBroad = Boolean(event && /(recorrido|calles? (de la|y)|circuito anunciado|escenario anunciado|otros espacios|espacios de la ciudad|por confirmar|anunciad[oa]s? para cada edici[oó]n|programa por gesti[oó]n)/i.test(event.location));
  const eventHasPhysicalLocation = Boolean(event && (eventHasCoordinates || (event.location.trim() && !eventLocationIsBroad)));
  const record: DetailRecord | undefined = event && currentStatus && {
    id: event.id,
    name: event.name,
    category: translateRecordText("event", event.id, "category", event.category, language),
    status: statusIsInactive ? "INACTIVO" : "ACTIVO",
    statusLabel: tx(statusLabels[currentStatus]),
    location: translateRecordText("event", event.id, "location", event.location, language),
    address: eventHasPhysicalLocation ? translateRecordText("event", event.id, "address", event.location, language) : undefined,
    mapLocation: translateRecordText("event", event.id, "location", event.location, language),
    showLocationMap: true,
    allowLocationSearch: eventHasPhysicalLocation,
    description: translateRecordText("event", event.id, "description", event.description, language),
    image: event.image,
    images: event.image ? [event.image] : [],
    phone: event.phone,
    action: event.source ? { label: tx("Consultar información del evento"), href: event.source } : undefined,
    imageSet: getImageSet("event", event.id, event.image ? [event.image] : []),
    latitude: event.latitude,
    longitude: event.longitude,
    fields: [
      { label: "Estado del evento", value: tx(statusLabels[currentStatus]) },
      { label: "Periodicidad", value: translateRecordText("event", event.id, "periodicity", event.periodicity, language) },
      { label: "Mes habitual", value: translateRecordText("event", event.id, "month", event.usualMonthLabel, language) },
      { label: "Fecha de inicio", value: event.startDate ? formatDate(event.startDate) : undefined },
      { label: "Fecha de finalización", value: event.endDate ? formatDate(event.endDate) : undefined },
      { label: "Horario", value: hours },
      { label: "Organizador", value: event.organizer },
      { label: "Teléfono", value: event.phone },
      { label: "Precio / entrada", value: translateRecordText("event", event.id, "price", event.price, language) },
    ],
  };

  const related = event ? events.filter((item) => item.id !== event.id).slice(0, 4).map((item) => ({ id: item.id, name: item.name, category: translateRecordText("event", item.id, "category", item.category, language), location: translateRecordText("event", item.id, "location", item.location, language), imageSet: getImageSet("event", item.id, item.image ? [item.image] : []), to: `/eventos/${item.id}` })) : [];

  return <RecordDetailPage
    record={record}
    related={related}
    moduleName="Eventos"
    detailTitle="evento"
    backTo="/eventos"
    imageCategory="event"
    summary={{ rating: currentStatus ? tx(statusLabels[currentStatus]) : undefined, price: event?.organizer, hours: dateRange ? dateRange + (hours ? " · " + hours : "") : undefined }}
    summaryLabels={{ rating: "Estado", price: "Organizador", hours: "Fecha y horario" }}
  />;
}

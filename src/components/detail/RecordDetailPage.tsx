import { Link } from "react-router-dom";

export type DetailField = { label: string; value?: string | number | null };

export type DetailRecord = {
  id: string;
  name: string;
  category?: string;
  status?: string;
  location?: string;
  description?: string;
  image?: string;
  images?: string[];
  rating?: number;
  price?: string;
  hours?: string;
  services?: string[];
  registeredBy?: string;
  registeredAt?: string;
  latitude?: number;
  longitude?: number;
  fields?: DetailField[];
};

type Props = {
  record?: DetailRecord;
  moduleName: string;
  detailTitle: string;
  backTo: string;
  summary: { rating?: string; price?: string; hours?: string };
};

const unavailable = "No disponible";
const mapUrl = (latitude?: number, longitude?: number) => latitude != null && longitude != null
  ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
  : undefined;

export default function RecordDetailPage({ record, moduleName, detailTitle, backTo, summary }: Props) {
  if (!record) {
    return <section className="record-detail record-detail--empty"><h2>Registro no encontrado</h2><p>El registro solicitado no existe o ya no está disponible.</p><Link className="detail-button" to={backTo}>Volver al listado</Link></section>;
  }

  const images = [...new Set([record.image, ...(record.images ?? [])].filter((image): image is string => Boolean(image)))];
  const locationMap = mapUrl(record.latitude, record.longitude);
  const fields = [
    { label: "Categoría", value: record.category },
    { label: "Ubicación", value: record.location },
    ...(record.fields ?? []),
    { label: "Registrado por", value: record.registeredBy },
    { label: "Fecha de registro", value: record.registeredAt },
  ].filter((field) => field.value != null && field.value !== "");

  return <article className="record-detail">
    <div className="record-detail__heading"><div><p className="eyebrow">Dashboard / {moduleName} / Detalle</p><h2>Detalle de {detailTitle}</h2></div><Link className="record-detail__back" to={backTo}>← Volver a {moduleName.toLowerCase()}</Link></div>
    <section className="record-detail__hero">
      <div className="record-detail__media">{images.length ? <img src={images[0]} alt={record.name} /> : <p>Sin imágenes disponibles</p>}</div>
      <div className="record-detail__identity"><span className={`status-badge status-badge--${record.status?.toLowerCase() === "inactivo" ? "inactivo" : "activo"}`}>{record.status === "INACTIVO" ? "Inactivo" : "Activo"}</span><p className="record-detail__category">{record.category ?? unavailable}</p><h1>{record.name}</h1><p className="record-detail__location">⌖ {record.location ?? unavailable}</p><p className="record-detail__description">{record.description ?? unavailable}</p></div>
    </section>
    {images.length > 1 && <section className="record-detail__gallery" aria-label="Galería de imágenes">{images.slice(1).map((image) => <img key={image} src={image} alt="" />)}</section>}
    <section className="record-detail__summary"><div><small>Calificación</small><strong>{summary.rating ?? unavailable}</strong></div><div><small>Precio</small><strong>{summary.price ?? unavailable}</strong></div><div><small>Horario</small><strong>{summary.hours ?? unavailable}</strong></div></section>
    <div className="record-detail__grid"><section className="record-detail__panel"><h3>Información general</h3>{fields.length ? <dl>{fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl> : <p className="record-detail__unavailable">Información incompleta.</p>}</section><section className="record-detail__panel"><h3>Descripción</h3><p>{record.description ?? unavailable}</p></section><section className="record-detail__panel"><h3>Servicios disponibles</h3>{record.services?.length ? <ul className="record-detail__services">{record.services.map((service) => <li key={service}>✓ {service}</li>)}</ul> : <p className="record-detail__unavailable">No hay servicios registrados.</p>}</section><section className="record-detail__panel"><h3>Ubicación en el mapa</h3>{locationMap ? <iframe className="record-detail__map" title={`Mapa de ${record.name}`} src={locationMap} loading="lazy" /> : <p className="record-detail__unavailable">No hay coordenadas registradas para mostrar el mapa.</p>}</section></div>
  </article>;
}

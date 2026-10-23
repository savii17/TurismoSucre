import { Link } from "react-router-dom";
import ImageGallery from "../ImageGallery";
import ImageWithFallback from "../ImageWithFallback";
import { useLanguage } from "../../i18n/useLanguage";
import type { ImageCategory, ImageSet } from "../../types/images";

export type DetailField = { label: string; value?: string | number | null };
export type RelatedDetail = {
  id: string;
  name: string;
  category?: string;
  location?: string;
  imageSet: ImageSet;
  to: string;
};

export type DetailRecord = {
  id: string;
  name: string;
  category?: string;
  status?: string;
  location?: string;
  address?: string;
  description?: string;
  image?: string;
  images?: string[];
  imageSet?: ImageSet;
  rating?: number;
  reviews?: number;
  price?: string;
  hours?: string;
  phone?: string;
  services?: string[];
  registeredBy?: string;
  registeredAt?: string;
  latitude?: number;
  longitude?: number;
  statusLabel?: string;
  fields?: DetailField[];
  tags?: string[];
  action?: { label: string; href: string };
};

type Props = {
  record?: DetailRecord;
  moduleName: string;
  detailTitle: string;
  backTo: string;
  summary: { rating?: string; price?: string; hours?: string };
  summaryLabels?: { rating?: string; price?: string; hours?: string };
  imageCategory: ImageCategory;
  related?: RelatedDetail[];
};

const copy = {
  es: {
    notFound: "Registro no encontrado", notFoundText: "El registro solicitado no existe o ya no está disponible.", back: "Volver al listado",
    dashboard: "Inicio", detail: "Detalle", statusActive: "Activo", statusInactive: "Inactivo", location: "Ubicación no registrada",
    address: "Dirección", phone: "Teléfono", category: "Categoría", locationLabel: "Ubicación", rating: "Valoración", reviews: "opiniones",
    description: "Descripción", readMore: "Leer más", readLess: "Leer menos", features: "Características", practical: "Información práctica",
    map: "Ubicación en el mapa", mapUnavailable: "No hay coordenadas registradas para mostrar el mapa.", openMap: "Abrir mapa", call: "Llamar",
    services: "Servicios e instalaciones", noServices: "No hay servicios registrados.", related: "También te puede interesar", noDescription: "No hay descripción registrada.",
    ratingLabel: "Calificación", price: "Precio", hours: "Horario", registeredBy: "Registrado por", registeredAt: "Fecha de registro",
  },
  en: {
    notFound: "Record not found", notFoundText: "The requested record does not exist or is no longer available.", back: "Back to list",
    dashboard: "Home", detail: "Details", statusActive: "Active", statusInactive: "Inactive", location: "Location not provided",
    address: "Address", phone: "Phone", category: "Category", locationLabel: "Location", rating: "Rating", reviews: "reviews",
    description: "Description", readMore: "Read more", readLess: "Read less", features: "Features", practical: "Visitor information",
    map: "Map location", mapUnavailable: "No coordinates are available to display the map.", openMap: "Open map", call: "Call",
    services: "Services and facilities", noServices: "No services are listed.", related: "You may also like", noDescription: "No description is available.",
    ratingLabel: "Rating", price: "Price", hours: "Hours", registeredBy: "Registered by", registeredAt: "Registration date",
  },
} as const;

const mapUrl = (latitude?: number, longitude?: number) => latitude != null && longitude != null
  ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
  : undefined;

export default function RecordDetailPage({ record, moduleName, detailTitle, backTo, summary, summaryLabels, imageCategory, related = [] }: Props) {
  const { language } = useLanguage();
  const text = copy[language];

  if (!record) {
    return <section className="record-detail record-detail--empty"><span className="record-detail__eyebrow">{moduleName}</span><h2>{text.notFound}</h2><p>{text.notFoundText}</p><Link className="detail-button" to={backTo}>{text.back}</Link></section>;
  }

  const images = [...new Set([record.image, ...(record.images ?? [])].filter((image): image is string => Boolean(image)))];
  const imageSet = record.imageSet ?? {
    category: imageCategory,
    main: images[0] ? { src: images[0], alt: `${record.name} en Sucre, Bolivia`, order: 0, role: "main" as const } : undefined,
    gallery: images.slice(1).map((src, index) => ({ src, alt: `${record.name} en Sucre, Bolivia · imagen ${index + 2}`, order: index + 1, role: "gallery" as const })),
    fallback: `/images/fallback/fallback-${imageCategory}.svg`,
  };
  const locationMap = mapUrl(record.latitude, record.longitude);
  const fields = [
    { label: text.category, value: record.category },
    { label: text.address, value: record.address },
    ...(record.location && record.location !== record.address ? [{ label: text.locationLabel, value: record.location }] : []),
    { label: text.phone, value: record.phone },
    ...(record.fields ?? []),
    { label: text.registeredBy, value: record.registeredBy },
    { label: text.registeredAt, value: record.registeredAt },
  ].filter((field, index, all) => field.value != null && field.value !== "" && all.findIndex((other) => other.label === field.label) === index);
  const statItems = [
    { label: summaryLabels?.rating ?? text.ratingLabel, value: summary.rating, icon: "★" },
    { label: summaryLabels?.price ?? text.price, value: summary.price, icon: "Bs" },
    { label: summaryLabels?.hours ?? text.hours, value: summary.hours, icon: "◷" },
  ].filter((item) => item.value != null && item.value !== "");
  const status = record.statusLabel ?? (record.status === "INACTIVO" ? text.statusInactive : record.status === "ACTIVO" ? text.statusActive : undefined);
  const tags = [...new Set([...(record.tags ?? []), ...(record.services ?? []).slice(0, 3)])].slice(0, 4);
  const hasDescription = Boolean(record.description?.trim());
  const mapSearchUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent([record.name, record.address ?? record.location, "Sucre Bolivia"].filter(Boolean).join(", "))}`;
  const primaryAction = record.action ?? (record.phone ? { label: text.call, href: `tel:${record.phone.replace(/[^+\d]/g, "")}` } : { label: text.openMap, href: locationMap ? `https://www.openstreetmap.org/?mlat=${record.latitude}&mlon=${record.longitude}#map=17/${record.latitude}/${record.longitude}` : mapSearchUrl });

  return <article className="record-detail">
    <div className="record-detail__heading">
      <div><p className="record-detail__eyebrow">{text.dashboard} <span>/</span> {moduleName} <span>/</span> {text.detail}</p><h2>{detailTitle}</h2></div>
      <Link className="record-detail__back" to={backTo}><span aria-hidden="true">←</span> {text.back}</Link>
    </div>

    <div className="record-detail__layout">
      <div className="record-detail__primary">
        <section className="record-detail__hero">
          <div className="record-detail__hero-media"><ImageGallery key={record.id} imageSet={imageSet} category={imageCategory} alt={record.name} /></div>
          <div className="record-detail__identity">
            <div className="record-detail__badges">{record.category && <span className="record-detail__category">{record.category}</span>}{status && <span className={`status-badge status-badge--${record.status === "INACTIVO" ? "inactivo" : "activo"}`}>{status}</span>}</div>
            <h1>{record.name}</h1>
            {(record.address || record.location) && <p className="record-detail__location"><span aria-hidden="true">⌖</span> {record.address ?? record.location}</p>}
            {record.rating != null && <p className="record-detail__rating"><span aria-label="Valoración">★</span> {record.rating.toFixed(1)}{record.reviews != null && <small> · {record.reviews} {text.reviews}</small>}</p>}
            {tags.length > 0 && <ul className="record-detail__tags">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
            {hasDescription && <p className="record-detail__intro">{record.description!.length > 185 ? `${record.description!.slice(0, 182).trimEnd()}…` : record.description}</p>}
            <div className="record-detail__actions"><a className="detail-button" href={primaryAction.href} target={primaryAction.href.startsWith("http") ? "_blank" : undefined} rel={primaryAction.href.startsWith("http") ? "noreferrer" : undefined}>{primaryAction.label}<span aria-hidden="true"> →</span></a></div>
          </div>
        </section>

        {statItems.length > 0 && <section className="record-detail__summary" aria-label={text.practical}>{statItems.map((item) => <div className="record-detail__stat" key={item.label}><span className="record-detail__stat-icon" aria-hidden="true">{item.icon}</span><span><small>{item.label}</small><strong>{item.value}</strong></span></div>)}</section>}

        <div className="record-detail__cards">
          {hasDescription && <section className="record-detail__panel record-detail__panel--description"><span className="record-detail__panel-icon" aria-hidden="true">✦</span><div><h3>{text.description}</h3><details className="record-detail__read-more"><summary><span className="record-detail__read-more-open">{text.readMore}</span><span className="record-detail__read-more-close">{text.readLess}</span></summary><p>{record.description}</p></details></div></section>}
          {record.services?.length ? <section className="record-detail__panel"><span className="record-detail__panel-icon" aria-hidden="true">✓</span><div><h3>{text.services}</h3><ul className="record-detail__services">{record.services.map((service) => <li key={service}>{service}</li>)}</ul></div></section> : null}
          {fields.length > 0 && <section className="record-detail__panel"><span className="record-detail__panel-icon" aria-hidden="true">⌑</span><div><h3>{text.features}</h3><dl>{fields.map((field, index) => <div key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div></section>}
          {!hasDescription && !record.services?.length && fields.length === 0 && <section className="record-detail__panel"><span className="record-detail__panel-icon" aria-hidden="true">i</span><div><h3>{text.practical}</h3><p className="record-detail__unavailable">{text.noDescription}</p></div></section>}
        </div>
      </div>

      <aside className="record-detail__aside">
        <section className="record-detail__panel record-detail__map-panel"><div className="record-detail__panel-heading"><span className="record-detail__panel-icon" aria-hidden="true">⌖</span><h3>{text.map}</h3></div>{locationMap ? <iframe className="record-detail__map" title={`${text.map}: ${record.name}`} src={locationMap} loading="lazy" /> : <div className="record-detail__map-empty"><span aria-hidden="true">⌖</span><p>{record.address ?? record.location ?? text.mapUnavailable}</p></div>}<a className="record-detail__text-link" href={locationMap ? primaryAction.href.includes("openstreetmap") && primaryAction.label === text.openMap ? primaryAction.href : `https://www.openstreetmap.org/?mlat=${record.latitude}&mlon=${record.longitude}#map=17/${record.latitude}/${record.longitude}` : mapSearchUrl} target="_blank" rel="noreferrer">{text.openMap} <span aria-hidden="true">↗</span></a></section>
        {(record.phone || record.hours || record.price || record.address || record.location) && <section className="record-detail__panel record-detail__practical"><h3>{text.practical}</h3><dl>{record.address && <div><dt>{text.address}</dt><dd>{record.address}</dd></div>}{record.location && record.location !== record.address && <div><dt>{text.locationLabel}</dt><dd>{record.location}</dd></div>}{record.phone && <div><dt>{text.phone}</dt><dd><a href={`tel:${record.phone.replace(/[^+\d]/g, "")}`}>{record.phone}</a></dd></div>}{record.hours && <div><dt>{text.hours}</dt><dd>{record.hours}</dd></div>}{record.price && <div><dt>{text.price}</dt><dd>{record.price}</dd></div>}</dl></section>}
      </aside>
    </div>

    {related.length > 0 && <section className="record-detail__related"><div className="record-detail__related-heading"><div><p className="record-detail__eyebrow">{moduleName}</p><h2>{text.related}</h2></div><Link to={backTo}>{text.back} <span aria-hidden="true">→</span></Link></div><div className="record-detail__related-grid">{related.slice(0, 4).map((item) => <Link className="record-detail__related-card" key={item.id} to={item.to}><ImageWithFallback imageSet={item.imageSet} category={item.imageSet.category} alt={item.name} objectFit="cover" /><span className="record-detail__related-copy">{item.category && <small>{item.category}</small>}<strong>{item.name}</strong>{item.location && <span>{item.location}</span>}</span><span className="record-detail__related-arrow" aria-hidden="true">↗</span></Link>)}</div></section>}
  </article>;
}

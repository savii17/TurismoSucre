import { Link } from "react-router-dom";
import ImageGallery from "../ImageGallery";
import ImageWithFallback from "../ImageWithFallback";
import LocationMap from "../LocationMap";
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
  mapLocation?: string;
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
  showLocationMap?: boolean;
  allowLocationSearch?: boolean;
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
    dashboard: "Inicio", detail: "Detalle", statusActive: "Activo", statusInactive: "Inactivo",
    address: "Dirección", phone: "Teléfono", category: "Categoría", locationLabel: "Ubicación", rating: "Valoración", reviews: "opiniones",
    description: "Descripción", readMore: "Leer más", readLess: "Leer menos", features: "Características", practical: "Información práctica",
    call: "Llamar", services: "Servicios e instalaciones", related: "También te puede interesar",
    ratingLabel: "Calificación", price: "Precio", hours: "Horario", registeredBy: "Registrado por", registeredAt: "Fecha de registro",
  },
  en: {
    notFound: "Record not found", notFoundText: "The requested record does not exist or is no longer available.", back: "Back to list",
    dashboard: "Home", detail: "Details", statusActive: "Active", statusInactive: "Inactive",
    address: "Address", phone: "Phone", category: "Category", locationLabel: "Location", rating: "Rating", reviews: "reviews",
    description: "Description", readMore: "Read more", readLess: "Read less", features: "Features", practical: "Visitor information",
    call: "Call", services: "Services and facilities", related: "You may also like",
    ratingLabel: "Rating", price: "Price", hours: "Hours", registeredBy: "Registered by", registeredAt: "Registration date",
  },
} as const;

const isDisplayable = (value: DetailField["value"]): boolean => {
  if (typeof value !== "string") return value != null;
  const normalized = value.trim();
  return Boolean(normalized) && !/(?:no disponible|sin informaci[oó]n|no especificad[oa]|no registrado|pendiente de verificaci[oó]n)/i.test(normalized);
};

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
  const fields = [
    { label: text.category, value: record.category },
    { label: text.address, value: record.address },
    ...(record.location && record.location !== record.address ? [{ label: text.locationLabel, value: record.location }] : []),
    { label: text.phone, value: record.phone },
    ...(record.fields ?? []),
    { label: text.registeredBy, value: record.registeredBy },
    { label: text.registeredAt, value: record.registeredAt },
  ].filter((field, index, all) => isDisplayable(field.value) && all.findIndex((other) => other.label === field.label) === index);
  const statItems = [
    { label: summaryLabels?.rating ?? text.ratingLabel, value: summary.rating, icon: "★" },
    { label: summaryLabels?.price ?? text.price, value: summary.price, icon: "Bs" },
    { label: summaryLabels?.hours ?? text.hours, value: summary.hours, icon: "◷" },
  ].filter((item) => isDisplayable(item.value));
  const status = record.statusLabel ?? (record.status === "INACTIVO" ? text.statusInactive : record.status === "ACTIVO" ? text.statusActive : undefined);
  const services = (record.services ?? []).filter((service) => isDisplayable(service));
  const tags = [...new Set([...(record.tags ?? []), ...services.slice(0, 3)].filter(isDisplayable))].slice(0, 4);
  const hasDescription = isDisplayable(record.description);
  const address = [record.address, record.mapLocation, record.location].find(isDisplayable);
  const primaryAction = record.action ?? (isDisplayable(record.phone) ? { label: text.call, href: `tel:${record.phone!.replace(/[^+\d]/g, "")}` } : undefined);

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
            {address && <p className="record-detail__location"><span aria-hidden="true">⌖</span> {address}</p>}
            {record.rating != null && <p className="record-detail__rating"><span aria-label="Valoración">★</span> {record.rating.toFixed(1)}{record.reviews != null && <small> · {record.reviews} {text.reviews}</small>}</p>}
            {tags.length > 0 && <ul className="record-detail__tags">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
            {hasDescription && <p className="record-detail__intro">{record.description!.length > 185 ? `${record.description!.slice(0, 182).trimEnd()}…` : record.description}</p>}
            {primaryAction && <div className="record-detail__actions"><a className="detail-button" href={primaryAction.href} target={primaryAction.href.startsWith("http") ? "_blank" : undefined} rel={primaryAction.href.startsWith("http") ? "noreferrer" : undefined}>{primaryAction.label}<span aria-hidden="true"> →</span></a></div>}
          </div>
        </section>

        {statItems.length > 0 && <section className="record-detail__summary" aria-label={text.practical}>{statItems.map((item) => <div className="record-detail__stat" key={item.label}><span className="record-detail__stat-icon" aria-hidden="true">{item.icon}</span><span><small>{item.label}</small><strong>{item.value}</strong></span></div>)}</section>}

        <div className="record-detail__cards">
          {hasDescription && <section className="record-detail__panel record-detail__panel--description"><span className="record-detail__panel-icon" aria-hidden="true">✦</span><div><h3>{text.description}</h3><details className="record-detail__read-more"><summary><span className="record-detail__read-more-open">{text.readMore}</span><span className="record-detail__read-more-close">{text.readLess}</span></summary><p>{record.description}</p></details></div></section>}
          {services.length > 0 ? <section className="record-detail__panel"><span className="record-detail__panel-icon" aria-hidden="true">✓</span><div><h3>{text.services}</h3><ul className="record-detail__services">{services.map((service) => <li key={service}>{service}</li>)}</ul></div></section> : null}
          {fields.length > 0 && <section className="record-detail__panel"><span className="record-detail__panel-icon" aria-hidden="true">⌑</span><div><h3>{text.features}</h3><dl>{fields.map((field, index) => <div key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div></section>}
        </div>
      </div>

      <aside className="record-detail__aside">
        {record.showLocationMap !== false && <div className="record-detail__panel record-detail__map-panel"><LocationMap latitude={record.latitude} longitude={record.longitude} name={record.name} address={address} allowAddressSearch={record.allowLocationSearch ?? true} /></div>}
        {(isDisplayable(record.phone) || isDisplayable(record.hours) || isDisplayable(record.price) || address) && <section className="record-detail__panel record-detail__practical"><h3>{text.practical}</h3><dl>{record.address && isDisplayable(record.address) && <div><dt>{text.address}</dt><dd>{record.address}</dd></div>}{record.location && isDisplayable(record.location) && record.location !== record.address && <div><dt>{text.locationLabel}</dt><dd>{record.location}</dd></div>}{isDisplayable(record.phone) && <div><dt>{text.phone}</dt><dd><a href={`tel:${record.phone!.replace(/[^+\d]/g, "")}`}>{record.phone}</a></dd></div>}{isDisplayable(record.hours) && <div><dt>{text.hours}</dt><dd>{record.hours}</dd></div>}{isDisplayable(record.price) && <div><dt>{text.price}</dt><dd>{record.price}</dd></div>}</dl></section>}
      </aside>
    </div>

    {related.length > 0 && <section className="record-detail__related"><div className="record-detail__related-heading"><div><p className="record-detail__eyebrow">{moduleName}</p><h2>{text.related}</h2></div><Link to={backTo}>{text.back} <span aria-hidden="true">→</span></Link></div><div className="record-detail__related-grid">{related.slice(0, 4).map((item) => <Link className="record-detail__related-card" key={item.id} to={item.to}><ImageWithFallback imageSet={item.imageSet} category={item.imageSet.category} alt={item.name} objectFit="cover" /><span className="record-detail__related-copy">{item.category && <small>{item.category}</small>}<strong>{item.name}</strong>{item.location && <span>{item.location}</span>}</span><span className="record-detail__related-arrow" aria-hidden="true">↗</span></Link>)}</div></section>}
  </article>;
}

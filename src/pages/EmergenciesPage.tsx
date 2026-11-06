import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { emergencyRepository } from "../repositories/emergencyRepository";
import type { Emergency, EmergencyInput } from "../types/emergency";
import ImageWithFallback from "../components/ImageWithFallback";
import LocationMap from "../components/LocationMap";
import { getImageSet } from "../data/imageCatalog";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";
import { getRecordEnglishField, getRecordEnglishTranslations, saveRecordEnglishTranslations } from "../i18n/contentTranslations";

type EmergencyFormValue = EmergencyInput & { nameEn: string; typeEn: string; locationEn: string; descriptionEn: string; hoursEn: string; servicesEn: string; institutionEn: string };
const emptyForm: EmergencyFormValue = { nombre_lugar: "", ubicacion: "", latitud: undefined, longitud: undefined, descripcion: "", telefono: "", tipo: "", registrado_por: "", estado: "ACTIVO", nameEn: "", typeEn: "", locationEn: "", descriptionEn: "", hoursEn: "", servicesEn: "", institutionEn: "" };
const pageSize = 6;

function EmergencyForm({ value, onCancel, onSave }: { value: EmergencyFormValue; onCancel: () => void; onSave: (value: EmergencyFormValue) => void }) {
  const { tx } = useLanguage();
  const [form, setForm] = useState(value);
  const [coordinateError, setCoordinateError] = useState("");
  const set = (key: keyof EmergencyFormValue, raw: string) => { setCoordinateError(""); setForm((current) => ({ ...current, [key]: key === "latitud" || key === "longitud" ? (raw === "" ? undefined : Number(raw)) : raw })); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasLatitude = form.latitud != null;
    const hasLongitude = form.longitud != null;
    if (hasLatitude !== hasLongitude || (hasLatitude && (!Number.isFinite(form.latitud) || Math.abs(form.latitud!) > 90 || !Number.isFinite(form.longitud) || Math.abs(form.longitud!) > 180))) {
      setCoordinateError(tx("Ingresa latitud y longitud válidas, o deja ambos campos vacíos hasta verificar las coordenadas."));
      return;
    }
    onSave(form);
  };
  return <form className="module-form" onSubmit={submit}>
    <label>{tx("Tipo")}<input required value={form.tipo} onChange={(e) => set("tipo", e.target.value)} /></label><label>{tx("Lugar")}<input required value={form.nombre_lugar} onChange={(e) => set("nombre_lugar", e.target.value)} /></label>
    <label className="module-form__wide">{tx("Descripción")}<textarea required value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} /></label><label>{tx("Ubicación")}<input required value={form.ubicacion} onChange={(e) => set("ubicacion", e.target.value)} /></label>
    <label>{tx("Teléfono")}<input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} /></label><label>{tx("Latitud")}<input type="number" step="any" value={form.latitud ?? ""} onChange={(e) => set("latitud", e.target.value)} /></label><label>{tx("Longitud")}<input type="number" step="any" value={form.longitud ?? ""} onChange={(e) => set("longitud", e.target.value)} /></label>{coordinateError && <p className="module-form__error" role="alert">{coordinateError}</p>}
    <label>{tx("Registrado por")}<input required value={form.registrado_por} onChange={(e) => set("registrado_por", e.target.value)} /></label><label>{tx("Estado")}<select value={form.estado} onChange={(e) => set("estado", e.target.value)}><option value="ACTIVO">{tx("ACTIVO")}</option><option value="INACTIVO">{tx("INACTIVO")}</option></select></label>
    <details className="module-form__wide translation-fields"><summary>{tx("Versión en inglés (opcional)")}</summary><p>{tx("Completa los campos en inglés para que el registro no aparezca pendiente en ese idioma. Los nombres propios pueden conservarse.")}</p><p role="status">{form.nameEn.trim() ? tx("Traducción del nombre completa") : tx("Traducción del nombre pendiente")}</p>
      <label>{tx("Nombre en inglés")}<input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} /></label><label>{tx("Categoría en inglés")}<input value={form.typeEn} onChange={(e) => set("typeEn", e.target.value)} /></label>
      <label className="module-form__wide">{tx("Ubicación en inglés")}<input value={form.locationEn} onChange={(e) => set("locationEn", e.target.value)} /></label><label className="module-form__wide">{tx("Descripción en inglés")}<textarea value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} /></label>
      <label>{tx("Horario o periodicidad en inglés")}<input value={form.hoursEn} onChange={(e) => set("hoursEn", e.target.value)} /></label><label>{tx("Servicios en inglés (mismo orden, separados por coma)")}<input value={form.servicesEn} onChange={(e) => set("servicesEn", e.target.value)} /></label><label>{tx("Institución en inglés")}<input value={form.institutionEn} onChange={(e) => set("institutionEn", e.target.value)} /></label>
    </details>
    <div className="module-form__actions"><button type="button" className="module-button module-button--secondary" onClick={onCancel}>{tx("Cancelar")}</button><button className="admin-button">{tx("Guardar emergencia")}</button></div>
  </form>;
}

export default function EmergenciesPage() {
  const { language, tx } = useLanguage();
  const [items, setItems] = useState<Emergency[]>(() => emergencyRepository.list());
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("TODOS"); const [type, setType] = useState("TODOS"); const [page, setPage] = useState(1); const [editing, setEditing] = useState<Emergency | null | "new">(null); const [detail, setDetail] = useState<Emergency | null>(null);
  const types = useMemo(() => [...new Set(items.map((item) => item.tipo))], [items]);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visible = items.filter((item) => `${item.PK_id} ${item.nombre_lugar} ${translateRecordText("emergency", item.PK_id, "name", item.nombre_lugar, language)} ${item.tipo} ${item.descripcion} ${item.ubicacion} ${item.telefono} ${item.telefono_emergencia ?? ""} ${item.institucion ?? ""} ${(item.servicios ?? []).join(" ")}`.toLocaleLowerCase().includes(normalizedQuery) && (status === "TODOS" || item.estado === status) && (type === "TODOS" || item.tipo === type));
  const pages = Math.max(1, Math.ceil(visible.length / pageSize)); const records = visible.slice((page - 1) * pageSize, page * pageSize);
  const refresh = () => { setItems(emergencyRepository.list()); setPage(1); };
  const save = (form: EmergencyFormValue) => {
    const { nameEn, typeEn, locationEn, descriptionEn, hoursEn, servicesEn, institutionEn, ...record } = form;
    const saved = editing === "new" ? emergencyRepository.create(record) : editing ? emergencyRepository.update(editing.PK_id, record) : undefined;
    if (saved) {
      const serviceMap = Object.fromEntries((record.servicios ?? []).flatMap((service, index) => { const translated = servicesEn.split(",").map((part) => part.trim())[index]; return translated ? [[service, translated]] : []; }));
      saveRecordEnglishTranslations("emergency", saved.PK_id, { ...(nameEn.trim() ? { name: nameEn.trim() } : {}), ...(typeEn.trim() ? { type: typeEn.trim() } : {}), ...(locationEn.trim() ? { location: locationEn.trim() } : {}), ...(descriptionEn.trim() ? { description: descriptionEn.trim() } : {}), ...(hoursEn.trim() ? { hours: hoursEn.trim() } : {}), ...(institutionEn.trim() ? { institution: institutionEn.trim() } : {}), ...(Object.keys(serviceMap).length ? { services: serviceMap } : {}) });
    }
    setEditing(null); refresh();
  };
  const emergencyForm = (item: Emergency): EmergencyFormValue => { const stored = getRecordEnglishTranslations("emergency", item.PK_id); return { ...item, nameEn: getRecordEnglishField("emergency", item.PK_id, "name"), typeEn: typeof stored.type === "string" ? stored.type : "", locationEn: typeof stored.location === "string" ? stored.location : "", descriptionEn: typeof stored.description === "string" ? stored.description : "", hoursEn: typeof stored.hours === "string" ? stored.hours : "", institutionEn: typeof stored.institution === "string" ? stored.institution : "", servicesEn: (item.servicios ?? []).map((service) => typeof stored.services === "object" ? stored.services[service] ?? "" : "").join(", ") }; };
  const validLocations = items.filter((item) => Number.isFinite(item.latitud) && Number.isFinite(item.longitud));
  const byType = types.map((name) => ({ name, count: items.filter((item) => item.tipo === name).length }));
  const activeCount = items.filter((item) => item.estado === "ACTIVO").length;
  const roundTheClockCount = items.filter((item) => item.estado === "ACTIVO" && item.atencion_24_horas).length;
  const phoneCount = items.filter((item) => Boolean(item.telefono.trim())).length;
  const hasPhysicalAddress = (location: string) => /\b(calle|av\.?|avenida|plaza|plazuela|zona|pasaje|km\.?|kilómetro|urbanización)\b/i.test(location);
  const displayLocation = (location: string) => location.replace(/\s*\([^)]*dirección física no especificada[^)]*\)/i, "").trim();
  return <section className="module-page">
    <div className="module-heading"><div><p className="eyebrow">{tx("Gestión")}</p><h1>{tx("Emergencias")}</h1><p>{tx("Directorio de asistencia y servicios de emergencia de Sucre.")}</p></div><button className="admin-button" onClick={() => setEditing("new")}>{tx("Registrar Emergencia")}</button></div>
    <div className="module-stats"><article><span>{tx("Total")}</span><strong>{items.length}</strong><small>{tx("Servicios registrados")}</small></article><article><span>{tx("Activos")}</span><strong>{activeCount}</strong><small>{tx("Disponibilidad según fuente")}</small></article><article><span>{tx("Atención 24 horas")}</span><strong>{roundTheClockCount}</strong><small>{tx("Verificada en la fuente")}</small></article><article><span>{tx("Con teléfono")}</span><strong>{phoneCount}</strong><small>{tx("Número publicado")}</small></article></div>
    <div className="emergency-insights">{validLocations.length > 0 && <article className="module-panel"><h2>{tx("Ubicación de servicios")}</h2><ul className="location-list">{validLocations.slice(0, 5).map((item) => <li key={item.PK_id}><strong>{translateRecordText("emergency", item.PK_id, "name", item.nombre_lugar, language)}</strong><span>{translateRecordText("emergency", item.PK_id, "location", item.ubicacion, language)}</span></li>)}</ul></article>}<article className="module-panel"><h2>{tx("Servicios por categoría")}</h2><ul className="bar-list">{byType.map(({ name, count }) => <li key={name}><span>{translateRecordText("emergency", name, "type", name, language)}</span><i><b style={{ width: `${items.length ? (count / items.length) * 100 : 0}%` }} /></i><strong>{count}</strong></li>)}</ul></article>{roundTheClockCount > 0 && <article className="module-panel"><h2>{tx("Atención 24 horas verificada")}</h2><ul className="location-list">{items.filter((item) => item.estado === "ACTIVO" && item.atencion_24_horas).map((item) => <li key={item.PK_id}><strong>{translateRecordText("emergency", item.PK_id, "name", item.nombre_lugar, language)}</strong>{(item.telefono_emergencia || item.telefono) && <span>{item.telefono_emergencia ? `${tx("Línea de emergencia")} ${item.telefono_emergencia}` : item.telefono}</span>}</li>)}</ul></article>}</div>
    <div className="module-panel"><div className="module-filters"><input placeholder={tx("Buscar emergencia")} value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} /><select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}><option value="TODOS">{tx("Todos los tipos")}</option>{types.map((value) => <option key={value} value={value}>{translateRecordText("emergency", value, "type", value, language)}</option>)}</select><select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="TODOS">{tx("Todos los estados")}</option><option value="ACTIVO">{tx("ACTIVO")}</option><option value="INACTIVO">{tx("INACTIVO")}</option></select></div>
      <div className="emergency-directory-grid">{records.map((item) => <article className="emergency-directory-card" key={item.PK_id}>
        <div className="emergency-directory-card__media"><ImageWithFallback imageSet={getImageSet("emergency", item.PK_id)} category="emergency" alt={`${tx("Servicio de emergencia de Sucre")}: ${translateRecordText("emergency", item.PK_id, "name", item.nombre_lugar, language)}`} /><span>{translateRecordText("emergency", item.PK_id, "type", item.tipo, language)}</span></div>
        <div className="emergency-directory-card__body"><p className="emergency-directory-card__eyebrow">{tx("Asistencia en Sucre")}</p><h2>{translateRecordText("emergency", item.PK_id, "name", item.nombre_lugar, language)}</h2>
          <p className="emergency-directory-card__description">{translateRecordText("emergency", item.PK_id, "description", item.descripcion, language)}</p>
          <p className="emergency-directory-card__location">⌖ {translateRecordText("emergency", item.PK_id, "location", displayLocation(item.ubicacion), language)}</p>
          {item.horario && <p className="emergency-directory-card__hours">◷ {translateRecordText("emergency", item.PK_id, "hours", item.horario, language)}</p>}
          {item.servicios?.length ? <div className="emergency-directory-card__services">{item.servicios.slice(0, 3).map((service) => <span key={service}>{translateRecordText("emergency", item.PK_id, "services", service, language)}</span>)}</div> : null}
          {item.atencion_24_horas && <p className="emergency-directory-card__availability">{tx("Atención 24 horas")}</p>}
          <div className="emergency-directory-card__phones">{item.telefono && <a href={`tel:${item.telefono.replace(/[^\d+]/g, "")}`}>{tx("Teléfono")}: {item.telefono}</a>}{item.telefono_emergencia && <a href={`tel:${item.telefono_emergencia.replace(/[^\d+]/g, "")}`}>{tx("Emergencia")}: {item.telefono_emergencia}</a>}</div>
          <button type="button" className="emergency-directory-card__details" onClick={() => setDetail(item)}>{tx("Ver detalles")} <span aria-hidden="true">→</span></button>
          <div className="emergency-directory-card__admin"><span className={`module-status module-status--${item.estado.toLowerCase()}`}>{tx(item.estado)}</span><div className="module-actions"><button onClick={() => setEditing(item)}>{tx("Editar")}</button><button onClick={() => { emergencyRepository.toggleStatus(item.PK_id); refresh(); }}>{item.estado === "ACTIVO" ? tx("Desactivar") : tx("Activar")}</button><button className="danger" onClick={() => { if (window.confirm(tx("¿Eliminar esta emergencia?"))) { emergencyRepository.remove(item.PK_id); refresh(); } }}>{tx("Eliminar")}</button></div></div>
        </div>
      </article>)}{!records.length && <p className="module-empty">{tx("No se encontraron emergencias.")}</p>}</div><div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>{tx("Anterior")}</button><span>{page} {tx("de")} {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}>{tx("Siguiente")}</button></div>
    </div>
    {(editing || detail) && <div className="module-dialog-backdrop" role="presentation"><section className="module-dialog" role="dialog" aria-modal="true">
      <button className="module-dialog__close" aria-label={tx("Cerrar")} onClick={() => { setEditing(null); setDetail(null); }}>×</button>
      {detail ? <div>
        <h2>{translateRecordText("emergency", detail.PK_id, "name", detail.nombre_lugar, language)}</h2>
        <div className="emergency-detail-image"><ImageWithFallback imageSet={getImageSet("emergency", detail.PK_id)} category="emergency" alt={`${tx("Servicio de emergencia de Sucre")}: ${translateRecordText("emergency", detail.PK_id, "name", detail.nombre_lugar, language)}`} /></div>
        <dl className="module-detail">
          <dt>{tx("Tipo")}</dt><dd>{translateRecordText("emergency", detail.PK_id, "type", detail.tipo, language)}</dd>
          <dt>{tx("Descripción")}</dt><dd>{translateRecordText("emergency", detail.PK_id, "description", detail.descripcion, language)}</dd>
          <dt>{tx("Ubicación")}</dt><dd>{translateRecordText("emergency", detail.PK_id, "location", displayLocation(detail.ubicacion), language)}</dd>
          {detail.telefono && <><dt>{tx("Teléfono")}</dt><dd>{detail.telefono}</dd></>}
          {detail.telefono_emergencia && <><dt>{tx("Teléfono de emergencia")}</dt><dd>{detail.telefono_emergencia}</dd></>}
          {detail.horario && <><dt>{tx("Horario")}</dt><dd>{translateRecordText("emergency", detail.PK_id, "hours", detail.horario, language)}</dd></>}
          {detail.servicios?.length ? <><dt>{tx("Servicios")}</dt><dd>{detail.servicios.map((service) => translateRecordText("emergency", detail.PK_id, "services", service, language)).join(", ")}</dd></> : null}
          {detail.atencion_24_horas && <><dt>{tx("Atención")}</dt><dd>{tx("24 horas (verificado)")}</dd></>}
          {detail.institucion && <><dt>{tx("Institución")}</dt><dd>{translateRecordText("emergency", detail.PK_id, "institution", detail.institucion, language)}</dd></>}
          {detail.sitio_web && <><dt>{tx("Sitio web")}</dt><dd><a href={detail.sitio_web} target="_blank" rel="noreferrer">{tx("Abrir sitio oficial")}</a></dd></>}
          {detail.fuente_url && <><dt>{tx("Fuente")}</dt><dd><a href={detail.fuente_url} target="_blank" rel="noreferrer">{tx("Ver fuente consultada")}</a></dd></>}
          {detail.fuente_secundaria_url && <><dt>{tx("Fuente adicional")}</dt><dd><a href={detail.fuente_secundaria_url} target="_blank" rel="noreferrer">{tx("Ver información complementaria")}</a></dd></>}
          <dt>{tx("Estado")}</dt><dd>{tx(detail.estado)}</dd>
          {detail.registrado_por && <><dt>{tx("Registrado por")}</dt><dd>{translateRecordText("emergency", detail.PK_id, "registeredBy", detail.registrado_por, language)}</dd></>}
        </dl>
        <div className="emergency-detail-map"><LocationMap name={translateRecordText("emergency", detail.PK_id, "name", detail.nombre_lugar, language)} address={hasPhysicalAddress(detail.ubicacion) ? translateRecordText("emergency", detail.PK_id, "location", detail.ubicacion, language) : undefined} latitude={detail.latitud} longitude={detail.longitud} /></div>
      </div> : <div><h2>{editing === "new" ? tx("Registrar emergencia") : tx("Editar emergencia")}</h2><EmergencyForm value={editing === "new" ? emptyForm : emergencyForm(editing!)} onCancel={() => setEditing(null)} onSave={save} /></div>}
    </section></div>}
  </section>;
}

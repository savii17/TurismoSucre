import { useState } from "react";
import AdministrativeListingPage from "../../components/listing/AdministrativeListingPage";
import { catalogRepository, type CatalogItem, type CatalogKind } from "../../repositories/catalogRepository";
import type { AdministrativeListing } from "../../types/listing";
import type { EventRecord } from "../../types/event";
import type { EntertainmentRecord } from "../../types/listing";
import { useLanguage } from "../../i18n/useLanguage";
import LocationSearchField from "../../components/listing/LocationSearchField";
import ImageUrlField from "../../components/listing/ImageUrlField";
import { getRecordEnglishField, getRecordEnglishTranslations, saveRecordEnglishTranslations } from "../../i18n/contentTranslations";
import type { ContentKind } from "../../i18n/contentTranslations";

const contentKind: Record<CatalogKind, ContentKind> = { hospedajes: "accommodation", restaurantes: "restaurant", entretenimiento: "entertainment", eventos: "event" };

type FormValue = { name: string; category: string; location: string; latitude?: number; longitude?: number; description: string; image: string; phone: string; hours: string; services: string; startTime: string; endTime: string; source: string; startDate: string; endDate: string; nameEn: string; categoryEn: string; locationEn: string; descriptionEn: string; hoursEn: string; servicesEn: string };
const emptyForm: FormValue = { name: "", category: "", location: "", latitude: undefined, longitude: undefined, description: "", image: "", phone: "", hours: "", services: "", startTime: "", endTime: "", source: "", startDate: "", endDate: "", nameEn: "", categoryEn: "", locationEn: "", descriptionEn: "", hoursEn: "", servicesEn: "" };

function fromItem(kind: CatalogKind, item: CatalogItem): FormValue {
  const id = "id" in item ? item.id : item._id;
  const stored = getRecordEnglishTranslations(contentKind[kind], id);
  const serviceTranslations = stored.services && typeof stored.services === "object" ? stored.services : {};
  const englishBase = { nameEn: getRecordEnglishField(contentKind[kind], id, "name"), categoryEn: getRecordEnglishField(contentKind[kind], id, "category"), locationEn: getRecordEnglishField(contentKind[kind], id, "location"), descriptionEn: getRecordEnglishField(contentKind[kind], id, "description"), hoursEn: getRecordEnglishField(contentKind[kind], id, "hours") || getRecordEnglishField(contentKind[kind], id, "periodicity") };
  if (kind === "eventos") { const event = item as EventRecord; return { ...emptyForm, ...englishBase, servicesEn: "", name: event.name, category: event.category, location: event.location, latitude: event.latitude, longitude: event.longitude, description: event.description, image: event.image ?? "", phone: event.phone ?? "", hours: event.periodicity ?? "", source: event.source, startDate: event.startDate ?? "", endDate: event.endDate ?? "" }; }
  if (kind === "entretenimiento") { const place = item as EntertainmentRecord; return { ...emptyForm, ...englishBase, servicesEn: place.servicios.map((service) => serviceTranslations[service] ?? "").join(", "), name: place.nombre_lugar, category: place.tipo, location: place.ubicacion, latitude: place.latitud, longitude: place.longitud, description: place.descripcion, image: place.imagenes_url[0] ?? "", phone: place.telefono ?? "", startTime: place.horario_inicio ?? "", endTime: place.horario_fin ?? "", hours: [place.horario_inicio, place.horario_fin].filter(Boolean).join("–"), services: place.servicios.join(", ") }; }
  const listing = item as AdministrativeListing;
  return { ...emptyForm, ...englishBase, servicesEn: (listing.services ?? []).map((service) => serviceTranslations[service] ?? "").join(", "), name: listing.name, category: listing.category, location: listing.location, latitude: listing.latitude, longitude: listing.longitude, description: listing.description, image: listing.image ?? "", phone: listing.phone ?? "", hours: listing.hours ?? "", services: listing.services?.join(", ") ?? "" };
}

function viewItem(kind: CatalogKind, item: CatalogItem): AdministrativeListing {
  if (kind === "eventos") { const event = item as EventRecord; return { id: event.id, name: event.name, category: event.category, description: event.description, location: event.location, latitude: event.latitude, longitude: event.longitude, status: event.status === "CANCELADO" || event.status === "FINALIZADO" ? "INACTIVO" : "ACTIVO", image: event.image, date: event.startDate, phone: event.phone }; }
  if (kind === "entretenimiento") { const place = item as EntertainmentRecord; return { id: place._id, name: place.nombre_lugar, category: place.tipo, description: place.descripcion, location: place.ubicacion, latitude: place.latitud, longitude: place.longitud, status: place.estado ?? "ACTIVO", image: place.imagenes_url[0], images: place.imagenes_url, phone: place.telefono, hours: [place.horario_inicio, place.horario_fin].filter(Boolean).join("–"), services: place.servicios }; }
  return item as AdministrativeListing;
}

function CatalogForm({ initial, kind, onCancel, onSave }: { initial: FormValue; kind: CatalogKind; onCancel: () => void; onSave: (value: FormValue) => void }) {
  const { tx } = useLanguage();
  const [form, setForm] = useState(initial);
  const set = (key: keyof FormValue, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const fields: Array<[keyof FormValue, string, "text" | "url" | "date" | "time"]> = [["name", "Nombre", "text"], ["category", "Categoría", "text"], ["phone", "Teléfono", "text"], ["hours", "Horario o periodicidad", "text"], ["startTime", "Hora de inicio", "time"], ["endTime", "Hora de cierre", "time"], ["startDate", "Fecha de inicio", "date"], ["endDate", "Fecha de finalización", "date"], ["source", "Enlace informativo", "url"]];
  const hoursHint = kind === "eventos" ? "Ej.: Anual, cada 25 de mayo" : kind === "hospedajes" ? "Ej.: Atención las 24 horas" : kind === "restaurantes" ? "Ej.: Todos los días, 08:00 a 22:00" : kind === "entretenimiento" ? "Ej.: Viernes y sábados, 20:00 a 03:00" : "Ej.: Lunes a sábado, 09:00 a 18:00";
  return <form className="module-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
    {fields.filter(([key]) => key !== "hours").slice(0, 2).map(([key, label, type]) => <label key={key}>{tx(label)}<input required={key === "name" || key === "category"} type={type} value={form[key]} onChange={(event) => set(key, event.target.value)} /></label>)}
    <div className="module-form__wide"><LocationSearchField value={form.location} latitude={form.latitude} longitude={form.longitude} onChange={(location, latitude, longitude) => setForm((current) => ({ ...current, location, latitude, longitude }))} /></div>
    {fields.filter(([key]) => key !== "hours").slice(2).map(([key, label, type]) => <label key={key}>{tx(label)}<input required={key === "name" || key === "category"} type={type} value={form[key]} onChange={(event) => set(key, event.target.value)} /></label>)}
    <label>{tx("Horario o periodicidad")}<input value={form.hours} placeholder={tx(hoursHint)} onChange={(event) => set("hours", event.target.value)} /></label>
    <div className="module-form__wide"><ImageUrlField value={form.image} onChange={(image) => set("image", image)} /></div>
    <label className="module-form__wide">{tx("Descripción")}<textarea required value={form.description} onChange={(event) => set("description", event.target.value)} /></label>
    <label className="module-form__wide">{tx("Servicios separados por coma")}<input value={form.services} onChange={(event) => set("services", event.target.value)} /><small>{tx("Separa cada servicio con una coma. Ej.: Wi-Fi, baños, estacionamiento, visitas guiadas, cafetería")}</small></label>
    <details className="module-form__wide translation-fields"><summary>{tx("Versión en inglés (opcional)")}</summary><p>{tx("Completa los campos en inglés para que el registro no aparezca pendiente en ese idioma. Los nombres propios pueden conservarse.")}</p><p role="status">{form.nameEn.trim() ? tx("Traducción del nombre completa") : tx("Traducción del nombre pendiente")}</p>
      <label>{tx("Nombre en inglés")}<input value={form.nameEn} onChange={(event) => set("nameEn", event.target.value)} /></label>
      <label>{tx("Categoría en inglés")}<input value={form.categoryEn} onChange={(event) => set("categoryEn", event.target.value)} /></label>
      <label className="module-form__wide">{tx("Ubicación en inglés")}<input value={form.locationEn} onChange={(event) => set("locationEn", event.target.value)} /></label>
      <label className="module-form__wide">{tx("Descripción en inglés")}<textarea value={form.descriptionEn} onChange={(event) => set("descriptionEn", event.target.value)} /></label>
      <label>{tx("Horario o periodicidad en inglés")}<input value={form.hoursEn} onChange={(event) => set("hoursEn", event.target.value)} /></label>
      <label className="module-form__wide">{tx("Servicios en inglés (mismo orden, separados por coma)")}<input value={form.servicesEn} onChange={(event) => set("servicesEn", event.target.value)} /></label>
    </details>
    <div className="module-form__actions"><button type="button" className="module-button module-button--secondary" onClick={onCancel}>{tx("Cancelar")}</button><button className="admin-button">{tx("Guardar cambios")}</button></div>
  </form>;
}

export default function AdminCatalogPage({ kind, title, description, actionLabel }: { kind: CatalogKind; title: string; description: string; actionLabel: string }) {
  const { tx } = useLanguage();
  const [items, setItems] = useState(() => catalogRepository.list(kind));
  const [editing, setEditing] = useState<{ id?: string; form: FormValue } | null>(null);
  const [error, setError] = useState("");
  const view = items.map((item) => viewItem(kind, item));
  const refresh = () => setItems(catalogRepository.list(kind));
  const save = (value: FormValue) => {
    const common = { ...value, image: value.image.trim(), services: value.services.split(",").map((part) => part.trim()).filter(Boolean) };
    const geo = { latitude: common.latitude, longitude: common.longitude, latitud: common.latitude, longitud: common.longitude, locationVerificationStatus: common.latitude != null && common.longitude != null ? "VERIFICADA" : "PENDIENTE_VERIFICACION" };
    const source = kind === "entretenimiento" ? { nombre_lugar: common.name, tipo: common.category, ubicacion: common.location, descripcion: common.description, telefono: common.phone, horario_inicio: common.startTime || common.hours, horario_fin: common.endTime, imagenes_url: common.image ? [common.image] : [], servicios: common.services, ...geo } : kind === "eventos" ? { name: common.name, category: common.category, location: common.location, description: common.description, image: common.image, phone: common.phone, periodicity: common.hours, source: common.source, startDate: common.startDate || undefined, endDate: common.endDate || undefined, ...geo } : { name: common.name, category: common.category, location: common.location, address: common.location, description: common.description, image: common.image, phone: common.phone, hours: common.hours, services: common.services, ...geo };
    try {
      const saved = editing?.id ? catalogRepository.update(kind, editing.id, source) : catalogRepository.create(kind, source);
      if (saved) {
        const id = "id" in saved ? saved.id : saved._id;
        const sourceServices = common.services;
        const translatedServices = common.servicesEn.split(",").map((part) => part.trim());
        const serviceMap = Object.fromEntries(sourceServices.flatMap((service, index) => translatedServices[index] ? [[service, translatedServices[index]]] : []));
        saveRecordEnglishTranslations(contentKind[kind], id, {
          ...(common.nameEn.trim() ? { name: common.nameEn.trim() } : {}),
          ...(common.categoryEn.trim() ? { category: common.categoryEn.trim() } : {}),
          ...(common.locationEn.trim() ? { location: common.locationEn.trim(), address: common.locationEn.trim() } : {}),
          ...(common.descriptionEn.trim() ? { description: common.descriptionEn.trim(), shortDescription: common.descriptionEn.trim() } : {}),
          ...(common.hoursEn.trim() ? kind === "eventos" ? { periodicity: common.hoursEn.trim() } : { hours: common.hoursEn.trim(), periodicity: common.hoursEn.trim() } : {}),
          ...(Object.keys(serviceMap).length ? { services: serviceMap } : {}),
        });
      }
      setEditing(null); setError(""); refresh();
    } catch (cause) { setError(cause instanceof Error ? tx(cause.message) : tx("No se pudo guardar el registro.")); }
  };
  const remove = (id: string, name: string) => {
    if (!window.confirm(tx(`¿Eliminar «${name}»?`))) return;
    try { catalogRepository.remove(kind, id); refresh(); } catch { setError(tx("No se pudo eliminar el registro.")); }
  };
  const toPublic = kind === "hospedajes" ? "/admin/hospedajes" : kind === "restaurantes" ? "/admin/restaurantes" : kind === "entretenimiento" ? "/admin/entretenimiento" : "/admin/eventos";
  return <section className="module-page admin-catalog-page">
    {error && <p className="module-form__error" role="alert">{error}</p>}
    <AdministrativeListingPage title={title} description={description} actionLabel={actionLabel} items={view} detailPath={toPublic} kind={kind === "hospedajes" ? "accommodations" : kind === "restaurantes" ? "restaurants" : kind === "entretenimiento" ? "entertainment" : "events"} canManage onCreate={() => setEditing({ form: emptyForm })} onEdit={(id) => { const original = items.find((item) => ("id" in item ? item.id : item._id) === id); if (original) setEditing({ id, form: fromItem(kind, original) }); }} onDelete={remove} />
    {editing && <div className="module-dialog-backdrop"><section className="module-dialog" role="dialog" aria-modal="true"><button className="module-dialog__close" type="button" aria-label={tx("Cerrar")} onClick={() => setEditing(null)}>×</button><h2>{tx(editing.id ? "Editar registro" : "Nuevo registro")}</h2><CatalogForm initial={editing.form} kind={kind} onCancel={() => setEditing(null)} onSave={save} /></section></div>}
  </section>;
}

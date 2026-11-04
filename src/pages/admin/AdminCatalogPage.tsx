import { useState } from "react";
import AdministrativeListingPage from "../../components/listing/AdministrativeListingPage";
import { catalogRepository, type CatalogItem, type CatalogKind } from "../../repositories/catalogRepository";
import type { AdministrativeListing } from "../../types/listing";
import type { EventRecord } from "../../types/event";
import type { EntertainmentRecord } from "../../types/listing";
import { useLanguage } from "../../i18n/useLanguage";

type FormValue = { name: string; category: string; location: string; description: string; image: string; phone: string; hours: string; services: string; startTime: string; endTime: string; source: string; startDate: string; endDate: string };
const emptyForm: FormValue = { name: "", category: "", location: "Sucre, Bolivia", description: "", image: "", phone: "", hours: "", services: "", startTime: "", endTime: "", source: "", startDate: "", endDate: "" };

function fromItem(kind: CatalogKind, item: CatalogItem): FormValue {
  if (kind === "eventos") { const event = item as EventRecord; return { ...emptyForm, name: event.name, category: event.category, location: event.location, description: event.description, image: event.image ?? "", phone: event.phone ?? "", hours: event.periodicity ?? "", source: event.source, startDate: event.startDate ?? "", endDate: event.endDate ?? "" }; }
  if (kind === "entretenimiento") { const place = item as EntertainmentRecord; return { ...emptyForm, name: place.nombre_lugar, category: place.tipo, location: place.ubicacion, description: place.descripcion, image: place.imagenes_url[0] ?? "", phone: place.telefono ?? "", startTime: place.horario_inicio ?? "", endTime: place.horario_fin ?? "", services: place.servicios.join(", ") }; }
  const listing = item as AdministrativeListing;
  return { ...emptyForm, name: listing.name, category: listing.category, location: listing.location, description: listing.description, image: listing.image ?? "", phone: listing.phone ?? "", hours: listing.hours ?? "", services: listing.services?.join(", ") ?? "" };
}

function viewItem(kind: CatalogKind, item: CatalogItem): AdministrativeListing {
  if (kind === "eventos") { const event = item as EventRecord; return { id: event.id, name: event.name, category: event.category, description: event.description, location: event.location, status: event.status === "CANCELADO" || event.status === "FINALIZADO" ? "INACTIVO" : "ACTIVO", image: event.image, date: event.startDate, phone: event.phone }; }
  if (kind === "entretenimiento") { const place = item as EntertainmentRecord; return { id: place._id, name: place.nombre_lugar, category: place.tipo, description: place.descripcion, location: place.ubicacion, status: place.estado ?? "ACTIVO", image: place.imagenes_url[0], images: place.imagenes_url, phone: place.telefono, hours: [place.horario_inicio, place.horario_fin].filter(Boolean).join("–"), services: place.servicios }; }
  return item as AdministrativeListing;
}

function CatalogForm({ initial, onCancel, onSave }: { initial: FormValue; onCancel: () => void; onSave: (value: FormValue) => void }) {
  const { tx } = useLanguage();
  const [form, setForm] = useState(initial);
  const set = (key: keyof FormValue, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const fields: Array<[keyof FormValue, string, "text" | "url" | "date" | "time"]> = [["name", "Nombre", "text"], ["category", "Categoría", "text"], ["location", "Ubicación", "text"], ["phone", "Teléfono", "text"], ["image", "Imagen (ruta o URL)", "text"], ["hours", "Horario o periodicidad", "text"], ["startTime", "Hora de inicio", "time"], ["endTime", "Hora de cierre", "time"], ["startDate", "Fecha de inicio", "date"], ["endDate", "Fecha de finalización", "date"], ["source", "Enlace informativo", "url"]];
  return <form className="module-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
    {fields.map(([key, label, type]) => <label key={key}>{tx(label)}<input required={key === "name" || key === "category"} type={type} value={form[key]} onChange={(event) => set(key, event.target.value)} /></label>)}
    <label className="module-form__wide">{tx("Descripción")}<textarea required value={form.description} onChange={(event) => set("description", event.target.value)} /></label>
    <label className="module-form__wide">{tx("Servicios separados por coma")}<input value={form.services} onChange={(event) => set("services", event.target.value)} /></label>
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
    const source = kind === "entretenimiento" ? { nombre_lugar: common.name, tipo: common.category, ubicacion: common.location, descripcion: common.description, telefono: common.phone, horario_inicio: common.startTime, horario_fin: common.endTime, imagenes_url: common.image ? [common.image] : [], servicios: common.services } : kind === "eventos" ? { name: common.name, category: common.category, location: common.location, description: common.description, image: common.image, phone: common.phone, periodicity: common.hours, source: common.source, startDate: common.startDate || undefined, endDate: common.endDate || undefined } : { name: common.name, category: common.category, location: common.location, address: common.location, description: common.description, image: common.image, phone: common.phone, hours: common.hours, services: common.services };
    try {
      if (editing?.id) catalogRepository.update(kind, editing.id, source);
      else catalogRepository.create(kind, source);
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
    {editing && <div className="module-dialog-backdrop"><section className="module-dialog" role="dialog" aria-modal="true"><button className="module-dialog__close" type="button" aria-label={tx("Cerrar")} onClick={() => setEditing(null)}>×</button><h2>{tx(editing.id ? "Editar registro" : "Nuevo registro")}</h2><CatalogForm initial={editing.form} onCancel={() => setEditing(null)} onSave={save} /></section></div>}
  </section>;
}

import { useState } from "react";
import type { FormEvent } from "react";
import AdministrativeListingPage from "../components/listing/AdministrativeListingPage";
import { getTouristPlaceImage } from "../data/touristImages";
import { touristPlaceRepository } from "../repositories/touristPlaceRepository";
import type { TouristPlaceInput } from "../repositories/touristPlaceRepository";
import type { TouristPlace } from "../types/listing";
import { authRepository } from "../repositories/authRepository";
import { useLanguage } from "../i18n/useLanguage";

const emptyForm: TouristPlaceInput = {
  name: "", category: "", address: "", hours: "", image: "", shortDescription: "", description: "",
  highlights: [], services: [], estado: "ACTIVO", latitud: undefined, longitud: undefined, telefono: "", precio_entrada: undefined,
};
const toForm = (place: TouristPlace): TouristPlaceInput => ({
  name: place.nombre_lugar ?? place.name, category: place.category, address: place.ubicacion ?? place.address,
  hours: place.hours, image: place.imagenes_url?.[0] ?? place.image, shortDescription: place.shortDescription,
  description: place.descripcion ?? place.description, highlights: place.highlights ?? [], services: place.services ?? [],
  estado: place.estado ?? "ACTIVO", latitud: place.latitud, longitud: place.longitud, telefono: place.telefono ?? "",
  precio_entrada: place.precio_entrada, registrado_por: place.registrado_por,
});

function TouristPlaceForm({ value, onCancel, onSave }: { value: TouristPlaceInput; onCancel: () => void; onSave: (input: TouristPlaceInput) => void }) {
  const { tx } = useLanguage();
  const [form, setForm] = useState(value);
  const [error, setError] = useState("");
  const set = (key: keyof TouristPlaceInput, raw: string) => setForm((current) => ({
    ...current,
    [key]: key === "latitud" || key === "longitud" || key === "precio_entrada" ? (raw === "" ? undefined : Number(raw)) : raw,
  }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasLatitude = form.latitud != null;
    const hasLongitude = form.longitud != null;
    if (hasLatitude !== hasLongitude || (hasLatitude && (!Number.isFinite(form.latitud) || Math.abs(form.latitud!) > 90 || !Number.isFinite(form.longitud) || Math.abs(form.longitud!) > 180))) {
      setError(tx("Ingresa latitud y longitud válidas, o deja ambos campos vacíos."));
      return;
    }
    if (form.precio_entrada != null && (!Number.isFinite(form.precio_entrada) || form.precio_entrada < 0)) {
      setError(tx("El precio de entrada debe ser un número igual o mayor que cero."));
      return;
    }
    setError("");
    onSave({ ...form, name: form.name.trim(), category: form.category.trim(), address: form.address.trim(), shortDescription: form.shortDescription.trim(), description: form.description.trim(), highlights: form.highlights.map((item) => item.trim()).filter(Boolean), services: form.services.map((item) => item.trim()).filter(Boolean) });
  };
  return <form className="module-form" onSubmit={submit}>
    <label>{tx("Nombre del lugar")}<input required maxLength={100} value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
    <label>{tx("Categoría")}<input required maxLength={80} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder={tx("Ej.: Museos")} /></label>
    <label className="module-form__wide">{tx("Ubicación / dirección")}<input required maxLength={200} value={form.address} onChange={(e) => set("address", e.target.value)} /></label>
    <label>{tx("Horario") }<input maxLength={120} value={form.hours} onChange={(e) => set("hours", e.target.value)} /></label>
    <label>{tx("Teléfono")}<input maxLength={40} value={form.telefono ?? ""} onChange={(e) => set("telefono", e.target.value)} /></label>
    <label>{tx("Latitud")}<input type="number" step="any" min="-90" max="90" value={form.latitud ?? ""} onChange={(e) => set("latitud", e.target.value)} /></label>
    <label>{tx("Longitud")}<input type="number" step="any" min="-180" max="180" value={form.longitud ?? ""} onChange={(e) => set("longitud", e.target.value)} /></label>
    <label>{tx("Precio de entrada (Bs)")}<input type="number" step="0.01" min="0" value={form.precio_entrada ?? ""} onChange={(e) => set("precio_entrada", e.target.value)} /></label>
    <label>{tx("Estado")}<select value={form.estado ?? "ACTIVO"} onChange={(e) => set("estado", e.target.value)}><option value="ACTIVO">{tx("ACTIVO")}</option><option value="INACTIVO">{tx("INACTIVO")}</option></select></label>
    <label className="module-form__wide">{tx("Imagen (ruta o URL)")}<input maxLength={500} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/images/tourist-places/imagen.jpg" /></label>
    <label className="module-form__wide">{tx("Descripción breve")}<textarea required maxLength={250} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></label>
    <label className="module-form__wide">{tx("Descripción")}<textarea required maxLength={2000} value={form.description} onChange={(e) => set("description", e.target.value)} /></label>
    <label className="module-form__wide">{tx("Atractivos destacados (separados por coma)")}<input value={form.highlights.join(", ")} onChange={(e) => setForm((current) => ({ ...current, highlights: e.target.value.split(",") }))} /></label>
    <label className="module-form__wide">{tx("Servicios (separados por coma)")}<input value={form.services.join(", ")} onChange={(e) => setForm((current) => ({ ...current, services: e.target.value.split(",") }))} /></label>
    {error && <p className="module-form__error" role="alert">{error}</p>}
    <div className="module-form__actions"><button type="button" className="module-button module-button--secondary" onClick={onCancel}>{tx("Cancelar")}</button><button className="admin-button" type="submit">{tx("Guardar lugar turístico")}</button></div>
  </form>;
}

export default function TouristPlacesPage({ adminMode = false }: { adminMode?: boolean }) {
  const { tx } = useLanguage();
  const [items, setItems] = useState(() => touristPlaceRepository.list());
  const [editing, setEditing] = useState<TouristPlace | "new" | null>(null);
  const [formError, setFormError] = useState("");
  const canManage = adminMode && authRepository.canManage();
  const places = items.filter((place) => adminMode || place.estado !== "INACTIVO").map((place) => ({
    id: place.id, name: place.nombre_lugar ?? place.name, category: place.category,
    status: place.estado === "INACTIVO" ? "INACTIVO" as const : "ACTIVO" as const,
    location: place.ubicacion ?? place.address, latitude: place.latitud, longitude: place.longitud,
    description: place.descripcion ?? place.shortDescription,
    image: getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image),
    rating: place.calificacion,
    price: place.precio_entrada == null ? undefined : place.precio_entrada === 0 ? "Gratuito" : `Bs ${place.precio_entrada}`,
  }));
  const refresh = () => setItems(touristPlaceRepository.list());
  const save = (input: TouristPlaceInput) => {
    try {
      if (editing === "new") touristPlaceRepository.create({ ...input, registrado_por: authRepository.getCurrentUser()?.email ?? "" });
      else if (editing) touristPlaceRepository.update(editing.id, input);
      setEditing(null);
      setFormError("");
      refresh();
    } catch {
      setFormError(tx("No tienes permisos para gestionar lugares turísticos. Inicia sesión con una cuenta ADMIN."));
    }
  };
  const remove = (id: string, name: string) => {
    if (!canManage || !window.confirm(tx(`¿Eliminar el lugar turístico «${name}»?`))) return;
    try { touristPlaceRepository.remove(id); refresh(); }
    catch { setFormError(tx("No tienes permisos para gestionar lugares turísticos.")); }
  };
  return <>
    {formError && <p className="module-form__error" role="alert">{formError}</p>}
    <AdministrativeListingPage title="Lugares Turísticos" description={adminMode ? "Gestiona y consulta todos los lugares turísticos registrados en el sistema." : "Explora los lugares turísticos de Sucre."} actionLabel="Nuevo Lugar Turístico" items={places} detailPath={adminMode ? "/admin/lugares-turisticos" : "/lugares-turisticos"} kind="places" canManage={canManage} onCreate={() => { setFormError(""); setEditing("new"); }} onEdit={(id) => { const place = items.find((item) => item.id === id); if (place && canManage) { setFormError(""); setEditing(place); } }} onDelete={remove} />
    {editing && <div className="module-dialog-backdrop" role="presentation"><section className="module-dialog" role="dialog" aria-modal="true" aria-labelledby="tourist-place-form-title"><button className="module-dialog__close" type="button" aria-label={tx("Cerrar")} onClick={() => setEditing(null)}>×</button><h2 id="tourist-place-form-title">{editing === "new" ? tx("Nuevo Lugar Turístico") : tx("Editar Lugar Turístico")}</h2><TouristPlaceForm key={editing === "new" ? "new" : editing.id} value={editing === "new" ? emptyForm : toForm(editing)} onCancel={() => setEditing(null)} onSave={save} /></section></div>}
  </>;
}

import { useMemo, useState } from "react";
import { userRepository } from "../repositories/userRepository";
import type { ManagedUser, ManagedUserInput } from "../types/userManagement";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";

const pageSize = 7;

function UserForm({ value, onCancel, onSave }: { value: ManagedUserInput; onCancel: () => void; onSave: (value: ManagedUserInput) => void }) {
  const { tx } = useLanguage();
  const [form, setForm] = useState(value);
  const set = (key: keyof ManagedUserInput, value: string) => setForm((current) => ({ ...current, [key]: key === "edad" ? Number(value) : value }));
  return <form className="module-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
    {([["nombres", "Nombres"], ["apellido_paterno", "Apellido paterno"], ["apellido_materno", "Apellido materno"], ["edad", "Edad"], ["email", "Correo electrónico"], ["numero_identidad", "Número de identidad"], ["nacionalidad", "Nacionalidad"], ["idioma", "Idioma"]] as const).map(([key, label]) => <label key={key}>{tx(label)}<input required type={key === "edad" ? "number" : key === "email" ? "email" : "text"} min={key === "edad" ? "0" : undefined} value={form[key]} onChange={(event) => set(key, event.target.value)} /></label>)}
    <div className="module-form__actions"><button type="button" className="module-button module-button--secondary" onClick={onCancel}>{tx("Cancelar")}</button><button className="admin-button">{tx("Guardar usuario")}</button></div>
  </form>;
}

export default function UsersPage() {
  const { language, tx } = useLanguage();
  const [items, setItems] = useState<ManagedUser[]>(() => userRepository.list());
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("TODOS");
  const [status, setStatus] = useState("TODOS");
  const [nationality, setNationality] = useState("TODOS");
  const [selectedLanguage, setSelectedLanguage] = useState("TODOS");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [detail, setDetail] = useState<ManagedUser | null>(null);
  const [actionError, setActionError] = useState("");
  const options = useMemo(() => ({ nationalities: [...new Set(items.map((item) => item.nacionalidad))], languages: [...new Set(items.map((item) => item.idioma))] }), [items]);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const today = new Date().toDateString();
  const visible = items.filter((item) => `${item.nombres} ${item.apellido_paterno} ${item.email} ${item.numero_identidad}`.toLowerCase().includes(query.toLowerCase()) && (role === "TODOS" || item.rol === role) && (status === "TODOS" || item.estado === status) && (nationality === "TODOS" || item.nacionalidad === nationality) && (selectedLanguage === "TODOS" || item.idioma === selectedLanguage));
  const pages = Math.max(1, Math.ceil(visible.length / pageSize));
  const records = visible.slice((page - 1) * pageSize, page * pageSize);
  const refresh = () => { setItems(userRepository.list()); setPage(1); };
  const save = (form: ManagedUserInput) => { try { if (editing) userRepository.update(editing.PK_id, form); setEditing(null); setActionError(""); refresh(); } catch (error) { setActionError(error instanceof Error ? tx(error.message) : tx("No se pudieron guardar los cambios.")); } };
  const stats = [
    ["Total de Usuarios", items.length], ["Usuarios Activos", items.filter((item) => item.estado === "ACTIVO").length], ["Usuarios Inactivos", items.filter((item) => item.estado === "INACTIVO").length], ["Administradores", items.filter((item) => item.rol === "ADMIN").length],
    ["Registrados este mes", items.filter((item) => { const date = new Date(item.fecha_registro); return date.getMonth() === currentMonth && date.getFullYear() === currentYear; }).length],
    ["Registrados hoy", items.filter((item) => new Date(item.fecha_registro).toDateString() === today).length],
  ] as const;
  const translatedValue = (id: string, field: "nationality" | "language", value: string) => translateRecordText("user", id, field, value, language);
  return <section className="module-page">
    <div className="module-heading"><div><p className="eyebrow">{tx("Gestión")}</p><h1>{tx("Usuarios")}</h1><p>{tx("Administra y gestiona los usuarios del sistema turístico.")}</p></div></div>
    {actionError && <p className="login-form__error" role="alert">{actionError}</p>}
    <div className="module-stats module-stats--six">{stats.map(([label, value]) => <article key={label}><span>{tx(label)}</span><strong>{value}</strong></article>)}</div>
    <div className="module-panel">
      <div className="module-filters module-filters--users">
        <input placeholder={tx("Buscar por nombre, correo o identidad")} value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
        <select value={role} onChange={(event) => setRole(event.target.value)}><option value="TODOS">{tx("Todos los roles")}</option><option value="ADMIN">{tx("ADMIN")}</option><option value="USUARIO">{tx("USUARIO")}</option></select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="TODOS">{tx("Todos los estados")}</option><option value="ACTIVO">{tx("ACTIVO")}</option><option value="INACTIVO">{tx("INACTIVO")}</option></select>
        <select value={nationality} onChange={(event) => setNationality(event.target.value)}><option value="TODOS">{tx("Nacionalidad")}</option>{options.nationalities.map((value) => <option key={value} value={value}>{translatedValue("", "nationality", value)}</option>)}</select>
        <select value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)}><option value="TODOS">{tx("Idioma")}</option>{options.languages.map((value) => <option key={value} value={value}>{translatedValue("", "language", value)}</option>)}</select>
      </div>
      <div className="module-table-wrap"><table className="module-table"><thead><tr>{["Usuario", "Correo electrónico", "Número de identidad", "Nacionalidad", "Idioma", "Rol", "Estado", "Fecha de registro", "Acciones"].map((label) => <th key={label}>{tx(label)}</th>)}</tr></thead><tbody>{records.map((item) => <tr key={item.PK_id}>
        <td><span className="user-cell"><b>{`${item.nombres[0] ?? ""}${item.apellido_paterno[0] ?? ""}`}</b><span>{item.nombres} {item.apellido_paterno} {item.apellido_materno}</span></span></td><td>{item.email}</td><td>{tx(item.numero_identidad)}</td>
        <td>{translatedValue(item.PK_id, "nationality", item.nacionalidad)}</td><td>{translatedValue(item.PK_id, "language", item.idioma)}</td><td>{tx(item.rol)}</td><td><span className={`module-status module-status--${item.estado.toLowerCase()}`}>{tx(item.estado)}</span></td>
        <td>{item.fecha_registro ? new Date(item.fecha_registro).toLocaleDateString(language === "en" ? "en-US" : "es-BO") : tx("Sin fecha")}</td><td className="module-actions"><button onClick={() => setDetail(item)}>{tx("Ver")}</button>{item.rol === "USUARIO" && <><button onClick={() => setEditing(item)}>{tx("Editar")}</button><button onClick={() => { userRepository.toggleStatus(item.PK_id); refresh(); }}>{item.estado === "ACTIVO" ? tx("Desactivar") : tx("Activar")}</button><button className="danger" onClick={() => { if (window.confirm(tx("¿Eliminar este usuario?"))) { userRepository.remove(item.PK_id); refresh(); } }}>{tx("Eliminar")}</button></>}</td>
      </tr>)}</tbody></table>{!records.length && <p className="module-empty">{tx("No se encontraron usuarios.")}</p>}</div>
      <div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>{tx("Anterior")}</button><span>{page} {tx("de")} {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}>{tx("Siguiente")}</button></div>
    </div>
    {(editing || detail) && <div className="module-dialog-backdrop"><section className="module-dialog" role="dialog" aria-modal="true"><button className="module-dialog__close" aria-label={tx("Cerrar")} onClick={() => { setEditing(null); setDetail(null); }}>×</button>{detail ? <><h2>{detail.nombres} {detail.apellido_paterno}</h2><dl className="module-detail"><dt>{tx("Correo")}</dt><dd>{detail.email}</dd><dt>{tx("Identidad")}</dt><dd>{tx(detail.numero_identidad)}</dd><dt>{tx("Nacionalidad")}</dt><dd>{translatedValue(detail.PK_id, "nationality", detail.nacionalidad)}</dd><dt>{tx("Idioma")}</dt><dd>{translatedValue(detail.PK_id, "language", detail.idioma)}</dd><dt>{tx("Rol")}</dt><dd>{tx(detail.rol)}</dd><dt>{tx("Estado")}</dt><dd>{tx(detail.estado)}</dd></dl></> : <><h2>{tx("Editar usuario")}</h2><UserForm value={editing!} onCancel={() => setEditing(null)} onSave={save} /></>}</section></div>}
  </section>;
}

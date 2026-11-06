import { useState } from "react";
import { userRepository } from "../repositories/userRepository";
import type { ManagedUser } from "../types/userManagement";
import { useLanguage } from "../i18n/useLanguage";

export default function UsersPage() {
  const { language, tx } = useLanguage();
  const [items, setItems] = useState<ManagedUser[]>(() => userRepository.list());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [detail, setDetail] = useState<ManagedUser | null>(null);
  const [error, setError] = useState("");
  const refresh = () => setItems(userRepository.list());
  const visible = items.filter((item) => `${item.nombres} ${item.apellido_paterno} ${item.apellido_materno} ${item.email}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && (status === "TODOS" || item.estado === status));
  const toggle = (item: ManagedUser) => {
    try { const updated = userRepository.toggleStatus(item.PK_id); if (!updated) throw new Error("No se pudo cambiar el estado de esta cuenta."); setError(""); refresh(); if (detail?.PK_id === item.PK_id) setDetail(updated); }
    catch (cause) { setError(cause instanceof Error ? tx(cause.message) : tx("No se pudo cambiar el estado de la cuenta.")); }
  };
  const registered = (value: string) => value ? new Date(value).toLocaleDateString(language === "en" ? "en-US" : "es-BO") : tx("Sin fecha");
  return <section className="module-page">
    <div className="module-heading"><div><p className="eyebrow">{tx("Gestión")}</p><h1>{tx("Usuarios")}</h1><p>{tx("Consulta la información y controla el estado de las cuentas registradas.")}</p></div></div>
    {error && <p className="login-form__error" role="alert">{error}</p>}
    <div className="module-stats">{[["Total de cuentas", items.length], ["Activas", items.filter((item) => item.estado === "ACTIVO").length], ["Inactivas", items.filter((item) => item.estado === "INACTIVO").length], ["Administradores", items.filter((item) => item.rol === "ADMIN").length]].map(([label, count]) => <article key={label}><span>{tx(String(label))}</span><strong>{count}</strong></article>)}</div>
    <div className="module-panel">
      <div className="module-filters"><input placeholder={tx("Buscar por nombre o correo")} value={query} onChange={(event) => setQuery(event.target.value)} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="TODOS">{tx("Todos los estados")}</option><option value="ACTIVO">{tx("ACTIVO")}</option><option value="INACTIVO">{tx("INACTIVO")}</option></select></div>
      <div className="module-table-wrap"><table className="module-table"><thead><tr>{["Usuario", "Correo electrónico", "Rol", "Estado", "Fecha de registro", "Acciones"].map((label) => <th key={label}>{tx(label)}</th>)}</tr></thead><tbody>{visible.map((item) => <tr key={item.PK_id}>
        <td>{item.nombres} {item.apellido_paterno} {item.apellido_materno}</td><td>{item.email}</td><td>{tx(item.rol)}</td><td><span className={`module-status module-status--${item.estado.toLowerCase()}`}>{tx(item.estado)}</span></td><td>{registered(item.fecha_registro)}</td>
        <td className="module-actions"><button type="button" onClick={() => setDetail(item)}>{tx("Ver detalles")}</button>{item.rol !== "ADMIN" && <button type="button" onClick={() => toggle(item)}>{tx(item.estado === "ACTIVO" ? "Desactivar" : "Activar")}</button>}</td>
      </tr>)}</tbody></table>{!visible.length && <p className="module-empty">{tx("No se encontraron usuarios.")}</p>}</div>
    </div>
    {detail && <div className="module-dialog-backdrop"><section className="module-dialog" role="dialog" aria-modal="true" aria-labelledby="user-detail-title"><button className="module-dialog__close" type="button" aria-label={tx("Cerrar")} onClick={() => setDetail(null)}>×</button><h2 id="user-detail-title">{tx("Detalles de la cuenta")}</h2><dl className="module-detail"><dt>{tx("Nombre")}</dt><dd>{[detail.nombres, detail.apellido_paterno, detail.apellido_materno].filter(Boolean).join(" ") || tx("No registrado")}</dd><dt>{tx("Correo electrónico")}</dt><dd>{detail.email}</dd><dt>{tx("Fecha de registro")}</dt><dd>{registered(detail.fecha_registro)}</dd><dt>{tx("Rol")}</dt><dd>{tx(detail.rol)}</dd><dt>{tx("Estado de la cuenta")}</dt><dd>{tx(detail.estado === "ACTIVO" ? "Activa" : "Inactiva")}</dd></dl>{detail.rol !== "ADMIN" && <button className="admin-button" type="button" onClick={() => toggle(detail)}>{tx(detail.estado === "ACTIVO" ? "Desactivar" : "Activar")}</button>}</section></div>}
  </section>;
}

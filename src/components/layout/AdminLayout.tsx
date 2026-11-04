import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";
import { useLanguage } from "../../i18n/useLanguage";

const links = [
  ["/administrador", "Dashboard"], ["/admin/lugares-turisticos", "Lugares turísticos"],
  ["/admin/hospedajes", "Hospedajes"], ["/admin/restaurantes", "Restaurantes"],
  ["/admin/entretenimiento", "Entretenimiento"], ["/admin/eventos", "Eventos y festividades"],
  ["/admin/usuarios", "Usuarios"], ["/admin/estadisticas", "Estadísticas"],
] as const;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const user = authRepository.getCurrentUser();
  return <div className="role-shell role-shell--admin">
    <aside className="role-sidebar"><LinkBrand /><p className="role-sidebar__eyebrow">{tx("Administración")}</p><nav>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/administrador"}>{tx(label)}</NavLink>)}</nav><div className="role-sidebar__account"><strong>{user?.nombres} {user?.apellido_paterno}</strong><span>{tx("ADMIN")}</span><button onClick={() => { authRepository.logout(); navigate("/", { replace: true }); }}>{tx("Cerrar sesión")}</button></div></aside>
    <main className="role-main"><header className="role-header"><span>{tx("Panel administrativo")}</span><span>{user?.email}</span></header><div className="role-content"><Outlet /></div></main>
  </div>;
}

function LinkBrand() { return <div className="role-brand"><span>TS</span><strong>TURISMO SUCRE</strong></div>; }

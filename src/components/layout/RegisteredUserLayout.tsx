import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";
import { useLanguage } from "../../i18n/useLanguage";

const publicLinks = [["/", "Inicio"], ["/lugares-turisticos", "Lugares turísticos"], ["/hospedajes", "Hospedajes"], ["/restaurantes", "Restaurantes"], ["/entretenimiento", "Entretenimiento"], ["/eventos", "Eventos"]] as const;

export default function RegisteredUserLayout() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const user = authRepository.getCurrentUser();
  return <div className="role-shell role-shell--user">
    <aside className="role-sidebar"><div className="role-brand"><span>TS</span><strong>TURISMO SUCRE</strong></div><p className="role-sidebar__eyebrow">{tx("Explorar")}</p><nav>{publicLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{tx(label)}</NavLink>)}</nav><p className="role-sidebar__eyebrow">{tx("Mi espacio")}</p><nav><NavLink to="/mi-cuenta" end>{tx("Resumen personal")}</NavLink><NavLink to="/mi-cuenta/favoritos">{tx("Mis favoritos")}</NavLink><NavLink to="/mi-cuenta/notificaciones">{tx("Eventos y notificaciones")}</NavLink></nav><div className="role-sidebar__account"><strong>{user?.nombres} {user?.apellido_paterno}</strong><span>{tx("USUARIO")}</span><button onClick={() => { authRepository.logout(); navigate("/", { replace: true }); }}>{tx("Cerrar sesión")}</button></div></aside>
    <main className="role-main"><header className="role-header"><span>{tx("Tu espacio en TurismoSucre")}</span><span>{user?.email}</span></header><div className="role-content"><Outlet /></div></main>
  </div>;
}

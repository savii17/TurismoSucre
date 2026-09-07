import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useLanguage } from "../../i18n/useLanguage";
import { authRepository } from "../../repositories/authRepository";
import TourismHero from "../dashboard/TourismHero";

type IconName = "grid" | "pin" | "bed" | "food" | "calendar" | "alert" | "users" | "tag" | "sparkles" | "report" | "settings" | "menu" | "search" | "bell" | "globe";
type NavigationRoute = { to: string; label: string; icon: IconName };
function Icon({ name }: { name: IconName }) {
  const icons: Record<IconName, ReactNode> = {
    grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />, pin: <path d="M12 21s6-5.17 6-11A6 6 0 0 0 6 10c0 5.83 6 11 6 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />,
    bed: <path d="M3 14h18v5H3zm2 5v2m14-2v2M5 14V8h6a3 3 0 0 1 3 3v3m1-5h2a2 2 0 0 1 2 2v3" />, food: <path d="M7 3v7m-3-7v4a3 3 0 0 0 6 0V3m-3 7v11m10-18v18m0-18a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3" />,
    calendar: <path d="M4 5h16v15H4zM8 3v4m8-4v4M4 10h16" />, alert: <path d="M12 3 2.8 20h18.4L12 3Zm0 6v4m0 3h.01" />, users: <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m6-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm11 9v-1a4 4 0 0 0-3-3.87m-1-12.1a4 4 0 0 1 0 7.75" />,
    tag: <path d="m20 12-8 8-9-9V4h7zM7.5 7.5h.01" />, sparkles: <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5zm7 12 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />, report: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 17l2-2 2 1 3-4" />, settings: <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.1h-3v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.06 15 1.7 1.7 0 0 0 5.5 14H5v-3h.5a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.73 4.8v-.1h3v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 21 11h.1v3H21A1.7 1.7 0 0 0 19.4 15Z" />, menu: <path d="M4 7h16M4 12h16M4 17h16" />, search: <path d="m20 20-4.2-4.2M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />, bell: <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />, globe: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z" />,
  };
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;
}

function SidebarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 850);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const user = authRepository.getCurrentUser();
  const managementRoutes: NavigationRoute[] = [{ to: "/", label: t("dashboard"), icon: "grid" }, { to: "/lugares-turisticos", label: t("touristPlaces"), icon: "pin" }, { to: "/hospedajes", label: t("accommodations"), icon: "bed" }, { to: "/restaurantes", label: t("restaurants"), icon: "food" }, { to: "/eventos", label: t("events"), icon: "calendar" }, { to: "/emergencias", label: t("emergencies"), icon: "alert" }, { to: "/usuario", label: t("users"), icon: "users" }];
  const configurationRoutes: NavigationRoute[] = [{ to: "/categorias", label: t("categories"), icon: "tag" }, { to: "/servicios", label: t("services"), icon: "sparkles" }, { to: "/reportes", label: t("reports"), icon: "report" }, { to: "/configuracion", label: t("settings"), icon: "settings" }];
  const notifications = language === "es" ? ["No hay una fuente de notificaciones conectada."] : ["No notification source is connected."];
  const initials = useMemo(() => user ? `${user.nombres?.charAt(0) ?? ""}${user.apellido_paterno?.charAt(0) ?? ""}`.toUpperCase() : "TS", [user]);
  const pageTitle = managementRoutes.concat(configurationRoutes).find((route) => route.to === location.pathname)?.label ?? t("systemTitle");

  const closeSidebar = () => setIsSidebarOpen(false);
  const closeMobileSidebar = () => {
    if (window.matchMedia("(max-width: 850px)").matches) {
      closeSidebar();
    }
  };

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 850px)");
    const updateSidebarForViewport = () => setIsSidebarOpen(!mobileQuery.matches);

    mobileQuery.addEventListener("change", updateSidebarForViewport);
    return () => mobileQuery.removeEventListener("change", updateSidebarForViewport);
  }, []);

  return <div className={`app-shell ${isSidebarOpen ? "" : "app-shell--sidebar-collapsed"}`}>
    <button className="sidebar-backdrop" type="button" aria-label="Cerrar menú" onClick={closeSidebar} tabIndex={isSidebarOpen ? 0 : -1} />
    <aside className="sidebar" aria-label={t("navigation")}><div className="sidebar__brand"><span>TS</span><div><strong>TURISMO</strong><small>SUCRE</small></div></div><button className="sidebar__close" type="button" aria-label="Cerrar menú" onClick={closeSidebar}>×</button><nav className="sidebar__nav"><section className="sidebar__section"><h2 className="sidebar__heading">{t("management")}</h2>{managementRoutes.map((route) => <NavLink key={route.to} to={route.to} end={route.to === "/"} className="sidebar__link" onClick={closeMobileSidebar}><Icon name={route.icon} /><span>{route.label}</span></NavLink>)}</section><section className="sidebar__section"><h2 className="sidebar__heading">{t("configuration")}</h2>{configurationRoutes.map((route) => <NavLink key={route.to} to={route.to} className="sidebar__link" onClick={closeMobileSidebar}><Icon name={route.icon} /><span>{route.label}</span></NavLink>)}</section></nav><div className="sidebar__footer"><span className="sidebar__status" /> Sistema operativo</div></aside>
    <div className="app-shell__main"><header className="topbar"><div className="topbar__left"><button type="button" className="hamburger-button" aria-label={isSidebarOpen ? t("hideSidebar") : t("showSidebar")} aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen((current) => !current)}><Icon name="menu" /></button><div><p className="breadcrumb">{t("dashboard")} <span>/</span> {pageTitle}</p><h1 className="topbar__title">{pageTitle}</h1></div></div><div className="topbar__actions"><label className="topbar-search"><Icon name="search" /><span className="sr-only">Buscar</span><input type="search" placeholder="Buscar en Turismo Sucre" /></label><div className="notifications"><button type="button" className="icon-button" aria-label={t("viewNotifications")} aria-expanded={isNotificationsOpen} onClick={() => setIsNotificationsOpen((current) => !current)}><Icon name="bell" /><span className="notification-badge">{notifications.length}</span></button>{isNotificationsOpen && <div className="notifications__panel" role="status"><h2>{t("notifications")}</h2><ul>{notifications.map((notification) => <li key={notification}>{notification}</li>)}</ul></div>}</div><label className="language-selector"><Icon name="globe" /><span className="sr-only">{t("language")}</span><select value={language} onChange={(event) => setLanguage(event.target.value as "es" | "en")} aria-label={t("language")}><option value="es">ES</option><option value="en">EN</option></select></label><div className="profile-card" aria-label={t("accountProfile")}><div className="profile-card__avatar">{initials}</div><div><strong>{user ? `${user.nombres} ${user.apellido_paterno}` : t("guest")}</strong><span>{user?.rol ?? t("noSession")}</span></div></div></div></header><TourismHero /><main className="app-shell__content"><Outlet /></main></div>
  </div>;
}
export default SidebarLayout;

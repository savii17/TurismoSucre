import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import { authRepository } from "../repositories/authRepository";
import PublicExperienceLayout from "../components/layout/PublicExperienceLayout";
import AdminLayout from "../components/layout/AdminLayout";
import AudienceHomePage from "../pages/AudienceHomePage";
import PlaceholderPage from "../pages/PlaceholderPage";
import TouristPlacesPage from "../pages/TouristPlacesPage";
import TouristPlaceDetailPage from "../pages/TouristPlaceDetailPage";
import AccommodationsPage from "../pages/AccommodationsPage";
import AccommodationDetailPage from "../pages/AccommodationDetailPage";
import RestaurantsPage from "../pages/RestaurantsPage";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";
import EntertainmentPage from "../pages/EntertainmentPage";
import EntertainmentDetailPage from "../pages/EntertainmentDetailPage";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import EmergenciesPage from "../pages/EmergenciesPage";
import UsersPage from "../pages/UsersPage";
import AdminHomePage from "../pages/AdminHomePage";
import AdminCatalogPage from "../pages/admin/AdminCatalogPage";
import AdminStatsPage from "../pages/admin/AdminStatsPage";
import FavoritesPage from "../pages/user/FavoritesPage";
import NotificationsPage from "../pages/user/NotificationsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

function RequireRole({ role }: { role: "ADMIN" | "USUARIO" }) {
  const user = authRepository.getCurrentUser();
  const location = useLocation();
  if (!user || user.estado !== "ACTIVO" || !authRepository.isRole(role)) return <Navigate to={role === "ADMIN" ? "/" : "/login"} state={{ from: location.pathname }} replace />;
  if (user.rol !== role) return <Navigate to={user.rol === "ADMIN" ? "/administrador" : "/mi-cuenta"} replace />;
  return <Outlet />;
}

function AppRoutes() {
  const { t } = useLanguage();
  return <BrowserRouter><Routes>
    <Route element={<PublicExperienceLayout />}>
      <Route path="/" element={<AudienceHomePage />} />
      <Route path="/lugares-turisticos" element={<TouristPlacesPage />} />
      <Route path="/lugares-turisticos/:placeId" element={<TouristPlaceDetailPage />} />
      <Route path="/hospedajes" element={<AccommodationsPage />} />
      <Route path="/hospedajes/:accommodationId" element={<AccommodationDetailPage />} />
      <Route path="/restaurantes" element={<RestaurantsPage />} />
      <Route path="/restaurantes/:restaurantId" element={<RestaurantDetailPage />} />
      <Route path="/entretenimiento" element={<EntertainmentPage />} />
      <Route path="/entretenimiento/:entertainmentId" element={<EntertainmentDetailPage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/eventos/:eventId" element={<EventDetailPage />} />
      <Route path="/emergencias" element={<EmergenciesPage />} />
    </Route>

    <Route element={<RequireRole role="USUARIO" />}>
      <Route path="/mi-cuenta" element={<Navigate to="/" replace />} />
      <Route element={<PublicExperienceLayout />}>
        <Route path="/mi-cuenta/favoritos" element={<FavoritesPage />} />
        <Route path="/mi-cuenta/notificaciones" element={<NotificationsPage />} />
      </Route>
    </Route>

    <Route element={<RequireRole role="ADMIN" />}>
      <Route element={<AdminLayout />}>
        <Route path="/administrador" element={<AdminHomePage />} />
        <Route path="/admin/lugares-turisticos" element={<TouristPlacesPage adminMode />} />
        <Route path="/admin/lugares-turisticos/:placeId" element={<TouristPlaceDetailPage />} />
        <Route path="/admin/hospedajes" element={<AdminCatalogPage kind="hospedajes" title="Hospedajes" description="Administra los hospedajes publicados en TurismoSucre." actionLabel="Nuevo hospedaje" />} />
        <Route path="/admin/hospedajes/:accommodationId" element={<AccommodationDetailPage />} />
        <Route path="/admin/restaurantes" element={<AdminCatalogPage kind="restaurantes" title="Restaurantes" description="Administra restaurantes publicados en TurismoSucre." actionLabel="Nuevo restaurante" />} />
        <Route path="/admin/restaurantes/:restaurantId" element={<RestaurantDetailPage />} />
        <Route path="/admin/entretenimiento" element={<AdminCatalogPage kind="entretenimiento" title="Entretenimiento" description="Administra espacios de entretenimiento publicados." actionLabel="Nuevo espacio" />} />
        <Route path="/admin/entretenimiento/:entertainmentId" element={<EntertainmentDetailPage />} />
        <Route path="/admin/eventos" element={<AdminCatalogPage kind="eventos" title="Eventos y festividades" description="Administra eventos y festividades publicados." actionLabel="Nuevo evento" />} />
        <Route path="/admin/eventos/:eventId" element={<EventDetailPage />} />
        <Route path="/admin/usuarios" element={<UsersPage />} />
        <Route path="/admin/estadisticas" element={<AdminStatsPage />} />
        <Route path="/usuario" element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="/usuarios" element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="/categorias" element={<PlaceholderPage title={t("categories")} description={t("categoriesDescription")} />} />
        <Route path="/servicios" element={<PlaceholderPage title={t("services")} description={t("servicesDescription")} />} />
        <Route path="/reportes" element={<Navigate to="/admin/estadisticas" replace />} />
        <Route path="/configuracion" element={<PlaceholderPage title={t("settings")} description={t("settingsDescription")} />} />
      </Route>
    </Route>

    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
    <Route path="/registro" element={<RegisterPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}

export default AppRoutes;

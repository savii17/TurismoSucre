import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import SidebarLayout from "../components/layout/SidebarLayout";
import HomePage from "../pages/HomePage";
import PlaceholderPage from "../pages/PlaceholderPage";
import TouristPlaceDetailPage from "../pages/TouristPlaceDetailPage";
import AccommodationDetailPage from "../pages/AccommodationDetailPage";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";
import TouristPlacesPage from "../pages/TouristPlacesPage";
import LoginPage from "../pages/auth/LoginPage";
import AccommodationsPage from "../pages/AccommodationsPage";
import RestaurantsPage from "../pages/RestaurantsPage";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import EmergenciesPage from "../pages/EmergenciesPage";
import UsersPage from "../pages/UsersPage";
import EntertainmentPage from "../pages/EntertainmentPage";
import EntertainmentDetailPage from "../pages/EntertainmentDetailPage";
import { useLanguage } from "../i18n/useLanguage";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminHomePage from "../pages/AdminHomePage";

function RequireRole({ role }: { role: "ADMIN" | "USUARIO" }) {
  const user = authRepository.getCurrentUser();
  const location = useLocation();
  if (!user || user.estado !== "ACTIVO") return <Navigate to={role === "ADMIN" ? "/admin/login" : "/login"} state={{ from: location.pathname }} replace />;
  if (user.rol !== role) return <Navigate to={user.rol === "ADMIN" ? "/administrador" : "/"} replace />;
  return <Outlet />;
}


function AppRoutes() {
  const { t } = useLanguage();
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<SidebarLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/lugares-turisticos"
            element={<TouristPlacesPage />}
          />
          <Route path="/lugares-turisticos/:placeId" element={<TouristPlaceDetailPage />} />
          <Route
            path="/hospedajes"
            element={<AccommodationsPage />}
          />
          <Route path="/hospedajes/:accommodationId" element={<AccommodationDetailPage />} />
          <Route
            path="/restaurantes"
            element={<RestaurantsPage />}
          />
          <Route path="/restaurantes/:restaurantId" element={<RestaurantDetailPage />} />
          <Route path="/entretenimiento" element={<EntertainmentPage />} />
          <Route path="/entretenimiento/:entertainmentId" element={<EntertainmentDetailPage />} />
          <Route
            path="/eventos"
            element={<EventsPage />}
          />
          <Route path="/eventos/:eventId" element={<EventDetailPage />} />
          <Route
            path="/emergencias"
            element={<EmergenciesPage />}
          />
          <Route element={<RequireRole role="ADMIN" />}>
            <Route path="/usuario" element={<UsersPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/categorias" element={<PlaceholderPage title={t("categories")} description={t("categoriesDescription")} />} />
            <Route path="/servicios" element={<PlaceholderPage title={t("services")} description={t("servicesDescription")} />} />
            <Route path="/reportes" element={<PlaceholderPage title={t("reports")} description={t("reportsDescription")} />} />
            <Route path="/configuracion" element={<PlaceholderPage title={t("settings")} description={t("settingsDescription")} />} />
            <Route path="/administrador" element={<AdminHomePage />} />
          </Route>
        </Route>
      
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import SidebarLayout from "../components/layout/SidebarLayout";
import HomePage from "../pages/HomePage";
import PlaceholderPage from "../pages/PlaceholderPage";
import TouristPlaceDetailPage from "../pages/TouristPlaceDetailPage";
import TouristPlacesPage from "../pages/TouristPlacesPage";
import LoginPage from "../pages/auth/LoginPage";
import AccommodationsPage from "../pages/AccommodationsPage";
import RestaurantsPage from "../pages/RestaurantsPage";
import EventsPage from "../pages/EventsPage";
import { useLanguage } from "../i18n/useLanguage";


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
          <Route
            path="/restaurantes"
            element={<RestaurantsPage />}
          />
          <Route
            path="/eventos"
            element={<EventsPage />}
          />
          <Route
            path="/emergencias"
            element={<PlaceholderPage title={t("emergencies")} description={t("emergenciesDescription")} />}
          />
          <Route
            path="/usuario"
            element={<PlaceholderPage title={t("user")} description={t("userDescription")} />}
          />
          <Route
            path="/categorias"
            element={<PlaceholderPage title={t("categories")} description={t("categoriesDescription")} />}
          />
          <Route
            path="/servicios"
            element={<PlaceholderPage title={t("services")} description={t("servicesDescription")} />}
          />
          <Route
            path="/reportes"
            element={<PlaceholderPage title={t("reports")} description={t("reportsDescription")} />}
          />
          <Route
            path="/configuracion"
            element={<PlaceholderPage title={t("settings")} description={t("settingsDescription")} />}
          />
          <Route
            path="/administrador"
            element={<PlaceholderPage title={t("administrator")} description={t("administratorDescription")} />}
          />
        </Route>
      
        
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;

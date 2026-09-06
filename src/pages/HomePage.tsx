import { Link } from "react-router-dom";

import StatisticsCards from "../components/dashboard/StatisticsCards";
import DashboardRightSidebar from "../components/dashboard/DashboardRightSidebar";
import TouristPlaceCard from "../components/tourist/TouristPlaceCard";
import { touristPlaces } from "../data/touristPlaces";
import { useLanguage } from "../i18n/useLanguage";

const quickActions = [
  { to: "/lugares-turisticos", icon: "⌖", label: "Nuevo Lugar Turístico" },
  { to: "/hospedajes", icon: "▣", label: "Nuevo Hospedaje" },
  { to: "/restaurantes", icon: "⌁", label: "Nuevo Restaurante" },
  { to: "/emergencias", icon: "+", label: "Nueva Emergencia" },
  { to: "/usuario", icon: "♙", label: "Nuevo Usuario" },
  { to: "/reportes", icon: "↗", label: "Generar Reporte" },
];

function HomePage() {
  const { t } = useLanguage();

  return (
    <section className="home-page" aria-labelledby="home-title">
      <StatisticsCards />

      <div className="dashboard-layout">
        <section className="dashboard-primary">
          <div className="section-heading">
            <div><p className="eyebrow">{t("featuredKicker")}</p><h1 id="home-title">{t("featuredPlaces")}</h1><p>{t("featuredDescription")}</p></div>
            <Link className="see-all-link" to="/lugares-turisticos">{t("allPlaces")} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="tourist-places-grid tourist-places-grid--featured">
            {touristPlaces.slice(0, 3).map((place) => <TouristPlaceCard key={place.id} place={place} />)}
          </div>
        </section>

        <DashboardRightSidebar />
      </div>

      <section className="quick-actions" aria-labelledby="quick-actions-title">
        <div className="section-heading"><div><p className="eyebrow">Gestión ágil</p><h2 id="quick-actions-title">Acciones Rápidas</h2><p>Accede a los módulos existentes del sistema.</p></div></div>
        <div className="quick-actions__grid">{quickActions.map((action) => <Link key={action.to} className="quick-action" to={action.to}><span aria-hidden="true">{action.icon}</span>{action.label}<b aria-hidden="true">→</b></Link>)}</div>
      </section>
    </section>
  );
}

export default HomePage;

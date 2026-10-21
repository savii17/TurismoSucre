import { Link } from "react-router-dom";

import StatisticsCards from "../components/dashboard/StatisticsCards";
import DashboardRightSidebar from "../components/dashboard/DashboardRightSidebar";
import DashboardTouristPlaceCard from "../components/dashboard/DashboardTouristPlaceCard";
import TourismHero from "../components/dashboard/TourismHero";
import { featuredTouristPlaces } from "../data/touristPlaces";
import { useLanguage } from "../i18n/useLanguage";

const quickActions = [
  { to: "/lugares-turisticos", icon: "pin", label: "Ver lugares turísticos" },
  { to: "/hospedajes", icon: "bed", label: "Ver hospedajes" },
  { to: "/restaurantes", icon: "food", label: "Ver restaurantes" },
  { to: "/emergencias", icon: "alert", label: "Ver emergencias" },
  { to: "/usuario", icon: "users", label: "Ver usuarios" },
  { to: "/reportes", icon: "report", label: "Reportes (provisional)" },
] as const;

function QuickActionIcon({ name }: { name: (typeof quickActions)[number]["icon"] }) {
  const paths = {
    pin: <><path d="M20 10c0 5.25-8 12-8 12S4 15.25 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    bed: <path d="M3 18v-6.5A2.5 2.5 0 0 1 5.5 9h13a2.5 2.5 0 0 1 2.5 2.5V18M3 15h18M6 9V6h4a2 2 0 0 1 2 2v1M3 18v2m18-2v2" />,
    food: <path d="M7 3v8m-3-8v5a3 3 0 0 0 6 0V3M7 11v10m10-18v18m-3-18v6h3" />,
    alert: <path d="m12 3 9 18H3L12 3Zm0 6v5m0 3h.01" />,
    users: <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m6-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm11 9v-1a4 4 0 0 0-3-3.87m-1-12.1a4 4 0 0 1 0 7.75" />,
    report: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 17l2-2 2 1 3-4" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function HomePage() {
  const { t } = useLanguage();
  const featuredPlaces = [...featuredTouristPlaces]
    .sort((first, second) => (second.calificacion ?? -1) - (first.calificacion ?? -1));

  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="dashboard-layout">
        <section className="dashboard-primary">
          <TourismHero />
          <StatisticsCards />
          <div className="section-heading">
            <div><p className="eyebrow">{t("featuredKicker")}</p><h1 id="home-title">{t("featuredPlaces")}</h1><p>{t("featuredDescription")}</p></div>
            <Link className="see-all-link" to="/lugares-turisticos">{t("allPlaces")} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="tourist-places-grid tourist-places-grid--featured">
            {featuredPlaces.slice(0, 4).map((place) => <DashboardTouristPlaceCard key={place.id} place={place} />)}
          </div>
          <section className="quick-actions" aria-labelledby="quick-actions-title">
            <div className="section-heading"><div><h2 id="quick-actions-title">Acciones Rápidas</h2></div></div>
            <div className="quick-actions__grid">{quickActions.map((action) => <Link key={action.to} className="quick-action" to={action.to}><span><QuickActionIcon name={action.icon} /></span>{action.label}</Link>)}</div>
          </section>
        </section>

        <DashboardRightSidebar />
      </div>
    </section>
  );
}

export default HomePage;

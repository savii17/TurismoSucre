import { Link } from "react-router-dom";

import { events } from "../../data/events";
import { emergencyDirectory } from "../../data/emergencies";
import { entertainment } from "../../data/entertainment";
import { accommodations, restaurants } from "../../data/secondaryListings";
import { touristPlaces } from "../../data/touristPlaces";
import { useLanguage } from "../../i18n/useLanguage";
import { translateRecordText } from "../../i18n/contentTranslations";

const categoryRecords = [
  { label: "Lugares turísticos", value: touristPlaces.length, color: "#e52d35" },
  { label: "Hospedajes", value: accommodations.length, color: "#2878db" },
  { label: "Restaurantes", value: restaurants.length, color: "#f28b13" },
  { label: "Entretenimiento", value: entertainment.length, color: "#8455c7" },
  { label: "Eventos", value: events.length, color: "#159a88" },
  { label: "Emergencias", value: emergencyDirectory.length, color: "#cf5363" },
];
const totalRecords = categoryRecords.reduce((sum, category) => sum + category.value, 0);
const categories = categoryRecords.map((category) => ({
  ...category,
  percentage: totalRecords ? Math.round(category.value / totalRecords * 100) : 0,
}));
const distribution = categories.reduce<{ parts: string[]; offset: number }>((result, category) => {
  const end = totalRecords ? result.offset + category.value / totalRecords * 100 : result.offset;
  result.parts.push(`${category.color} ${result.offset}% ${end}%`);
  result.offset = end;
  return result;
}, { parts: [], offset: 0 });
const agendaEvents = events.slice(0, 4);

function DashboardRightSidebar() {
  const { language, tx } = useLanguage();
  return (
    <aside className="dashboard-right-sidebar" aria-label={tx("Resumen turístico")}>
      <section className="dashboard-right-sidebar__panel">
        <div className="dashboard-right-sidebar__panel-heading"><h2>{tx("Resumen Turístico")}</h2></div>
        <div className="dashboard-summary-metrics">
          <article className="dashboard-summary-metric"><p>{tx("Registros turísticos")}</p><strong>{totalRecords}</strong><span>{tx("En seis categorías de Sucre")}</span></article>
          <article className="dashboard-summary-metric"><p>{tx("Eventos y festividades")}</p><strong>{events.length}</strong><span>{tx("En el calendario local")}</span></article>
        </div>
      </section>
      <section className="dashboard-right-sidebar__panel">
        <h2>{tx("Registros por categoría")}</h2>
        <div className="dashboard-category-visits">
          <div className="dashboard-category-visits__chart" role="img" aria-label={`${language === "es" ? "Distribución de" : "Distribution of"} ${totalRecords} ${tx("registros de Sucre por categoría.")}`} style={{ background: `conic-gradient(${distribution.parts.join(", ")})` }}>
            <span><strong>{totalRecords}</strong><small>{tx("Registros")}</small></span>
          </div>
          <ul className="dashboard-category-visits__legend">{categories.map((category) => <li key={category.label}><i style={{ backgroundColor: category.color }} aria-hidden="true" /><span>{tx(category.label)}</span><strong>{category.value}</strong></li>)}</ul>
        </div>
        <p className="dashboard-data-note">{tx("Conteos calculados a partir de los catálogos del proyecto.")}</p>
      </section>
      <section className="dashboard-right-sidebar__panel">
        <div className="dashboard-right-sidebar__panel-heading"><h2>{tx("Eventos y Festividades")}</h2><Link to="/eventos">{tx("Ver calendario")} <span aria-hidden="true">→</span></Link></div>
        <ul className="dashboard-events-list">{agendaEvents.map((event) => <li key={event.id}><time><strong>{translateRecordText("event", event.id, "category", event.category, language)}</strong>{event.usualMonthLabel && <span>{translateRecordText("event", event.id, "month", event.usualMonthLabel, language)}</span>}</time><div><h3>{event.name}</h3><p>{translateRecordText("event", event.id, "description", event.description, language)}</p><small>{translateRecordText("event", event.id, "location", event.location, language)}</small></div></li>)}</ul>
      </section>
    </aside>
  );
}

export default DashboardRightSidebar;

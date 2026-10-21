import { Link } from "react-router-dom";

import { events, accommodations, restaurants } from "../../data/secondaryListings";
import { touristPlaces } from "../../data/touristPlaces";

const categoryRecords = [
  { label: "Lugares Turísticos", value: touristPlaces.length, color: "#e52d35" },
  { label: "Restaurantes", value: restaurants.length, color: "#f28b13" },
  { label: "Hospedajes", value: accommodations.length, color: "#2878db" },
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

function DashboardRightSidebar() {
  return (
    <aside className="dashboard-right-sidebar" aria-label="Resumen turístico">
      <section className="dashboard-right-sidebar__panel">
        <div className="dashboard-right-sidebar__panel-heading"><h2>Resumen Turístico</h2></div>
        <div className="dashboard-summary-metrics">
          <article className="dashboard-summary-metric"><p>Visitantes estimados</p><strong>No disponible</strong><span>Sin datos de visitas conectados</span></article>
          <article className="dashboard-summary-metric"><p>Ingresos generados</p><strong>No disponible</strong><span>Sin datos de ingresos conectados</span></article>
        </div>
      </section>
      <section className="dashboard-right-sidebar__panel">
        <h2>Registros por categoría</h2>
        <div className="dashboard-category-visits">
          <div className="dashboard-category-visits__chart" role="img" aria-label={`Distribución de ${totalRecords} registros locales por categoría.`} style={{ background: `conic-gradient(${distribution.parts.join(", ")})` }}>
            <span><strong>{totalRecords}</strong><small>Registros</small></span>
          </div>
          <ul className="dashboard-category-visits__legend">{categories.map((category) => <li key={category.label}><i style={{ backgroundColor: category.color }} aria-hidden="true" /><span>{category.label}</span><strong>{category.percentage}%</strong></li>)}</ul>
        </div>
        <p className="dashboard-data-note">Conteo de registros locales; no representa visitas.</p>
      </section>
      <section className="dashboard-right-sidebar__panel">
        <div className="dashboard-right-sidebar__panel-heading"><h2>Eventos y Festividades</h2><Link to="/eventos">Ver calendario <span aria-hidden="true">→</span></Link></div>
        <ul className="dashboard-events-list">{events.map((event) => <li key={event.id}><time><strong>{event.category}</strong><span>{event.date ?? "Fecha no registrada"}</span><em className={`dashboard-event-status dashboard-event-status--${event.status.toLowerCase()}`}>{event.status}</em></time><div><h3>{event.name}</h3><p>{event.description}</p><small>{event.location}</small></div></li>)}</ul>
      </section>
    </aside>
  );
}

export default DashboardRightSidebar;

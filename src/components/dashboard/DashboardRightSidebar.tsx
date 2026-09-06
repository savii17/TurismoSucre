import { Link } from "react-router-dom";

import { events } from "../../data/secondaryListings";

const categoryVisits = [
  { label: "Lugares Turísticos", value: 45, color: "#e8505b" },
  { label: "Restaurantes", value: 25, color: "#7966d9" },
  { label: "Hospedajes", value: 20, color: "#249a73" },
  { label: "Otros Servicios", value: 10, color: "#e78a36" },
];

const summaryMetrics = [
  { label: "Visitantes estimados", value: "18,450", change: "15%" },
  { label: "Ingresos generados", value: "Bs. 245,000", change: "12%" },
];

function DashboardRightSidebar() {
  return (
    <aside className="dashboard-right-sidebar" aria-label="Resumen turístico">
      <section className="dashboard-right-sidebar__panel">
        <div className="dashboard-right-sidebar__panel-heading">
          <h2>Resumen Turístico</h2>
          <select aria-label="Periodo del resumen turístico" defaultValue="Este mes">
            <option>Este mes</option>
          </select>
        </div>
        <div className="dashboard-summary-metrics">
          {summaryMetrics.map((metric) => (
            <article className="dashboard-summary-metric" key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span><b aria-hidden="true">↑</b> {metric.change} <small>vs. mes anterior</small></span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-right-sidebar__panel">
        <h2>Visitas por categoría</h2>
        <div className="dashboard-category-visits">
          <div
            className="dashboard-category-visits__chart"
            role="img"
            aria-label="Distribución de visitas: lugares turísticos 45%, restaurantes 25%, hospedajes 20% y otros servicios 10%."
          >
            <span><strong>100%</strong><small>Visitas</small></span>
          </div>
          <ul className="dashboard-category-visits__legend">
            {categoryVisits.map((category) => (
              <li key={category.label}>
                <i style={{ backgroundColor: category.color }} aria-hidden="true" />
                <span>{category.label}</span>
                <strong>{category.value}%</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dashboard-right-sidebar__panel">
        <div className="dashboard-right-sidebar__panel-heading">
          <h2>Eventos y Festividades</h2>
          <Link to="/eventos">Ver calendario <span aria-hidden="true">→</span></Link>
        </div>
        <ul className="dashboard-events-list">
          {events.map((event, index) => (
            <li key={event.id}>
              <time dateTime={event.date}><strong>{index === 0 ? "PRÓX." : "EVENTO"}</strong><span>{event.date}</span></time>
              <div>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <small>{event.location}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export default DashboardRightSidebar;

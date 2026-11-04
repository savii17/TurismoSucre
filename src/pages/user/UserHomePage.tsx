import { Link } from "react-router-dom";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function UserHomePage() {
  const { tx } = useLanguage();
  const popular = personalRepository.popularPlaces();
  return <section className="module-page user-dashboard"><div className="module-heading"><div><p className="eyebrow">{tx("Mi espacio")}</p><h1>{tx("Explora TurismoSucre")}</h1><p>{tx("Guarda tus lugares favoritos y descubre eventos nuevos de Sucre.")}</p></div></div>
    <div className="user-feature-grid"><Link to="/lugares-turisticos">{tx("Explorar lugares turísticos")} <span>→</span></Link><Link to="/hospedajes">{tx("Consultar hospedajes")} <span>→</span></Link><Link to="/restaurantes">{tx("Consultar restaurantes")} <span>→</span></Link><Link to="/eventos">{tx("Explorar eventos y festividades")} <span>→</span></Link><Link to="/mi-cuenta/favoritos">{tx("Mis favoritos")} <span>→</span></Link><Link to="/mi-cuenta/notificaciones">{tx("Eventos y notificaciones")} <span>→</span></Link></div>
    <section className="module-panel user-popular"><h2>{tx("Lugares más visitados")}</h2>{popular.length ? <ol>{popular.map((item) => <li key={item.id}><Link to={`/lugares-turisticos/${item.id}`}>{item.name}</Link><strong>{item.visits} {tx("visitas")}</strong></li>)}</ol> : <p>{tx("Aún no hay visitas registradas. Explora los detalles de los lugares para consultar las estadísticas.")}</p>}</section>
  </section>;
}

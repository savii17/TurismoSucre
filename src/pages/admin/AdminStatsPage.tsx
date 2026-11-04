import { catalogRepository } from "../../repositories/catalogRepository";
import { touristPlaceRepository } from "../../repositories/touristPlaceRepository";
import { userRepository } from "../../repositories/userRepository";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function AdminStatsPage() {
  const { tx } = useLanguage();
  const stats = [["Lugares turísticos", touristPlaceRepository.list().length], ["Hospedajes", catalogRepository.list("hospedajes").length], ["Restaurantes", catalogRepository.list("restaurantes").length], ["Entretenimiento", catalogRepository.list("entretenimiento").length], ["Eventos", catalogRepository.list("eventos").length], ["Cuentas", userRepository.list().length], ["Visitas registradas", personalRepository.totalTouristPlaceVisits()]] as const;
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{tx("Administración")}</p><h1>{tx("Estadísticas")}</h1><p>{tx("Resumen local de los catálogos y visitas registradas.")}</p></div></div><div className="module-stats module-stats--six">{stats.map(([label, count]) => <article key={label}><span>{tx(label)}</span><strong>{count}</strong></article>)}</div><p className="module-empty">{tx("Las visitas y estadísticas se almacenan solo en este navegador.")}</p></section>;
}

import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";

export default function AdminHomePage() {
  const { tx } = useLanguage();
  return <section className="module-page">
    <div className="module-heading"><div><p className="eyebrow">{tx("Administración")}</p><h1>{tx("Panel administrativo")}</h1><p>{tx("Gestiona la información turística de TurismoSucre.")}</p></div></div>
    <div className="quick-actions__grid admin-home-actions">
      <Link className="quick-action" to="/admin/lugares-turisticos"><span aria-hidden="true">⌖</span><strong>{tx("Lugares turísticos")}</strong><small>{tx("Crear, editar y administrar destinos")}</small></Link>
      <Link className="quick-action" to="/admin/usuarios"><span aria-hidden="true">♙</span><strong>{tx("Usuarios")}</strong><small>{tx("Consultar y administrar cuentas")}</small></Link>
      <Link className="quick-action" to="/admin/eventos"><span aria-hidden="true">▦</span><strong>{tx("Eventos")}</strong><small>{tx("Consultar la agenda turística")}</small></Link>
    </div>
  </section>;
}

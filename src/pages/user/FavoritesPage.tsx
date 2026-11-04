import { Link } from "react-router-dom";
import { useState } from "react";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function FavoritesPage() {
  const { tx } = useLanguage();
  const [items, setItems] = useState(() => personalRepository.listFavorites());
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{tx("Mi espacio")}</p><h1>{tx("Mis favoritos")}</h1><p>{tx("Lugares y sitios que guardaste en tu cuenta.")}</p></div></div><div className="user-favorites-grid">{items.map((item) => <article key={`${item.kind}:${item.id}`}><span>♥</span><h2>{item.name}</h2><Link to={item.to}>{tx("Ver detalles")} →</Link><button type="button" onClick={() => { personalRepository.removeFavorite(item.kind, item.id); setItems(personalRepository.listFavorites()); }}>{tx("Quitar de favoritos")}</button></article>)}</div>{!items.length && <p className="module-empty">{tx("Todavía no guardaste favoritos. Abre el detalle de un lugar para guardarlo.")}</p>}</section>;
}

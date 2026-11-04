import { useState } from "react";
import { Link } from "react-router-dom";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function NotificationsPage() {
  const { tx } = useLanguage();
  const [items, setItems] = useState(() => personalRepository.listNotifications());
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{tx("Mi espacio")}</p><h1>{tx("Eventos y notificaciones")}</h1><p>{tx("Avisos de eventos y festividades añadidos a TurismoSucre.")}</p></div><button className="module-button" type="button" onClick={() => { personalRepository.markNotificationsRead(); setItems(personalRepository.listNotifications()); }}>{tx("Marcar como leídas")}</button></div><div className="module-panel user-notifications">{items.map((item) => <article key={item.id} className={item.read ? "is-read" : "is-unread"}><span aria-hidden="true">{item.read ? "○" : "●"}</span><div><Link to={item.to}>{item.title}</Link><small>{new Date(item.createdAt).toLocaleString()}</small></div></article>)}{!items.length && <p className="module-empty">{tx("Todavía no hay eventos nuevos. Te avisaremos cuando se agreguen festividades.")}</p>}</div></section>;
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function NotificationsPage() {
  const { tx } = useLanguage();
  const [items, setItems] = useState(() => personalRepository.listNotifications());
  useEffect(() => {
    const refresh = () => setItems(personalRepository.listNotifications());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{tx("Mi espacio")}</p><h1>{tx("Eventos y notificaciones")}</h1><p>{tx("Avisos de nuevas publicaciones añadidas a TurismoSucre.")}</p></div><button className="module-button" type="button" onClick={() => { personalRepository.markNotificationsRead(); setItems(personalRepository.listNotifications()); }}>{tx("Marcar como leídas")}</button></div><div className="module-panel user-notifications">{items.map((item) => <article key={item.id} className={item.read ? "is-read" : "is-unread"}><span aria-hidden="true">{item.read ? "○" : "●"}</span><div><Link to={item.to} onClick={() => { personalRepository.markNotificationRead(item.id); setItems(personalRepository.listNotifications()); }}><strong>{item.title}</strong></Link><p>{item.name ?? item.title}</p><small>{tx(item.category ?? "Eventos y festividades")} · {new Date(item.createdAt).toLocaleString()}</small></div></article>)}{!items.length && <p className="module-empty">{tx("Todavía no hay publicaciones nuevas.")}</p>}</div></section>;
}

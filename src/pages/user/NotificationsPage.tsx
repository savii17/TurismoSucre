import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";
import { translateRecordText, type ContentKind } from "../../i18n/contentTranslations";

export default function NotificationsPage() {
  const { language, tx } = useLanguage();
  const kindFor = (category?: string): ContentKind | undefined => ({ "Lugares turísticos": "tourist-place", "Hospedajes": "accommodation", "Restaurantes": "restaurant", "Entretenimiento": "entertainment", "Eventos y festividades": "event", "Emergencias": "emergency" } as Record<string, ContentKind>)[category ?? ""];
  const [items, setItems] = useState(() => personalRepository.listNotifications());
  useEffect(() => {
    const refresh = () => setItems(personalRepository.listNotifications());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{tx("Mi espacio")}</p><h1>{tx("Eventos y notificaciones")}</h1><p>{tx("Avisos de nuevas publicaciones añadidas a TurismoSucre.")}</p></div><button className="module-button" type="button" onClick={() => { personalRepository.markNotificationsRead(); setItems(personalRepository.listNotifications()); }}>{tx("Marcar como leídas")}</button></div><div className="module-panel user-notifications">{items.map((item) => { const kind = kindFor(item.category); const name = kind && item.recordId ? translateRecordText(kind, item.recordId, "name", item.name, language) : item.name ?? tx(item.title); return <article key={item.id} className={item.read ? "is-read" : "is-unread"}><span aria-hidden="true">{item.read ? "○" : "●"}</span><div><Link to={item.to} onClick={() => { personalRepository.markNotificationRead(item.id); setItems(personalRepository.listNotifications()); }}><strong>{tx(item.title)}</strong></Link><p>{name}</p><small>{tx(item.category ?? "Eventos y festividades")} · {new Date(item.createdAt).toLocaleString(language === "es" ? "es-BO" : "en-US")}</small></div></article>;})}{!items.length && <p className="module-empty">{tx("Todavía no hay publicaciones nuevas.")}</p>}</div></section>;
}

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FAVORITES_CHANGED_EVENT, personalRepository, type FavoriteRecord } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";
import { translateRecordText, type ContentKind } from "../../i18n/contentTranslations";
import { getImageSet } from "../../data/imageCatalog";
import ImageWithFallback from "../../components/ImageWithFallback";
import { touristPlaceRepository } from "../../repositories/touristPlaceRepository";
import { catalogRepository } from "../../repositories/catalogRepository";
import { emergencyRepository } from "../../repositories/emergencyRepository";
import type { AccommodationListing, RestaurantListing, EntertainmentRecord } from "../../types/listing";
import type { EventRecord } from "../../types/event";
import type { Emergency } from "../../types/emergency";
import type { ImageCategory, ImageSet } from "../../types/images";

const contentKinds = new Set<ContentKind>(["tourist-place", "accommodation", "restaurant", "entertainment", "event", "emergency", "user"]);
type FavoriteDetails = { category?: string; imageSet: ImageSet };

function favoriteDetails(item: FavoriteRecord): FavoriteDetails {
  const kind = item.kind as ImageCategory;
  if (item.kind === "tourist-place") {
    const place = touristPlaceRepository.list().find((record) => record.id === item.id);
    return { category: place?.category, imageSet: getImageSet(kind, item.id, place ? [place.image, ...(place.imagenes_url ?? [])] : []) };
  }
  if (item.kind === "accommodation" || item.kind === "restaurant") {
    const entries = catalogRepository.list(item.kind === "accommodation" ? "hospedajes" : "restaurantes") as Array<AccommodationListing | RestaurantListing>;
    const record = entries.find((entry) => entry.id === item.id);
    return { category: record?.category, imageSet: getImageSet(kind, item.id, record ? [record.image ?? "", ...(record.images ?? [])] : []) };
  }
  if (item.kind === "entertainment") {
    const record = (catalogRepository.list("entretenimiento") as EntertainmentRecord[]).find((entry) => entry._id === item.id);
    return { category: record?.tipo, imageSet: getImageSet(kind, item.id, record?.imagenes_url ?? []) };
  }
  if (item.kind === "event") {
    const record = (catalogRepository.list("eventos") as EventRecord[]).find((entry) => entry.id === item.id);
    return { category: record?.category, imageSet: getImageSet(kind, item.id, record ? [record.image ?? ""] : []) };
  }
  if (item.kind === "emergency") {
    const record = (emergencyRepository.list() as Emergency[]).find((entry) => entry.PK_id === item.id);
    return { category: record?.tipo, imageSet: getImageSet(kind, item.id) };
  }
  return { category: item.category, imageSet: getImageSet("tourist-place", item.id) };
}

export default function FavoritesPage() {
  const { language, tx } = useLanguage();
  const [items, setItems] = useState(() => personalRepository.listFavorites());
  useEffect(() => {
    const sync = () => setItems(personalRepository.listFavorites());
    window.addEventListener(FAVORITES_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{tx("Mi espacio")}</p><h1>{tx("Mis favoritos")}</h1><p>{tx("Lugares y sitios que guardaste en tu cuenta.")}</p></div></div><div className="user-favorites-grid">{items.map((item) => {
    const detail = favoriteDetails(item);
    const name = contentKinds.has(item.kind as ContentKind) ? translateRecordText(item.kind as ContentKind, item.id, "name", item.name, language) : item.name;
    const category = contentKinds.has(item.kind as ContentKind) ? translateRecordText(item.kind as ContentKind, item.id, "category", detail.category ?? item.category, language) : detail.category ?? item.category;
    return <article key={`${item.kind}:${item.id}`} className="user-favorite-card"><Link className="user-favorite-card__image" to={item.to}><ImageWithFallback imageSet={detail.imageSet} category={detail.imageSet.category} alt={name} objectFit="cover" /></Link><div className="user-favorite-card__body"><span aria-hidden="true">♥</span>{category && <small>{category}</small>}<h2><Link to={item.to}>{name}</Link></h2><Link className="user-favorite-card__details" to={item.to}>{tx("Ver detalles")} →</Link><button type="button" onClick={() => personalRepository.removeFavorite(item.kind, item.id)}>{tx("Quitar de favoritos")}</button></div></article>;
  })}</div>{!items.length && <div className="module-empty"><p>{tx("Todavía no guardaste favoritos. Abre el detalle de un lugar para guardarlo.")}</p><Link to="/lugares-turisticos">{tx("Explorar lugares turísticos")} →</Link></div>}</section>;
}

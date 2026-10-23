import { Link } from "react-router-dom";

import type { TouristPlace } from "../../data/touristPlaces";
import { getTouristPlaceImage } from "../../data/touristImages";
import { getImageSet } from "../../data/imageCatalog";
import ImageWithFallback from "../ImageWithFallback";
import { useLanguage } from "../../i18n/useLanguage";
import { translateRecordText } from "../../i18n/contentTranslations";

type Props = { place: TouristPlace };

function DashboardTouristPlaceCard({ place }: Props) {
  const { language, tx } = useLanguage();
  const image = getTouristPlaceImage(
    place.id,
    place.imagenes_url?.find((url) => url.trim()) ?? place.image,
  );
  const name = place.nombre_lugar ?? place.name;
  const location = translateRecordText("tourist-place", place.id, "location", place.ubicacion ?? place.localizacion ?? place.address, language);
  const description = translateRecordText("tourist-place", place.id, "shortDescription", place.descripcion ?? place.shortDescription, language);
  const rawHours = place.horario_inicio && place.horario_fin
    ? `${place.horario_inicio} – ${place.horario_fin}`
    : place.hours;
  const hours = translateRecordText("tourist-place", place.id, "hours", rawHours, language);
  const status = translateRecordText("tourist-place", place.id, "status", place.estado ?? "SIN ESTADO", language);
  const imageSet = getImageSet("tourist-place", place.id, [image]);

  return (
    <article className="dashboard-place-card">
      <div className="dashboard-place-card__media">
        <ImageWithFallback imageSet={imageSet} category="tourist-place" alt={`${name} ${language === "es" ? "en" : "in"} Sucre, Bolivia`} />
        <span className="dashboard-place-card__category">{translateRecordText("tourist-place", place.id, "category", place.category, language)}</span>
        <span className={`dashboard-place-card__status dashboard-place-card__status--${status.toLowerCase()}`}>{status}</span>
      </div>
      <div className="dashboard-place-card__body">
        <div><h2>{name}</h2><p className="dashboard-place-card__location">⌖ {location}</p></div>
        <p className="dashboard-place-card__description">{description}</p>
        <div className="dashboard-place-card__facts">
          {place.calificacion != null && <span>★ {place.calificacion.toFixed(1)}</span>}
          <span>◷ {hours}</span>
        </div>
        <div className="dashboard-place-card__bottom">
          <Link to={`/lugares-turisticos/${place.id}`}>{tx("Explorar lugar")} <b aria-hidden="true">→</b></Link>
        </div>
      </div>
    </article>
  );
}

export default DashboardTouristPlaceCard;

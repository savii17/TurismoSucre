import { Link } from "react-router-dom";

import {
  getLocalizedTouristPlace,
  type TouristPlace,
} from "../../data/touristPlaces";
import { getTouristPlaceImage } from "../../data/touristImages";
import { useLanguage } from "../../i18n/useLanguage";

type TouristPlaceCardProps = {
  place: TouristPlace;
};

function TouristPlaceCard({ place }: TouristPlaceCardProps) {
  const { language, t } = useLanguage();
  const localizedPlace = getLocalizedTouristPlace(place, language);
  const image = getTouristPlaceImage(
    localizedPlace.id,
    localizedPlace.imagenes_url?.[0] ?? localizedPlace.image,
  );
  const location = localizedPlace.ubicacion ?? localizedPlace.address;
  const hours =
    localizedPlace.horario_inicio && localizedPlace.horario_fin
      ? `${localizedPlace.horario_inicio} – ${localizedPlace.horario_fin}`
      : localizedPlace.hours;

  return (
    <article className="tourist-place-card">
      <div className="tourist-place-card__image-wrap">
        {image ? (
          <img
            className="tourist-place-card__image"
            src={image}
            alt={`${t("touristPlaces")}: ${localizedPlace.nombre_lugar ?? localizedPlace.name}`}
            loading="lazy"
          />
        ) : (
          <div
            className="tourist-place-card__image--fallback"
            role="img"
            aria-label={`${t("touristPlaces")}: ${localizedPlace.nombre_lugar ?? localizedPlace.name}`}
          >
            <span>Sucre</span>
          </div>
        )}
        <span className="tourist-place-card__category">
          {localizedPlace.category}
        </span>
      </div>

      <div className="tourist-place-card__body">
        <h2>{localizedPlace.nombre_lugar ?? localizedPlace.name}</h2>
        <p className="tourist-place-card__description">
          {localizedPlace.descripcion ?? localizedPlace.shortDescription}
        </p>

        <dl className="tourist-place-card__details">
          <div>
            <dt><span aria-hidden="true">⌖</span> {t("location")}</dt>
            <dd>{location}</dd>
          </div>
          <div>
            <dt><span aria-hidden="true">◷</span> {t("hours")}</dt>
            <dd>{hours}</dd>
          </div>
        </dl>

        <div className="tourist-place-card__meta">
          {localizedPlace.calificacion != null && (
            <span className="tourist-place-card__rating">
              ★ {localizedPlace.calificacion.toFixed(1)}
            </span>
          )}
          {localizedPlace.precio_entrada != null && (
            <span className="tourist-place-card__price">
              Bs {localizedPlace.precio_entrada}
            </span>
          )}
        </div>

        <Link className="tourist-place-card__link" to={`/lugares-turisticos/${place.id}`}>
          {t("viewDetails")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default TouristPlaceCard;

import { Link } from "react-router-dom";

import {
  getLocalizedTouristPlace,
  type TouristPlace,
} from "../../data/touristPlaces";
import { getTouristPlaceImage } from "../../data/touristImages";
import { getImageSet } from "../../data/imageCatalog";
import ImageWithFallback from "../ImageWithFallback";
import { useLanguage } from "../../i18n/useLanguage";
import { translateRecordText } from "../../i18n/contentTranslations";

type TouristPlaceCardProps = {
  place: TouristPlace;
};

function TouristPlaceCard({ place }: TouristPlaceCardProps) {
  const { language, t } = useLanguage();
  const basePlace = getLocalizedTouristPlace(place, language);
  const localizedPlace = language === "en" ? {
    ...basePlace,
    name: place.name,
    nombre_lugar: translateRecordText("tourist-place", place.id, "name", place.nombre_lugar ?? place.name, language),
    category: translateRecordText("tourist-place", place.id, "category", place.category, language),
    address: translateRecordText("tourist-place", place.id, "address", basePlace.address, language),
    ubicacion: translateRecordText("tourist-place", place.id, "location", basePlace.ubicacion ?? basePlace.address, language),
    shortDescription: translateRecordText("tourist-place", place.id, "shortDescription", place.shortDescription, language),
    descripcion: translateRecordText("tourist-place", place.id, "description", place.description, language),
    description: translateRecordText("tourist-place", place.id, "description", place.description, language),
    highlights: (basePlace.highlights ?? []).map((value) => translateRecordText("tourist-place", place.id, "highlights", value, language)),
    services: (basePlace.services ?? []).map((value) => translateRecordText("tourist-place", place.id, "services", value, language)),
    hours: translateRecordText("tourist-place", place.id, "hours", basePlace.hours, language),
  } : basePlace;
  const image = getTouristPlaceImage(
    localizedPlace.id,
    localizedPlace.imagenes_url?.[0] ?? localizedPlace.image,
  );
  const location = localizedPlace.ubicacion ?? localizedPlace.address;
  const imageSet = getImageSet("tourist-place", place.id, [image]);
  const rawHours =
    localizedPlace.horario_inicio && localizedPlace.horario_fin
      ? `${localizedPlace.horario_inicio} – ${localizedPlace.horario_fin}`
      : localizedPlace.hours;
  const hours = translateRecordText("tourist-place", place.id, "hours", rawHours, language);

  return (
    <article className="tourist-place-card">
      <div className="tourist-place-card__image-wrap">
        <ImageWithFallback imageSet={imageSet} category="tourist-place" imageClassName="tourist-place-card__image" alt={`${localizedPlace.nombre_lugar ?? localizedPlace.name} ${language === "es" ? "en" : "in"} Sucre, Bolivia`} />
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

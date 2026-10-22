import { Link } from "react-router-dom";

import type { TouristPlace } from "../../data/touristPlaces";
import { getTouristPlaceImage } from "../../data/touristImages";
import { getImageSet } from "../../data/imageCatalog";
import ImageWithFallback from "../ImageWithFallback";

type Props = { place: TouristPlace };

function DashboardTouristPlaceCard({ place }: Props) {
  const image = getTouristPlaceImage(
    place.id,
    place.imagenes_url?.find((url) => url.trim()) ?? place.image,
  );
  const name = place.nombre_lugar ?? place.name;
  const location = place.ubicacion ?? place.localizacion ?? place.address;
  const description = place.descripcion ?? place.shortDescription;
  const hours = place.horario_inicio && place.horario_fin
    ? `${place.horario_inicio} – ${place.horario_fin}`
    : place.hours;
  const status = place.estado ?? "SIN ESTADO";
  const imageSet = getImageSet("tourist-place", place.id, [image]);

  return (
    <article className="dashboard-place-card">
      <div className="dashboard-place-card__media">
        <ImageWithFallback imageSet={imageSet} category="tourist-place" alt={imageSet.main?.alt ?? `${name} en Sucre, Bolivia`} />
        <span className="dashboard-place-card__category">{place.category}</span>
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
          <Link to={`/lugares-turisticos/${place.id}`}>Explorar lugar <b aria-hidden="true">→</b></Link>
        </div>
      </div>
    </article>
  );
}

export default DashboardTouristPlaceCard;

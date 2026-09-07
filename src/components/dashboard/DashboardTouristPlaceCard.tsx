import { useState } from "react";
import { Link } from "react-router-dom";

import type { TouristPlace } from "../../data/touristPlaces";

type Props = { place: TouristPlace };

function DashboardTouristPlaceCard({ place }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = place.imagenes_url?.find((url) => url.trim()) ?? place.image;
  const name = place.nombre_lugar ?? place.name;
  const location = place.ubicacion ?? place.localizacion ?? place.address;
  const description = place.descripcion ?? place.shortDescription;
  const hours = place.horario_inicio && place.horario_fin
    ? `${place.horario_inicio} – ${place.horario_fin}`
    : place.hours;
  const status = place.estado ?? "SIN ESTADO";

  return (
    <article className="dashboard-place-card">
      <div className="dashboard-place-card__media">
        {image && !imageFailed ? (
          <img src={image} alt={name} onError={() => setImageFailed(true)} />
        ) : (
          <div className="dashboard-place-card__fallback" role="img" aria-label={`Imagen no disponible de ${name}`}><span>Sucre</span></div>
        )}
        <span className="dashboard-place-card__category">{place.category}</span>
        <span className={`dashboard-place-card__status dashboard-place-card__status--${status.toLowerCase()}`}>{status}</span>
        <button className="dashboard-place-card__favorite" type="button" aria-label={`Guardar ${name} como favorito`}>♡</button>
      </div>
      <div className="dashboard-place-card__body">
        <div><h2>{name}</h2><p className="dashboard-place-card__location">⌖ {location}</p></div>
        <p className="dashboard-place-card__description">{description}</p>
        <div className="dashboard-place-card__facts">
          <span>★ {place.calificacion != null ? place.calificacion.toFixed(1) : "—"}</span>
          <span>◷ {hours}</span>
        </div>
        <div className="dashboard-place-card__bottom">
          <span>{place.precio_entrada != null ? (place.precio_entrada === 0 ? "Entrada libre" : `Bs ${place.precio_entrada}`) : "Precio no registrado"}</span>
          <Link to={`/lugares-turisticos/${place.id}`}>Ver detalles <b aria-hidden="true">→</b></Link>
        </div>
      </div>
    </article>
  );
}

export default DashboardTouristPlaceCard;

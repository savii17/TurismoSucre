import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { getTouristPlaceById } from "../data/touristPlaces";
import { getTouristPlaceImage } from "../data/touristImages";

export default function TouristPlaceDetailPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const place = getTouristPlaceById(placeId);
  const record: DetailRecord | undefined = place && {
    id: place.id, name: place.nombre_lugar ?? place.name, category: place.category,
    status: place.estado, location: place.ubicacion ?? place.address,
    description: place.descripcion ?? place.description,
    image: getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image),
    images: [getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image)],
    rating: place.calificacion, hours: place.horario_inicio && place.horario_fin ? `${place.horario_inicio} – ${place.horario_fin}` : place.hours,
    price: place.precio_entrada != null ? (place.precio_entrada === 0 ? "Gratuito" : `Bs ${place.precio_entrada}`) : undefined,
    services: place.services, registeredBy: place.registrado_por, registeredAt: place.fecha_registro,
    latitude: place.latitud, longitude: place.longitud,
  };
  return <RecordDetailPage record={record} moduleName="Lugares turísticos" detailTitle="Lugar turístico" backTo="/lugares-turisticos" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { getTouristPlaceById, touristPlaces } from "../data/touristPlaces";
import { getTouristPlaceImage } from "../data/touristImages";
import { getImageSet } from "../data/imageCatalog";

export default function TouristPlaceDetailPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const place = getTouristPlaceById(placeId);
  const record: DetailRecord | undefined = place && {
    id: place.id, name: place.nombre_lugar ?? place.name, category: place.category,
    status: place.estado, location: place.ubicacion ?? place.address,
    description: place.descripcion ?? place.description,
    image: getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image),
    images: [getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image)],
    imageSet: getImageSet("tourist-place", place.id, [place.imagenes_url?.[0] ?? "", place.image]),
    rating: place.calificacion, hours: place.horario_inicio && place.horario_fin ? `${place.horario_inicio} – ${place.horario_fin}` : place.hours,
    price: place.precio_entrada != null ? (place.precio_entrada === 0 ? "Gratuito" : `Bs ${place.precio_entrada}`) : undefined,
    services: place.services, registeredBy: place.registrado_por, registeredAt: place.fecha_registro,
    address: place.address, phone: place.telefono, reviews: undefined, tags: place.highlights,
    latitude: place.latitud, longitude: place.longitud,
  };
  const related = place ? touristPlaces.filter((item) => item.id !== place.id).slice(0, 4).map((item) => ({ id: item.id, name: item.name, category: item.category, location: item.address, imageSet: getImageSet("tourist-place", item.id, [item.image]), to: `/lugares-turisticos/${item.id}` })) : [];
  return <RecordDetailPage record={record} related={related} moduleName="Lugares turísticos" detailTitle="Lugar turístico" backTo="/lugares-turisticos" imageCategory="tourist-place" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

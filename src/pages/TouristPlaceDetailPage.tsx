import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { touristPlaceRepository } from "../repositories/touristPlaceRepository";
import { getTouristPlaceImage } from "../data/touristImages";
import { getImageSet } from "../data/imageCatalog";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";

export default function TouristPlaceDetailPage() {
  const { language } = useLanguage();
  const { placeId } = useParams<{ placeId: string }>();
  const touristPlaces = touristPlaceRepository.list();
  const place = touristPlaceRepository.getById(placeId);
  const record: DetailRecord | undefined = place && {
    id: place.id, name: place.nombre_lugar ?? place.name, category: translateRecordText("tourist-place", place.id, "category", place.category, language),
    status: translateRecordText("tourist-place", place.id, "status", place.estado ?? "ACTIVO", language), location: translateRecordText("tourist-place", place.id, "location", place.ubicacion ?? place.address, language),
    description: translateRecordText("tourist-place", place.id, "description", place.descripcion ?? place.description, language),
    image: getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image),
    images: [getTouristPlaceImage(place.id, place.imagenes_url?.[0] ?? place.image)],
    imageSet: getImageSet("tourist-place", place.id, [place.imagenes_url?.[0] ?? "", place.image]),
    rating: place.calificacion, hours: translateRecordText("tourist-place", place.id, "hours", place.horario_inicio && place.horario_fin ? `${place.horario_inicio} – ${place.horario_fin}` : place.hours, language),
    price: place.precio_entrada != null ? (place.precio_entrada === 0 ? "Gratuito" : `Bs ${place.precio_entrada}`) : undefined,
    services: place.services.map((value) => translateRecordText("tourist-place", place.id, "services", value, language)), registeredBy: place.registrado_por, registeredAt: place.fecha_registro,
    address: translateRecordText("tourist-place", place.id, "address", place.address, language), phone: place.telefono, reviews: undefined, tags: place.highlights.map((value) => translateRecordText("tourist-place", place.id, "highlights", value, language)),
    latitude: place.latitud, longitude: place.longitud,
  };
  const related = place ? touristPlaces.filter((item) => item.id !== place.id).slice(0, 4).map((item) => ({ id: item.id, name: item.name, category: translateRecordText("tourist-place", item.id, "category", item.category, language), location: translateRecordText("tourist-place", item.id, "location", item.address, language), imageSet: getImageSet("tourist-place", item.id, [item.image]), to: `/lugares-turisticos/${item.id}` })) : [];
  return <RecordDetailPage record={record} related={related} moduleName="Lugares turísticos" detailTitle="Lugar turístico" backTo="/lugares-turisticos" imageCategory="tourist-place" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

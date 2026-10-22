import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { entertainment } from "../data/entertainment";
import { getImageSet } from "../data/imageCatalog";

export default function EntertainmentDetailPage() {
  const { entertainmentId } = useParams<{ entertainmentId: string }>();
  const item = entertainment.find((record) => record._id === entertainmentId);
  const record: DetailRecord | undefined = item && { id: item._id, name: item.nombre_lugar, category: item.tipo, status: item.estado, location: item.ubicacion, description: item.descripcion, image: item.imagenes_url[0], images: item.imagenes_url, imageSet: getImageSet("entertainment", item._id, item.imagenes_url), rating: item.calificacion, hours: item.horario_inicio && item.horario_fin ? `${item.horario_inicio} – ${item.horario_fin}` : undefined, services: item.servicios, registeredBy: item.registrado_por, registeredAt: item.fecha_registro, latitude: item.latitud, longitude: item.longitud, fields: [{ label: "Teléfono", value: item.telefono }] };
  return <RecordDetailPage record={record} moduleName="Entretenimiento" detailTitle="Lugar de entretenimiento" backTo="/entretenimiento" imageCategory="entertainment" summary={{ rating: record?.rating?.toFixed(1), hours: record?.hours }} />;
}

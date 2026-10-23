import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { accommodations } from "../data/secondaryListings";
import { getImageSet } from "../data/imageCatalog";

export default function AccommodationDetailPage() {
  const { accommodationId } = useParams<{ accommodationId: string }>();
  const item = accommodations.find((record) => record.id === accommodationId);
  const record: DetailRecord | undefined = item && { ...item, address: item.address, phone: item.phone, status: item.status, hours: item.hours, price: item.price, services: item.services, imageSet: getImageSet("accommodation", item.id, [item.image ?? "", ...(item.images ?? [])]) };
  const related = item ? accommodations.filter((entry) => entry.id !== item.id).slice(0, 4).map((entry) => ({ id: entry.id, name: entry.name, category: entry.category, location: entry.location, imageSet: getImageSet("accommodation", entry.id, [entry.image ?? "", ...(entry.images ?? [])]), to: `/hospedajes/${entry.id}` })) : [];
  return <RecordDetailPage record={record} related={related} moduleName="Hospedajes" detailTitle="Hospedaje" backTo="/hospedajes" imageCategory="accommodation" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

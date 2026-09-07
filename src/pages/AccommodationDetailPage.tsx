import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { accommodations } from "../data/secondaryListings";

export default function AccommodationDetailPage() {
  const { accommodationId } = useParams<{ accommodationId: string }>();
  const item = accommodations.find((record) => record.id === accommodationId);
  const record: DetailRecord | undefined = item && { ...item, status: item.status, hours: undefined, price: item.price, services: item.services };
  return <RecordDetailPage record={record} moduleName="Hospedajes" detailTitle="Hospedaje" backTo="/hospedajes" summary={{ rating: record?.rating?.toFixed(1), price: record?.price }} />;
}

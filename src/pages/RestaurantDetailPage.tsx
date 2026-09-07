import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { restaurants } from "../data/secondaryListings";

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const item = restaurants.find((record) => record.id === restaurantId);
  const record: DetailRecord | undefined = item && { ...item, status: item.status, hours: undefined, price: item.price, services: item.services };
  return <RecordDetailPage record={record} moduleName="Restaurantes" detailTitle="Restaurante" backTo="/restaurantes" summary={{ rating: record?.rating?.toFixed(1), price: record?.price }} />;
}

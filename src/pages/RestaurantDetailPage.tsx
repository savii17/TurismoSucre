import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { restaurants } from "../data/secondaryListings";
import { getImageSet } from "../data/imageCatalog";

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const item = restaurants.find((record) => record.id === restaurantId);
  const record: DetailRecord | undefined = item && {
    ...item,
    status: item.status,
    hours: item.hours,
    price: item.price,
    services: item.services,
    address: item.address,
    phone: item.phone,
    imageSet: getImageSet("restaurant", item.id, [item.image ?? "", ...(item.images ?? [])]),
  };
  const related = item ? restaurants.filter((entry) => entry.id !== item.id).slice(0, 4).map((entry) => ({ id: entry.id, name: entry.name, category: entry.category, location: entry.location, imageSet: getImageSet("restaurant", entry.id, [entry.image ?? "", ...(entry.images ?? [])]), to: `/restaurantes/${entry.id}` })) : [];
  return <RecordDetailPage record={record} related={related} moduleName="Restaurantes" detailTitle="Restaurante" backTo="/restaurantes" imageCategory="restaurant" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

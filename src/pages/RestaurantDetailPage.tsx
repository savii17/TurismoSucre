import { useLocation, useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { catalogRepository } from "../repositories/catalogRepository";
import type { RestaurantListing } from "../types/listing";
import { getImageSet } from "../data/imageCatalog";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";

export default function RestaurantDetailPage() {
  const { language } = useLanguage();
  const isAdminView = useLocation().pathname.startsWith("/admin/");
  const detailPath = isAdminView ? "/admin/restaurantes" : "/restaurantes";
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurants = (catalogRepository.list("restaurantes") as RestaurantListing[]).filter((record) => isAdminView || record.status !== "INACTIVO");
  const item = restaurants.find((record) => record.id === restaurantId && (isAdminView || record.status !== "INACTIVO"));
  const record: DetailRecord | undefined = item && {
    ...item,
    category: translateRecordText("restaurant", item.id, "category", item.category, language),
    location: translateRecordText("restaurant", item.id, "location", item.location, language),
    description: translateRecordText("restaurant", item.id, "description", item.description, language),
    status: translateRecordText("restaurant", item.id, "status", item.status, language),
    hours: translateRecordText("restaurant", item.id, "hours", item.hours, language),
    price: translateRecordText("restaurant", item.id, "price", item.price, language),
    services: item.services?.map((value) => translateRecordText("restaurant", item.id, "services", value, language)),
    address: translateRecordText("restaurant", item.id, "address", item.address, language),
    phone: item.phone,
    imageSet: getImageSet("restaurant", item.id, [item.image ?? "", ...(item.images ?? [])]),
  };
  const related = item ? restaurants.filter((entry) => entry.id !== item.id).slice(0, 4).map((entry) => ({ id: entry.id, name: entry.name, category: translateRecordText("restaurant", entry.id, "category", entry.category, language), location: translateRecordText("restaurant", entry.id, "location", entry.location, language), imageSet: getImageSet("restaurant", entry.id, [entry.image ?? "", ...(entry.images ?? [])]), to: `${detailPath}/${entry.id}` })) : [];
  return <RecordDetailPage record={record} related={related} moduleName="Restaurantes" detailTitle="Restaurante" backTo={detailPath} imageCategory="restaurant" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

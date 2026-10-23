import { useParams } from "react-router-dom";
import RecordDetailPage, { type DetailRecord } from "../components/detail/RecordDetailPage";
import { accommodations } from "../data/secondaryListings";
import { getImageSet } from "../data/imageCatalog";
import { useLanguage } from "../i18n/useLanguage";
import { translateRecordText } from "../i18n/contentTranslations";

export default function AccommodationDetailPage() {
  const { language } = useLanguage();
  const { accommodationId } = useParams<{ accommodationId: string }>();
  const item = accommodations.find((record) => record.id === accommodationId);
  const record: DetailRecord | undefined = item && { ...item, category: translateRecordText("accommodation", item.id, "category", item.category, language), location: translateRecordText("accommodation", item.id, "location", item.location, language), description: translateRecordText("accommodation", item.id, "description", item.description, language), address: translateRecordText("accommodation", item.id, "address", item.address, language), phone: item.phone, status: translateRecordText("accommodation", item.id, "status", item.status, language), hours: translateRecordText("accommodation", item.id, "hours", item.hours, language), price: translateRecordText("accommodation", item.id, "price", item.price, language), services: item.services?.map((value) => translateRecordText("accommodation", item.id, "services", value, language)), imageSet: getImageSet("accommodation", item.id, [item.image ?? "", ...(item.images ?? [])]) };
  const related = item ? accommodations.filter((entry) => entry.id !== item.id).slice(0, 4).map((entry) => ({ id: entry.id, name: entry.name, category: translateRecordText("accommodation", entry.id, "category", entry.category, language), location: translateRecordText("accommodation", entry.id, "location", entry.location, language), imageSet: getImageSet("accommodation", entry.id, [entry.image ?? "", ...(entry.images ?? [])]), to: `/hospedajes/${entry.id}` })) : [];
  return <RecordDetailPage record={record} related={related} moduleName="Hospedajes" detailTitle="Hospedaje" backTo="/hospedajes" imageCategory="accommodation" summary={{ rating: record?.rating?.toFixed(1), price: record?.price, hours: record?.hours }} />;
}

interface PlaceholderPageProps {
  title: string;
  description: string;
}


function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const { t } = useLanguage();
  return (
    <main className="page-card">
      <p className="eyebrow">{t("module")}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}


export default PlaceholderPage;
import { useLanguage } from "../i18n/useLanguage";

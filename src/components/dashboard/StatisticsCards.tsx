import { touristPlaces } from "../../data/touristPlaces";
import { accommodations, restaurants } from "../../data/secondaryListings";
import { useLanguage } from "../../i18n/useLanguage";
import type { ReactNode } from "react";

type StatisticIconName = "places" | "bed" | "food" | "alert";

function StatisticIcon({ name }: { name: StatisticIconName }) {
  const paths = {
    places: <path d="M12 21s6-5.17 6-11A6 6 0 0 0 6 10c0 5.83 6 11 6 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />,
    bed: <><path d="M3 18v-6.5A2.5 2.5 0 0 1 5.5 9h13A2.5 2.5 0 0 1 21 11.5V18M3 15h18M6 9V6h4a2 2 0 0 1 2 2v1" /><path d="M3 18v2m18-2v2" /></>,
    food: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M14 3v6h3" /></>,
    alert: <><path d="m12 3 9 16H3L12 3Z" /><path d="M12 9v4m0 3h.01" /></>,
  } satisfies Record<StatisticIconName, ReactNode>;

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function StatisticsCards() {
  const { t } = useLanguage();
  const countActive = (records: Array<{ estado?: string; status?: string }>) =>
    records.filter((record) => (record.estado ?? record.status)?.toUpperCase() === "ACTIVO").length;

  const activePlaces = countActive(touristPlaces);
  const activeAccommodations = countActive(accommodations);
  const activeRestaurants = countActive(restaurants);

  const statistics = [
    { id: "places", title: t("touristPlaces"), value: touristPlaces.length, active: activePlaces, icon: "places" as const, detail: "Registros disponibles" },
    { id: "accommodations", title: t("accommodations"), value: accommodations.length, active: activeAccommodations, icon: "bed" as const, detail: "Opciones registradas" },
    { id: "restaurants", title: t("restaurants"), value: restaurants.length, active: activeRestaurants, icon: "food" as const, detail: "Sabores locales" },
    { id: "emergencies", title: t("emergencies"), value: null, active: null, icon: "alert" as const, detail: "Sin registros conectados" },
  ];

  return (
    <section className="statistics-grid" aria-label={t("dashboardStatistics")}>
      {statistics.map((statistic) => (
        <article key={statistic.id} className={`statistic-card statistic-card--${statistic.id}`}>
          <div className="statistic-card__icon"><StatisticIcon name={statistic.icon} /></div>
          <div className="statistic-card__content">
            <p className="statistic-card__title">{statistic.title}</p>
            <strong className="statistic-card__value">{statistic.value ?? "—"}</strong>
            <div className="statistic-card__footer">
              <span>{statistic.active == null ? statistic.detail : `${t("active")}: ${statistic.active}`}</span><i aria-hidden="true" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default StatisticsCards;

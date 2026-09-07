import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { touristHeroImages } from "../../data/touristImages";
import { useLanguage } from "../../i18n/useLanguage";

const AUTO_ADVANCE_DELAY = 5_000;
const INTERACTION_PAUSE_DELAY = 10_000;

// Carrusel con fotografías reales de atractivos turísticos de Sucre.
const heroImages = touristHeroImages;

type HeroIconName = "sun" | "location" | "calendar";

function HeroIcon({ name }: { name: HeroIconName }) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    location: <><path d="M20 10c0 5.25-8 12-8 12S4 15.25 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  } satisfies Record<HeroIconName, ReactNode>;

  return <svg className="tourism-hero__info-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function TourismHero() {
  const { language, t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(language === "es" ? "es-BO" : "en-US", { dateStyle: "long" }),
    [language],
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(language === "es" ? "es-BO" : "en-US", { hour: "numeric", minute: "2-digit" }),
    [language],
  );

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, AUTO_ADVANCE_DELAY);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      return undefined;
    }

    const resumeTimer = window.setTimeout(() => setIsPaused(false), INTERACTION_PAUSE_DELAY);
    return () => window.clearTimeout(resumeTimer);
  }, [isPaused]);

  const selectImage = (index: number) => {
    setActiveImage(index);
    setIsPaused(true);
  };

  return (
    <section className="tourism-hero" aria-labelledby="tourism-hero-title">
      <div className="tourism-hero__images" aria-hidden="true">
        {heroImages.map((image, index) => (
          <img
            key={image}
            className={`tourism-hero__image${index === activeImage ? " tourism-hero__image--active" : ""}`}
            src={image}
            alt=""
          />
        ))}
      </div>
      <div className="tourism-hero__overlay" />

      <div className="tourism-hero__content">
        <p className="tourism-hero__kicker">{t("heroKicker")}</p>
        <h2 id="tourism-hero-title">{t("heroTitleLineOne")}<br />{t("heroTitleLineTwo")}</h2>
        <p className="tourism-hero__description">{t("heroDescription")}</p>

        <div className="tourism-hero__information" aria-label={t("heroInformation")}>
          <div className="tourism-hero__info-card">
            <HeroIcon name="sun" />
            <div><strong>22°C</strong><span>{t("sunny")}</span></div>
          </div>
          <div className="tourism-hero__info-card">
            <HeroIcon name="location" />
            <div><strong>{t("sucreLocation")}</strong><span>{t("altitude")}</span></div>
          </div>
          <div className="tourism-hero__info-card">
            <HeroIcon name="calendar" />
            <div><strong>{dateFormatter.format(now)}</strong><span>{timeFormatter.format(now)}</span></div>
          </div>
        </div>

        <Link className="tourism-hero__cta" to="/lugares-turisticos">
          {t("exploreSucre")} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="tourism-hero__indicators" role="tablist" aria-label={t("heroSlides")}>
        {heroImages.map((image, index) => (
          <button
            key={image}
            className={`tourism-hero__indicator${index === activeImage ? " tourism-hero__indicator--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={index === activeImage}
            aria-label={`${t("heroSlide")} ${index + 1}`}
            onClick={() => selectImage(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default TourismHero;

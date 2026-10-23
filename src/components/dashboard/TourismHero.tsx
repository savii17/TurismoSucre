import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { touristHeroImages } from "../../data/touristImages";
import { useLanguage } from "../../i18n/useLanguage";
import ImageWithFallback from "../ImageWithFallback";
import { getImageSet } from "../../data/imageCatalog";

const AUTO_ADVANCE_DELAY = 5_000;
const INTERACTION_PAUSE_DELAY = 10_000;

// Carrusel con fotografías reales de atractivos turísticos de Sucre.
const heroImages = touristHeroImages;
const heroPlaceIds = ["casa-de-la-libertad", "parque-cretacico", "la-recoleta", "castillo-de-la-glorieta"];
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=-19.0475&longitude=-65.26&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FLa_Paz&temperature_unit=celsius&wind_speed_unit=kmh";

type CurrentWeather = { temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; weather_code: number; wind_speed_10m: number };

function weatherDescription(code: number, language: "es" | "en") {
  const descriptions: Record<number, [string, string]> = {
    0: ["Despejado", "Clear"], 1: ["Mayormente despejado", "Mainly clear"], 2: ["Parcialmente nublado", "Partly cloudy"], 3: ["Nublado", "Overcast"],
    45: ["Niebla", "Fog"], 48: ["Niebla con escarcha", "Rime fog"], 51: ["Llovizna ligera", "Light drizzle"], 53: ["Llovizna", "Drizzle"], 55: ["Llovizna intensa", "Dense drizzle"],
    61: ["Lluvia ligera", "Light rain"], 63: ["Lluvia", "Rain"], 65: ["Lluvia intensa", "Heavy rain"], 71: ["Nevada ligera", "Light snow"], 73: ["Nevada", "Snow"], 75: ["Nevada intensa", "Heavy snow"],
    80: ["Chubascos ligeros", "Light showers"], 81: ["Chubascos", "Rain showers"], 82: ["Chubascos intensos", "Heavy showers"], 95: ["Tormenta", "Thunderstorm"], 96: ["Tormenta con granizo", "Thunderstorm with hail"], 99: ["Tormenta intensa con granizo", "Heavy thunderstorm with hail"],
  };
  const description = descriptions[code] ?? ["Condiciones variables", "Variable conditions"];
  return description[language === "es" ? 0 : 1];
}

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
  const [weather, setWeather] = useState<CurrentWeather | null>(null);

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
    const controller = new AbortController();
    fetch(weatherApiUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Weather request failed");
        return response.json() as Promise<{ current?: CurrentWeather }>;
      })
      .then((data) => {
        const current = data.current;
        if (current && Number.isFinite(current.temperature_2m) && Number.isFinite(current.weather_code)) setWeather(current);
      })
      .catch(() => undefined);
    return () => controller.abort();
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
          <ImageWithFallback
            key={image}
            imageSet={getImageSet("tourist-place", heroPlaceIds[index], [image])}
            category="tourist-place"
            className={`tourism-hero__image${index === activeImage ? " tourism-hero__image--active" : ""}`}
            imageClassName="tourism-hero__image-source"
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
            <div className="tourism-hero__weather">{weather ? <><strong>{Math.round(weather.temperature_2m)}°C</strong><span>{weatherDescription(weather.weather_code, language)}</span><small>{language === "es" ? `Sensación ${Math.round(weather.apparent_temperature)}° · Humedad ${weather.relative_humidity_2m}% · Viento ${Math.round(weather.wind_speed_10m)} km/h` : `Feels like ${Math.round(weather.apparent_temperature)}° · Humidity ${weather.relative_humidity_2m}% · Wind ${Math.round(weather.wind_speed_10m)} km/h`}</small></> : <><strong>{language === "es" ? "Clima de Sucre" : "Sucre weather"}</strong><a href={weatherApiUrl} target="_blank" rel="noreferrer">{language === "es" ? "Consultar condiciones actuales" : "Check current conditions"}</a></>}</div>
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

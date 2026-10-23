import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";

type Props = {
  latitude?: number;
  longitude?: number;
  name: string;
  address?: string;
  allowAddressSearch?: boolean;
};

export default function LocationMap({ latitude, longitude, name, address, allowAddressSearch = true }: Props) {
  const [routeMessage, setRouteMessage] = useState("");
  const { language } = useLanguage();
  const hasCoordinates = typeof latitude === "number" && Number.isFinite(latitude) && Math.abs(latitude) <= 90 &&
    typeof longitude === "number" && Number.isFinite(longitude) && Math.abs(longitude) <= 180;
  const destination = hasCoordinates ? `${latitude},${longitude}` : "";
  const mapEmbed = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.008}%2C${latitude - 0.006}%2C${longitude + 0.008}%2C${latitude + 0.006}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : undefined;
  const fallbackRoute = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
    : undefined;
  const locationSuffix = [
    address?.toLocaleLowerCase().includes("sucre") ? undefined : "Sucre",
    address?.toLocaleLowerCase().includes("bolivia") ? undefined : "Bolivia",
  ].filter(Boolean).join(", ");
  const searchUrl = allowAddressSearch && (name.trim() || address?.trim())
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name.trim(), address?.trim(), locationSuffix].filter(Boolean).join(", "))}`
    : undefined;
  const text = language === "en" ? {
    map: "Location", notVerified: address ? (allowAddressSearch ? "Coordinates are unavailable. Search this place in Google Maps." : "The venue or route varies; check the announcement for this edition.") : "Location is currently unavailable.",
    directions: "Get directions", search: "Search address in Google Maps", denied: "Your location was unavailable. Opening directions to the destination.",
    geolocationError: "Could not access your location. Opening directions to the destination.", noAddress: address ? "The venue or route varies; check the announced location for this edition." : "Location is currently unavailable.",
  } : {
    map: "Ubicación", notVerified: address ? (allowAddressSearch ? "Ubicación no disponible actualmente en el mapa. Puedes buscarla en Google Maps." : "La sede o el recorrido varía; consulta el anuncio de esta edición.") : "Ubicación no disponible actualmente.",
    directions: "Cómo llegar", search: "🔎 Buscar en Google Maps", denied: "No se pudo obtener tu ubicación. Abrimos la ruta al destino.",
    geolocationError: "No se pudo acceder a tu ubicación. Abrimos la ruta al destino.", noAddress: address ? "La sede o el recorrido varía; consulta la ubicación anunciada para esta edición." : "Ubicación no disponible actualmente.",
  };

  const openRoute = () => {
    if (!fallbackRoute || !hasCoordinates) return;
    const routeTab = window.open("about:blank", "_blank");
    const navigateToRoute = (url: string) => {
      if (routeTab && !routeTab.closed) {
        routeTab.opener = null;
        routeTab.location.href = url;
      } else {
        window.location.assign(url);
      }
    };

    if (!navigator.geolocation) {
      navigateToRoute(fallbackRoute);
      return;
    }

    setRouteMessage("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const routeWithOrigin = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
        navigateToRoute(routeWithOrigin);
      },
      (error) => {
        setRouteMessage(error.code === error.PERMISSION_DENIED ? text.denied : text.geolocationError);
        navigateToRoute(fallbackRoute);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

  return <section className="location-map" aria-label={`${text.map}: ${name}`}>
    <div className="location-map__heading"><span className="location-map__pin" aria-hidden="true">⌖</span><div><h3>{text.map}</h3><strong>{name}</strong>{address && <p>{address}</p>}</div></div>
    {mapEmbed
      ? <iframe className="location-map__frame" title={`${text.map}: ${name}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer" />
      : <div className="location-map__unverified"><p>{text.notVerified}</p></div>}
    <div className="location-map__actions">
      {fallbackRoute
        ? <button className="location-map__directions" type="button" onClick={openRoute}><span aria-hidden="true">➤</span>{text.directions}</button>
        : allowAddressSearch && searchUrl
          ? <a className="location-map__search" href={searchUrl} target="_blank" rel="noreferrer">{text.search}<span aria-hidden="true">↗</span></a>
          : <span className="location-map__pending">{text.noAddress}</span>}
    </div>
    {routeMessage && <p className="location-map__message" role="status" aria-live="polite">{routeMessage}</p>}
  </section>;
}

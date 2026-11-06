import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "../../i18n/useLanguage";

type Result = { lat: string; lon: string; display_name: string; type?: string };
type Props = { value: string; latitude?: number; longitude?: number; onChange: (value: string, latitude?: number, longitude?: number) => void; label?: string };
let lastSearchAt = 0;

export default function LocationSearchField({ value, latitude, longitude, onChange, label = "Buscar ubicación" }: Props) {
  const { tx } = useLanguage();
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setMessage(""); setResults([]);
    try {
      const wait = Math.max(0, 1000 - (Date.now() - lastSearchAt));
      if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait));
      const params = new URLSearchParams({ q: `${query.trim()}, Sucre, Bolivia`, format: "jsonv2", addressdetails: "1", limit: "5", countrycodes: "bo", viewbox: "-65.4,-18.8,-64.8,-19.3", bounded: "1" });
      lastSearchAt = Date.now();
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("service");
      const data = await response.json() as Result[];
      const sucreResults = data.filter((item) => /sucre|chuquisaca/i.test(item.display_name));
      setResults(sucreResults);
      if (!sucreResults.length) setMessage(tx("No se encontraron coincidencias confiables en Sucre, Bolivia. Prueba con una dirección más específica."));
    } catch { setMessage(tx("El servicio de búsqueda no está disponible. Inténtalo nuevamente.")); }
    finally { setLoading(false); }
  };
  const select = (result: Result) => {
    const lat = Number(result.lat), lon = Number(result.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    setQuery(result.display_name); onChange(result.display_name, lat, lon); setResults([]); setMessage(tx("Ubicación seleccionada."));
  };
  return <div className="location-search-field">
    <form onSubmit={search} className="location-search-field__form"><label>{tx(label)}<div><input value={query} onChange={(e) => { setQuery(e.target.value); onChange(e.target.value, undefined, undefined); }} placeholder={tx("Nombre, calle o dirección en Sucre")} /><button type="submit" disabled={loading}>{loading ? tx("Buscando…") : tx("Buscar")}</button></div></label></form>
    {message && <small role="status">{message}</small>}
    {results.length > 0 && <ul className="location-search-field__results">{results.map((item, index) => <li key={`${item.lat}-${item.lon}-${index}`}><button type="button" onClick={() => select(item)}>{item.display_name}</button></li>)}</ul>}
    {latitude != null && longitude != null ? <div className="location-search-field__preview"><iframe title={tx("Vista previa de ubicación")} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.003}%2C${latitude - 0.003}%2C${longitude + 0.003}%2C${latitude + 0.003}&layer=mapnik&marker=${latitude}%2C${longitude}`} /><small>{latitude.toFixed(6)}, {longitude.toFixed(6)}</small></div> : <small>{tx("Selecciona un resultado para guardar coordenadas verificadas. No se asignará una ubicación automática sin coincidencia.")}</small>}
  </div>;
}

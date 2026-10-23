import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export type MappableListing = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  href?: string;
};

type Props = { title: string; items: MappableListing[]; className?: string };
type Point = MappableListing & { latitude: number; longitude: number; x: number; y: number };
type Tile = { x: number; y: number; left: number; top: number };

const TILE_SIZE = 256;
const MAP_HEIGHT = 270;
const clampLatitude = (value: number) => Math.max(-85.05112878, Math.min(85.05112878, value));
const toWorld = (latitude: number, longitude: number, zoom: number) => {
  const scale = TILE_SIZE * 2 ** zoom;
  const lat = clampLatitude(latitude) * Math.PI / 180;
  return {
    x: (longitude + 180) / 360 * scale,
    y: (1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2 * scale,
  };
};

export default function CategoryLocationMap({ title, items, className = "" }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 720, height: MAP_HEIGHT });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mappedItems = useMemo(() => items.filter((item): item is MappableListing & { latitude: number; longitude: number } =>
    Number.isFinite(item.latitude) && Math.abs(item.latitude!) <= 90 && Number.isFinite(item.longitude) && Math.abs(item.longitude!) <= 180), [items]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: Math.max(260, entry.contentRect.width), height: MAP_HEIGHT });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const map = useMemo(() => {
    if (!mappedItems.length) return undefined;
    let zoom = 11;
    let center = { x: 0, y: 0 };
    for (let candidate = 17; candidate >= 11; candidate -= 1) {
      const positions = mappedItems.map((item) => toWorld(item.latitude, item.longitude, candidate));
      const minX = Math.min(...positions.map((point) => point.x));
      const maxX = Math.max(...positions.map((point) => point.x));
      const minY = Math.min(...positions.map((point) => point.y));
      const maxY = Math.max(...positions.map((point) => point.y));
      if (maxX - minX <= size.width * 0.72 && maxY - minY <= size.height * 0.62) {
        zoom = candidate;
        center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        break;
      }
      if (candidate === 11) center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    }
    const left = center.x - size.width / 2;
    const top = center.y - size.height / 2;
    const firstX = Math.floor(left / TILE_SIZE);
    const lastX = Math.floor((left + size.width) / TILE_SIZE);
    const firstY = Math.floor(top / TILE_SIZE);
    const lastY = Math.floor((top + size.height) / TILE_SIZE);
    const tiles: Tile[] = [];
    for (let x = firstX; x <= lastX; x += 1) {
      for (let y = firstY; y <= lastY; y += 1) {
        if (y < 0 || y >= 2 ** zoom) continue;
        tiles.push({ x, y, left: x * TILE_SIZE - left, top: y * TILE_SIZE - top });
      }
    }
    const points: Point[] = mappedItems.map((item) => {
      const position = toWorld(item.latitude, item.longitude, zoom);
      return { ...item, x: position.x - left, y: position.y - top };
    });
    return { zoom, tiles, points };
  }, [mappedItems, size]);

  const selected = map?.points.find((point) => point.id === selectedId);

  return <section className={`category-location-map ${className}`} aria-label={title}>
    <div className="category-location-map__heading"><div><span>🗺️</span><h2>{title}</h2></div><small>{map?.points.length ?? 0} {map?.points.length === 1 ? "marcador" : "marcadores"}</small></div>
    <div className="category-location-map__viewport" ref={viewportRef}>
      {map?.tiles.map((tile) => <img key={`${map.zoom}-${tile.x}-${tile.y}`} className="category-location-map__tile" alt="" draggable="false" loading="lazy" src={`https://tile.openstreetmap.org/${map.zoom}/${tile.x}/${tile.y}.png`} style={{ left: tile.left, top: tile.top }} />)}
      {map?.points.map((point) => <button key={point.id} type="button" className={`category-location-map__marker${selectedId === point.id ? " is-selected" : ""}`} aria-label={`Ver ${point.name} en el mapa`} title={point.name} style={{ left: `${point.x}px`, top: `${point.y}px` }} onClick={() => setSelectedId(selectedId === point.id ? null : point.id)}>📍</button>)}
      {selected && <div className="category-location-map__popup" style={{ left: `${Math.min(Math.max(selected.x, 100), size.width - 100)}px`, top: `${Math.max(8, selected.y - 39)}px` }}>
        <strong>{selected.name}</strong>{selected.href && <Link to={selected.href}>Ver detalles →</Link>}
      </div>}
      <span className="category-location-map__attribution">© OpenStreetMap contributors</span>
    </div>
  </section>;
}

import { authRepository } from "./authRepository";
import { storageService } from "../services/storageService";

export type FavoriteRecord = { id: string; kind: string; name: string; to: string; savedAt: string };
export type VisitRecord = { id: string; kind: string; name: string; visits: number };
const VISITS_KEY = "tourism_public_visits_v1";
const accountKey = () => {
  const user = authRepository.getCurrentUser();
  if (!user || user.rol !== "USUARIO" || user.estado !== "ACTIVO") throw new Error("Esta función requiere una cuenta USUARIO activa.");
  return user.email.toLocaleLowerCase();
};
const favoritesKey = () => `tourism_favorites_${encodeURIComponent(accountKey())}`;

export function publishEventNotification(emails: string[], eventId: string, title: string): void {
  for (const email of emails) {
    const key = `tourism_notifications_${encodeURIComponent(email.toLocaleLowerCase())}`;
    const list = storageService.get<Array<{ id: string; title: string; to: string; read: boolean; createdAt: string }>>(key) ?? [];
    const notification = { id: `event:${eventId}`, title, to: `/eventos/${encodeURIComponent(eventId)}`, read: false, createdAt: new Date().toISOString() };
    storageService.set(key, [notification, ...list.filter((item) => item.id !== notification.id)]);
  }
}

export const personalRepository = {
  listFavorites(): FavoriteRecord[] { return storageService.get<FavoriteRecord[]>(favoritesKey()) ?? []; },
  toggleFavorite(record: Omit<FavoriteRecord, "savedAt">): boolean {
    const list = this.listFavorites();
    const exists = list.some((item) => item.kind === record.kind && item.id === record.id);
    storageService.set(favoritesKey(), exists ? list.filter((item) => item.kind !== record.kind || item.id !== record.id) : [{ ...record, savedAt: new Date().toISOString() }, ...list]);
    return !exists;
  },
  removeFavorite(kind: string, id: string): void { storageService.set(favoritesKey(), this.listFavorites().filter((item) => item.kind !== kind || item.id !== id)); },
  listNotifications() {
    accountKey();
    return storageService.get<Array<{ id: string; title: string; to: string; read: boolean; createdAt: string }>>(`tourism_notifications_${encodeURIComponent(accountKey())}`) ?? [];
  },
  markNotificationsRead(): void {
    const notifications = this.listNotifications().map((item) => ({ ...item, read: true }));
    storageService.set(`tourism_notifications_${encodeURIComponent(accountKey())}`, notifications);
  },
  recordVisit(kind: string, id: string, name: string): void {
    const visits = storageService.get<VisitRecord[]>(VISITS_KEY) ?? [];
    const existing = visits.find((entry) => entry.kind === kind && entry.id === id);
    storageService.set(VISITS_KEY, existing ? visits.map((entry) => entry === existing ? { ...entry, name, visits: entry.visits + 1 } : entry) : [{ kind, id, name, visits: 1 }, ...visits]);
  },
  popularPlaces(): VisitRecord[] { return (storageService.get<VisitRecord[]>(VISITS_KEY) ?? []).filter((item) => item.kind === "tourist-place").sort((a, b) => b.visits - a.visits).slice(0, 5); },
  totalTouristPlaceVisits(): number { return (storageService.get<VisitRecord[]>(VISITS_KEY) ?? []).filter((item) => item.kind === "tourist-place").reduce((total, item) => total + item.visits, 0); },
};

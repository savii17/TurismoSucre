import { authRepository } from "./authRepository";
import { storageService } from "../services/storageService";

export type FavoriteRecord = { id: string; kind: string; name: string; to: string; savedAt: string };
export type VisitRecord = { id: string; kind: string; name: string; visits: number };
export type NotificationRecord = { id: string; recordId?: string; title: string; name?: string; category?: string; to: string; read: boolean; createdAt: string };
const VISITS_KEY = "tourism_public_visits_v1";
const accountKey = () => {
  const user = authRepository.getCurrentUser();
  if (!user || user.rol !== "USUARIO" || user.estado !== "ACTIVO") throw new Error("Esta función requiere una cuenta USUARIO activa.");
  return user.email.toLocaleLowerCase();
};
const favoritesKey = () => `tourism_favorites_${encodeURIComponent(accountKey())}`;

export function publishNewContentNotification(emails: string[], category: string, recordId: string, name: string, to: string): void {
  for (const email of emails) {
    const key = `tourism_notifications_${encodeURIComponent(email.toLocaleLowerCase())}`;
    const list = storageService.get<NotificationRecord[]>(key) ?? [];
    const notification: NotificationRecord = { id: crypto.randomUUID(), recordId, title: "Nueva publicación en TurismoSucre", name, category, to, read: false, createdAt: new Date().toISOString() };
    storageService.set(key, [notification, ...list]);
  }
}

export function claimBrowserNotification(email: string, notificationId: string): boolean {
  const key = `tourism_browser_notification_${encodeURIComponent(email.toLocaleLowerCase())}_${encodeURIComponent(notificationId)}`;
  if (storageService.get<boolean>(key)) return false;
  return storageService.set(key, true);
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
    return storageService.get<NotificationRecord[]>(`tourism_notifications_${encodeURIComponent(accountKey())}`) ?? [];
  },
  unreadNotificationCount(): number { return this.listNotifications().filter((item) => !item.read).length; },
  markNotificationRead(id: string): void {
    const notifications = this.listNotifications().map((item) => item.id === id ? { ...item, read: true } : item);
    storageService.set(`tourism_notifications_${encodeURIComponent(accountKey())}`, notifications);
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

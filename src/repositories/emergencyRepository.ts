import { storageService } from "../services/storageService";
import { emergencyDirectory } from "../data/emergencies";
import type { Emergency, EmergencyInput } from "../types/emergency";

const EMERGENCIES_KEY = "emergencias";
const INITIAL_DIRECTORY_KEY = "emergencias-directorio-inicial-v1";

const readAll = (): Emergency[] => {
  const stored = storageService.get<Emergency[]>(EMERGENCIES_KEY) ?? [];
  if (storageService.get<boolean>(INITIAL_DIRECTORY_KEY)) return stored;

  // One-time migration: append verified entries while preserving existing data.
  const existingNames = new Set(stored.map((item) => item.nombre_lugar.trim().toLocaleLowerCase()));
  const merged = [...stored, ...emergencyDirectory.filter((item) => !existingNames.has(item.nombre_lugar.trim().toLocaleLowerCase()))];
  storageService.set(EMERGENCIES_KEY, merged);
  storageService.set(INITIAL_DIRECTORY_KEY, true);
  return merged;
};
const writeAll = (items: Emergency[]) => storageService.set(EMERGENCIES_KEY, items);

export const emergencyRepository = {
  list: readAll,
  create(input: EmergencyInput): Emergency {
    const item: Emergency = {
      ...input,
      PK_id: crypto.randomUUID(),
      fecha_registro: input.fecha_registro ?? new Date().toISOString(),
    };
    writeAll([item, ...readAll()]);
    return item;
  },
  update(id: string, input: EmergencyInput): Emergency | null {
    let updated: Emergency | null = null;
    writeAll(readAll().map((item) => {
      if (item.PK_id !== id) return item;
      updated = { ...item, ...input, PK_id: item.PK_id, fecha_registro: input.fecha_registro ?? item.fecha_registro };
      return updated;
    }));
    return updated;
  },
  remove(id: string) {
    writeAll(readAll().filter((item) => item.PK_id !== id));
  },
  toggleStatus(id: string): Emergency | null {
    const item = readAll().find((entry) => entry.PK_id === id);
    return item ? this.update(id, { ...item, estado: item.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" }) : null;
  },
};

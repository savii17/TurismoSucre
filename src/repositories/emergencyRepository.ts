import { storageService } from "../services/storageService";
import type { Emergency, EmergencyInput } from "../types/emergency";

const EMERGENCIES_KEY = "emergencias";

const readAll = (): Emergency[] => storageService.get<Emergency[]>(EMERGENCIES_KEY) ?? [];
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

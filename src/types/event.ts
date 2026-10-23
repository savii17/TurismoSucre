export type EventStatus = "PROXIMO" | "EN_CURSO" | "FINALIZADO" | "CANCELADO" | "RECURRENTE";

/** Event view/data shape for the Events section, separate from other catalog records. */
export type EventRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  /** Exact dates are optional for annual traditions whose next edition is not announced. */
  startDate?: string;
  endDate?: string;
  periodicity?: string;
  /** Month number (1-12) used for month-level date filtering, never as an exact event date. */
  usualMonth?: number;
  usualMonthLabel?: string;
  startTime?: string;
  endTime?: string;
  organizer?: string;
  phone?: string;
  price?: string;
  latitude?: number;
  longitude?: number;
  locationVerificationStatus?: "VERIFICADA" | "PENDIENTE_VERIFICACION" | "SIN_SEDE_FIJA";
  locationSourceUrl?: string;
  image?: string;
  status: EventStatus;
  source: string;
};

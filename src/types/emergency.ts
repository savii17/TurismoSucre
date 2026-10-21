export type EmergencyStatus = "ACTIVO" | "INACTIVO";

export type Emergency = {
  PK_id: string;
  nombre_lugar: string;
  ubicacion: string;
  latitud?: number;
  longitud?: number;
  descripcion: string;
  telefono: string;
  telefono_emergencia?: string;
  horario?: string;
  atencion_24_horas?: boolean;
  servicios?: string[];
  institucion?: string;
  sitio_web?: string;
  fuente_url?: string;
  fuente_secundaria_url?: string;
  tipo: string;
  registrado_por: string;
  estado: EmergencyStatus;
  fecha_registro: string;
};

export type EmergencyInput = Omit<Emergency, "PK_id" | "fecha_registro"> & {
  fecha_registro?: string;
};

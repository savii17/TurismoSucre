export type EmergencyStatus = "ACTIVO" | "INACTIVO";

export type Emergency = {
  PK_id: string;
  nombre_lugar: string;
  ubicacion: string;
  latitud?: number;
  longitud?: number;
  descripcion: string;
  telefono: string;
  tipo: string;
  registrado_por: string;
  estado: EmergencyStatus;
  fecha_registro: string;
};

export type EmergencyInput = Omit<Emergency, "PK_id" | "fecha_registro"> & {
  fecha_registro?: string;
};

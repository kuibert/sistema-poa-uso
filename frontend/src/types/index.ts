// ===============================
//      TIPOS PARA SEGUIMIENTO
// ===============================
export interface MesSeguimiento {
  mes: number;
  estado: string; // "-", "P", "I", "F"
  comentario?: string;
}

// ===============================
//      TIPOS PARA INDICADORES
// ===============================
export interface Indicador {
  id_indicador: number;
  nombre: string;

  // Estos dos campos se agregan porque tus componentes los usan:
  descripcion: string;
  categoria: string;

  meta: number;
  unidad_medida: string;
  valor_logrado: number;
  porcentaje_cumplimiento: number;

  beneficiarios_directos?: number;
  beneficiarios_indirectos?: number;
}

// ===============================
//      TIPOS PARA GASTOS
// ===============================
export interface Gasto {
  id_gasto: number;
  fecha_gasto: string;
  descripcion: string;
  monto: number;
  registrado_por_nombre?: string;
}

// ===============================
//      TIPOS PARA EVIDENCIAS
// ===============================
export interface Evidencia {
  id_evidencia: number;
  tipo_evidencia: string;
  descripcion: string;
  ruta_archivo: string;
  fecha_subida: string;
  subido_por_nombre?: string;
}

// ===============================
//      TIPO ACTIVIDAD
// ===============================
export interface Actividad {
  id_actividad: number;
  nombre: string;

  seguimiento_mensual?: MesSeguimiento[];

  indicadores?: Indicador[];

  gastos?: Gasto[];

  evidencias?: Evidencia[];
}

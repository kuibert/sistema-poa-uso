<<<<<<< HEAD
// Tipos del dominio POA

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol_sistema: 'ADMIN' | 'USUARIO';
  activo: boolean;
}

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  objetivo: string;
  unidad_responsable: string;
  id_responsable: number;
  anio: number;
  fecha_inicio: string;
  fecha_fin: string;
  presupuesto_total: number;
  estado: 'PLANIFICACION' | 'EN_EJECUCION' | 'FINALIZADO' | 'CANCELADO';
  responsable_nombre?: string;
  total_actividades?: number;
  total_gastado?: number;
}

export interface Actividad {
  id_actividad: number;
  id_proyecto: number;
  nombre: string;
  descripcion?: string;
  id_responsable: number;
  presupuesto_asignado: number;
  orden: number;
  responsable_nombre?: string;
  plan_mensual?: MesPlan[];
  seguimiento_mensual?: MesSeguimiento[];
  indicadores?: Indicador[];
  total_gastado?: number;
}

export interface MesPlan {
  mes: number;
  planificado: boolean;
}

export interface MesSeguimiento {
  mes: number;
  estado: '-' | 'P' | 'I' | 'F';
  comentario?: string;
}

export interface Indicador {
  id_indicador: number;
  id_actividad: number;
  nombre: string;
  unidad_medida: string;
  meta: number;
  valor_logrado: number;
  porcentaje_cumplimiento: number;
=======
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

>>>>>>> origin/DevGabriela
  beneficiarios_directos?: number;
  beneficiarios_indirectos?: number;
}

<<<<<<< HEAD
export interface Gasto {
  id_gasto: number;
  id_actividad: number;
  fecha_gasto: string;
  descripcion: string;
  monto: number;
  id_registrado_por: number;
  registrado_por_nombre?: string;
}

export interface Evidencia {
  id_evidencia: number;
  id_actividad: number;
=======
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
>>>>>>> origin/DevGabriela
  tipo_evidencia: string;
  descripcion: string;
  ruta_archivo: string;
  fecha_subida: string;
<<<<<<< HEAD
  id_subido_por: number;
  subido_por_nombre?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
=======
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
>>>>>>> origin/DevGabriela
}

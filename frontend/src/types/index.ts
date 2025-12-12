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
  gastos?: Gasto[];
  evidencias?: Evidencia[];
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
  descripcion?: string;
  categoria?: string;
  unidad_medida: string;
  meta: number;
  valor_logrado: number;
  porcentaje_cumplimiento: number;
  beneficiarios_directos?: number;
  beneficiarios_indirectos?: number;
}

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
  tipo_evidencia: string;
  descripcion: string;
  ruta_archivo: string;
  fecha_subida: string;
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
}

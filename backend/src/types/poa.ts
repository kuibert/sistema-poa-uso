export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol_sistema: 'ADMIN' | 'USUARIO';
  activo: boolean;
  fecha_creacion: Date;
}

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  objetivo: string;
  unidad_responsable: string;
  id_responsable: number;
  anio: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  presupuesto_total: number;
  estado: 'PLANIFICACION' | 'EN_EJECUCION' | 'FINALIZADO' | 'CANCELADO';
  fecha_creacion: Date;
}

export interface Actividad {
  id_actividad: number;
  id_proyecto: number;
  nombre: string;
  descripcion?: string;
  id_responsable: number;
  presupuesto_asignado: number;
  orden: number;
  fecha_creacion: Date;
}

export interface ActividadMesPlan {
  id_plan: number;
  id_actividad: number;
  mes: number;
  planificado: boolean;
}

export interface ActividadMesSeguimiento {
  id_seguimiento: number;
  id_actividad: number;
  mes: number;
  estado: '-' | 'P' | 'I' | 'F';
  comentario?: string;
  fecha_actualizacion: Date;
}

export interface IndicadorActividad {
  id_indicador: number;
  id_actividad: number;
  nombre: string;
  unidad_medida: string;
  meta: number;
  valor_logrado: number;
  porcentaje_cumplimiento: number;
  beneficiarios_directos?: number;
  beneficiarios_indirectos?: number;
}

export interface CostoProyecto {
  id_costo: number;
  id_proyecto: number;
  tipo_costo: string;
  descripcion: string;
  monto: number;
  categoria: 'FIJO' | 'VARIABLE';
}

export interface GastoActividad {
  id_gasto: number;
  id_actividad: number;
  fecha_gasto: Date;
  descripcion: string;
  monto: number;
  id_registrado_por: number;
  fecha_registro: Date;
}

export interface EvidenciaActividad {
  id_evidencia: number;
  id_actividad: number;
  tipo_evidencia: string;
  descripcion: string;
  ruta_archivo: string;
  fecha_subida: Date;
  id_subido_por: number;
}

export interface ProyectoUsuarioRol {
  id_asignacion: number;
  id_proyecto: number;
  id_usuario: number;
  rol: 'OWNER' | 'EDITOR' | 'VIEWER';
  fecha_asignacion: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

import apiClient from './apiClient';
import { Proyecto, Actividad, Gasto, Evidencia, Indicador, MesPlan, MesSeguimiento } from '@/types';

export const poaApi = {
  // ==================== DASHBOARD (Page0) ====================
  getDashboard: (anio: number) =>
    apiClient.get(`/proyectos/dashboard?anio=${anio}`),

  getProyectos: (anio: number) =>
    apiClient.get<Proyecto[]>(`/proyectos?anio=${anio}`),

  // ==================== PLANIFICACIÓN (Page1) ====================

  // Proyectos
  crearProyecto: (data: Partial<Proyecto>) =>
    apiClient.post<Proyecto>('/proyectos', data),

  getProyecto: (id: number) =>
    apiClient.get<Proyecto>(`/proyectos/${id}`),

  updateProyecto: (id: number, data: Partial<Proyecto>) =>
    apiClient.put<Proyecto>(`/proyectos/${id}`, data),

  deleteProyecto: (id: number) =>
    apiClient.delete(`/proyectos/${id}`),

  getReporte: (id: number) =>
    apiClient.get<any>(`/proyectos/${id}/reporte`),

  // Actividades
  crearActividad: (proyectoId: number, data: Partial<Actividad>) =>
    apiClient.post<Actividad>(`/proyectos/${proyectoId}/actividades`, data),

  updateActividad: (id: number, data: Partial<Actividad>) =>
    apiClient.put<Actividad>(`/actividades/${id}`, data),

  deleteActividad: (id: number) =>
    apiClient.delete(`/actividades/${id}`),

  // Planificación mensual
  updatePlanMensual: (actividadId: number, meses: MesPlan[]) =>
    apiClient.put(`/proyectos/actividades/${actividadId}/plan-mensual`, { meses }),

  // Indicadores
  crearIndicador: (actividadId: number, data: Partial<Indicador>) =>
    apiClient.post<Indicador>(`/proyectos/actividades/${actividadId}/indicadores`, data),

  updateIndicador: (id: number, data: Partial<Indicador>) =>
    apiClient.put<Indicador>(`/proyectos/indicadores/${id}`, data),

  deleteIndicador: (id: number) =>
    apiClient.delete(`/proyectos/indicadores/${id}`),

  // Costos
  crearCosto: (proyectoId: number, data: any) =>
    apiClient.post(`/proyectos/${proyectoId}/costos`, data),

  updateCosto: (id: number, data: any) =>
    apiClient.put(`/proyectos/costos/${id}`, data),

  deleteCosto: (id: number) =>
    apiClient.delete(`/proyectos/costos/${id}`),

  // ==================== SEGUIMIENTO (Page2) ====================

  getSeguimiento: (proyectoId: number) =>
    apiClient.get<any>(`/proyectos/${proyectoId}/seguimiento`),

  getActividadSeguimiento: (actividadId: number) =>
    apiClient.get<Actividad>(`/proyectos/actividades/${actividadId}/seguimiento`),

  updateSeguimientoMensual: (actividadId: number, seguimiento: MesSeguimiento[]) =>
    apiClient.put(`/proyectos/actividades/${actividadId}/seguimiento-mensual`, { seguimiento }),

  updateAvanceIndicador: (indicadorId: number, data: { valor_logrado: number; porcentaje_cumplimiento: number }) =>
    apiClient.put<Indicador>(`/proyectos/indicadores/${indicadorId}/avance`, data),

  // ==================== GASTOS ====================

  getGastos: (actividadId: number) =>
    apiClient.get<Gasto[]>(`/actividades/${actividadId}/gastos`),

  crearGasto: (actividadId: number, data: Partial<Gasto>) =>
    apiClient.post<Gasto>(`/actividades/${actividadId}/gastos`, data),

  updateGasto: (id: number, data: Partial<Gasto>) =>
    apiClient.put<Gasto>(`/gastos/${id}`, data),

  deleteGasto: (id: number) =>
    apiClient.delete(`/gastos/${id}`),

  // ==================== EVIDENCIAS ====================

  getEvidencias: (actividadId: number) =>
    apiClient.get<Evidencia[]>(`/actividades/${actividadId}/evidencias`),

  subirEvidencia: (actividadId: number, formData: FormData) =>
    apiClient.post<Evidencia>(`/actividades/${actividadId}/evidencias`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  deleteEvidencia: (id: number) =>
    apiClient.delete(`/evidencias/${id}`),

  // ==================== PERMISOS ====================

  getPermisos: (proyectoId: number) =>
    apiClient.get(`/proyectos/${proyectoId}/permisos`),

  agregarPermiso: (proyectoId: number, data: { id_usuario: number; rol: string }) =>
    apiClient.post(`/proyectos/${proyectoId}/permisos`, data),

  updatePermiso: (proyectoId: number, userId: number, rol: string) =>
    apiClient.put(`/proyectos/${proyectoId}/permisos/${userId}`, { rol }),

  deletePermiso: (proyectoId: number, userId: number) =>
    apiClient.delete(`/proyectos/${proyectoId}/permisos/${userId}`)
};

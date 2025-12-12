import apiClient from './apiClient';
import { Proyecto, Actividad, Gasto, Evidencia, Indicador, MesPlan, MesSeguimiento } from '@/types';

export const poaApi = {
  // ==================== DASHBOARD (Page0) ====================
  getDashboard: (anio: number) =>
    apiClient.get(`/api/proyectos/dashboard?anio=${anio}`),

  getProyectos: (anio: number) =>
    apiClient.get<Proyecto[]>(`/api/proyectos?anio=${anio}`),

  // ==================== PLANIFICACIÓN (Page1) ====================

  // Proyectos
  crearProyecto: (data: Partial<Proyecto>) =>
    apiClient.post<Proyecto>('/api/proyectos', data),

  getProyecto: (id: number) =>
    apiClient.get<Proyecto>(`/api/proyectos/${id}`),

  updateProyecto: (id: number, data: Partial<Proyecto>) =>
    apiClient.put<Proyecto>(`/api/proyectos/${id}`, data),

  deleteProyecto: (id: number) =>
    apiClient.delete(`/api/proyectos/${id}`),

  // Actividades
  crearActividad: (proyectoId: number, data: Partial<Actividad>) =>
    apiClient.post<Actividad>(`/api/proyectos/${proyectoId}/actividades`, data),

  updateActividad: (id: number, data: Partial<Actividad>) =>
    apiClient.put<Actividad>(`/api/actividades/${id}`, data),

  deleteActividad: (id: number) =>
    apiClient.delete(`/api/actividades/${id}`),

  // Planificación mensual
  updatePlanMensual: (actividadId: number, meses: MesPlan[]) =>
    apiClient.put(`/api/proyectos/actividades/${actividadId}/plan-mensual`, { meses }),

  // Indicadores
  crearIndicador: (actividadId: number, data: Partial<Indicador>) =>
    apiClient.post<Indicador>(`/api/proyectos/actividades/${actividadId}/indicadores`, data),

  updateIndicador: (id: number, data: Partial<Indicador>) =>
    apiClient.put<Indicador>(`/api/proyectos/indicadores/${id}`, data),

  deleteIndicador: (id: number) =>
    apiClient.delete(`/api/proyectos/indicadores/${id}`),

  // Costos
  crearCosto: (proyectoId: number, data: any) =>
    apiClient.post(`/api/proyectos/${proyectoId}/costos`, data),

  updateCosto: (id: number, data: any) =>
    apiClient.put(`/api/proyectos/costos/${id}`, data),

  deleteCosto: (id: number) =>
    apiClient.delete(`/api/proyectos/costos/${id}`),

  // ==================== SEGUIMIENTO (Page2) ====================

  getSeguimiento: (proyectoId: number) =>
    apiClient.get<any>(`/api/proyectos/${proyectoId}/seguimiento`),

  getActividadSeguimiento: (actividadId: number) =>
    apiClient.get<Actividad>(`/api/proyectos/actividades/${actividadId}/seguimiento`),

  updateSeguimientoMensual: (actividadId: number, seguimiento: MesSeguimiento[]) =>
    apiClient.put(`/api/proyectos/actividades/${actividadId}/seguimiento-mensual`, { seguimiento }),

  updateAvanceIndicador: (indicadorId: number, data: { valor_logrado: number; porcentaje_cumplimiento: number }) =>
    apiClient.put<Indicador>(`/api/proyectos/indicadores/${indicadorId}/avance`, data),

  // ==================== GASTOS ====================

  getGastos: (actividadId: number) =>
    apiClient.get<Gasto[]>(`/api/actividades/${actividadId}/gastos`),

  crearGasto: (actividadId: number, data: Partial<Gasto>) =>
    apiClient.post<Gasto>(`/api/actividades/${actividadId}/gastos`, data),

  updateGasto: (id: number, data: Partial<Gasto>) =>
    apiClient.put<Gasto>(`/api/gastos/${id}`, data),

  deleteGasto: (id: number) =>
    apiClient.delete(`/api/gastos/${id}`),

  // ==================== EVIDENCIAS ====================

  getEvidencias: (actividadId: number) =>
    apiClient.get<Evidencia[]>(`/api/actividades/${actividadId}/evidencias`),

  subirEvidencia: (actividadId: number, formData: FormData) =>
    apiClient.post<Evidencia>(`/api/actividades/${actividadId}/evidencias`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  deleteEvidencia: (id: number) =>
    apiClient.delete(`/api/evidencias/${id}`),

  // ==================== PERMISOS ====================

  getPermisos: (proyectoId: number) =>
    apiClient.get(`/api/proyectos/${proyectoId}/permisos`),

  agregarPermiso: (proyectoId: number, data: { id_usuario: number; rol: string }) =>
    apiClient.post(`/api/proyectos/${proyectoId}/permisos`, data),

  updatePermiso: (proyectoId: number, userId: number, rol: string) =>
    apiClient.put(`/api/proyectos/${proyectoId}/permisos/${userId}`, { rol }),

  deletePermiso: (proyectoId: number, userId: number) =>
    apiClient.delete(`/api/proyectos/${proyectoId}/permisos/${userId}`)
};

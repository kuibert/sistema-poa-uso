import apiClient from "./apiClient";

export const poaApi = {
  // ==========================
  //    SEGUIMIENTO (PAGE2)
  // ==========================
  getSeguimiento(proyectoId: number) {
    return apiClient.get(`/proyectos/${proyectoId}/seguimiento`);
  },

  updateSeguimientoMensual(actividadId: number, seguimiento: any) {
    return apiClient.put(`/actividades/${actividadId}/seguimiento`, seguimiento);
  },

  // ==========================
  //    GASTOS (gastos.html)
  // ==========================
  getGastos(actividadId: number) {
    return apiClient.get(`/actividades/${actividadId}/gastos`);
  },

  crearGasto(actividadId: number, gasto: any) {
    return apiClient.post(`/actividades/${actividadId}/gastos`, gasto);
  },

  deleteGasto(gastoId: number) {
    return apiClient.delete(`/gastos/${gastoId}`);
  },

  // ==========================
  //    EVIDENCIAS (evidencias.html)
  // ==========================
  getEvidencias(actividadId: number) {
    return apiClient.get(`/actividades/${actividadId}/evidencias`);
  },

  subirEvidencia(actividadId: number, formData: FormData) {
    return apiClient.post(`/actividades/${actividadId}/evidencias`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteEvidencia(evidenciaId: number) {
    return apiClient.delete(`/evidencias/${evidenciaId}`);
  },
};

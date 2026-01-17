import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, LoadingSpinner, ErrorMessage, Select, Input, Button, Modal, FormGroup, ConfirmDialog, PageLayout, Section, Divider, ProgressBar, Grid, Flex, Typography, UserSelectModal } from '../components/common';
import { Status } from '../components/poa';
import { MonthlyGanttView } from '../components/Seguimiento';
import apiClient from '../services/apiClient';

type Actividad = {
  id_actividad: number;
  nombre: string;
  responsable_nombre: string;
  presupuesto_asignado: number;
  total_gastado: number;
  id_responsable?: number;
  cargo_responsable?: string;
  unidad_responsable?: string;
  plan_mensual: { mes: number; planificado: boolean }[] | null;
  seguimiento_mensual: { mes: number; estado: Status }[] | null;
  indicadores: {
    id_indicador: number;
    nombre: string; // descripcion especifica
    unidad_medida: string;
    meta: number;
    valor_logrado: number; // valor actual
    porcentaje_cumplimiento: number;
    // Extra fields if available from backend, otherwise generic
    categoria?: string;
    beneficiarios?: string;
  }[] | null;
};

type ProyectoSeguimiento = {
  id_proyecto: number;
  nombre: string;
  anio: number;
  actividades: Actividad[];
};

export const SeguimientoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Role Logic
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const userRol = user.rol || 'VIEWER';
  const isAdmin = userRol === 'ADMIN';
  const canEdit = userRol === 'ADMIN' || userRol === 'EDITOR'; // Editor or Admin

  // Estados
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [proyectoSel, setProyectoSel] = useState<number>(0);
  const [anio, setAnio] = useState(new Date().getFullYear()); // Year state
  const [seguimiento, setSeguimiento] = useState<ProyectoSeguimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [responsables, setResponsables] = useState<any[]>([]); // New State

  // Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Actividad | null>(null);
  const [editForm, setEditForm] = useState<{
    nombre: string;
    presupuesto: number;
    responsable_nombre: string;
    id_responsable?: number; // New field
    cargo_responsable: string;
    unidad_responsable: string;
  }>({
    nombre: '',
    presupuesto: 0,
    responsable_nombre: '',
    cargo_responsable: '',
    unidad_responsable: ''
  });

  // Confirm Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    action: () => void;
  }>({ title: '', message: '', action: () => { } });

  // Referencias para scroll
  const [targetActivityId, setTargetActivityId] = useState<number | null>(null);
  const activityRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});


  // Cargar lista de proyectos y responsables
  useEffect(() => {
    loadProyectos();
    loadResponsables(); // New fetch
  }, [anio]);

  // Leer Query Params (proyectoId y actividad)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pId = searchParams.get('proyectoId');
    const aId = searchParams.get('actividad');

    if (pId) {
      setProyectoSel(Number(pId));
    } else if (id) {
      setProyectoSel(Number(id));
    }

    if (aId) {
      setTargetActivityId(Number(aId));
    }
  }, [location.search, id]);


  // Cargar seguimiento cuando cambia el proyecto seleccionado
  useEffect(() => {
    if (proyectoSel > 0) {
      loadSeguimiento(proyectoSel);
    }
  }, [proyectoSel]);

  // Efecto para hacer scroll a la actividad seleccionada
  useEffect(() => {
    if (seguimiento && targetActivityId && activityRefs.current[targetActivityId]) {
      // Pequeño timeout para asegurar que el DOM se renderizó
      setTimeout(() => {
        activityRefs.current[targetActivityId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Opcional: Resaltar temporalmente si se desea
      }, 500);
    }
  }, [seguimiento, targetActivityId]);

  const loadProyectos = async () => {
    try {
      const response = await apiClient.get(`/proyectos?anio=${anio}`);
      setProyectos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar proyectos');
      console.error('Error cargando proyectos:', err);
    }
  };

  const loadResponsables = async () => {
    try {
      const response = await apiClient.get('/proyectos/responsables');
      setResponsables(response.data);
    } catch (err: any) {
      console.error('Error cargando responsables:', err);
    }
  };

  const handleEditClick = (act: Actividad) => {
    setEditingActivity(act);
    setEditForm({
      nombre: act.nombre,
      presupuesto: act.presupuesto_asignado,
      responsable_nombre: act.responsable_nombre || '',
      id_responsable: act.id_responsable, // Capture existing ID
      cargo_responsable: act.cargo_responsable || '',
      unidad_responsable: act.unidad_responsable || ''
    });
    setEditModalOpen(true);
  };

  const handleSaveActivity = async () => {
    if (!editingActivity || !seguimiento) return;

    try {
      setSaving(true);
      // Note: We are only updating basic fields here. Responsable ID logic would need a user selector.
      // For now we keep the same responsible ID or generic update if backend supports it.
      await apiClient.put(`/proyectos/actividades/${editingActivity.id_actividad}`, {
        nombre: editForm.nombre,
        presupuesto_asignado: editForm.presupuesto,
        // Send other fields if needed or kept as is
        cargo_responsable: editForm.cargo_responsable,
        unidad_responsable: editForm.unidad_responsable,
        id_responsable: editForm.id_responsable // Send selected ID
      });

      setEditModalOpen(false);
      setEditingActivity(null);
      loadSeguimiento(seguimiento.id_proyecto); // Reload to refresh
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar actividad');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivityClick = (act: Actividad) => {
    setConfirmConfig({
      title: 'Eliminar Actividad',
      message: `¿Estás seguro de eliminar la actividad "${act.nombre}"? Esto borrará también sus gastos y evidencias.`,
      action: () => executeDeleteActivity(act)
    });
    setConfirmOpen(true);
  };

  const executeDeleteActivity = async (act: Actividad) => {
    try {
      setSaving(true);
      await apiClient.delete(`/proyectos/actividades/${act.id_actividad}`);
      if (seguimiento) loadSeguimiento(seguimiento.id_proyecto);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar actividad');
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };

  const handleDeleteProyectoClick = () => {
    if (!seguimiento) return;
    setConfirmConfig({
      title: 'Eliminar Proyecto',
      message: '¿Estás seguro de que quieres eliminar este proyecto y TODAS sus actividades? Esta acción no se puede deshacer.',
      action: () => executeDeleteProyecto()
    });
    setConfirmOpen(true);
  };

  const executeDeleteProyecto = async () => {
    if (!seguimiento) return;
    try {
      setLoading(true);
      await apiClient.delete(`/proyectos/${seguimiento.id_proyecto}`);
      // alert('Proyecto eliminado correctamente'); // Removed to use UI feedback if needed, or just redirect
      setSeguimiento(null);
      setProyectoSel(0);
      loadProyectos(); // Recargar lista
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar proyecto');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const loadSeguimiento = async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/proyectos/${projectId}/seguimiento`);
      setSeguimiento(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar el seguimiento');
      console.error('Error cargando seguimiento:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper para verificar si una actividad está totalmente finalizada (todos los meses planificados están en 'F')
  const isActivityFinalized = (act: Actividad, overrideSeguimiento?: { mes: number; estado: Status }[]) => {
    const planificados = act.plan_mensual?.filter(p => p.planificado) || [];
    if (planificados.length === 0) return false; // Sin plan no cuenta como ejecutada (o definir regla de negocio)

    const actualSeguimiento = overrideSeguimiento || act.seguimiento_mensual || [];

    return planificados.every(p => {
      const seg = actualSeguimiento.find(s => s.mes === p.mes);
      return seg && seg.estado === 'F';
    });
  };

  // Lógica de actualización de estado (Paso 3)
  const actualizarEstadoMes = async (actividadId: number, mes: number, nuevoEstado: Status | undefined) => {
    if (!seguimiento) return;
    try {
      setSaving(true);

      // 1. Calcular nuevo seguimiento para la actividad afectada
      const actividadAfectada = seguimiento.actividades.find(a => a.id_actividad === actividadId);
      if (!actividadAfectada) return;

      let seguimientoActualizado = [...(actividadAfectada.seguimiento_mensual || [])];
      seguimientoActualizado = seguimientoActualizado.filter(s => s.mes !== mes);
      if (nuevoEstado) {
        seguimientoActualizado.push({ mes, estado: nuevoEstado });
      }

      // 2. Crear una proyección de TODAS las actividades con este cambio aplicado
      // Esto es necesario para calcular cuántas ESTARÁN finalizadas globalmente
      const actividadesProyectadas = seguimiento.actividades.map(a =>
        a.id_actividad === actividadId
          ? { ...a, seguimiento_mensual: seguimientoActualizado }
          : a
      );

      // 3. Calcular total de actividades finalizadas globalmente
      const totalActivities = actividadesProyectadas.length;
      const totalFinalizadas = actividadesProyectadas.filter(a => isActivityFinalized(a)).length;

      // 4. Identificar indicadores que deben actualizarse (Categoría: "% de actividades ejecutadas")
      // y preparar sus nuevos valores
      const indicadoresAActualizar: { actId: number; indId: number; valor: number; pct: number }[] = [];

      const actividadesConIndicadoresActualizados = actividadesProyectadas.map(a => {
        if (!a.indicadores) return a;

        const indicadoresNuevos = a.indicadores.map(ind => {
          if (ind.categoria === '% de actividades ejecutadas') {
            // Autocalcular
            // Meta debe ser totalActivities (asegurado desde Page1, pero usamos live count por seguridad)
            // Ojo: si la meta viniera mal, usar el meta guardado o totalActivities?
            // El requerimiento dice que la meta ES el total de actividades.
            const meta = Number(ind.meta) || totalActivities;
            const valor = totalFinalizadas;
            const pct = meta > 0 ? Math.round((valor / meta) * 100) : 0;

            // Guardar para API call side-effect
            if (valor !== ind.valor_logrado) {
              indicadoresAActualizar.push({ actId: a.id_actividad, indId: ind.id_indicador, valor, pct });
            }

            return { ...ind, valor_logrado: valor, porcentaje_cumplimiento: pct };
          }
          return ind;
        });

        return { ...a, indicadores: indicadoresNuevos };
      });

      // 5. Actualizar Estado Local (Optimistic)
      const newSeguimiento = {
        ...seguimiento,
        actividades: actividadesConIndicadoresActualizados
      };
      setSeguimiento(newSeguimiento);

      // 6. Enviar actualizaciones al Backend
      // a) Actualizar mes
      const updateMesPromise = apiClient.put(`/proyectos/actividades/${actividadId}/seguimiento-mensual`, {
        seguimiento: seguimientoActualizado
      });

      // b) Actualizar indicadores afectados
      const updateIndicadoresPromises = indicadoresAActualizar.map(item =>
        apiClient.put(`/proyectos/indicadores/${item.indId}/avance`, {
          valor_logrado: item.valor,
          porcentaje_cumplimiento: item.pct
        })
      );

      await Promise.all([updateMesPromise, ...updateIndicadoresPromises]);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar estado');
      console.error('Error actualizando estado:', err);
      // Revert logic usually required here, simplifying for prototype
    } finally {
      setSaving(false);
    }
  };

  // Lógica de actualización de indicador (Paso 4)
  // Lógica de actualización de indicador (Paso 4)
  const actualizarIndicador = async (actividadId: number, indicadorId: number, valorLogrado: number) => {
    if (!seguimiento) return;

    // Find meta for calculation
    const act = seguimiento.actividades.find(a => a.id_actividad === actividadId);
    const ind = act?.indicadores?.find(i => i.id_indicador === indicadorId);
    const meta = Number(ind?.meta) || 0;
    const porcentaje = meta > 0 ? Math.round((valorLogrado / meta) * 100) : 0;

    try {
      setSaving(true);
      // Optimistic update
      const newSeguimiento = {
        ...seguimiento,
        actividades: seguimiento.actividades.map(a =>
          a.id_actividad === actividadId ? {
            ...a,
            indicadores: (a.indicadores || []).map(ind =>
              ind.id_indicador === indicadorId ? {
                ...ind,
                valor_logrado: valorLogrado,
                porcentaje_cumplimiento: porcentaje
              } : ind
            )
          } : a
        )
      };
      setSeguimiento(newSeguimiento);

      // API Call
      await apiClient.put(`/proyectos/indicadores/${indicadorId}/avance`, {
        valor_logrado: valorLogrado,
        porcentaje_cumplimiento: porcentaje
      });

    } catch (err: any) {
      console.error('Error updating indicator:', err);
    } finally {
      setSaving(false);
    }
  };

  // Lógica de progreso (Paso 3 - HTML Logic)
  const calcularProgreso = (
    seguimientoMensual: { mes: number; estado: Status }[] | null,
    planMensual: { mes: number; planificado: boolean }[] | null
  ) => {
    // 1. Contar total planificados
    const mesesPlanificados = planMensual?.filter(p => p.planificado) || [];
    const totalPlanificados = mesesPlanificados.length;

    if (totalPlanificados === 0) return 0;

    let suma = 0;

    // 2. Iterar sobre lo PLANIFICADO (Base 100%)
    mesesPlanificados.forEach(p => {
      // Buscar si tiene estado reportado para este mes
      const rep = seguimientoMensual?.find(s => s.mes === p.mes);

      if (rep) {
        if (rep.estado === 'F') suma += 1;
        else if (rep.estado === 'I') suma += 0.5;
      }
      // Si no hay reporte o es 'P' o '-', suma 0.
    });

    return Math.round((suma / totalPlanificados) * 100);
  };


  const formatoDinero = (n: number) => `$ ${n.toLocaleString("es-SV", { minimumFractionDigits: 2 })}`;

  // Estilos

  return (
    <PageLayout>
      <Card padding="1.8rem">
        {/* Header */}
        <Flex justify="space-between" align="center" gap="0.8rem" style={{ marginBottom: '0.5rem' }}>
          <Typography variant="h1">Avance por actividad</Typography>
          <Button
            variant="alt"
            size="sm"
            onClick={() => window.print()}
            title="Imprimir tablero"
          >
            🖨 Imprimir tablero
          </Button>
        </Flex>
        <Typography variant="body" style={{ marginTop: '0.2rem', marginBottom: '1.5rem' }}>
          Gantt mensual, responsable y cumplimiento de indicadores de logro.
        </Typography>

        <Divider />

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {/* Proyecto Seleccionado */}
        <Section title="Proyecto seleccionado">
          {!seguimiento && !loading ? (
            /* Selector Mode if no project loaded */
            <Grid columns={2} gap="1rem">
              <FormGroup label="Año:">
                <Input
                  type="number"
                  value={anio}
                  onChange={e => setAnio(Number(e.target.value))}
                  placeholder="Ej. 2025"
                />
              </FormGroup>
              <FormGroup label="Seleccione un proyecto para ver su seguimiento:">
                <Select
                  value={proyectoSel}
                  onChange={(e) => setProyectoSel(parseInt(e.target.value))}
                  disabled={loading}
                >
                  <option value={0}>Seleccione...</option>
                  {proyectos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </Select>
              </FormGroup>
            </Grid>
          ) : (
            /* ReadOnly Mode */
            <Grid columns={2} gap="1rem">
              <FormGroup label="Proyecto">
                <Input type="text" value={seguimiento?.nombre || ''} readOnly style={{ background: 'rgba(0,0,0,0.1)' }} />
              </FormGroup>
              <Flex direction="column">
                <FormGroup label="Año">
                  <Input
                    type="number"
                    value={seguimiento?.anio || 2025}
                    onChange={(e) => {
                      if (!seguimiento) return;
                      setSeguimiento({ ...seguimiento, anio: parseInt(e.target.value) });
                    }}
                    style={{
                      background: 'rgba(0,0,0,0.1)',
                      border: '1px solid var(--verde-hoja)',
                      color: 'var(--texto-claro)'
                    }}
                  />
                </FormGroup>
                {!id && (
                  <Flex justify="flex-end" gap="0.5rem" wrap="wrap" style={{ marginTop: '0.5rem' }}>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => seguimiento && navigate(`/proyectos/${seguimiento.id_proyecto}`)}
                        style={{ color: 'var(--verde-hoja)', textDecoration: 'underline' }}
                      >
                        ✏️ Editar Proyecto
                      </Button>
                    )}

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteProyectoClick}
                        style={{ color: '#e74c3c', textDecoration: 'underline' }}
                      >
                        🗑️ Eliminar Proyecto
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSeguimiento(null); setProyectoSel(0); }}
                      style={{ color: 'var(--texto-sec)', textDecoration: 'underline' }}
                    >
                      Cambiar proyecto
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Grid>
          )}
        </Section>

        <Divider />

        {loading ? (
          <LoadingSpinner size="lg" fullScreen={false} />
        ) : seguimiento ? (
          <Section
            title="Actividades, indicadores y avance"
            description="Estados mensuales: - (no aplica), P (pendiente), I (iniciado), F (finalizado). El progreso de la actividad se calcula con los meses P/I/F. El cumplimiento del indicador se calcula a partir del valor alcanzado y la meta definida."
          >
            {/* Lista de Actividades */}
            <Flex direction="column" gap="1.5rem">
              {seguimiento.actividades.map((act, idx) => {
                const progreso = calcularProgreso(act.seguimiento_mensual, act.plan_mensual);
                const disponible = act.presupuesto_asignado - act.total_gastado;
                const indicador = act.indicadores && act.indicadores.length > 0 ? act.indicadores[0] : null;

                // Merge Plan + Execution
                const mergedSeguimiento: { mes: number; estado: Status }[] = [];
                for (let m = 1; m <= 12; m++) {
                  const seg = act.seguimiento_mensual?.find(s => s.mes === m);
                  const plan = act.plan_mensual?.find(p => p.mes === m && p.planificado);

                  if (seg) {
                    mergedSeguimiento.push({ mes: m, estado: seg.estado });
                  } else if (plan) {
                    mergedSeguimiento.push({ mes: m, estado: 'P' as Status });
                  }
                }

                return (
                  <Flex
                    direction="column"
                    key={act.id_actividad}
                    ref={(el) => { activityRefs.current[act.id_actividad] = el }}
                    style={{
                      transition: 'all 0.3s ease',
                      background: targetActivityId === act.id_actividad ? 'rgba(46, 204, 113, 0.15)' : 'transparent',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: targetActivityId === act.id_actividad ? '1px solid var(--verde-hoja)' : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <Typography variant="h3" color="var(--verde-hoja)" style={{ marginBottom: '0.8rem' }}>
                      Actividad {idx + 1}
                    </Typography>

                    <Flex direction="column" gap="1rem">
                      <Input type="text" value={act.nombre || ''} readOnly style={{ background: 'rgba(0,0,0,0.15)', fontWeight: 600 }} />

                      <FormGroup label="Responsable de la actividad">
                        <Input type="text" value={act.responsable_nombre || ''} readOnly placeholder="Nombre del responsable" />
                      </FormGroup>

                      {/* Meses */}
                      <MonthlyGanttView
                        seguimientoMensual={mergedSeguimiento}
                        onStatusChange={(mes, status) => actualizarEstadoMes(act.id_actividad, mes + 1, status)}
                        onStatusClick={() => { }}
                        disabled={saving || !canEdit}
                      />

                      {/* Progreso + Presupuesto */}
                      <Flex align="center" wrap="wrap" gap="1rem">
                        <Flex align="center" gap="0.8rem" style={{ flex: 1, minWidth: '250px' }}>
                          <Typography variant="label" color="var(--texto-claro)">Progreso:</Typography>
                          <ProgressBar progress={progreso} showLabel />
                        </Flex>

                        <Flex gap="1.5rem" wrap="wrap">
                          <Typography variant="caption">
                            Presupuestado: <Typography component="span" weight={600} color="var(--texto-claro)">{formatoDinero(act.presupuesto_asignado)}</Typography>
                          </Typography>
                          <Typography variant="caption">
                            Gastado: <Typography component="span" weight={600} color="#e74c3c">{formatoDinero(act.total_gastado)}</Typography>
                          </Typography>
                          <Typography variant="caption">
                            Disponible: <Typography component="span" weight={600} color="var(--texto-claro)">{formatoDinero(disponible)}</Typography>
                          </Typography>
                        </Flex>
                      </Flex>

                      {/* Indicador de logro */}
                      {indicador && (
                        <Card variant="dark" padding="1rem" style={{ marginTop: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Typography variant="label" weight={600} color="var(--verde-hoja)" style={{ display: 'block', marginBottom: '1rem' }}>
                            Indicador de logro de la actividad
                          </Typography>

                          <Grid columns={3} gap="1rem">
                            <FormGroup label="Categoría">
                              <Input type="text" value={indicador.categoria || ''} readOnly />
                            </FormGroup>
                            <FormGroup label="Beneficiarios">
                              <Input type="text" value={indicador.beneficiarios || '-'} readOnly />
                            </FormGroup>
                            <FormGroup label="Meta">
                              <Input type="text" value={indicador.meta || ''} readOnly />
                            </FormGroup>
                            <FormGroup label="Unidad">
                              <Input type="text" value={indicador.unidad_medida || ''} readOnly />
                            </FormGroup>
                            <div style={{ gridColumn: 'span 2' }}>
                              <FormGroup label="Descripción específica del indicador">
                                <Input type="text" value={indicador.nombre || ''} readOnly />
                              </FormGroup>
                            </div>
                          </Grid>

                          <Flex wrap="wrap" align="center" gap="1.5rem" style={{ marginTop: '1rem' }}>
                            <div style={{ width: '200px' }}>
                              <FormGroup label="Valor alcanzado a la fecha">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0"
                                  value={indicador.valor_logrado || 0}
                                  readOnly={!canEdit}
                                  onChange={(e) => actualizarIndicador(act.id_actividad, indicador.id_indicador, Number(e.target.value))}
                                />
                              </FormGroup>
                            </div>
                            <Typography variant="caption" style={{ marginTop: '1.2rem' }}>
                              Cumplimiento del indicador: <Typography component="span" weight={700} color="var(--texto-claro)">{indicador.porcentaje_cumplimiento}%</Typography>
                            </Typography>
                          </Flex>
                        </Card>
                      )}

                      {/* Action Buttons */}
                      <Flex wrap="wrap" gap="0.8rem" style={{ marginTop: '0.5rem' }}>
                        <Button
                          variant="alt"
                          size="sm"
                          onClick={() => navigate(`/actividades/${act.id_actividad}/evidencias`)}
                        >
                          📎 Evidencias
                        </Button>
                        <Button
                          variant="alt"
                          size="sm"
                          onClick={() => navigate(`/actividades/${act.id_actividad}/gastos`)}
                        >
                          💰 Gastos
                        </Button>
                        <Flex style={{ flex: 1 }} />
                        {canEdit && (
                          <Button
                            variant="alt"
                            size="sm"
                            onClick={() => handleEditClick(act)}
                            title="Editar detalles de la actividad"
                          >
                            ✏️ Editar
                          </Button>
                        )}
                        {isAdmin && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteActivityClick(act)}
                            title="Eliminar actividad permanentemente"
                          >
                            🗑️ Eliminar
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Section>
        ) : null}
      </Card>

      {/* MODAL DE EDICIÓN */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Actividad"
      >
        <Flex direction="column" gap="1rem" style={{ minWidth: '350px' }}>
          <FormGroup label="Nombre de la actividad">
            <Input
              type="text"
              value={editForm.nombre}
              onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Presupuesto Asignado ($)">
            <Input
              type="number"
              step="0.01"
              value={editForm.presupuesto}
              onChange={e => setEditForm({ ...editForm, presupuesto: Number(e.target.value) })}
            />
          </FormGroup>

          <FormGroup label="Responsable">
            <Flex gap="0.5rem">
              <Input
                type="text"
                readOnly
                value={editForm.responsable_nombre}
                placeholder="Seleccione responsable..."
                onClick={() => setUserModalOpen(true)}
                style={{ cursor: 'pointer', background: 'rgba(0,0,0,0.1)' }}
              />
              <Button variant="alt" size="sm" onClick={() => setUserModalOpen(true)}>🔍</Button>
            </Flex>
            {(editForm.responsable_nombre && !editForm.id_responsable) && (
              <Typography variant="caption" color="#e74c3c" style={{ marginTop: '0.2rem' }}>
                ⚠️ Usuario no registrado
              </Typography>
            )}
          </FormGroup>

          <FormGroup label="Cargo del responsable">
            <Input
              type="text"
              value={editForm.cargo_responsable}
              onChange={e => setEditForm({ ...editForm, cargo_responsable: e.target.value })}
              placeholder="Ej. Coordinador de Proyecto"
            />
          </FormGroup>

          <Flex justify="flex-end" gap="0.8rem" style={{ marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button variant="main" onClick={handleSaveActivity} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Flex>
        </Flex>
      </Modal>

      {/* MODAL DE SELECCIÓN DE USUARIO */}
      <UserSelectModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        users={responsables}
        onSelect={(u) => {
          setEditForm(prev => ({
            ...prev,
            responsable_nombre: u.nombre_completo,
            id_responsable: typeof u.id === 'string' ? parseInt(u.id) : u.id,
            cargo_responsable: u.cargo || prev.cargo_responsable
          }));
          setUserModalOpen(false);
        }}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.action}
        onCancel={() => setConfirmOpen(false)}
        confirmVariant="danger"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </PageLayout>
  );
};

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { NavBar, Card, Divider, Section, Label, LoadingSpinner, ErrorMessage } from '../components/common';
import { Status } from '../components/poa';
import { MonthlyGanttView, IndicadoresTable, ActivityActionButtons } from '../components/Seguimiento';
import apiClient from '../services/apiClient';

type Actividad = {
  id_actividad: number;
  nombre: string;
  responsable_nombre: string;
  presupuesto_asignado: number;
  total_gastado: number;
  seguimiento_mensual: { mes: number; estado: Status }[] | null;
  indicadores: {
    id_indicador: number;
    nombre: string;
    unidad_medida: string;
    meta: number;
    valor_logrado: number;
    porcentaje_cumplimiento: number;
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

  // Estados
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [proyectoSel, setProyectoSel] = useState<number>(0);
  const [seguimiento, setSeguimiento] = useState<ProyectoSeguimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Cargar lista de proyectos
  useEffect(() => {
    loadProyectos();
  }, []);

  // Cargar seguimiento cuando cambia el proyecto seleccionado
  useEffect(() => {
    if (proyectoSel > 0) {
      loadSeguimiento(proyectoSel);
    } else if (id) {
      const projectId = parseInt(id);
      setProyectoSel(projectId);
      loadSeguimiento(projectId);
    }
  }, [proyectoSel, id]);

  const loadProyectos = async () => {
    try {
      const response = await apiClient.get('/proyectos');
      setProyectos(response.data);

      // Si hay proyectos y no hay uno seleccionado, seleccionar el primero
      if (response.data.length > 0 && proyectoSel === 0) {
        setProyectoSel(response.data[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar proyectos');
      console.error('Error cargando proyectos:', err);
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

  const actualizarEstadoMes = async (actividadId: number, mes: number, nuevoEstado: Status) => {
    if (!seguimiento) return;

    try {
      setSaving(true);

      // Encontrar la actividad
      const actividad = seguimiento.actividades.find(a => a.id_actividad === actividadId);
      if (!actividad) return;

      // Actualizar seguimiento mensual
      const seguimientoActualizado = (actividad.seguimiento_mensual || []).map(s =>
        s.mes === mes ? { ...s, estado: nuevoEstado } : s
      );

      // Si el mes no existe, agregarlo
      if (!(actividad.seguimiento_mensual || []).find(s => s.mes === mes)) {
        seguimientoActualizado.push({ mes, estado: nuevoEstado });
      }

      await apiClient.put(`/proyectos/actividades/${actividadId}/seguimiento-mensual`, {
        seguimiento: seguimientoActualizado
      });

      // Actualizar estado local
      setSeguimiento({
        ...seguimiento,
        actividades: seguimiento.actividades.map(a =>
          a.id_actividad === actividadId
            ? { ...a, seguimiento_mensual: seguimientoActualizado }
            : a
        )
      });

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el seguimiento');
      console.error('Error actualizando seguimiento:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatoDinero = (n: number) => `$ ${n.toLocaleString("es-SV", { minimumFractionDigits: 2 })}`;

  const calcularProgreso = (seguimientoMensual: { mes: number; estado: Status }[] | null) => {
    if (!seguimientoMensual) return 0;
    const total = seguimientoMensual.length;
    const finalizados = seguimientoMensual.filter(s => s.estado === "F").length;
    return total > 0 ? Math.round((finalizados / total) * 100) : 0;
  };

  // Estilos
  const containerStyle: React.CSSProperties = {
    background: 'var(--fondo-azul)',
    color: 'var(--texto-claro)',
    minHeight: '100vh',
  };

  const mainStyle: React.CSSProperties = {
    maxWidth: '1150px',
    margin: '1.5rem auto 0',
    padding: '0 1rem 1rem',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    background: 'var(--card-dark-bg)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '0.5rem',
  };

  const progressFillStyle = (porcentaje: number): React.CSSProperties => ({
    width: `${porcentaje}%`,
    height: '100%',
    background: 'linear-gradient(90deg, var(--acento-verde), var(--acento-verde-claro))',
    transition: 'width 0.3s ease',
  });

  const activityTitleStyle: React.CSSProperties = {
    fontSize: '1rem',
    margin: 0,
    color: 'var(--acento-verde)',
    marginBottom: '0.5rem',
  };

  const responsableStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: 'var(--texto-sec)',
    marginBottom: '0.8rem',
  };

  const progressInfoStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    fontSize: '0.85rem',
  };

  const budgetInfoStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1.5rem',
    color: 'var(--texto-sec)',
  };

  const budgetItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <div style={containerStyle}>
      <NavBar />

      <main style={mainStyle}>
        <Card padding="1.8rem">
          {/* Header */}
          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>
              Avance por actividad
            </h1>
            <p style={{ color: 'var(--texto-sec)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Gantt mensual, responsable y cumplimiento de indicadores de logro.
            </p>
          </div>

          <Divider variant="gradient" />

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {/* Project Selector */}
          <Section title="Proyecto seleccionado" description="">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
              <div>
                <span style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--texto-sec)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Proyecto</span>
                <select
                  value={proyectoSel}
                  onChange={(e) => setProyectoSel(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--borde)',
                    color: 'var(--texto-claro)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                  disabled={loading}
                >
                  <option value={0}>Seleccione un proyecto...</option>
                  {proyectos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--texto-sec)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Año</span>
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--borde)',
                  color: 'var(--texto-claro)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                }}>
                  {seguimiento ? seguimiento.anio : '-'}
                </div>
              </div>
            </div>
          </Section>

          {loading ? (
            <LoadingSpinner size="lg" fullScreen={false} />
          ) : seguimiento ? (
            <>
              {/* Activities Section */}
              <Section
                title="Actividades, indicadores y avance"
                description={`Estados mensuales: - (no aplica), P (pendiente), I (iniciado), F (finalizado). El progreso de la actividad se calcula con los meses P-I-F. El cumplimiento del indicador se calcula a partir del valor alcanzado y la meta definida en la página 1.`}
              >
                {(seguimiento.actividades || []).map((act, idx) => {
                  const progreso = calcularProgreso(act.seguimiento_mensual);
                  const disponible = act.presupuesto_asignado - act.total_gastado;

                  return (
                    <Card key={act.id_actividad} variant="dark" padding="1.2rem" style={{ marginBottom: '1rem' }}>
                      {/* Activity Header */}
                      <h3 style={activityTitleStyle}>
                        Actividad {idx + 1}
                      </h3>
                      <p style={{ fontSize: '0.95rem', margin: '0 0 0.3rem 0' }}>{act.nombre}</p>
                      <p style={responsableStyle}>
                        Responsable de la actividad: {act.responsable_nombre}
                      </p>

                      {/* Monthly Gantt View */}
                      <Label>Nombre del responsable</Label>
                      <MonthlyGanttView
                        seguimientoMensual={act.seguimiento_mensual}
                        onStatusClick={(mesIdx) => {
                          // Ciclo: sin estado → P → I → F → sin estado
                          const seguimiento = act.seguimiento_mensual?.find(s => s.mes === mesIdx + 1);
                          const estadoActual = seguimiento?.estado;
                          const nuevoEstado: Status | undefined = !estadoActual ? 'P' : estadoActual === 'P' ? 'I' : estadoActual === 'I' ? 'F' : undefined;
                          if (nuevoEstado) {
                            actualizarEstadoMes(act.id_actividad, mesIdx + 1, nuevoEstado);
                          }
                        }}
                        disabled={saving}
                      />

                      {/* Progress Bar */}
                      <div style={progressInfoStyle}>
                        <span style={{ color: 'var(--acento-verde)', fontWeight: '600' }}>
                          Progreso: {progreso}%
                        </span>
                        <div style={budgetInfoStyle}>
                          <div style={budgetItemStyle}>
                            <span>Presupuesto:</span>
                            <strong>{formatoDinero(act.presupuesto_asignado)}</strong>
                          </div>
                          <div style={budgetItemStyle}>
                            <span>Gastado:</span>
                            <strong>{formatoDinero(act.total_gastado)}</strong>
                          </div>
                          <div style={budgetItemStyle}>
                            <span>Disponible:</span>
                            <strong style={{ color: disponible >= 0 ? 'var(--acento-verde)' : 'var(--error)' }}>
                              {formatoDinero(disponible)}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div style={progressBarStyle}>
                        <div style={progressFillStyle(progreso)} />
                      </div>

                      {/* Indicators Table */}
                      <IndicadoresTable indicadores={act.indicadores} />

                      {/* Action Buttons */}
                      <ActivityActionButtons actividadId={act.id_actividad} />
                    </Card>
                  );
                })}
              </Section>
            </>
          ) : proyectoSel === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--texto-sec)', padding: '2rem' }}>
              Selecciona un proyecto para ver su seguimiento
            </p>
          ) : null}
        </Card>
      </main>
    </div>
  );
};

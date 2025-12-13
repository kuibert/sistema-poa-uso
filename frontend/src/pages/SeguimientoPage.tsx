import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, LoadingSpinner, ErrorMessage, Select, Input, Button, Label } from '../components/common';
import { Status } from '../components/poa';
import { MonthlyGanttView } from '../components/Seguimiento';
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
    }
  }, [proyectoSel, id]);

  const loadProyectos = async () => {
    try {
      const response = await apiClient.get('/proyectos');
      setProyectos(response.data);
      // Si hay proyectos y no hay uno seleccionado, seleccionar el primero si no hay ID en URL
      if (!id && response.data.length > 0 && proyectoSel === 0) {
        // Optional: Auto-select first? Or wait for user. HTML design implies "Selected Project".
        // setProyectoSel(response.data[0].id);
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

  // Lógica de actualización de estado (Paso 3)
  const actualizarEstadoMes = async (actividadId: number, mes: number, nuevoEstado: Status | undefined) => {
    if (!seguimiento) return;
    try {
      setSaving(true);

      // Encontrar actividad
      const actividad = seguimiento.actividades.find(a => a.id_actividad === actividadId);
      if (!actividad) return;

      // Actualizar seguimiento mensual
      let seguimientoActualizado = [...(actividad.seguimiento_mensual || [])];

      // Remove existing for this month to replace or delete
      seguimientoActualizado = seguimientoActualizado.filter(s => s.mes !== mes);

      if (nuevoEstado) {
        seguimientoActualizado.push({ mes, estado: nuevoEstado });
      }

      // Optimistic update
      const newSeguimiento = {
        ...seguimiento,
        actividades: seguimiento.actividades.map(a =>
          a.id_actividad === actividadId ? { ...a, seguimiento_mensual: seguimientoActualizado } : a
        )
      };
      setSeguimiento(newSeguimiento);

      await apiClient.put(`/proyectos/actividades/${actividadId}/seguimiento-mensual`, {
        seguimiento: seguimientoActualizado
      });

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar estado');
      console.error('Error actualizando estado:', err);
      // Revert logic would go here
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
      await apiClient.put(`/indicadores/${indicadorId}/avance`, {
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
  const calcularProgreso = (seguimientoMensual: { mes: number; estado: Status }[] | null) => {
    if (!seguimientoMensual) return 0;

    let usados = 0;
    let suma = 0;

    seguimientoMensual.forEach(s => {
      if (s.estado === 'P' || s.estado === 'I' || s.estado === 'F') {
        usados++;
        if (s.estado === 'I') suma += 0.5;
        if (s.estado === 'F') suma += 1;
      }
    });

    return usados ? Math.round((suma / usados) * 100) : 0;
  };

  const formatoDinero = (n: number) => `$ ${n.toLocaleString("es-SV", { minimumFractionDigits: 2 })}`;

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

  const sectionTitleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: 600,
    marginBottom: '0.2rem',
    fontSize: '1rem' // Default h2 size aprox
  };

  const sectionDividerStyle: React.CSSProperties = {
    height: '1px',
    background: 'var(--verde-hoja)',
    opacity: 0.4,
    margin: '0.4rem 0 0.8rem'
  };

  // Bar styles
  const barBgStyle: React.CSSProperties = {
    width: '130px',
    height: '6px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  };

  const barFillStyle = (pct: number): React.CSSProperties => ({
    height: '100%',
    width: `${pct}%`,
    background: 'var(--verde-hoja)',
    transition: 'width 0.25s ease-out'
  });


  return (
    <div style={containerStyle}>
      <NavBar />

      <main style={mainStyle}>
        <Card padding="1.8rem">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Avance por actividad</h1>
              <p style={{ color: 'var(--texto-sec)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Gantt mensual, responsable y cumplimiento de indicadores de logro.
              </p>
            </div>
            <button
              className="btn-alt" // Assuming global class or style below
              onClick={() => window.print()}
              style={{
                border: '1px solid var(--verde-hoja)',
                color: 'var(--verde-hoja)',
                background: 'transparent',
                borderRadius: '999px',
                padding: '0.35rem 0.9rem',
                cursor: 'pointer',
                fontSize: '0.78rem'
              }}
            >
              🖨 Imprimir tablero
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--verde-hoja), transparent)', margin: '1.2rem 0' }} />

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {/* Proyecto Seleccionado */}
          <div>
            <h2 style={sectionTitleStyle}>
              <span style={{ width: '4px', height: '18px', background: 'var(--verde-hoja)', borderRadius: '10px', display: 'inline-block' }}></span>
              Proyecto seleccionado
            </h2>
            <div style={sectionDividerStyle}></div>

            {!seguimiento && !loading ? (
              /* Selector Mode if no project loaded */
              <div style={{ marginBottom: '1rem' }}>
                <Label>Seleccione un proyecto para ver su seguimiento:</Label>
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
              </div>
            ) : (
              /* ReadOnly Mode (HTML Design) */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <Label>Proyecto</Label>
                  <Input type="text" value={seguimiento?.nombre || ''} readOnly style={{ background: '#081529' }} />
                </div>
                <div>
                  <Label>Año</Label>
                  <Input
                    type="number"
                    value={seguimiento?.anio || 2025}
                    onChange={(e) => seguimiento && setSeguimiento({ ...seguimiento, anio: parseInt(e.target.value) })}
                    style={{
                      background: '#081529',
                      border: '1px solid var(--verde-hoja)',
                      color: 'var(--texto-claro)'
                    }}
                  />
                  {!id && (
                    <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => { setSeguimiento(null); setProyectoSel(0); }}
                        style={{ background: 'none', border: 'none', color: 'var(--texto-sec)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Cambiar proyecto
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--verde-hoja), transparent)', margin: '1.2rem 0' }} />

          {loading ? (
            <LoadingSpinner size="lg" fullScreen={false} />
          ) : seguimiento ? (
            <>
              {/* Description Text */}
              <div>
                <h2 style={sectionTitleStyle}>
                  <span style={{ width: '4px', height: '18px', background: 'var(--verde-hoja)', borderRadius: '10px', display: 'inline-block' }}></span>
                  Actividades, indicadores y avance
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--texto-sec)', marginBottom: '0.4rem' }}>
                  Estados mensuales: <strong>-</strong> (no aplica), <strong style={{ color: 'var(--P)' }}>P</strong> (pendiente), <strong style={{ color: 'var(--I)' }}>I</strong> (iniciado), <strong style={{ color: 'var(--F)' }}>F</strong> (finalizado).<br />
                  El progreso de la actividad se calcula con los meses P/I/F. El cumplimiento del indicador se calcula a partir del valor alcanzado y la meta definida en la página 1.
                </p>
                <div style={sectionDividerStyle}></div>
              </div>

              {/* Lista de Actividades */}
              <div id="lista-actividades">
                {seguimiento.actividades.map((act, idx) => {
                  const progreso = calcularProgreso(act.seguimiento_mensual);
                  const disponible = act.presupuesto_asignado - act.total_gastado;
                  const indicador = act.indicadores && act.indicadores.length > 0 ? act.indicadores[0] : null;

                  return (
                    <div key={act.id_actividad} style={{ marginBottom: '1.6rem' }}>
                      <div style={{ color: 'var(--verde-hoja)', fontWeight: 700, fontSize: '0.98rem', marginLeft: '0.2rem', marginBottom: '0.35rem' }}>
                        Actividad {idx + 1}
                      </div>
                      <div style={{ marginLeft: '1.2rem' }}>
                        {/* Nombre y Responsable */}
                        <div style={{ marginBottom: '0.6rem' }}>
                          <Input type="text" value={act.nombre} readOnly style={{ background: '#081529', fontWeight: 600 }} />
                        </div>
                        <div style={{ marginBottom: '0.6rem' }}>
                          <Label>Responsable de la actividad</Label>
                          <Input type="text" value={act.responsable_nombre} readOnly placeholder="Nombre del responsable" />
                        </div>

                        {/* Meses */}
                        <div style={{ marginBottom: '0.6rem' }}>
                          <MonthlyGanttView
                            seguimientoMensual={act.seguimiento_mensual}
                            onStatusChange={(mes, status) => actualizarEstadoMes(act.id_actividad, mes + 1, status)}
                            onStatusClick={() => { }} // Legacy
                            disabled={saving}
                          />
                        </div>

                        {/* Progreso + Presupuesto */}
                        <div style={{ marginBottom: '0.6rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--texto-sec)' }}>
                            <strong style={{ color: 'var(--texto-claro)' }}>Progreso:</strong>
                            <div style={barBgStyle}>
                              <div style={barFillStyle(progreso)}></div>
                            </div>
                            <strong style={{ color: 'var(--texto-claro)' }}>{progreso}%</strong>
                            <span>| Presupuestado: <strong style={{ color: 'var(--texto-claro)' }}>{formatoDinero(act.presupuesto_asignado)}</strong></span>
                            <span>| Gastado: <strong style={{ color: 'var(--texto-claro)' }}>{formatoDinero(act.total_gastado)}</strong></span>
                            <span>| Disponible: <strong style={{ color: 'var(--texto-claro)' }}>{formatoDinero(disponible)}</strong></span>
                          </div>
                        </div>

                        {/* Indicador de logro */}
                        {indicador && (
                          <div style={{ marginBottom: '0.6rem' }}>
                            <div style={{
                              borderRadius: '10px',
                              border: '1px solid rgba(255,255,255,.06)',
                              background: 'rgba(0,0,0,.14)',
                              padding: '0.7rem 0.75rem',
                              marginTop: '0.3rem'
                            }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--verde-hoja)', marginBottom: '0.4rem' }}>
                                Indicador de logro de la actividad
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div>
                                  <Label>Categoría</Label>
                                  <Input type="text" value={indicador.categoria || ''} readOnly />
                                </div>
                                <div>
                                  <Label>Meta</Label>
                                  <Input type="text" value={indicador.meta} readOnly />
                                </div>
                                <div>
                                  <Label>Unidad</Label>
                                  <Input type="text" value={indicador.unidad_medida} readOnly />
                                </div>
                                <div>
                                  <Label>Beneficiarios</Label>
                                  <Input type="text" value={indicador.beneficiarios || '-'} readOnly />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                  <Label>Descripción específica del indicador</Label>
                                  <Input type="text" value={indicador.nombre} readOnly />
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '0.7rem', fontSize: '0.78rem' }}>
                                <div style={{ minWidth: '150px' }}>
                                  <Label>Valor alcanzado a la fecha</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    value={indicador.valor_logrado}
                                    onChange={(e) => actualizarIndicador(act.id_actividad, indicador.id_indicador, Number(e.target.value))}
                                  />
                                </div>
                                <div style={{ color: 'var(--texto-sec)', paddingBottom: '0.4rem' }}>
                                  Cumplimiento del indicador: <strong style={{ color: 'var(--texto-claro)' }}>{indicador.porcentaje_cumplimiento}%</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ marginBottom: '0.6rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                            <button
                              className="btn-alt"
                              onClick={() => navigate(`/actividades/${act.id_actividad}/evidencias`)}
                              style={{
                                border: '1px solid var(--verde-hoja)',
                                color: 'var(--verde-hoja)',
                                background: 'transparent',
                                borderRadius: '999px',
                                padding: '0.35rem 0.9rem',
                                cursor: 'pointer',
                                fontSize: '0.78rem'
                              }}
                            >
                              📎 Evidencias
                            </button>
                            <button
                              className="btn-alt"
                              onClick={() => navigate(`/actividades/${act.id_actividad}/gastos`)}
                              style={{
                                border: '1px solid var(--verde-hoja)',
                                color: 'var(--verde-hoja)',
                                background: 'transparent',
                                borderRadius: '999px',
                                padding: '0.35rem 0.9rem',
                                cursor: 'pointer',
                                fontSize: '0.78rem'
                              }}
                            >
                              💰 Gastos
                            </button>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: '3px', background: 'var(--verde-hoja)', borderRadius: '999px', margin: '1rem 0 0.6rem' }}></div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </Card>
      </main>
    </div>
  );
};

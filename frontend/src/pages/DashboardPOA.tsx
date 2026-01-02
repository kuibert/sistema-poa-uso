import React, { useEffect, useState } from 'react';
import { NavBar, Card, Divider, Grid, Table, Badge, Select, Input, Modal, FormGroup, Label, SuccessMessage } from '../components/common';
import { KPICard, StatusPill, Status } from '../components/poa';
import { Button } from '../components/common/Button';
import apiClient from '../services/apiClient';
import Swal from 'sweetalert2';

export const DashboardPOA: React.FC = () => {

  const [proyectos, setProyectos] = useState<any[]>([]);
  const [actividadesMes, setActividadesMes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unidades, setUnidades] = useState<string[]>([]);

  // Estados de los Inputs (Interfaz de usuario)
  const [inputMonth, setInputMonth] = useState<number>(12);
  const [inputYear, setInputYear] = useState<string>("2025");
  const [inputUnidad, setInputUnidad] = useState<string>("");

  // Estados de los Filtros Aplicados (Para la query)
  const [appliedMonth, setAppliedMonth] = useState<number>(12);
  const [appliedYear, setAppliedYear] = useState<number>(2025);
  const [appliedUnidad, setAppliedUnidad] = useState<string>("");

  // Estados para Duplicación
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateTargetYear, setDuplicateTargetYear] = useState<string>((new Date().getFullYear() + 1).toString());
  const [duplicating, setDuplicating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmStep, setConfirmStep] = useState(false);

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  // ============================
  //  CARGAR DATOS DESDE BACKEND
  // ============================
  useEffect(() => {
    const loadUnidades = async () => {
      try {
        const { data } = await apiClient.get('/proyectos/unidades');
        setUnidades(data);
      } catch (error) {
        console.error("Error cargando unidades:", error);
      }
    };
    loadUnidades();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Usar los filtros APLICADOS
        const params: any = { anio: appliedYear, mes: appliedMonth };
        if (appliedUnidad) params.unidad = appliedUnidad;
        const { data } = await apiClient.get('/proyectos/dashboard', { params });

        setProyectos(data.proyectos || []);
        setActividadesMes(data.actividadesMes || []);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
      setLoading(false);
    };

    load();
  }, [appliedYear, appliedMonth, appliedUnidad]); // Dependencias: solo cambia cuando se aplican

  const handleApplyFilters = () => {
    const yearParsed = parseInt(inputYear, 10);
    if (!isNaN(yearParsed) && yearParsed > 1900 && yearParsed < 2100) {
      setAppliedYear(yearParsed);
      setAppliedMonth(inputMonth);
      setAppliedUnidad(inputUnidad);
    }
  };

  const handleDuplicatePOA = async () => {
    if (!duplicateTargetYear) return;

    if (!duplicateTargetYear) return;

    try {
      setDuplicating(true);

      await apiClient.post('/proyectos/duplicar', {
        anioOrigen: appliedYear,
        anioDestino: parseInt(duplicateTargetYear)
      });

      setSuccessMsg('POA duplicado correctamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
      setShowDuplicateModal(false);

      // Opcional: Cambiar al nuevo año
      setInputYear(duplicateTargetYear);
      setAppliedYear(parseInt(duplicateTargetYear));

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al duplicar POA',
        icon: 'error',
        confirmButtonColor: '#3fa65b',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setDuplicating(false);
    }
  };

  if (loading) {
    return <p style={{ color: "white", padding: "2rem" }}>Cargando datos del dashboard...</p>;
  }


  // ============================
  //  CÁLCULOS
  // ============================
  const formatoDinero = (v: number) =>
    "$ " + Number(v).toLocaleString("es-SV", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Normalizar números (evitar NaN)
  const fixNum = (v: any) => Number(v ?? 0);

  // ----------------------------
  // Valores base
  // ----------------------------
  const totalProyectos = proyectos.length;

  const totalAprobado = proyectos.reduce(
    (s, p) => s + fixNum(p.presupuestoAprobado),
    0
  );

  const totalGastado = proyectos.reduce(
    (s, p) => s + fixNum(p.gastado),
    0
  );

  const dispPortafolio = totalAprobado - totalGastado;

  // ----------------------------
  // Porcentajes
  // ----------------------------
  const pctGastadoPortafolio =
    totalAprobado > 0 ? (totalGastado / totalAprobado) * 100 : 0;

  // ----------------------------
  // Promedios
  // ----------------------------
  const promAvance =
    totalProyectos > 0
      ? Math.round(
        proyectos.reduce(
          (s, p) => s + fixNum(p.avanceOperativo),
          0
        ) / totalProyectos
      )
      : 0;

  const promLogro =
    totalProyectos > 0
      ? Math.round(
        proyectos.reduce(
          (s, p) => s + fixNum(p.logroKpi),
          0
        ) / totalProyectos
      )
      : 0;

  const totalActivMes = proyectos.reduce(
    (s, p) => s + fixNum(p.actividadesMes),
    0
  );

  // ----------------------------
  // Actividades por estado
  // ----------------------------
  const cP = actividadesMes.filter(a => a.estado === 'P').length;
  const cI = actividadesMes.filter(a => a.estado === 'I').length;
  const cF = actividadesMes.filter(a => a.estado === 'F').length;

  const urlSeguimiento = 'seguimiento';

  // =============================
  //  ESTILOS (NO CAMBIADOS)
  // =============================
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

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.8rem',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
  };

  const cardSubStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: 'var(--texto-sec)',
    marginTop: '0.2rem',
  };

  const portafolioResumenStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  };

  const portafolioTextoStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: 'var(--texto-sec)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.95rem',
    fontWeight: 600,
  };

  const sectionTitleBeforeStyle: React.CSSProperties = {
    width: '4px',
    height: '18px',
    background: 'var(--verde-hoja)',
    borderRadius: '10px',
  };

  const sectionDividerStyle: React.CSSProperties = {
    height: '1px',
    background: 'var(--verde-hoja)',
    opacity: 0.4,
    margin: '0.4rem 0 0.7rem',
  };

  const sectionDescStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: 'var(--texto-sec)',
  };

  const proyectoLinkStyle: React.CSSProperties = {
    color: '#9ad7ff',
    textDecoration: 'none',
  };

  const actividadLinkStyle: React.CSSProperties = {
    color: '#72e1ff',
    textDecoration: 'none',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.4rem',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <NavBar />


      <main style={mainStyle}>
        <Card>
          {successMsg && <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} />}

          {/* PANEL SUPERIOR */}
          <div style={cardHeaderStyle}>
            <div>
              <h1 style={cardTitleStyle}>Resumen del portafolio de proyectos POA</h1>
              <p style={cardSubStyle}>
                Visión global del presupuesto, avance y resultados de todos los proyectos activos.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button onClick={() => setShowDuplicateModal(true)}>
                📋 Duplicar POA
              </Button>

            </div>
          </div>

          <Divider variant="gradient" />

          {/* ========= KPI ========= */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={portafolioResumenStyle}>
              <div style={portafolioTextoStyle}>
                Proyectos activos: <strong>{totalProyectos}</strong><br />
                Seguimiento por ejecución del plan, logro de indicadores y uso de presupuesto.
              </div>

              <div style={portafolioTextoStyle}>
                Mes de referencia:
                <div style={filterContainerStyle}>
                  <Select
                    value={inputMonth}
                    onChange={(e) => setInputMonth(Number(e.target.value))}
                    style={{ width: '130px', padding: '4px 8px', fontSize: '0.9rem' }}
                  >
                    {months.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Select>

                  <Input
                    value={inputYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Solo permite dígitos
                      if (/^\d*$/.test(val)) {
                        setInputYear(val);
                      }
                    }}
                    style={{ width: '70px', padding: '4px 8px', fontSize: '0.9rem' }}
                    placeholder="Año"
                  />

                  <Select
                    value={inputUnidad}
                    onChange={(e) => setInputUnidad(e.target.value)}
                    style={{ width: '200px', padding: '4px 8px', fontSize: '0.9rem' }}
                  >
                    <option value="">Todas las unidades</option>
                    {unidades.map((u, idx) => (
                      <option key={idx} value={u}>{u}</option>
                    ))}
                  </Select>

                  <Button
                    onClick={handleApplyFilters}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Aplicar
                  </Button>
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  Este resumen consolida los datos de todos los proyectos aprobados en el POA.
                </div>
              </div>
            </div>

            <Grid columns={4}>
              <KPICard
                label="Presupuesto del portafolio"
                value={formatoDinero(dispPortafolio)}
                subtitle={`Aprobado: ${formatoDinero(totalAprobado)} · Gastado: ${formatoDinero(totalGastado)}`}
                progress={pctGastadoPortafolio}
                showBar={true}
              />

              <KPICard
                label="Avance operativo promedio"
                value={`${promAvance}%`}
                subtitle="Calculado a partir de los meses P/I/F de todas las actividades."
                progress={promAvance}
                showBar={true}
              />

              <KPICard
                label="Logro promedio de indicadores (KPI)"
                value={`${promLogro}%`}
                subtitle="Promedio de cumplimiento de metas de los proyectos."
                progress={promLogro}
                showBar={true}
              />

              <KPICard
                label="Actividades del mes en todo el portafolio"
                value={totalActivMes}
                subtitle={`Pendientes: ${cP} · En proceso: ${cI} · Finalizadas: ${cF}`}
                showBar={false}
              />
            </Grid>
          </div>

          {/* ========= TABLA DE PROYECTOS ========= */}
          <Card variant="dark" padding="1rem" style={{ marginBottom: '1.3rem' }}>
            <div style={sectionTitleStyle}>
              <span style={sectionTitleBeforeStyle}></span>
              Listado de proyectos activos
            </div>

            <div style={sectionDividerStyle}></div>

            <p style={sectionDescStyle}>
              Visión compacta para más de 20 proyectos.
            </p>

            <Table>
              <Table.Header>
                <Table.Row hover={false}>
                  <Table.Cell header>Proyecto</Table.Cell>
                  <Table.Cell header center>Año</Table.Cell>
                  <Table.Cell header>Responsable</Table.Cell>
                  <Table.Cell header>Aprobado</Table.Cell>
                  <Table.Cell header>Gastado</Table.Cell>
                  <Table.Cell header>Disponible</Table.Cell>
                  <Table.Cell header center>Avance %</Table.Cell>
                  <Table.Cell header center>Logro %</Table.Cell>
                  <Table.Cell header center>Act. Mes</Table.Cell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {proyectos.map(p => {
                  const disp = p.presupuestoAprobado - p.gastado;
                  return (
                    <Table.Row key={p.id}>
                      <Table.Cell>
                        <a href={`${urlSeguimiento}?proyectoId=${p.id}`} style={proyectoLinkStyle}>
                          {p.nombre}
                        </a>
                      </Table.Cell>

                      <Table.Cell center>{p.anio}</Table.Cell>
                      <Table.Cell>{p.responsable}</Table.Cell>
                      <Table.Cell>{formatoDinero(p.presupuestoAprobado)}</Table.Cell>
                      <Table.Cell>{formatoDinero(p.gastado)}</Table.Cell>
                      <Table.Cell>{formatoDinero(disp)}</Table.Cell>
                      <Table.Cell center>{p.avanceOperativo}%</Table.Cell>
                      <Table.Cell center>{p.logroKpi}%</Table.Cell>
                      <Table.Cell center><Badge variant="circle">{p.actividadesMes}</Badge></Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Card>

          {/* ========= TABLA ACTIVIDADES ========= */}
          <Card variant="accent" padding="1rem 1rem 1.1rem">
            <div style={sectionTitleStyle}>
              <span style={sectionTitleBeforeStyle}></span>
              Actividades del mes (todos los proyectos)
            </div>

            <div style={sectionDividerStyle}></div>

            <p style={sectionDescStyle}>
              Vista consolidada de todas las actividades del mes.
            </p>

            <Table variant="activities">
              <Table.Header>
                <Table.Row hover={false}>
                  <Table.Cell header>Actividad</Table.Cell>
                  <Table.Cell header>Proyecto</Table.Cell>
                  <Table.Cell header>Responsable</Table.Cell>
                  <Table.Cell header>Estado</Table.Cell>
                  <Table.Cell header center>Avance %</Table.Cell>
                  <Table.Cell header center>Logro KPI %</Table.Cell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {actividadesMes.map((a, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <a
                        href={`${urlSeguimiento}?proyectoId=${a.proyectoId}&actividad=${encodeURIComponent(a.nombre)}`}
                        style={actividadLinkStyle}
                      >
                        {a.nombre}
                      </a>
                    </Table.Cell>

                    <Table.Cell>{a.proyectoNombre}</Table.Cell>
                    <Table.Cell>{a.responsable}</Table.Cell>

                    <Table.Cell>
                      <StatusPill status={a.estado as Status} />
                    </Table.Cell>

                    <Table.Cell center>{a.avanceActividad}%</Table.Cell>
                    <Table.Cell center>{a.logroKpiActividad}%</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

          </Card>
        </Card>
      </main>

      {/* MODAL DUPLICAR POA */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => { setShowDuplicateModal(false); setConfirmStep(false); }}
        title="Duplicar POA (Copia de Estructura)"
      >
        {!confirmStep ? (
          <>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Está a punto de copiar <strong>todos los proyectos</strong> del año <strong>{appliedYear}</strong> al año destino seleccionado.
              <br /><br />
              <strong>¿Qué se copia?</strong> <br />
              Proyectos, Objetivos, Costos, Actividades, Indicadores y Planificación Mensual.
              <br /><br />
              <strong>¿Qué NO se copia?</strong> <br />
              Ejecución (Gastos, Evidencias, Avance Real).
            </p>

            <FormGroup>
              <Label>Año Origen (Base para la copia)</Label>
              <Input value={appliedYear.toString()} disabled />
            </FormGroup>

            <FormGroup>
              <Label>Año Destino (Nuevo Año)</Label>
              <Input
                type="number"
                value={duplicateTargetYear}
                onChange={(e) => setDuplicateTargetYear(e.target.value)}
              />
            </FormGroup>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <Button variant="alt" onClick={() => setShowDuplicateModal(false)}>Cancelar</Button>
              <Button onClick={() => setConfirmStep(true)}>Continuar</Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ fontSize: '1rem', color: '#e74c3c', fontWeight: 'bold', marginBottom: '1rem' }}>
                ⚠️ ¿Está seguro de realizar esta acción?
              </p>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>
                Se crearán copias de todos los proyectos del año {appliedYear} para el año {duplicateTargetYear}.
                <br />
                Verifique que el año destino sea el correcto.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <Button variant="alt" onClick={() => setConfirmStep(false)}>Atrás</Button>
              <Button onClick={handleDuplicatePOA} loading={duplicating} variant="main">
                Sí, Confirmar Duplicación
              </Button>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
};

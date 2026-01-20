import React, { useEffect, useState } from 'react';
import { Card, Divider, Grid, Table, Badge, Select, Input, Modal, FormGroup, Label, SuccessMessage, PageLayout, Flex, Typography } from '../components/common';
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
  const [inputYear, setInputYear] = useState<string>(new Date().getFullYear().toString());
  const [inputUnidad, setInputUnidad] = useState<string>("");

  // Estados de los Filtros Aplicados (Para la query)
  const [appliedMonth, setAppliedMonth] = useState<number>(12);
  const [appliedYear, setAppliedYear] = useState<number>(new Date().getFullYear());
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

    // Pre-seleccionar unidad si no es ADMIN
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.rol && user.rol !== 'ADMIN' && user.unidad) {
          setInputUnidad(user.unidad);
          setAppliedUnidad(user.unidad);
        }
      } catch (e) {
        console.error("Error parsing user from storage", e);
      }
    }
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
      let msg = error.response?.data?.message || 'Error al duplicar POA';

      if (error.response?.status === 403) {
        msg = 'Acción exclusiva para el administrador. No tiene permisos para realizar esta acción.';
      }

      Swal.fire({
        title: 'Error',
        text: msg,
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
    return <PageLayout><Typography color="white" style={{ padding: "2rem" }}>Cargando datos del dashboard...</Typography></PageLayout>;
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

  return (
    <PageLayout maxWidth="1150px">
      <Card>
        {successMsg && <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} />}

        {/* PANEL SUPERIOR */}
        <Flex justify="space-between" align="center" gap="0.8rem" wrap="wrap">
          <div>
            <Typography variant="h1">Resumen del portafolio de proyectos POA</Typography>
            <Typography variant="body" style={{ marginTop: '0.2rem' }}>
              Visión global del presupuesto, avance y resultados de todos los proyectos activos.
            </Typography>
          </div>

          <Flex gap="0.5rem">
            {(() => {
              const userStr = localStorage.getItem('user');
              if (userStr) {
                try {
                  const user = JSON.parse(userStr);
                  if (user.rol === 'ADMIN') {
                    return (
                      <Button onClick={() => setShowDuplicateModal(true)}>
                        📋 Duplicar POA
                      </Button>
                    );
                  }
                } catch (e) { }
              }
              return null;
            })()}
          </Flex>
        </Flex>

        <Divider variant="gradient" />

        {/* ========= KPI ========= */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Flex justify="space-between" align="flex-start" gap="1rem" wrap="wrap" style={{ marginBottom: '1rem' }}>
            <Typography variant="body">
              Proyectos activos: <strong style={{ color: 'var(--texto-claro)' }}>{totalProyectos}</strong><br />
              Seguimiento por ejecución del plan, logro de indicadores y uso de presupuesto.
            </Typography>

            <Flex direction="column" gap="0.4rem" style={{ fontSize: '0.85rem' }}>
              <Typography variant="body" color="var(--texto-sec)">Mes de referencia:</Typography>
              <Flex gap="0.5rem" align="center" wrap="wrap">
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
                  type="number"
                  value={inputYear}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputYear(val);
                  }}
                  style={{ width: '70px', padding: '4px 8px', fontSize: '0.9rem' }}
                  placeholder="Año"
                />

                <Select
                  value={inputUnidad}
                  onChange={(e) => setInputUnidad(e.target.value)}
                  style={{ width: '200px', padding: '4px 8px', fontSize: '0.9rem' }}
                  disabled={(() => {
                    const userStr = localStorage.getItem('user');
                    if (!userStr) return false;
                    try {
                      const user = JSON.parse(userStr);
                      return user.rol !== 'ADMIN';
                    } catch { return false; }
                  })()}
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
              </Flex>
              <Typography variant="caption" style={{ marginTop: '0.4rem' }}>
                Este resumen consolida los datos de todos los proyectos aprobados en el POA.
              </Typography>
            </Flex>
          </Flex>

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
          <Typography variant="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '4px', height: '18px', background: 'var(--verde-hoja)', borderRadius: '10px' }}></span>
            Listado de proyectos activos
          </Typography>

          <Divider variant="gradient" />

          <Typography variant="caption">
            Visión compacta para más de 20 proyectos.
          </Typography>

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
                      <a href={`${urlSeguimiento}?proyectoId=${p.id}`} style={{ color: '#9ad7ff', textDecoration: 'none' }}>
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
          <Typography variant="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '4px', height: '18px', background: 'var(--verde-hoja)', borderRadius: '10px' }}></span>
            Actividades del mes (todos los proyectos)
          </Typography>

          <Divider variant="gradient" />

          <Typography variant="caption">
            Vista consolidada de todas las actividades del mes.
          </Typography>

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
                      style={{ color: '#72e1ff', textDecoration: 'none' }}
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

      {/* MODAL DUPLICAR POA */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => { setShowDuplicateModal(false); setConfirmStep(false); }}
        title="Duplicar POA (Copia de Estructura)"
      >
        {!confirmStep ? (
          <>
            <Typography variant="body" style={{ marginBottom: '1rem' }}>
              Está a punto de copiar <strong>todos los proyectos</strong> del año <strong>{appliedYear}</strong> al año destino seleccionado.
              <br /><br />
              <strong>¿Qué se copia?</strong> <br />
              Proyectos, Objetivos, Costos, Actividades, Indicadores y Planificación Mensual.
              <br /><br />
              <strong>¿Qué NO se copia?</strong> <br />
              Ejecución (Gastos, Evidencias, Avance Real).
            </Typography>

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
            <Flex direction="column" align="center" style={{ padding: '1rem 0' }}>
              <Typography variant="h3" color="#e74c3c" weight={700} style={{ marginBottom: '1rem' }}>
                ⚠️ ¿Está seguro de realizar esta acción?
              </Typography>
              <Typography variant="body" align="center">
                Se crearán copias de todos los proyectos del año {appliedYear} para el año {duplicateTargetYear}.
                <br />
                Verifique que el año destino sea el correcto.
              </Typography>
            </Flex>

            <Flex justify="center" gap="1rem" style={{ marginTop: '1.5rem' }}>
              <Button variant="alt" onClick={() => setConfirmStep(false)}>Atrás</Button>
              <Button onClick={handleDuplicatePOA} loading={duplicating} variant="main">
                Sí, Confirmar Duplicación
              </Button>
            </Flex>
          </>
        )}
      </Modal>
    </PageLayout>
  );
};

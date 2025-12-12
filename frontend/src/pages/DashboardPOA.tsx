import React, { useEffect, useState } from 'react';
import { PageHeader, Card, Divider, Grid, Table, Badge } from '../components/common';
import { KPICard, StatusPill, Status } from '../components/poa';
import { Button } from '../components/common/Button';
import { authApi } from '../services/authApi';
import apiClient from '../services/apiClient';

export const DashboardPOA: React.FC = () => {

  const [proyectos, setProyectos] = useState<any[]>([]);
  const [actividadesMes, setActividadesMes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================
  //  CARGAR DATOS DESDE BACKEND
  // ============================
  useEffect(() => {
    const load = async () => {
      try {
        // 🚀 AQUÍ SE ARREGLA EL ERROR
        const { data } = await apiClient.get(`/api/proyectos/dashboard?anio=2025`);

        setProyectos(data.proyectos || []);
        setActividadesMes(data.actividadesMes || []);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
      setLoading(false);
    };

    load();
  }, []);

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
const pctDisponible =
  totalAprobado > 0 ? (dispPortafolio / totalAprobado) * 100 : 0;

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

const urlSeguimiento = 'seguimiento_proyecto.html';

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

  return (
    <div style={containerStyle}>
      <PageHeader
        title="Universidad de Sonsonate"
        subtitle="Dashboard POA - Portafolio de Proyectos"
        userName="Carlos Roberto Martínez Martínez"
        onLogout={authApi.logout}
      />
      

      <main style={mainStyle}>
        <Card>

          {/* PANEL SUPERIOR */}
          <div style={cardHeaderStyle}>
            <div>
              <h1 style={cardTitleStyle}>Resumen del portafolio de proyectos POA</h1>
              <p style={cardSubStyle}>
                Visión global del presupuesto, avance y resultados de todos los proyectos activos.
              </p>
            </div>

            <Button variant="alt" onClick={() => window.print()}>
              🖨 Imprimir dashboard
            </Button>
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
                Mes de referencia: <strong>Marzo 2025</strong><br />
                Este resumen consolida los datos de todos los proyectos aprobados en el POA.
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
    </div>
  );
};

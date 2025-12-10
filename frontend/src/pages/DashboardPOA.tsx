import React, { useMemo } from 'react';
import { PageHeader, Card, Divider, Grid, Table, Badge } from '../components/common';
import { KPICard, StatusPill, Status } from '../components/poa';
import { Button } from '../components/common/Button';

export const DashboardPOA: React.FC = () => {
  // Datos de ejemplo del prototipo (idénticos al HTML)
  const proyectos = useMemo(() => ([
    {
      id: 1,
      nombre: "Gestión de acreditación de la Carrera de Ingeniería Industrial",
      anio: 2025,
      responsable: "Coord. Ing. Industrial",
      presupuestoAprobado: 10000,
      gastado: 1500,
      avanceOperativo: 55,
      logroKpi: 62,
      actividadesMes: 3
    },
    {
      id: 2,
      nombre: "Fortalecimiento de laboratorios de Ingeniería Eléctrica",
      anio: 2025,
      responsable: "Coord. Ing. Eléctrica",
      presupuestoAprobado: 18000,
      gastado: 4000,
      avanceOperativo: 40,
      logroKpi: 35,
      actividadesMes: 4
    },
    {
      id: 3,
      nombre: "Programa de vinculación con el sector productivo Agronegocios",
      anio: 2025,
      responsable: "Coord. Ing. Agronegocios",
      presupuestoAprobado: 12000,
      gastado: 3000,
      avanceOperativo: 70,
      logroKpi: 55,
      actividadesMes: 5
    }
  ]), []);

  const actividadesMes = useMemo(() => ([
    {
      proyectoId: 1,
      proyectoNombre: "Gestión de acreditación de la Carrera de Ingeniería Industrial",
      nombre: "Acercamiento y entendimiento con ACAAI",
      responsable: "Carlos Martínez",
      estado: "I" as Status,
      avanceActividad: 60,
      logroKpiActividad: 40
    },
    {
      proyectoId: 1,
      proyectoNombre: "Gestión de acreditación de la Carrera de Ingeniería Industrial",
      nombre: "Capacitación de actores de la USO",
      responsable: "Equipo de acreditación",
      estado: "P" as Status,
      avanceActividad: 30,
      logroKpiActividad: 30
    },
    {
      proyectoId: 2,
      proyectoNombre: "Fortalecimiento de laboratorios de Ingeniería Eléctrica",
      nombre: "Adquisición de equipo de medición",
      responsable: "Ing. responsable de laboratorio",
      estado: "I" as Status,
      avanceActividad: 45,
      logroKpiActividad: 20
    },
    {
      proyectoId: 2,
      proyectoNombre: "Fortalecimiento de laboratorios de Ingeniería Eléctrica",
      nombre: "Capacitación en uso de equipo",
      responsable: "Unidad de capacitación",
      estado: "P" as Status,
      avanceActividad: 0,
      logroKpiActividad: 0
    },
    {
      proyectoId: 3,
      proyectoNombre: "Programa de vinculación con el sector productivo Agronegocios",
      nombre: "Diseño de talleres con productores",
      responsable: "Equipo Agronegocios",
      estado: "F" as Status,
      avanceActividad: 100,
      logroKpiActividad: 90
    },
    {
      proyectoId: 3,
      proyectoNombre: "Programa de vinculación con el sector productivo Agronegocios",
      nombre: "Ejecución de jornadas de campo",
      responsable: "Equipo de campo",
      estado: "I" as Status,
      avanceActividad: 50,
      logroKpiActividad: 40
    }
  ]), []);

  // Helpers y cálculos idénticos al script del HTML
  const formatoDinero = (v: number) => "$ " + v.toLocaleString("es-SV", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalProyectos = proyectos.length;
  const totalAprobado = proyectos.reduce((s, p) => s + p.presupuestoAprobado, 0);
  const totalGastado = proyectos.reduce((s, p) => s + p.gastado, 0);
  const dispPortafolio = totalAprobado - totalGastado;
  const promAvance = totalProyectos ? Math.round(proyectos.reduce((s, p) => s + p.avanceOperativo, 0) / totalProyectos) : 0;
  const promLogro = totalProyectos ? Math.round(proyectos.reduce((s, p) => s + p.logroKpi, 0) / totalProyectos) : 0;
  const pctGastadoPortafolio = totalAprobado > 0 ? (totalGastado / totalAprobado) * 100 : 0;
  const totalActivMes = proyectos.reduce((s, p) => s + p.actividadesMes, 0);

  const cP = actividadesMes.filter(a => a.estado === 'P').length;
  const cI = actividadesMes.filter(a => a.estado === 'I').length;
  const cF = actividadesMes.filter(a => a.estado === 'F').length;

  const urlSeguimiento = 'seguimiento_proyecto.html';

  // Estilos inline
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
      />

      <main style={mainStyle}>
        <Card>
          {/* CABECERA */}
          <div style={cardHeaderStyle}>
            <div>
              <h1 style={cardTitleStyle}>Resumen del portafolio de proyectos POA</h1>
              <p style={cardSubStyle}>Visión global del presupuesto, avance y resultados de todos los proyectos activos.</p>
            </div>
            <Button variant="alt" type="button" onClick={() => window.print()}>🖨 Imprimir dashboard</Button>
          </div>

          <Divider variant="gradient" />

          {/* PANEL 1: KPI DEL PORTAFOLIO */}
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

          {/* PANEL 2: LISTADO DE PROYECTOS (TABLA) */}
          <Card variant="dark" padding="1rem 1rem 1rem" style={{ marginBottom: '1.3rem' }}>
            <div style={sectionTitleStyle}>
              <span style={sectionTitleBeforeStyle}></span>
              Listado de proyectos activos
            </div>
            <div style={sectionDividerStyle}></div>
            <p style={sectionDescStyle}>
              Visión compacta para más de 20 proyectos: por fila se muestra presupuesto y porcentajes clave.
            </p>

            <Table>
              <Table.Header>
                <Table.Row hover={false}>
                  <Table.Cell header style={{ width: '26%' }}>Proyecto</Table.Cell>
                  <Table.Cell header center style={{ width: '6%' }}>Año</Table.Cell>
                  <Table.Cell header style={{ width: '18%' }}>Responsable</Table.Cell>
                  <Table.Cell header style={{ width: '10%' }}>Aprobado</Table.Cell>
                  <Table.Cell header style={{ width: '10%' }}>Gastado</Table.Cell>
                  <Table.Cell header style={{ width: '10%' }}>Disponible</Table.Cell>
                  <Table.Cell header center style={{ width: '8%' }}>Avance %</Table.Cell>
                  <Table.Cell header center style={{ width: '8%' }}>Logro %</Table.Cell>
                  <Table.Cell header center style={{ width: '9%' }}>Act. mes</Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {proyectos.map((p) => {
                  const disp = p.presupuestoAprobado - p.gastado;
                  return (
                    <Table.Row key={p.id}>
                      <Table.Cell>
                        <a href={`${urlSeguimiento}?proyectoId=${encodeURIComponent(p.id)}`} style={proyectoLinkStyle}>
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
                      <Table.Cell center>
                        <Badge variant="circle">{p.actividadesMes}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Card>

          {/* PANEL 3: ACTIVIDADES DEL MES (CAJA DIFERENCIADA) */}
          <Card variant="accent" padding="1rem 1rem 1.1rem" style={{ marginTop: '1rem' }}>
            <div style={{ ...sectionTitleStyle, color: 'var(--texto-actividades)' }}>
              <span style={sectionTitleBeforeStyle}></span>
              Actividades del mes (todos los proyectos)
            </div>
            <div style={sectionDividerStyle}></div>
            <p style={{ ...sectionDescStyle, color: 'var(--texto-actividades-sec)' }}>
              Vista consolidada de las actividades que tienen ejecución este mes: proyecto, responsable y estado.
            </p>

            <Table variant="activities">
              <Table.Header>
                <Table.Row hover={false}>
                  <Table.Cell header style={{ width: '30%' }}>Actividad</Table.Cell>
                  <Table.Cell header style={{ width: '26%' }}>Proyecto</Table.Cell>
                  <Table.Cell header style={{ width: '18%' }}>Responsable</Table.Cell>
                  <Table.Cell header style={{ width: '9%' }}>Estado</Table.Cell>
                  <Table.Cell header center style={{ width: '9%' }}>Avance act. %</Table.Cell>
                  <Table.Cell header center style={{ width: '8%' }}>Logro KPI %</Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {actividadesMes.map((a, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <a
                        href={`${urlSeguimiento}?proyectoId=${encodeURIComponent(a.proyectoId)}&actividad=${encodeURIComponent(a.nombre)}`}
                        style={actividadLinkStyle}
                      >
                        {a.nombre}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{a.proyectoNombre}</Table.Cell>
                    <Table.Cell>{a.responsable}</Table.Cell>
                    <Table.Cell>
                      <StatusPill status={a.estado} />
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

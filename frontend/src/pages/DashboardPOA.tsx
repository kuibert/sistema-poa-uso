import React, { useMemo } from 'react';
import './DashboardPrototype.css';

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
      estado: "I",
      avanceActividad: 60,
      logroKpiActividad: 40
    },
    {
      proyectoId: 1,
      proyectoNombre: "Gestión de acreditación de la Carrera de Ingeniería Industrial",
      nombre: "Capacitación de actores de la USO",
      responsable: "Equipo de acreditación",
      estado: "P",
      avanceActividad: 30,
      logroKpiActividad: 30
    },
    {
      proyectoId: 2,
      proyectoNombre: "Fortalecimiento de laboratorios de Ingeniería Eléctrica",
      nombre: "Adquisición de equipo de medición",
      responsable: "Ing. responsable de laboratorio",
      estado: "I",
      avanceActividad: 45,
      logroKpiActividad: 20
    },
    {
      proyectoId: 2,
      proyectoNombre: "Fortalecimiento de laboratorios de Ingeniería Eléctrica",
      nombre: "Capacitación en uso de equipo",
      responsable: "Unidad de capacitación",
      estado: "P",
      avanceActividad: 0,
      logroKpiActividad: 0
    },
    {
      proyectoId: 3,
      proyectoNombre: "Programa de vinculación con el sector productivo Agronegocios",
      nombre: "Diseño de talleres con productores",
      responsable: "Equipo Agronegocios",
      estado: "F",
      avanceActividad: 100,
      logroKpiActividad: 90
    },
    {
      proyectoId: 3,
      proyectoNombre: "Programa de vinculación con el sector productivo Agronegocios",
      nombre: "Ejecución de jornadas de campo",
      responsable: "Equipo de campo",
      estado: "I",
      avanceActividad: 50,
      logroKpiActividad: 40
    }
  ]), []);

  // Helpers y cálculos idénticos al script del HTML
  const formatoDinero = (v: number) => "$ " + v.toLocaleString("es-SV", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const estadoTexto = (estado: string) => estado === 'P' ? 'Pendiente' : estado === 'I' ? 'En proceso' : estado === 'F' ? 'Finalizada' : '-';

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

  return (
    <div className="dashboard-prototype">
      <header>
        <div>
          <div className="brand-title">Universidad de Sonsonate</div>
          <div className="brand-sub">Dashboard POA - Portafolio de Proyectos</div>
        </div>
        <div className="user">
          Usuario:<br />
          <strong>Carlos Roberto Martínez Martínez</strong>
        </div>
      </header>

      <main>
        <section className="card">
          {/* CABECERA */}
          <div className="card-header">
            <div>
              <h1 className="card-title">Resumen del portafolio de proyectos POA</h1>
              <p className="card-sub">Visión global del presupuesto, avance y resultados de todos los proyectos activos.</p>
            </div>
            <button className="btn btn-alt" type="button" onClick={() => window.print()}>🖨 Imprimir dashboard</button>
          </div>

          <div className="divider"></div>

          {/* PANEL 1: KPI DEL PORTAFOLIO */}
          <div className="panel-portafolio">
            <div className="portafolio-resumen">
              <div className="portafolio-texto">
                Proyectos activos: <strong id="lbl-total-proyectos">{totalProyectos}</strong><br />
                Seguimiento por ejecución del plan, logro de indicadores y uso de presupuesto.
              </div>
              <div className="portafolio-texto">
                Mes de referencia: <strong id="lbl-mes-ref">Marzo 2025</strong><br />
                Este resumen consolida los datos de todos los proyectos aprobados en el POA.
              </div>
            </div>

            <div className="kpi-grid">
              {/* Presupuesto del portafolio */}
              <div className="kpi-card">
                <div className="kpi-label">Presupuesto del portafolio</div>
                <div className="kpi-value" id="kpi-pres-disponible-portfolio">{formatoDinero(dispPortafolio)}</div>
                <div className="kpi-sub">
                  Aprobado: <span id="kpi-pres-aprobado-portfolio">{formatoDinero(totalAprobado)}</span> · Gastado:
                  <span id="kpi-pres-gastado-portfolio"> {formatoDinero(totalGastado)}</span>
                </div>
                <div className="kpi-bar-bg">
                  <div className="kpi-bar-fill" id="kpi-pres-bar-portfolio" style={{ width: `${Math.min(pctGastadoPortafolio, 100)}%` }}></div>
                </div>
              </div>

              {/* Avance operativo */}
              <div className="kpi-card">
                <div className="kpi-label">Avance operativo promedio</div>
                <div className="kpi-value" id="kpi-avance-portfolio">{promAvance}%</div>
                <div className="kpi-sub">
                  Calculado a partir de los meses P/I/F de todas las actividades.
                </div>
                <div className="kpi-bar-bg">
                  <div className="kpi-bar-fill" id="kpi-avance-bar-portfolio" style={{ width: `${Math.min(promAvance, 100)}%` }}></div>
                </div>
              </div>

              {/* Logro de indicadores */}
              <div className="kpi-card">
                <div className="kpi-label">Logro promedio de indicadores (KPI)</div>
                <div className="kpi-value" id="kpi-logro-portfolio">{promLogro}%</div>
                <div className="kpi-sub">
                  Promedio de cumplimiento de metas de los proyectos.
                </div>
                <div className="kpi-bar-bg">
                  <div className="kpi-bar-fill" id="kpi-logro-bar-portfolio" style={{ width: `${Math.min(promLogro, 100)}%` }}></div>
                </div>
              </div>

              {/* Actividades del mes */}
              <div className="kpi-card">
                <div className="kpi-label">Actividades del mes en todo el portafolio</div>
                <div className="kpi-value" id="kpi-activ-mes-portfolio">{totalActivMes}</div>
                <div className="kpi-sub" id="kpi-activ-detalle-portfolio">
                  Pendientes: {cP} · En proceso: {cI} · Finalizadas: {cF}
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: LISTADO DE PROYECTOS (TABLA) */}
          <div className="panel-proyectos">
            <div className="section-title">Listado de proyectos activos</div>
            <div className="section-divider"></div>
            <p className="section-desc">
              Visión compacta para más de 20 proyectos: por fila se muestra presupuesto y porcentajes clave.
            </p>

            <table className="tabla-proyectos" id="tabla-proyectos">
              <thead>
                <tr>
                  <th style={{ width: '26%' }}>Proyecto</th>
                  <th style={{ width: '6%' }} className="center">Año</th>
                  <th style={{ width: '18%' }}>Responsable</th>
                  <th style={{ width: '10%' }}>Aprobado</th>
                  <th style={{ width: '10%' }}>Gastado</th>
                  <th style={{ width: '10%' }}>Disponible</th>
                  <th style={{ width: '8%' }} className="center">Avance %</th>
                  <th style={{ width: '8%' }} className="center">Logro %</th>
                  <th style={{ width: '9%' }} className="center">Act. mes</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((p) => {
                  const disp = p.presupuestoAprobado - p.gastado;
                  return (
                    <tr key={p.id}>
                      <td>
                        <a href={`${urlSeguimiento}?proyectoId=${encodeURIComponent(p.id)}`} className="proyecto-link">
                          {p.nombre}
                        </a>
                      </td>
                      <td className="center">{p.anio}</td>
                      <td>{p.responsable}</td>
                      <td>{formatoDinero(p.presupuestoAprobado)}</td>
                      <td>{formatoDinero(p.gastado)}</td>
                      <td>{formatoDinero(disp)}</td>
                      <td className="center">{p.avanceOperativo}%</td>
                      <td className="center">{p.logroKpi}%</td>
                      <td className="center">
                        <span className="badge-activ">{p.actividadesMes}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PANEL 3: ACTIVIDADES DEL MES (CAJA DIFERENCIADA) */}
          <div className="panel-actividades">
            <div className="section-title">Actividades del mes (todos los proyectos)</div>
            <div className="section-divider"></div>
            <p className="section-desc">
              Vista consolidada de las actividades que tienen ejecución este mes: proyecto, responsable y estado.
            </p>

            <table className="actividades-tabla" id="tabla-actividades-mes">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Actividad</th>
                  <th style={{ width: '26%' }}>Proyecto</th>
                  <th style={{ width: '18%' }}>Responsable</th>
                  <th style={{ width: '9%' }}>Estado</th>
                  <th style={{ width: '9%' }} className="center">Avance act. %</th>
                  <th style={{ width: '8%' }} className="center">Logro KPI %</th>
                </tr>
              </thead>
              <tbody>
                {actividadesMes.map((a, idx) => (
                  <tr key={idx}>
                    <td>
                      <a
                        href={`${urlSeguimiento}?proyectoId=${encodeURIComponent(a.proyectoId)}&actividad=${encodeURIComponent(a.nombre)}`}
                        className="actividad-link"
                      >
                        {a.nombre}
                      </a>
                    </td>
                    <td>{a.proyectoNombre}</td>
                    <td>{a.responsable}</td>
                    <td>
                      <span className={`estado-pill estado-${a.estado}`}>
                        {estadoTexto(a.estado)}
                      </span>
                    </td>
                    <td className="center">{a.avanceActividad}%</td>
                    <td className="center">{a.logroKpiActividad}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

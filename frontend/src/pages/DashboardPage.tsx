import React, { useEffect, useState } from "react";
import "../assets/styles/global.css";
import "../assets/styles/dashboard.css";

export default function DashboardPage() {
  const [proyectos, setProyectos] = useState([]);
  const [actividadesMes, setActividadesMes] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setProyectos([
      {
        id: 1,
        nombre: "Gestión de acreditación de la Carrera de Ingeniería Industrial",
        anio: 2025,
        responsable: "Coord. Ing. Industrial",
        aprobado: 10000,
        gastado: 1500,
        avance: 55,
        logro: 62,
        actividadesMes: 3,
      },
      {
        id: 2,
        nombre: "Fortalecimiento de laboratorios de Ingeniería Eléctrica",
        anio: 2025,
        responsable: "Coord. Ing. Eléctrica",
        aprobado: 18000,
        gastado: 4000,
        avance: 40,
        logro: 35,
        actividadesMes: 4,
      },
      {
        id: 3,
        nombre: "Programa de vinculación con el sector productivo Agronegocios",
        anio: 2025,
        responsable: "Coord. Agronegocios",
        aprobado: 12000,
        gastado: 3000,
        avance: 70,
        logro: 55,
        actividadesMes: 5,
      },
    ]);

    setActividadesMes([
      {
        nombre: "Acercamiento y entendimiento con ACAAI",
        proyectoNombre: "Gestión de acreditación de Ingeniería Industrial",
        responsable: "Carlos Martínez",
        estado: "I",
        avanceActividad: 60,
        logroKpiActividad: 40,
      },
      {
        nombre: "Capacitación USO",
        proyectoNombre: "Gestión de acreditación de Ingeniería Industrial",
        responsable: "Equipo USO",
        estado: "P",
        avanceActividad: 30,
        logroKpiActividad: 30,
      },
      {
        nombre: "Talleres con productores",
        proyectoNombre: "Vinculación Agronegocios",
        responsable: "Equipo Agro",
        estado: "F",
        avanceActividad: 100,
        logroKpiActividad: 90,
      },
    ]);
  };

  const formatoDinero = (n: number) =>
    "$ " + n.toLocaleString("es-SV", { minimumFractionDigits: 2 });

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">

        {/* CARD PRINCIPAL */}
        <div className="dashboard-main-card">

          <div className="header-row">
            <h1>Resumen del portafolio de proyectos POA</h1>

            <button className="btn-green-outline">
              🖨 Imprimir dashboard
            </button>
          </div>

          {/* TEXTOS SUPERIORES EXACTOS DEL PROTOTIPO */}
          <p className="texto-sec">
            Visión global del presupuesto, avance y resultados de los proyectos activos.
          </p>

          <div className="divider-green-difuminado"></div>

          <p className="texto-sec">
            Proyectos activos: <strong>3</strong>
          </p>

          <p className="texto-sec">
            Seguimiento por ejecución del plan, logro de indicadores y uso de presupuesto.
          </p>

          <br />

          <p className="texto-sec">
            Mes de referencia: <strong>Marzo 2025</strong>
          </p>

          <p className="texto-sec" style={{ marginBottom: "25px" }}>
            Este resumen consolida los datos de todos los proyectos aprobados en el POA.
          </p>

         

          {/* KPI GRID */}
          <div className="kpi-grid">

            <div className="kpi-card">
              <div className="kpi-title">Presupuesto del portafolio</div>
              <div className="kpi-value">$ 31,500.00</div>
              <div className="kpi-sub">Aprobado: $ 40,000 · Gastado: $ 8,500</div>
              <div className="kpi-bar-bg">
                <div className="kpi-bar-fill" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Avance operativo promedio</div>
              <div className="kpi-value">55%</div>
              <div className="kpi-sub">Calculado a partir de los meses P/I/F de todas las actividades.</div>
              <div className="kpi-bar-bg">
                <div className="kpi-bar-fill" style={{ width: "55%" }}></div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Logro promedio de indicadores (KPI)</div>
              <div className="kpi-value">51%</div>
              <div className="kpi-sub">Promedio de cumplimiento de metas de los proyectos.</div>
              <div className="kpi-bar-bg">
                <div className="kpi-bar-fill" style={{ width: "51%" }}></div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Actividades del mes en todo el portafolio</div>
              <div className="kpi-value">12</div>
              <div className="kpi-sub">Pendientes: 2 · En proceso: 3 · Finalizadas: 1</div>
            </div>

          </div>
        </div>

        {/* TABLA PROYECTOS ACTIVOS */}
        

        <div className="card">
          <h2 className="section-title"><span className="barra-verde"></span> Listado de proyectos activos</h2>
          <div className="divider-green-delgada"></div>
          <p className="texto-sec">
              Visión compacta para mas de 20 proyectos: por fila se muestra presupuesto y porcentaje clave. 
          </p>  
          <table>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Año</th>
                <th>Responsable</th>
                <th>Aprobado</th>
                <th>Gastado</th>
                <th>Disponible</th>
                <th>Avance %</th>
                <th>Logro %</th>
                <th>Act. mes</th>
              </tr>
            </thead>

            <tbody>
              {proyectos.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.anio}</td>
                  <td>{p.responsable}</td>
                  <td>{formatoDinero(p.aprobado)}</td>
                  <td>{formatoDinero(p.gastado)}</td>
                  <td>{formatoDinero(p.aprobado - p.gastado)}</td>
                  <td className="center">{p.avance}%</td>
                  <td className="center">{p.logro}%</td>
                  <td className="center">
                    <span className="badge">{p.actividadesMes}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TABLA ACTIVIDADES */}
        

        <div className="card-verde">
          <h2 className="section-title"><span className="barra-verde"></span> Actividades del mes (todos los proyectos)</h2>
          <div className="divider-green-delgada"></div>
          <p className="texto-sec">
            Visión consolida de las actividades que tienen ejecución en este mes: proyecto, responsable y estado.
          </p>  
          <table>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Proyecto</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Avance</th>
                <th>Logro KPI</th>
              </tr>
            </thead>

            <tbody>
              {actividadesMes.map((a: any, i: number) => (
                <tr key={i}>
                  <td>{a.nombre}</td>
                  <td>{a.proyectoNombre}</td>
                  <td>{a.responsable}</td>

                  <td>
                    <span className={`estado-pill estado-${a.estado}`}>
                      {a.estado === "P"
                        ? "Pendiente"
                        : a.estado === "I"
                        ? "En proceso"
                        : "Finalizada"}
                    </span>
                  </td>

                  <td className="center">{a.avanceActividad}%</td>
                  <td className="center">{a.logroKpiActividad}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

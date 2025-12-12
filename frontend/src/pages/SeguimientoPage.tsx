import React, { useState, useEffect } from "react";
import "../assets/styles/global.css";

export const SeguimientoPage: React.FC = () => {
  // ============================
  //    DATOS QUEMADOS (SIMULADOS)
  // ============================
  const proyectos = [
    { id: 1, nombre: "Gestión de acreditación de Ingeniería Industrial", anio: 2025 },
    { id: 2, nombre: "Fortalecimiento de laboratorios de Eléctrica", anio: 2025 },
  ];

  const actividadesSimuladas = [
    {
      id: 1,
      nombre: "Acercamiento y entendimiento con ACAAI",
      responsable: "Carlos Martínez",
      presupuesto: 50,
      gastado: 10,
      meses: { Feb: "I", Mar: "P", Abr: "F" },
      indicador: {
        categoria: "% de actividades ejecutadas",
        unidad: "Reuniones",
        meta: 4,
        logrado: 2,
      },
    },
    {
      id: 2,
      nombre: "Capacitación de actores de la USO",
      responsable: "Equipo USO",
      presupuesto: 60,
      gastado: 20,
      meses: { Ene: "P", Feb: "I", Mar: "I", May: "F" },
      indicador: {
        categoria: "N° de personas beneficiadas directamente",
        unidad: "Personas",
        meta: 12,
        logrado: 8,
      },
    },
  ];

  // ============================
  //    ESTADOS DE PÁGINA
  // ============================
  const [proyectoSel, setProyectoSel] = useState(1);
  const [anioSel, setAnioSel] = useState(2025);
  const [actividades, setActividades] = useState<any[]>([]);

  useEffect(() => {
    // cargar datos según proyecto seleccionado
    setActividades(actividadesSimuladas);
  }, [proyectoSel]);

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const formatoDinero = (n: number) =>
    "$ " + n.toLocaleString("es-SV", { minimumFractionDigits: 2 });

  // Funcion para obtener color del estado
  const getEstadoClase = (estado: string) => {
    if (estado === "P") return "estado-pill estado-P";
    if (estado === "I") return "estado-pill estado-I";
    if (estado === "F") return "estado-pill estado-F";
    return "estado-pill";
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-inner">

        <div className="dashboard-main-card">
          {/* ====================== TÍTULO ====================== */}
          <h1>Avance por actividad</h1>
          <p className="texto-sec">
            Gantt mensual, responsable y cumplimiento de indicadores de logro.
          </p>

          <div className="divider-green-difuminado"></div>

          {/* ====================== SELECCIÓN DE PROYECTO ====================== */}
          <div>
            <h2 style={{ marginBottom: "10px" }}> <span className="barra-verde"></span> Proyecto seleccionado</h2>

            <div className="form-grid-2">
              <div>
                <label>Proyecto</label>
                <select
                  value={proyectoSel}
                  onChange={(e) => setProyectoSel(Number(e.target.value))}

                >
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Año</label>
                <select value={anioSel} onChange={(e) => setAnioSel(Number(e.target.value))}>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divider-green-difuminado"></div>

          {/* ====================== LISTA DE ACTIVIDADES ====================== */}
          <h2 className="section-title"> <span className="barra-verde"></span>Actividades, indicadores y avance</h2>

          <p className="texto-sec">
            Estados mensuales: - (no aplica), <strong>P</strong> (Pendiente), <strong>I</strong> (Iniciando), <strong>F</strong>(Finalizado) <br />
            El progreso de la actividad se calcula con los meses P/I/F. El cumplimiento del Iniciador se calcula a partir
            de lo alcanzado y le meta definida en la pagina 1.
          </p>
          <div className="divider-green-delgada"></div>
          {actividades.map((a) => (
            <div key={a.id} style={{ marginBottom: "25px" }}>

              <div className="header-activity-name" style={{ background: "none" }}>
                <h3 className="texto-verde">Actividad 1</h3>
                <div className="activity-name" style={{ display: "block" }}>
                  <input type="text" value="Acercamiento y entendimiento con ACAAI" style={{ width: "100%" }} />
                  <br /><br />
                  <div>
                    <label>Responsable de la actividad</label>
                    <input type="text" disabled placeholder="Nombre del responsable" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
              {/* <h3 style={{ marginBottom: "10px" }}>{a.nombre}</h3>
              <p className="texto-sec">Responsable de la actividad: <strong>{a.responsable}</strong></p> */}



              {/* ---------------- MESES ---------------- */}
              <table style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    {meses.map((m) => (
                      <th key={m}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {meses.map((m) => (
                      <td key={m} className="center">
                        <span className={getEstadoClase(a.meses[m] || "-")}>
                          {a.meses[m] || "-"}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* ---------------- PROGRESO ---------------- */}
              <div className="progreso-container">
                <div style={{ width: "30%", display: "flex" }}>
                  <strong>Progreso:</strong>
                  <div className="kpi-bar-bg" style={{ marginTop: "8px", marginLeft: "10px" }}>
                    <div className="kpi-bar-fill" style={{ width: `${a.meses.Mar ? 50 : 20}%` }}></div>
                  </div>
                  <strong style={{ paddingLeft: "10px" }}>42%</strong>
                </div>

                <div>
                  <div className="texto-sec" style={{ "marginLeft": "20px" }} >
                    | Presupuesto: {formatoDinero(a.presupuesto)} | Gastado: {formatoDinero(a.gastado)} | Disponible:{" "}
                    {formatoDinero(a.presupuesto - a.gastado)}
                  </div>
                </div>

              </div>

              {/* ---------------- INDICADOR ---------------- */}
              <div className="header-activity-name" style={{ padding: "10px", marginTop: "20px" }}>
                <h4 className="texto-verde">Indicador de logro de la actividad</h4>
                <br />
                <div className="form-grid-3">
                  <div>
                    <label>Categoria</label>
                    <select
                      value={proyectoSel}
                      onChange={(e) => setProyectoSel(Number(e.target.value))}

                    >
                      {proyectos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Meta</label>
                    <input type="text" placeholder="4" />
                  </div>
                  <div>
                    <label>Unidad</label>
                    <input type="text" placeholder="Reuniones" />
                  </div>
                </div>
                <div className="form-grid-3">
                  <div>
                    <label>Beneficiarios</label>
                    <input type="text" placeholder="Equipo de acreditacion" />
                  </div>
                </div>
                <div className="form-grid">
                  <div>
                    <label>Descripcion especifica del indicador</label>
                    <input type="text" placeholder="Breve descripcion" />
                  </div>
                </div>
                <br />
                <div className="form-grid-2">
                  <div>
                    <label>Valor alcanzado a la fecha</label>
                    <input type="text" placeholder="0" />
                  </div>
                  <div>
                    <label>Cumplimiento del indicador</label>
                    <input type="text" placeholder="0%" />
                  </div>
                </div>
              </div>


              {/* ---------------- BOTONES ---------------- */}
              <div style={{ marginTop: "20px", display: "flex", gap: "14px" }}>
                <button style={{ padding: "8px 16px" }} className="btn-green-outline">📁 Evidencias</button>
                <button style={{ padding: "8px 16px" }} className="btn-green-outline">💲 Gastos</button>
              </div>
              <div className="divider-green"></div>
            </div>

          ))}

        </div>


      </div>


    </div>
  );
};

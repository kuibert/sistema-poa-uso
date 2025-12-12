import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import "../styles/global.css"; // estilos generales si los tienes
=======
import "../assets/styles/global.css"; // estilos generales si los tienes
>>>>>>> origin/DevGabriela

export default function ActividadGastos() {
  // Valores iniciales (simulados igual que tu HTML)
  const [proyecto] = useState(
    "Gestión de acreditación de la Carrera de Ingeniería Industrial"
  );
  const [actividad] = useState("Acercamiento y entendimiento con ACAAI");

  // Totales
  const [montoAsignado, setMontoAsignado] = useState<number>(0);
  const [montoGastado, setMontoGastado] = useState<number>(0);
  const [montoDisponible, setMontoDisponible] = useState<number>(0);

  // Lista de gastos
  const [gastos, setGastos] = useState<
    { fecha: string; descripcion: string; monto: number }[]
  >([
    // Arranca vacío, el usuario puede agregar filas como en el HTML
    { fecha: "", descripcion: "", monto: 0 },
  ]);

  // Recalcular totales cuando cambian los gastos o el monto asignado
  useEffect(() => {
    const total = gastos.reduce(
      (sum, g) => sum + (g.monto ? Number(g.monto) : 0),
      0
    );
    setMontoGastado(total);
    setMontoDisponible(montoAsignado - total);
  }, [gastos, montoAsignado]);

  // Agregar fila
  const agregarFila = () => {
    setGastos([...gastos, { fecha: "", descripcion: "", monto: 0 }]);
  };

  // Eliminar fila
  const eliminarFila = (index: number) => {
    setGastos(gastos.filter((_, i) => i !== index));
  };

  // Editar fila
  const actualizarFila = (
    index: number,
    campo: "fecha" | "descripcion" | "monto",
    valor: string | number
  ) => {
    const copia = [...gastos];
    (copia[index] as any)[campo] = valor;
    setGastos(copia);
  };

  return (

    <div className="dashboard-container">
      <div className="dashboard-inner">

        {/* CARD PRINCIPAL */}
        <div className="dashboard-main-card">

          <div>
            <div className="header-row">
              <h1>Gastos de la actividad: Acercamiento y entendimiento con ACAAI.</h1>

              <button className="btn-green-outline">
                🖨 Imprimir dashboard
              </button>
            </div>

            <p className="texto-sec">
              Fecha, descripcion y monto, actualizando el disponible de la actividad.
            </p>

            <div className="divider-green-difuminado"></div>

            <div className="container-gasto">
              {/* INFO INICIAL */}
              <div style={{ marginBottom: "1rem", width: "60%", padding: "10px", }}>
                <label>Proyecto</label>
                <input type="text" value={proyecto} readOnly />

                <label style={{ marginTop: ".6rem" }}>Nombre de la actividad</label>
                <input type="text" value={actividad} readOnly />
              </div>

              {/* RESUMEN FINANCIERO */}
              <div
                style={{
                  background: "#101f3b",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "1rem",
                  width: "40%",
                  alignSelf: ""
                }}
              >
                <div style={{ display: "flex", flexDirection: "column"}}>
                  <div>
                    <label>Monto asignado a la actividad ($)</label>
                    <input
                      type="number"
                      value={montoAsignado}
                      onChange={(e) => setMontoAsignado(Number(e.target.value))}
                    />
                  </div>
                <br />
                  <div>
                    <label>Total gastado ($)</label>
                    <input type="number" value={montoGastado} readOnly />
                  </div>
                <br />
                  <div>
                    <label>Disponible ($)</label>
                    <input type="number" value={montoDisponible} readOnly />
                  </div>
                </div>
              </div>
            </div>



            {/* TABLA DE GASTOS */}
            <div
              style={{
                background: "#101f3b",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#bfc7d1" }}>
                  Lista simple de gastos: fecha, descripción y monto.
                </span>

                <button
                  className="btn-green-outline"
                  onClick={agregarFila}
                  style={{ padding: ".25rem .6rem" }}
                >
                  ➕ Agregar gasto
                </button>
              </div>

              <table className="tabla-gastos">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Monto ($)</th>
                    <th className="center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((g, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="date"
                          value={g.fecha}
                          onChange={(e) => actualizarFila(i, "fecha", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Detalle del gasto"
                          value={g.descripcion}
                          onChange={(e) =>
                            actualizarFila(i, "descripcion", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={g.monto}
                          onChange={(e) =>
                            actualizarFila(i, "monto", Number(e.target.value))
                          }
                        />
                      </td>
                      <td className="center">
                        <button
                          className="btn-green-outline"
                          onClick={() => eliminarFila(i)}
                        >
                          ✖
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* BOTÓN GUARDAR SIMULADO */}
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button
                  className="btn-green-outline"
                  onClick={() => alert("Simulación: gastos guardados")}
                >
                  💾 Guardar (simulado)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

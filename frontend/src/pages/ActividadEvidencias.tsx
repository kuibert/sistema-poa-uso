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
              <h1>Evidencias de la actividad</h1>

              <button className="btn-green-outline">
                🖨 Imprimir dashboard
              </button>
            </div>

            <p className="texto-sec">
              Subir, descubrir y consultar evidencias asociadas a una actividad del POA.
            </p>

            <div className="divider-green-difuminado"></div>

            <h2 className="section-title"><span className="barra-verde"></span> Proyecto y actividad</h2>
            <div className="divider-green-delgada"></div>

            <div className="form-grid-2" >
              <div>
                <label>Proyecto</label>
                <input
                  type="text"
                  name="descp"
                  placeholder="Docentes capacitados..."
                />
              </div>
              <div>
                <label>Actividad</label>
                <input
                  type="text"
                  name="meta"
                  placeholder="12"

                />
              </div>
            </div>
            <div className="form-grid-3" >
              <div>
                <label>Anio</label>
                <input
                  type="text"
                  name="descp"
                  placeholder="Docentes capacitados..."
                />
              </div>
              <div>
                <label>Responsable de la actividad</label>
                <input
                  type="text"
                  name="meta"
                  placeholder="12"

                />
              </div>
              <div>
                <label>Cargo / Unidad</label>
                <input
                  type="text"
                  name="meta"
                  placeholder="12"

                />
              </div>
            </div>

            <h2 className="section-title"><span className="barra-verde"></span> Registro de la nueva evidencia</h2>
            <div className="divider-green-delgada"></div>

            <p className="texto-sec">
              Cada evidencia puede ser un archivo (acta, lista, informe, fotografia, etc.) con su descripcion y fecha.
            </p>


            {/* TABLA DE GASTOS */}
            <div
              style={{
                background: "#101f3b",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                marginTop: "10px"
              }}
            >

              <div className="form-grid-3" >
                <div>
                  <label>Fecha de la evidencia</label>
                  <input
                    type="date"
                    name="descp"
                    placeholder="Docentes capacitados..."
                  />
                </div>
                <div>
                  <label>Tipo de evidencia</label>
                  <select name="tipo_evidencia" id="">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div>
                  <label>Archivo (simulacion)</label>
                  <input
                    type="file"
                    name="file_evidencia"
                    placeholder="12"

                  />
                </div>
              </div>

              <div >
                <label>Descripcion de la evidencias</label>
                <textarea
                  name="evidencias"
                  placeholder="Correos, actas, minutas, acuerdos."

                />
              </div>

              <div style={{display: "flex", justifyContent: "flex-end"}}>
              {/* BOTÓN GUARDAR SIMULADO */}
              <div style={{ marginTop: "1rem", marginRight: "10px"}}>
                <button
                  className="btn-green-outline"
                  onClick={() => alert("Simulación: gastos guardados")}
                >
                  Limpiar campos
                </button>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <button
                  className="btn-green-outline"
                  onClick={() => alert("Simulación: gastos guardados")}
                >
                  + Agregar evidencia
                </button>
              </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

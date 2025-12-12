import React, { useState } from "react";
<<<<<<< HEAD
import "../styles/global.css";
import "../styles/form.css";
import "../styles/registro.css";
=======
import "../assets/styles/global.css";
import "../assets/styles/form.css";
import "../assets/styles/registro.css";
>>>>>>> origin/DevGabriela


export default function ProyectoRegistroPage() {
  const [proyecto, setProyecto] = useState({
    anio: "",
    unidad: "",
    linea: "",
    objetivoEstrategico: "",
    accionEstrategica: "",
    nombreProyecto: "",
    responsable: "",
    objetivoProyecto: "",
  });

  const listFacultades = ["Faculta de Ingenieria y Ciencias Naturales", "Facultad de... 2", "Facultad de... 3"]
  const logros = ["Logro 1", "Logro 2", "Logro 3"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProyecto({
      ...proyecto,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        {/* CARD PRINCIPAL */}
        <div className="dashboard-main-card">

          {/* HEADER */}
          <div className="header-row">
            <h1>Registro de Proyecto POA</h1>

            <div>
              <button className="btn-green-outline" style={{ marginRight: "10px" }}>
                💾 Guardar
              </button>

              <button className="btn-green-outline">
                🖨 Imprimir PDF
              </button>
            </div>
          </div>

          <p className="texto-sec">
            Información estratégica, actividades, indicadores y presupuesto.
          </p>

          <div className="divider-green-difuminado"></div>

          {/* ============================= SECCIÓN 1 ============================= */}
          <h2 className="section-title" style={{ marginTop: "25px" }}>
            <span className="barra-verde"></span> Información estratégica
          </h2>
          <p className="texto-sec">Vinculación con el plan institucional.</p>
          <div className="divider-green-delgada"></div>

          {/* GRID 3 COLUMNAS */}
          <div className="form-grid-3">
            <div>
              <label>Año</label>
              <input
                type="number"
                name="anio"
                min="1900"
                max="2100"
                maxLength={4}
                placeholder="2025"
                value={proyecto.anio}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Unidad / Facultad</label>
              {/* <input
              type="text"
              name="unidad"
              placeholder="Facultad de Ingeniería..."
              value={proyecto.unidad}
              onChange={handleChange}
            /> */}
              <select name="unidad" id="unidad">
                <option selected disabled>Seleccionar</option>
                {listFacultades.map((p: any) => (
                  <option>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Línea estratégica</label>
              <input
                type="text"
                name="linea"
                placeholder="1. Mejora continua..."
                value={proyecto.linea}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* GRID 2 COLUMNAS */}
          <div className="form-grid-2">
            <div>
              <label>Objetivo estratégico</label>
              <textarea
                name="objetivoEstrategico"
                placeholder="Promover la excelencia..."
                value={proyecto.objetivoEstrategico}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Acción / Actividad estratégica</label>
              <textarea
                name="accionEstrategica"
                placeholder="Participar en procesos de acreditación..."
                value={proyecto.accionEstrategica}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ============================= SECCIÓN 2 ============================= */}
          <h2 className="section-title" style={{ marginTop: "35px" }}>
            <span className="barra-verde"></span> Datos del proyecto
          </h2>
          <div className="divider-green-delgada"></div>

          <div className="form-grid-2">
            <div>
              <label>Nombre del proyecto</label>
              <input
                type="text"
                name="nombreProyecto"
                placeholder="Gestión de acreditación..."
                value={proyecto.nombreProyecto}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Responsable</label>
              <input
                type="text"
                name="responsable"
                placeholder="Nombre y cargo..."
                value={proyecto.responsable}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Objetivo del proyecto</label>
            <textarea
              name="objetivoProyecto"
              placeholder="Describir qué se quiere lograr..."
              value={proyecto.objetivoProyecto}
              onChange={handleChange}
            />
          </div>


          {/* ============================= SECCIÓN 3 ============================= */}
          <h2 className="section-title" style={{ marginTop: "35px" }}>
            <span className="barra-verde"></span> Actividades, meses de ejecución e indicadores de logro
          </h2>
          <p className="texto-sec">Cada actividad tiene su nombre, meses de ejecución, indicador de logro y evidencias.</p>
          <div className="divider-green-delgada"></div>

          <div className="header-activity-name">
            <h3 className="texto-verde">Actividad 1</h3>
            <div className="activity-name">
              <input type="text" value="Acercamiento y entendimiento con ACAAI" style={{ width: "70%" }} />
              <button className="btn-green-outline">X</button>
            </div>
          </div>


          <div className="tabla-anio">
            <table style={{ width: "90%" }}>
              <thead>
                <tr>
                  <th>Ene</th>
                  <th>Feb</th>
                  <th>Mar</th>
                  <th>Abr</th>
                  <th>May</th>
                  <th>Jun</th>
                  <th>Jul</th>
                  <th>Ago</th>
                  <th>Sep</th>
                  <th>Oct</th>
                  <th>Nov</th>
                  <th>Dic</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                  <td><input type="checkbox" name="" id="" /></td>
                </tr>



              </tbody>
            </table>
          </div>



          <div className="form-grid-3" style={{ margin: "40px" }}>
            <div>
              <label>Indicador de logro (categoria)</label>
              <select name="ilogro" id="ilogro">
                <option selected disabled>Seleccionar</option>
                {logros.map((p: any) => (
                  <option>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Descripcion especifica</label>
              <input
                type="text"
                name="descp"
                placeholder="Docentes capacitados..."
                value={proyecto.linea}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Meta</label>
              <input
                type="text"
                name="meta"
                placeholder="12"
                value={proyecto.linea}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* GRID 2 COLUMNAS */}
          <div className="form-grid-2" style={{ margin: "40px" }}>
            <div>
              <label>Unidad</label>
              <input
                name="unidad"
                placeholder="Reuniones"
                value={proyecto.objetivoEstrategico}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Beneficiarios</label>
              <input
                name="beneficiarios"
                placeholder="Equipo de acreditacion..."
                value={proyecto.accionEstrategica}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ margin: "40px" }}>
            <label>Evidencias</label>
            <textarea
              name="evidencias"
              placeholder="Correos, actas, minutas, acuerdos."
              value={proyecto.objetivoProyecto}
              onChange={handleChange}
            />
          </div>

          <div className="divider-green"></div>



        </div>
      </div>


    </div>
  );
}

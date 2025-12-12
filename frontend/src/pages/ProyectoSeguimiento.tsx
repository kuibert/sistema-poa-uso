import React, { useState } from "react";
<<<<<<< HEAD
import "../styles/global.css";
=======
import "../assets/styles/global.css";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProyecto({
      ...proyecto,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="dashboard-container">
      
      {/* CARD PRINCIPAL */}
      <div className="card dashboard-main-card">
        
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

        {/* ============================= SECCIÓN 1 ============================= */}
        <h2 className="section-title" style={{ marginTop: "25px" }}>
          <span style={{ color: "var(--verde)" }}>┃</span> Información estratégica
        </h2>
        <p className="texto-sec">Vinculación con el plan institucional.</p>

        {/* GRID 3 COLUMNAS */}
        <div className="form-grid-3">
          <div>
            <label>Año</label>
            <input
              type="number"
              name="anio"
              placeholder="2025"
              value={proyecto.anio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Unidad / Facultad</label>
            <input
              type="text"
              name="unidad"
              placeholder="Facultad de Ingeniería..."
              value={proyecto.unidad}
              onChange={handleChange}
            />
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
          <span style={{ color: "var(--verde)" }}>┃</span> Datos del proyecto
        </h2>

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

      </div>
    </div>
  );
}

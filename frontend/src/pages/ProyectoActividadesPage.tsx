import React, { useState } from "react";
import "../assets/styles/global.css";

export default function ProyectoActividadesPage() {
  const [actividades, setActividades] = useState([
    {
      nombre: "",
      meses: Array(12).fill(false),
      indicador: "",
      descripcion: "",
      meta: "",
      unidad: "",
      beneficiarios: "",
      evidencias: "",
    },
  ]);

  const handleChange = (i:number, field:string, value:any) => {
    const copy = [...actividades];
    copy[i][field] = value;
    setActividades(copy);
  };

  const toggleMes = (i:number, mes:number) => {
    const copy = [...actividades];
    copy[i].meses[mes] = !copy[i].meses[mes];
    setActividades(copy);
  };

  const agregarActividad = () => {
    setActividades([
      ...actividades,
      {
        nombre:"", meses:Array(12).fill(false),
        indicador:"", descripcion:"",
        meta:"", unidad:"",
        beneficiarios:"", evidencias:""
      }
    ]);
  };

  const eliminarActividad = (i:number) => {
    if (actividades.length === 1) return;
    const copy = [...actividades];
    copy.splice(i,1);
    setActividades(copy);
  };

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  return (
    <div className="dashboard-container">

      <div className="card dashboard-main-card">
        <h1>Actividades, meses de ejecución e indicadores de logro</h1>
        <p className="texto-sec">
          Cada actividad tiene su nombre, meses de ejecución, indicador y evidencias.
        </p>
      </div>

      {actividades.map((act, i) => (
        <div className="card actividad-box" key={i}>

          {/* TÍTULO */}
          <div className="actividad-title">
            <h2>Actividad {i + 1}</h2>
            <button onClick={() => eliminarActividad(i)} className="btn-delete-mini">✕</button>
          </div>

          {/* NOMBRE */}
          <input
            value={act.nombre}
            placeholder="Nombre de la actividad"
            onChange={(e)=>handleChange(i,"nombre",e.target.value)}
          />

          {/* MESES */}
          <div className="meses-grid">
            {meses.map((m, idx) => (
              <label key={idx} className="mes-check">
                <input
                  type="checkbox"
                  checked={act.meses[idx]}
                  onChange={() => toggleMes(i, idx)}
                />
                {m}
              </label>
            ))}
          </div>

          {/* INDICADORES */}
          <div className="form-grid-3">
            <div>
              <label>Indicador de logro (categoría)</label>
              <select
                value={act.indicador}
                onChange={(e)=>handleChange(i,"indicador",e.target.value)}
              >
                <option value="">Seleccione…</option>
                <option value="exec">% de actividades ejecutadas</option>
                <option value="dir">N° de personas beneficiadas directamente</option>
                <option value="ind">N° de personas beneficiadas indirectamente</option>
                <option value="prod">N° de productos generados</option>
                <option value="si_no">Logro alcanzado (Sí/No)</option>
              </select>
            </div>

            <div>
              <label>Descripción específica</label>
              <input
                value={act.descripcion}
                placeholder="Descripción…"
                onChange={(e)=>handleChange(i,"descripcion",e.target.value)}
              />
            </div>

            <div>
              <label>Meta</label>
              <input
                type="number"
                value={act.meta}
                placeholder="0"
                onChange={(e)=>handleChange(i,"meta",e.target.value)}
              />
            </div>
          </div>

          {/* UNIDAD + BENEFICIARIOS */}
          <div className="form-grid-2">
            <div>
              <label>Unidad</label>
              <input
                value={act.unidad}
                placeholder="Reuniones, talleres…"
                onChange={(e)=>handleChange(i,"unidad",e.target.value)}
              />
            </div>

            <div>
              <label>Beneficiarios</label>
              <input
                value={act.beneficiarios}
                placeholder="Docentes, estudiantes…"
                onChange={(e)=>handleChange(i,"beneficiarios",e.target.value)}
              />
            </div>
          </div>

          {/* EVIDENCIAS */}
          <div>
            <label>Evidencias</label>
            <textarea
              value={act.evidencias}
              placeholder="Actas, informes, acuerdos…"
              onChange={(e)=>handleChange(i,"evidencias",e.target.value)}
            />
          </div>

        </div>
      ))}

      <button className="btn-add-actividad" onClick={agregarActividad}>
        ➕ Agregar actividad
      </button>
    </div>
  );
}

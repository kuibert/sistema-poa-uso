import React, { useState } from "react";
<<<<<<< HEAD
import "../styles/global.css"

// 🔹 TIPO PARA QUE TYPESCRIPT NO MARQUE ERROR
type Actividad = {
  nombre: string;
  meses: boolean[];
  indicador: string;
  descripcion: string;
  meta: string;
  unidad: string;
  beneficiarios: string;
  evidencias: string;
};

export default function ProyectoActividadesPage() {

  // 🔹 STATE TIPADO
  const [actividades, setActividades] = useState<Actividad[]>([
=======
import "../assets/styles/global.css";

export default function ProyectoActividadesPage() {
  const [actividades, setActividades] = useState([
>>>>>>> origin/DevGabriela
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

<<<<<<< HEAD
  // 🔹 Ahora field es keyof Actividad → esto elimina el error
  const handleChange = (
    i: number,
    field: keyof Actividad,
    value: any
  ) => {
=======
  const handleChange = (i:number, field:string, value:any) => {
>>>>>>> origin/DevGabriela
    const copy = [...actividades];
    copy[i][field] = value;
    setActividades(copy);
  };

<<<<<<< HEAD
  const toggleMes = (i: number, mes: number) => {
=======
  const toggleMes = (i:number, mes:number) => {
>>>>>>> origin/DevGabriela
    const copy = [...actividades];
    copy[i].meses[mes] = !copy[i].meses[mes];
    setActividades(copy);
  };

  const agregarActividad = () => {
    setActividades([
      ...actividades,
      {
<<<<<<< HEAD
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
  };

  const eliminarActividad = (i: number) => {
    if (actividades.length === 1) return;
    const copy = [...actividades];
    copy.splice(i, 1);
    setActividades(copy);
  };

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
=======
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
>>>>>>> origin/DevGabriela

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
<<<<<<< HEAD
            <button onClick={() => eliminarActividad(i)} className="btn-delete-mini">
              ✕
            </button>
=======
            <button onClick={() => eliminarActividad(i)} className="btn-delete-mini">✕</button>
>>>>>>> origin/DevGabriela
          </div>

          {/* NOMBRE */}
          <input
            value={act.nombre}
            placeholder="Nombre de la actividad"
<<<<<<< HEAD
            onChange={(e) => handleChange(i, "nombre", e.target.value)}
=======
            onChange={(e)=>handleChange(i,"nombre",e.target.value)}
>>>>>>> origin/DevGabriela
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
<<<<<<< HEAD
                onChange={(e) => handleChange(i, "indicador", e.target.value)}
=======
                onChange={(e)=>handleChange(i,"indicador",e.target.value)}
>>>>>>> origin/DevGabriela
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
<<<<<<< HEAD
                onChange={(e) => handleChange(i, "descripcion", e.target.value)}
=======
                onChange={(e)=>handleChange(i,"descripcion",e.target.value)}
>>>>>>> origin/DevGabriela
              />
            </div>

            <div>
              <label>Meta</label>
              <input
                type="number"
                value={act.meta}
                placeholder="0"
<<<<<<< HEAD
                onChange={(e) => handleChange(i, "meta", e.target.value)}
=======
                onChange={(e)=>handleChange(i,"meta",e.target.value)}
>>>>>>> origin/DevGabriela
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
<<<<<<< HEAD
                onChange={(e) => handleChange(i, "unidad", e.target.value)}
=======
                onChange={(e)=>handleChange(i,"unidad",e.target.value)}
>>>>>>> origin/DevGabriela
              />
            </div>

            <div>
              <label>Beneficiarios</label>
              <input
                value={act.beneficiarios}
                placeholder="Docentes, estudiantes…"
<<<<<<< HEAD
                onChange={(e) => handleChange(i, "beneficiarios", e.target.value)}
=======
                onChange={(e)=>handleChange(i,"beneficiarios",e.target.value)}
>>>>>>> origin/DevGabriela
              />
            </div>
          </div>

          {/* EVIDENCIAS */}
          <div>
            <label>Evidencias</label>
            <textarea
              value={act.evidencias}
              placeholder="Actas, informes, acuerdos…"
<<<<<<< HEAD
              onChange={(e) => handleChange(i, "evidencias", e.target.value)}
=======
              onChange={(e)=>handleChange(i,"evidencias",e.target.value)}
>>>>>>> origin/DevGabriela
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

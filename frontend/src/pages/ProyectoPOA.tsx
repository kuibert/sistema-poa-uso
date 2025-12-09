import React, { useMemo, useState } from 'react';
import './ProyectoPrototype.css';

// Tipos auxiliares
type Activity = {
  id: number;
  header: string; // "Actividad N"
  name: string;
  months: boolean[]; // 12 meses
  kpi: {
    categoria: string;
    descripcion: string;
    meta: string;
    unidad: string;
    beneficiarios: string;
  };
  evidencias: string;
};

type CostRow = {
  descripcion: string;
  qty: string; // mantener como string para inputs
  unidad: string;
  unit: string; // precio unitario, string para inputs
};

export const ProyectoPOA: React.FC = () => {
  // Actividades iniciales (3) como en el HTML
  const initialActivities: Activity[] = useMemo(
    () => [
      {
        id: 1,
        header: 'Actividad 1',
        name: 'Acercamiento y entendimiento con ACAAI',
        months: new Array(12).fill(false),
        kpi: {
          categoria: '',
          descripcion: 'Reuniones realizadas con la entidad acreditadora',
          meta: '',
          unidad: 'Reuniones',
          beneficiarios: 'Equipo de acreditación',
        },
        evidencias: 'Actas, minutas, correos, acuerdos...'
      },
      {
        id: 2,
        header: 'Actividad 2',
        name: 'Capacitación de actores de la USO',
        months: new Array(12).fill(false),
        kpi: {
          categoria: 'Nº de personas beneficiadas directamente',
          descripcion: 'Docentes capacitados en el modelo de acreditación',
          meta: '12',
          unidad: 'Personas',
          beneficiarios: 'Docentes',
        },
        evidencias: 'Listas de asistencia, constancias de participación...'
      },
      {
        id: 3,
        header: 'Actividad 3',
        name: 'Recopilación de documentación y autoevaluación',
        months: new Array(12).fill(false),
        kpi: {
          categoria: 'Nº de productos / documentos generados',
          descripcion: 'Expediente completo de autoevaluación elaborado',
          meta: '1',
          unidad: 'Documento',
          beneficiarios: 'Carrera / Facultad',
        },
        evidencias: 'Expediente de autoevaluación, informe final, anexos...'
      }
    ],
    []
  );

  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [groupCounter, setGroupCounter] = useState(4); // ya existen grupos 1..3
  const [actividadCounter, setActividadCounter] = useState(3); // Actividad 1..3

  const addActivity = () => {
    const nextId = groupCounter;
    const nextNum = actividadCounter + 1;
    setGroupCounter(groupCounter + 1);
    setActividadCounter(nextNum);

    const nueva: Activity = {
      id: nextId,
      header: `Actividad ${nextNum}`,
      name: 'Nueva actividad',
      months: new Array(12).fill(false),
      kpi: {
        categoria: '',
        descripcion: 'Descripción del indicador de la actividad',
        meta: '',
        unidad: '',
        beneficiarios: 'Grupo beneficiado',
      },
      evidencias: 'Actas, listas, informes, dictámenes...'
    };
    setActivities(prev => [...prev, nueva]);
  };

  const removeActivity = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  // Costos variables (3 filas iniciales)
  const [variablesRows, setVariablesRows] = useState<CostRow[]>([
    { descripcion: 'Costo de inscripción', qty: '', unidad: 'Evento', unit: '' },
    { descripcion: 'Capacitación a personal de la USO', qty: '', unidad: 'Sesión', unit: '' },
    { descripcion: 'Viáticos y alimentación', qty: '', unidad: 'Paquete', unit: '' },
  ]);

  // Costos fijos (3 filas iniciales)
  const [fijosRows, setFijosRows] = useState<CostRow[]>([
    { descripcion: 'Salario: Carlos Roberto Martínez Martínez', qty: '', unidad: 'Meses', unit: '' },
    { descripcion: 'Salario: Marvin Adonay Alarcón', qty: '', unidad: 'Meses', unit: '' },
    { descripcion: 'Salario: Henry Manuel Pérez', qty: '', unidad: 'Meses', unit: '' },
  ]);

  const addCostRow = (table: 'variables' | 'fijos') => {
    const nueva: CostRow = { descripcion: 'Nuevo costo', qty: '', unidad: 'Unidad', unit: '' };
    if (table === 'variables') setVariablesRows(prev => [...prev, nueva]);
    else setFijosRows(prev => [...prev, nueva]);
  };

  const removeCostRow = (table: 'variables' | 'fijos', index: number) => {
    if (table === 'variables') setVariablesRows(prev => prev.filter((_, i) => i !== index));
    else setFijosRows(prev => prev.filter((_, i) => i !== index));
  };

  const updateCostRow = (
    table: 'variables' | 'fijos',
    index: number,
    field: keyof CostRow,
    value: string
  ) => {
    const updater = (rows: CostRow[]) => rows.map((r, i) => i === index ? { ...r, [field]: value } : r);
    if (table === 'variables') setVariablesRows(prev => updater(prev));
    else setFijosRows(prev => updater(prev));
  };

  const rowTotal = (r: CostRow) => {
    const qty = parseFloat(r.qty) || 0;
    const unit = parseFloat(r.unit) || 0;
    return qty * unit;
  };

  const totalVariables = variablesRows.reduce((s, r) => s + rowTotal(r), 0);
  const totalFijos = fijosRows.reduce((s, r) => s + rowTotal(r), 0);
  const totalGeneral = totalVariables + totalFijos;

  return (
    <div className="proyecto-prototype">
      <header>
        <div>
          <div className="brand-title">Universidad de Sonsonate</div>
          <div className="brand-sub">Sistema de Gestión POA</div>
        </div>
        <div className="user">
          Usuario:<br />
          <strong>Carlos Roberto Martínez Martínez</strong>
        </div>
      </header>

      <main>
        <section className="card">
          <div className="card-header">
            <div>
              <h1 className="card-title">Registro de Proyecto POA</h1>
              <p className="card-sub">Información estratégica, actividades, indicadores y presupuesto.</p>
            </div>

            <div>
              <button className="btn btn-alt" type="button">💾 Guardar</button>
              <button className="btn btn-main" type="button" onClick={() => window.print()}>🖨 Imprimir PDF</button>
            </div>
          </div>

          <div className="divider"></div>

          <form>
            {/* ESTRATÉGICO */}
            <div className="section">
              <h2 className="section-title">Información estratégica</h2>
              <p className="section-desc">Vinculación con el plan institucional.</p>
              <div className="section-divider"></div>

              <div className="grid-3">
                <div>
                  <label>Año</label>
                  <input type="number" />
                </div>
                <div>
                  <label>Unidad / Facultad</label>
                  <input type="text" placeholder="Facultad de Ingeniería y Ciencias Naturales" />
                </div>
                <div>
                  <label>Línea estratégica</label>
                  <input type="text" placeholder="1. Mejora continua de la docencia" />
                </div>
              </div>

              <div className="grid-2" style={{ marginTop: '1rem' }}>
                <div>
                  <label>Objetivo estratégico</label>
                  <textarea placeholder="Promover la excelencia académica mediante..."></textarea>
                </div>
                <div>
                  <label>Acción / Actividad estratégica</label>
                  <textarea placeholder="Participar en procesos de acreditación..."></textarea>
                </div>
              </div>
            </div>

            {/* PROYECTO */}
            <div className="section">
              <h2 className="section-title">Datos del proyecto</h2>
              <div className="section-divider"></div>

              <div className="grid-2">
                <div>
                  <label>Nombre del proyecto</label>
                  <input type="text" placeholder="Gestión de acreditación de la Carrera de Ingeniería Industrial" />
                </div>
                <div>
                  <label>Responsable</label>
                  <input type="text" placeholder="Nombre y cargo del responsable" />
                </div>
              </div>

              <label style={{ marginTop: '.6rem' }}>Objetivo del proyecto</label>
              <textarea placeholder="Describir qué se quiere lograr, cómo y para qué..."></textarea>
            </div>

            {/* ACTIVIDADES + BLOQUES */}
            <div className="section">
              <h2 className="section-title">Actividades, meses de ejecución e indicadores de logro</h2>
              <p className="section-desc">
                Cada actividad tiene su nombre, meses de ejecución, indicador de logro y evidencias asociadas.
              </p>
              <div className="section-divider"></div>

              <table id="tabla-actividades">
                <tbody>
                  {activities.map((a) => (
                    <React.Fragment key={a.id}>
                      {/* BLOQUE: nombre */}
                      <tr className="actividad-nombre" data-group={a.id}>
                        <td>
                          <div className="actividad-header">{a.header}</div>
                          <input
                            type="text"
                            placeholder={a.name}
                            value={a.name}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))}
                          />
                        </td>
                        <td className="mes-col">
                          <button type="button" className="btn btn-mini btn-alt" onClick={() => removeActivity(a.id)}>✖</button>
                        </td>
                      </tr>

                      {/* BLOQUE: meses */}
                      <tr className="actividad-meses" data-group={a.id}>
                        <td colSpan={2}>
                          <table className="tabla-meses" aria-label="Meses de ejecución">
                            <thead>
                              <tr>
                                <th>Ene</th><th>Feb</th><th>Mar</th><th>Abr</th><th>May</th><th>Jun</th>
                                <th>Jul</th><th>Ago</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dic</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {a.months.map((checked, idx) => (
                                  <td key={idx}>
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, months: x.months.map((m, i) => i === idx ? e.target.checked : m) } : x))}
                                    />
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* BLOQUE: KPI */}
                      <tr className="actividad-kpi" data-group={a.id}>
                        <td colSpan={2}>
                          <div className="actividad-kpi-inner">
                            <div>
                              <label>Indicador de logro (categoría)</label>
                              <select
                                value={a.kpi.categoria}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, categoria: e.target.value } } : x))}
                              >
                                <option value="">Seleccione...</option>
                                <option>% de actividades ejecutadas</option>
                                <option>Nº de personas beneficiadas directamente</option>
                                <option>Nº de personas beneficiadas indirectamente</option>
                                <option>Nº de productos / documentos generados</option>
                                <option>Logro principal alcanzado (Sí/No)</option>
                              </select>
                            </div>
                            <div>
                              <label>Descripción específica</label>
                              <input
                                type="text"
                                placeholder="Descripción del indicador de la actividad"
                                value={a.kpi.descripcion}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, descripcion: e.target.value } } : x))}
                              />
                            </div>
                            <div>
                              <label>Meta</label>
                              <input
                                type="number"
                                placeholder="Meta"
                                value={a.kpi.meta}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, meta: e.target.value } } : x))}
                              />
                            </div>
                            <div>
                              <label>Unidad</label>
                              <input
                                type="text"
                                placeholder="Unidad"
                                value={a.kpi.unidad}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, unidad: e.target.value } } : x))}
                              />
                            </div>
                            <div>
                              <label>Beneficiarios</label>
                              <input
                                type="text"
                                placeholder="Grupo beneficiado"
                                value={a.kpi.beneficiarios}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, beneficiarios: e.target.value } } : x))}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* BLOQUE: Evidencias */}
                      <tr className="actividad-evidencia" data-group={a.id}>
                        <td colSpan={2}>
                          <label>Evidencias</label>
                          <textarea
                            placeholder="Actas, minutas, correos, acuerdos..."
                            value={a.evidencias}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, evidencias: e.target.value } : x))}
                          ></textarea>
                        </td>
                      </tr>

                      {/* Separador */}
                      <tr className="actividad-separador" data-group={a.id}>
                        <td colSpan={2}>
                          <div className="actividad-divider"></div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                <span className="note">&nbsp;</span>
                <button className="btn btn-mini btn-main" type="button" onClick={addActivity}>➕ Agregar actividad</button>
              </div>
            </div>

            {/* PRESUPUESTO: COSTOS VARIABLES */}
            <div className="section">
              <h2 className="section-title">Presupuesto - Costos variables</h2>
              <p className="section-desc">Gastos directamente asociados a actividades (inscripción, viáticos, servicios, etc.).</p>
              <div className="section-divider"></div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '.3rem' }}>
                <button className="btn btn-mini btn-main" type="button" onClick={() => addCostRow('variables')}>➕ Agregar costo variable</button>
              </div>

              <table id="tabla-variables">
                <thead>
                  <tr>
                    <th style={{ width: '36%' }}>Descripción</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Precio unitario ($)</th>
                    <th>Costo total ($)</th>
                    <th style={{ width: '3%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {variablesRows.map((r, idx) => (
                    <tr key={idx}>
                      <td><input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => updateCostRow('variables', idx, 'descripcion', e.target.value)} /></td>
                      <td><input type="number" className="qty" min={0} step={1} value={r.qty} onChange={(e) => updateCostRow('variables', idx, 'qty', e.target.value)} /></td>
                      <td><input type="text" placeholder="Unidad" value={r.unidad} onChange={(e) => updateCostRow('variables', idx, 'unidad', e.target.value)} /></td>
                      <td><input type="number" className="unit" min={0} step={0.01} value={r.unit} onChange={(e) => updateCostRow('variables', idx, 'unit', e.target.value)} /></td>
                      <td><input type="number" className="total" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} /></td>
                      <td className="mes-col">
                        <button type="button" className="btn btn-mini btn-alt" onClick={() => removeCostRow('variables', idx)}>✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'right' }}>Total costos variables ($):</td>
                    <td><input type="number" id="total-variables" readOnly value={totalVariables ? totalVariables.toFixed(2) : ''} /></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* PRESUPUESTO: COSTOS FIJOS */}
            <div className="section">
              <h2 className="section-title">Presupuesto - Costos fijos</h2>
              <p className="section-desc">Costos de personal u otros que se mantienen durante el año.</p>
              <div className="section-divider"></div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '.3rem' }}>
                <button className="btn btn-mini btn-main" type="button" onClick={() => addCostRow('fijos')}>➕ Agregar costo fijo</button>
              </div>

              <table id="tabla-fijos">
                <thead>
                  <tr>
                    <th style={{ width: '36%' }}>Descripción</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Precio unitario ($)</th>
                    <th>Costo total ($)</th>
                    <th style={{ width: '3%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {fijosRows.map((r, idx) => (
                    <tr key={idx}>
                      <td><input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => updateCostRow('fijos', idx, 'descripcion', e.target.value)} /></td>
                      <td><input type="number" className="qty" min={0} step={1} value={r.qty} onChange={(e) => updateCostRow('fijos', idx, 'qty', e.target.value)} /></td>
                      <td><input type="text" placeholder="Meses" value={r.unidad} onChange={(e) => updateCostRow('fijos', idx, 'unidad', e.target.value)} /></td>
                      <td><input type="number" className="unit" min={0} step={0.01} value={r.unit} onChange={(e) => updateCostRow('fijos', idx, 'unit', e.target.value)} /></td>
                      <td><input type="number" className="total" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} /></td>
                      <td className="mes-col">
                        <button type="button" className="btn btn-mini btn-alt" onClick={() => removeCostRow('fijos', idx)}>✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'right' }}>Total costos fijos ($):</td>
                    <td><input type="number" id="total-fijos" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} /></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* TOTAL GENERAL */}
            <div className="section">
              <h2 className="section-title">Costo total del proyecto</h2>
              <div className="section-divider"></div>

              <div className="grid-3">
                <div>
                  <label>Total costos variables ($)</label>
                  <input type="number" id="total-variables-copy" readOnly value={totalVariables ? totalVariables.toFixed(2) : ''} />
                </div>
                <div>
                  <label>Total costos fijos ($)</label>
                  <input type="number" id="total-fijos-copy" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} />
                </div>
                <div>
                  <label>Total general del proyecto ($)</label>
                  <input type="number" id="total-general" readOnly value={totalGeneral ? totalGeneral.toFixed(2) : ''} />
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

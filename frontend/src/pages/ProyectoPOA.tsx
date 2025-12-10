import React, { useMemo, useState } from 'react';
import { PageHeader, Card, Divider, Grid, Section, Label, Button } from '../components/common';

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

  // Estilos inline
  const containerStyle: React.CSSProperties = {
    background: 'var(--fondo-azul)',
    color: 'var(--texto-claro)',
    minHeight: '100vh',
  };

  const mainStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '1.5rem auto 0',
    padding: '0 1rem 1.2rem',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.8rem',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
  };

  const cardSubStyle: React.CSSProperties = {
    color: 'var(--texto-secundario)',
    fontSize: '0.9rem',
    marginTop: '0.2rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    marginTop: '0.2rem',
    background: 'var(--input-bg)',
    border: '1px solid var(--borde)',
    color: 'var(--texto-claro)',
    padding: '0.45rem 0.6rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.82rem',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical' as const,
    minHeight: '80px',
  };

  const readonlyInputStyle: React.CSSProperties = {
    ...inputStyle,
    background: 'var(--input-readonly-bg)',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem',
    marginTop: '0.3rem',
  };

  const thTdStyle: React.CSSProperties = {
    padding: '0.35rem',
    borderBottom: '1px solid var(--borde)',
    verticalAlign: 'middle',
  };

  const thStyle: React.CSSProperties = {
    ...thTdStyle,
    textAlign: 'left',
    color: 'var(--texto-secundario)',
  };

  const actividadHeaderStyle: React.CSSProperties = {
    color: 'var(--verde-hoja)',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginBottom: '0.2rem',
  };

  const actividadNombreTdStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.06)',
  };

  const actividadIndentStyle: React.CSSProperties = {
    paddingLeft: '1.6rem',
  };

  const actividadDividerStyle: React.CSSProperties = {
    height: '3px',
    background: 'var(--verde-hoja)',
    opacity: 0.85,
    margin: '0.8rem 0 0.9rem',
    borderRadius: '999px',
  };

  const tablaMesesStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.75rem',
  };

  const tablaMesesThTdStyle: React.CSSProperties = {
    borderBottom: 'none',
    padding: '0.2rem 0.25rem',
    textAlign: 'center',
  };

  const kpiGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.7rem',
  };

  return (
    <div style={containerStyle}>
      <PageHeader
        title="Universidad de Sonsonate"
        subtitle="Sistema de Gestión POA"
        userName="Carlos Roberto Martínez Martínez"
      />

      <main style={mainStyle}>
        <Card padding="1.8rem">
          <div style={cardHeaderStyle}>
            <div>
              <h1 style={cardTitleStyle}>Registro de Proyecto POA</h1>
              <p style={cardSubStyle}>Información estratégica, actividades, indicadores y presupuesto.</p>
            </div>

            <div>
              <Button variant="alt" type="button" style={{ marginRight: '0.5rem' }}>💾 Guardar</Button>
              <Button variant="main" type="button" onClick={() => window.print()}>🖨 Imprimir PDF</Button>
            </div>
          </div>

          <Divider variant="gradient" />

          <form>
            {/* ESTRATÉGICO */}
            <Section title="Información estratégica" description="Vinculación con el plan institucional.">
              <Grid columns={3}>
                <div>
                  <Label>Año</Label>
                  <input type="number" style={inputStyle} />
                </div>
                <div>
                  <Label>Unidad / Facultad</Label>
                  <input type="text" placeholder="Facultad de Ingeniería y Ciencias Naturales" style={inputStyle} />
                </div>
                <div>
                  <Label>Línea estratégica</Label>
                  <input type="text" placeholder="1. Mejora continua de la docencia" style={inputStyle} />
                </div>
              </Grid>

              <Grid columns={2} style={{ marginTop: '1rem' }}>
                <div>
                  <Label>Objetivo estratégico</Label>
                  <textarea placeholder="Promover la excelencia académica mediante..." style={textareaStyle}></textarea>
                </div>
                <div>
                  <Label>Acción / Actividad estratégica</Label>
                  <textarea placeholder="Participar en procesos de acreditación..." style={textareaStyle}></textarea>
                </div>
              </Grid>
            </Section>

            {/* PROYECTO */}
            <Section title="Datos del proyecto">
              <Grid columns={2}>
                <div>
                  <Label>Nombre del proyecto</Label>
                  <input type="text" placeholder="Gestión de acreditación de la Carrera de Ingeniería Industrial" style={inputStyle} />
                </div>
                <div>
                  <Label>Responsable</Label>
                  <input type="text" placeholder="Nombre y cargo del responsable" style={inputStyle} />
                </div>
              </Grid>

              <div style={{ marginTop: '0.6rem' }}>
                <Label>Objetivo del proyecto</Label>
                <textarea placeholder="Describir qué se quiere lograr, cómo y para qué..." style={textareaStyle}></textarea>
              </div>
            </Section>

            {/* ACTIVIDADES + BLOQUES */}
            <Section
              title="Actividades, meses de ejecución e indicadores de logro"
              description="Cada actividad tiene su nombre, meses de ejecución, indicador de logro y evidencias asociadas."
            >
              <table style={tableStyle}>
                <tbody>
                  {activities.map((a) => (
                    <React.Fragment key={a.id}>
                      {/* BLOQUE: nombre */}
                      <tr>
                        <td style={actividadNombreTdStyle}>
                          <div style={actividadHeaderStyle}>{a.header}</div>
                          <input
                            type="text"
                            placeholder={a.name}
                            value={a.name}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))}
                            style={{ ...inputStyle, fontWeight: 600 }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Button variant="alt" size="sm" type="button" onClick={() => removeActivity(a.id)}>✖</Button>
                        </td>
                      </tr>

                      {/* BLOQUE: meses */}
                      <tr>
                        <td colSpan={2} style={actividadIndentStyle}>
                          <table style={tablaMesesStyle} aria-label="Meses de ejecución">
                            <thead>
                              <tr>
                                <th style={tablaMesesThTdStyle}>Ene</th><th style={tablaMesesThTdStyle}>Feb</th><th style={tablaMesesThTdStyle}>Mar</th><th style={tablaMesesThTdStyle}>Abr</th><th style={tablaMesesThTdStyle}>May</th><th style={tablaMesesThTdStyle}>Jun</th>
                                <th style={tablaMesesThTdStyle}>Jul</th><th style={tablaMesesThTdStyle}>Ago</th><th style={tablaMesesThTdStyle}>Sep</th><th style={tablaMesesThTdStyle}>Oct</th><th style={tablaMesesThTdStyle}>Nov</th><th style={tablaMesesThTdStyle}>Dic</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {a.months.map((checked, idx) => (
                                  <td key={idx} style={tablaMesesThTdStyle}>
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
                      <tr>
                        <td colSpan={2} style={actividadIndentStyle}>
                          <div style={kpiGridStyle}>
                            <div>
                              <Label>Indicador de logro (categoría)</Label>
                              <select
                                value={a.kpi.categoria}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, categoria: e.target.value } } : x))}
                                style={inputStyle}
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
                              <Label>Descripción específica</Label>
                              <input
                                type="text"
                                placeholder="Descripción del indicador de la actividad"
                                value={a.kpi.descripcion}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, descripcion: e.target.value } } : x))}
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <Label>Meta</Label>
                              <input
                                type="number"
                                placeholder="Meta"
                                value={a.kpi.meta}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, meta: e.target.value } } : x))}
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <Label>Unidad</Label>
                              <input
                                type="text"
                                placeholder="Unidad"
                                value={a.kpi.unidad}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, unidad: e.target.value } } : x))}
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <Label>Beneficiarios</Label>
                              <input
                                type="text"
                                placeholder="Grupo beneficiado"
                                value={a.kpi.beneficiarios}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, beneficiarios: e.target.value } } : x))}
                                style={inputStyle}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* BLOQUE: Evidencias */}
                      <tr>
                        <td colSpan={2} style={actividadIndentStyle}>
                          <Label>Evidencias</Label>
                          <textarea
                            placeholder="Actas, minutas, correos, acuerdos..."
                            value={a.evidencias}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, evidencias: e.target.value } : x))}
                            style={textareaStyle}
                          ></textarea>
                        </td>
                      </tr>

                      {/* Separador */}
                      <tr>
                        <td colSpan={2}>
                          <div style={actividadDividerStyle}></div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button variant="main" size="sm" type="button" onClick={addActivity}>➕ Agregar actividad</Button>
              </div>
            </Section>

            {/* PRESUPUESTO: COSTOS VARIABLES */}
            <Section
              title="Presupuesto - Costos variables"
              description="Gastos directamente asociados a actividades (inscripción, viáticos, servicios, etc.)."
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.3rem' }}>
                <Button variant="main" size="sm" type="button" onClick={() => addCostRow('variables')}>➕ Agregar costo variable</Button>
              </div>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '36%' }}>Descripción</th>
                    <th style={thStyle}>Cantidad</th>
                    <th style={thStyle}>Unidad</th>
                    <th style={thStyle}>Precio unitario ($)</th>
                    <th style={thStyle}>Costo total ($)</th>
                    <th style={{ ...thStyle, width: '3%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {variablesRows.map((r, idx) => (
                    <tr key={idx}>
                      <td style={thTdStyle}><input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => updateCostRow('variables', idx, 'descripcion', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="number" min={0} step={1} value={r.qty} onChange={(e) => updateCostRow('variables', idx, 'qty', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="text" placeholder="Unidad" value={r.unidad} onChange={(e) => updateCostRow('variables', idx, 'unidad', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="number" min={0} step={0.01} value={r.unit} onChange={(e) => updateCostRow('variables', idx, 'unit', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="number" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} style={readonlyInputStyle} /></td>
                      <td style={{ ...thTdStyle, textAlign: 'center' }}>
                        <Button variant="alt" size="sm" type="button" onClick={() => removeCostRow('variables', idx)}>✖</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ ...thTdStyle, textAlign: 'right' }}>Total costos variables ($):</td>
                    <td style={thTdStyle}><input type="number" readOnly value={totalVariables ? totalVariables.toFixed(2) : ''} style={readonlyInputStyle} /></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </Section>

            {/* PRESUPUESTO: COSTOS FIJOS */}
            <Section
              title="Presupuesto - Costos fijos"
              description="Costos de personal u otros que se mantienen durante el año."
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.3rem' }}>
                <Button variant="main" size="sm" type="button" onClick={() => addCostRow('fijos')}>➕ Agregar costo fijo</Button>
              </div>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '36%' }}>Descripción</th>
                    <th style={thStyle}>Cantidad</th>
                    <th style={thStyle}>Unidad</th>
                    <th style={thStyle}>Precio unitario ($)</th>
                    <th style={thStyle}>Costo total ($)</th>
                    <th style={{ ...thStyle, width: '3%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {fijosRows.map((r, idx) => (
                    <tr key={idx}>
                      <td style={thTdStyle}><input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => updateCostRow('fijos', idx, 'descripcion', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="number" min={0} step={1} value={r.qty} onChange={(e) => updateCostRow('fijos', idx, 'qty', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="text" placeholder="Meses" value={r.unidad} onChange={(e) => updateCostRow('fijos', idx, 'unidad', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="number" min={0} step={0.01} value={r.unit} onChange={(e) => updateCostRow('fijos', idx, 'unit', e.target.value)} style={inputStyle} /></td>
                      <td style={thTdStyle}><input type="number" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} style={readonlyInputStyle} /></td>
                      <td style={{ ...thTdStyle, textAlign: 'center' }}>
                        <Button variant="alt" size="sm" type="button" onClick={() => removeCostRow('fijos', idx)}>✖</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ ...thTdStyle, textAlign: 'right' }}>Total costos fijos ($):</td>
                    <td style={thTdStyle}><input type="number" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} style={readonlyInputStyle} /></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </Section>

            {/* TOTAL GENERAL */}
            <Section title="Costo total del proyecto">
              <Grid columns={3}>
                <div>
                  <Label>Total costos variables ($)</Label>
                  <input type="number" readOnly value={totalVariables ? totalVariables.toFixed(2) : ''} style={readonlyInputStyle} />
                </div>
                <div>
                  <Label>Total costos fijos ($)</Label>
                  <input type="number" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} style={readonlyInputStyle} />
                </div>
                <div>
                  <Label>Total general del proyecto ($)</Label>
                  <input type="number" readOnly value={totalGeneral ? totalGeneral.toFixed(2) : ''} style={readonlyInputStyle} />
                </div>
              </Grid>
            </Section>
          </form>
        </Card>
      </main>
    </div>
  );
}

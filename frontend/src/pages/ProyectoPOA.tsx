import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, Divider, Grid, Section, Label, Button, ErrorMessage, Input, TextArea, Select, Table, Checkbox } from '../components/common';
import apiClient from '../services/apiClient';

// Tipos auxiliares
type Activity = {
  id: number;
  header: string; // "Actividad N"
  name: string;
  months: boolean[]; // 12 meses
  id_responsable: string;
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Información del proyecto (valores por defecto)
  const [projectData, setProjectData] = useState({
    nombre: 'Gestión de acreditación de la Carrera de Ingeniería Industrial',
    objetivo: 'Lograr la acreditación de la carrera ante ACAAI',
    unidad_responsable: 'Facultad de Ingeniería',
    linea_estrategica: '',
    objetivo_estrategico: '',
    accion_estrategica: '',
    anio: new Date().getFullYear(),
    fecha_inicio: '',
    fecha_fin: '',
    id_responsable: '',
  });

  const [responsables, setResponsables] = useState<any[]>([]);

  useEffect(() => {
    const loadResponsables = async () => {
      try {
        const { data } = await apiClient.get('/proyectos/responsables');
        setResponsables(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadResponsables();
  }, []);


  // Actividades iniciales (3) como en el HTML
  const initialActivities: Activity[] = useMemo(
    () => [
      {
        id: 1,
        header: 'Actividad 1',
        name: 'Acercamiento y entendimiento con ACAAI',
        months: new Array(12).fill(false),
        id_responsable: '',
        kpi: {
          categoria: '',
          descripcion: 'Reuniones realizadas con la entidad acreditadora',
          meta: '',
          unidad: 'Reuniones',
          beneficiarios: 'Equipo de acreditación',
          id_responsable: '',
        },
        evidencias: 'Actas, minutas, correos, acuerdos...'
      },
      {
        id: 2,
        header: 'Actividad 2',
        name: 'Capacitación de actores de la USO',
        months: new Array(12).fill(false),
        id_responsable: '',
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
        id_responsable: '',
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
      id_responsable: '',
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
  // Función para guardar proyecto
  const handleSave = async () => {
    // 🔒 Validaciones
    if (!activities.length) {
      setError('Debe registrar al menos una actividad');
      return;
    }

    const actividadesValidas = activities.filter(a => a.name.trim() !== '');

    if (!actividadesValidas.length) {
      setError('Debe registrar al menos una actividad con nombre');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // 1️⃣ PROYECTO
      const proyectoPayload = {
        nombre: projectData.nombre,
        objetivo: projectData.objetivo,
        unidad_facultad: projectData.unidad_responsable || 'No definida',
        linea_estrategica: projectData.linea_estrategica || null,
        objetivo_estrategico: projectData.objetivo_estrategico || null,
        accion_estrategica: projectData.accion_estrategica || null,
        anio: projectData.anio,
        fecha_inicio: projectData.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_fin: projectData.fecha_fin || new Date().toISOString().split('T')[0],
        presupuesto_total: totalGeneral,
        id_responsable: projectData.id_responsable
          ? Number(projectData.id_responsable)
          : null,
      };

      const { data: proyecto } = await apiClient.post('/proyectos', proyectoPayload);

      // 2️⃣ ACTIVIDADES
      const presupuestoPorActividad =
        actividadesValidas.length > 0
          ? totalVariables / actividadesValidas.length
          : 0;

      const actividadesPayload = actividadesValidas.map((a, index) => ({
        nombre: a.name,
        descripcion: a.kpi.descripcion,

        // RESPONSABLE
        id_responsable: projectData.id_responsable
          ? Number(projectData.id_responsable)
          : null,

        // 🔹 NUEVOS CAMPOS IMPORTANTES
        cargo_responsable: a.kpi.beneficiarios, // 👈 lo que escriben en Beneficiarios
        unidad_responsable: projectData.unidad_responsable, // 👈 Facultad
        presupuesto_asignado: presupuestoPorActividad, // 👈 según orden

        meses: a.months
          .map((m, idx) => (m ? idx + 1 : null))
          .filter(m => m !== null),

        indicador: {
          categoria: a.kpi.categoria,
          descripcion: a.kpi.descripcion,
          meta: a.kpi.meta,
          unidad: a.kpi.unidad,
          beneficiarios: a.kpi.beneficiarios
        }
      }));


      for (const actividad of actividadesPayload) {
        await apiClient.post(
          `/proyectos/${proyecto.id}/actividades`,
          actividad
        );
      }

      navigate('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el proyecto');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };



  // Función para guardar proyecto
  /*const handleSave = async () => {
          if (!activities.length) {
        setError('Debe registrar al menos una actividad');
        return;
      }

      const actividadesValidas = activities.filter(a => a.name.trim() !== '');

      if (!actividadesValidas.length) {
        setError('Debe registrar al menos una actividad con nombre');
        return;
      }

    try {
      setSaving(true);
      setError(null);

      const proyectoPayload = {
        nombre: projectData.nombre,
        objetivo: projectData.objetivo,
        unidad_facultad: projectData.unidad_responsable || 'No definida',
        anio: projectData.anio,
        fecha_inicio: projectData.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_fin: projectData.fecha_fin || new Date().toISOString().split('T')[0],
        presupuesto_total: totalGeneral,
        id_responsable: projectData.id_responsable || null

      };

      if (id) {
        // Modo edición
        await apiClient.put(`/proyectos/${id}`, proyectoPayload);
      } else {
        // Modo creación
        await apiClient.post('/proyectos', proyectoPayload);
      }

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el proyecto');
      console.error('Error guardando proyecto:', err);
    } finally {
      setSaving(false);
    }
  };
*/
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

  // Estilos específicos que no pueden ser reemplazados por componentes genéricos
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

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem',
    marginTop: '0.3rem',
  };

  const actividadHeaderStyle: React.CSSProperties = {
    color: 'var(--verde-hoja)',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginBottom: '0.2rem',
  };

  const actividadNombreTdStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.06)',
    padding: '0.5rem',
    borderRadius: '4px',
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
      <NavBar />

      <main style={mainStyle}>
        <Card padding="1.8rem">
          <div style={cardHeaderStyle}>
            <div>
              <h1 style={cardTitleStyle}>Registro de Proyecto POA</h1>
              <p style={cardSubStyle}>Información estratégica, actividades, indicadores y presupuesto.</p>
            </div>

            <div>
              <Button variant="alt" type="button" style={{ marginRight: '0.5rem' }} onClick={handleSave} disabled={saving}>
                {saving ? '💾 Guardando...' : '💾 Guardar'}
              </Button>
              <Button variant="main" type="button" onClick={() => window.print()}>🖨 Imprimir PDF</Button>
            </div>
          </div>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          <Divider variant="gradient" />

          <form>
            {/* ESTRATÉGICO */}
            <Section title="Información estratégica" description="Vinculación con el plan institucional.">
              <Grid columns={3}>
                <div>
                  <Label>Año</Label>
                  <Input
                    type="number"
                    value={projectData.anio}
                    onChange={(e) =>
                      setProjectData(p => ({ ...p, anio: Number(e.target.value) }))
                    }
                  />

                </div>
                <div>
                  <Label>Unidad / Facultad</Label>
                  <Input
                    type="text"
                    value={projectData.unidad_responsable}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        unidad_responsable: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Línea estratégica</Label>
                  <Input
                    type="text"
                    value={projectData.linea_estrategica}
                    onChange={(e) =>
                      setProjectData(p => ({ ...p, linea_estrategica: e.target.value }))
                    }
                  />
                </div>
              </Grid>

              <Grid columns={2} style={{ marginTop: '1rem' }}>
                <div>
                  <Label>Objetivo estratégico</Label>
                  <TextArea
                    value={projectData.objetivo_estrategico}
                    onChange={(e) =>
                      setProjectData(p => ({ ...p, objetivo_estrategico: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Acción / Actividad estratégica</Label>
                  <TextArea
                    value={projectData.accion_estrategica}
                    onChange={(e) =>
                      setProjectData(p => ({ ...p, accion_estrategica: e.target.value }))
                    }
                  />

                </div>
              </Grid>
            </Section>

            {/* PROYECTO */}
            <Section title="Datos del proyecto">
              <Grid columns={2}>
                <div>
                  <Label>Nombre del proyecto</Label>
                  <Input
                    type="text"
                    value={projectData.nombre}
                    onChange={(e) =>
                      setProjectData(p => ({ ...p, nombre: e.target.value }))
                    }
                  />

                </div>
                <div>
                  <Label>Responsable</Label>
                  <Select
                    value={projectData.id_responsable}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        id_responsable: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione responsable</option>
                    {responsables.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre_completo}
                      </option>
                    ))}
                  </Select>
                </div>
              </Grid>

              <div style={{ marginTop: '0.6rem' }}>
                <Label>Objetivo del proyecto</Label>
                <TextArea placeholder="Describir qué se quiere lograr, cómo y para qué..." />
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
                          <Input
                            type="text"
                            placeholder={a.name}
                            value={a.name}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))}
                            style={{ fontWeight: 600 }}
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
                                    <Checkbox
                                      checked={checked}
                                      onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, months: x.months.map((m, i) => i === idx ? e.target.checked : m) } : x))}
                                      style={{ justifyContent: 'center', marginBottom: 0 }}
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
                              <Select
                                value={a.kpi.categoria}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, categoria: e.target.value } } : x))}
                              >
                                <option value="">Seleccione...</option>
                                <option>% de actividades ejecutadas</option>
                                <option>Nº de personas beneficiadas directamente</option>
                                <option>Nº de personas beneficiadas indirectamente</option>
                                <option>Nº de productos / documentos generados</option>
                                <option>Logro principal alcanzado (Sí/No)</option>
                              </Select>
                            </div>
                            <div>
                              <Label>Descripción específica</Label>
                              <Input
                                type="text"
                                placeholder="Descripción del indicador de la actividad"
                                value={a.kpi.descripcion}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, descripcion: e.target.value } } : x))}
                              />
                            </div>
                            <div>
                              <Label>Meta</Label>
                              <Input
                                type="number"
                                placeholder="Meta"
                                value={a.kpi.meta}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, meta: e.target.value } } : x))}
                              />
                            </div>
                            <div>
                              <Label>Unidad</Label>
                              <Input
                                type="text"
                                placeholder="Unidad"
                                value={a.kpi.unidad}
                                onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, unidad: e.target.value } } : x))}
                              />
                            </div>
                            <div>
                              <Label>Beneficiarios</Label>
                              <Input
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
                      <tr>
                        <td colSpan={2} style={actividadIndentStyle}>
                          <Label>Evidencias</Label>
                          <TextArea
                            placeholder="Actas, minutas, correos, acuerdos..."
                            value={a.evidencias}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, evidencias: e.target.value } : x))}
                          />
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

              <Table variant="compact">
                <Table.Header>
                  <Table.Row>
                    <Table.Cell header style={{ width: '36%' }}>Descripción</Table.Cell>
                    <Table.Cell header>Cantidad</Table.Cell>
                    <Table.Cell header>Unidad</Table.Cell>
                    <Table.Cell header>Precio unitario ($)</Table.Cell>
                    <Table.Cell header>Costo total ($)</Table.Cell>
                    <Table.Cell header style={{ width: '3%' }}>{null}</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {variablesRows.map((r, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell><Input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => updateCostRow('variables', idx, 'descripcion', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="number" min={0} step={1} value={r.qty} onChange={(e) => updateCostRow('variables', idx, 'qty', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="text" placeholder="Unidad" value={r.unidad} onChange={(e) => updateCostRow('variables', idx, 'unidad', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="number" min={0} step={0.01} value={r.unit} onChange={(e) => updateCostRow('variables', idx, 'unit', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="number" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} /></Table.Cell>
                      <Table.Cell center>
                        <Button variant="alt" size="sm" type="button" onClick={() => removeCostRow('variables', idx)}>✖</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row>
                    <Table.Cell colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total costos variables ($):</Table.Cell>
                    <Table.Cell><Input type="number" readOnly value={totalVariables ? totalVariables.toFixed(2) : ''} style={{ fontWeight: 'bold' }} /></Table.Cell>
                    <Table.Cell>{null}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Section>

            {/* PRESUPUESTO: COSTOS FIJOS */}
            <Section
              title="Presupuesto - Costos fijos"
              description="Costos de personal u otros que se mantienen durante el año."
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.3rem' }}>
                <Button variant="main" size="sm" type="button" onClick={() => addCostRow('fijos')}>➕ Agregar costo fijo</Button>
              </div>

              <Table variant="compact">
                <Table.Header>
                  <Table.Row>
                    <Table.Cell header style={{ width: '36%' }}>Descripción</Table.Cell>
                    <Table.Cell header>Cantidad</Table.Cell>
                    <Table.Cell header>Unidad</Table.Cell>
                    <Table.Cell header>Precio unitario ($)</Table.Cell>
                    <Table.Cell header>Costo total ($)</Table.Cell>
                    <Table.Cell header style={{ width: '3%' }}>{null}</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {fijosRows.map((r, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell><Input type="text" placeholder="Nuevo costo" value={r.descripcion} onChange={(e) => updateCostRow('fijos', idx, 'descripcion', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="number" min={0} step={1} value={r.qty} onChange={(e) => updateCostRow('fijos', idx, 'qty', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="text" placeholder="Meses" value={r.unidad} onChange={(e) => updateCostRow('fijos', idx, 'unidad', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="number" min={0} step={0.01} value={r.unit} onChange={(e) => updateCostRow('fijos', idx, 'unit', e.target.value)} /></Table.Cell>
                      <Table.Cell><Input type="number" readOnly value={rowTotal(r) ? rowTotal(r).toFixed(2) : ''} /></Table.Cell>
                      <Table.Cell center>
                        <Button variant="alt" size="sm" type="button" onClick={() => removeCostRow('fijos', idx)}>✖</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row>
                    <Table.Cell colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total costos fijos ($):</Table.Cell>
                    <Table.Cell><Input type="number" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} style={{ fontWeight: 'bold' }} /></Table.Cell>
                    <Table.Cell>{null}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Section>

            {/* TOTAL GENERAL */}
            <Section title="Costo total del proyecto">
              <Grid columns={3}>
                <div>
                  <Label>Total costos variables ($)</Label>
                  <Input type="number" readOnly value={totalVariables ? totalVariables.toFixed(2) : ''} />
                </div>
                <div>
                  <Label>Total costos fijos ($)</Label>
                  <Input type="number" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} />
                </div>
                <div>
                  <Label>Total general del proyecto ($)</Label>
                  <Input type="number" readOnly value={totalGeneral ? totalGeneral.toFixed(2) : ''} />
                </div>
              </Grid>
            </Section>
          </form>
        </Card>
      </main>
    </div>
  );
}

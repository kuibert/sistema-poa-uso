import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageLayout,
  Card,
  Divider,
  Grid,
  Section,
  Label,
  Button,
  ErrorMessage,
  SuccessMessage,
  Input,
  TextArea,
  Select,
  Table,
  Checkbox,
  UserSelectModal,
  Flex,
  Typography
} from '../components/common';

import apiClient from '../services/apiClient';

// Tipos auxiliares
type Activity = {
  id: number;
  header: string; // "Actividad N"
  name: string;
  months: boolean[]; // 12 meses
  id_responsable: string;
  cargo_responsable: string;
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
  qty: string;
  unidad: string;
  unit: string;
  actividadId?: number;
  incluirEnAvance?: boolean;
};

export const ProyectoPOA: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // User Selection Modal State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [onUserSelect, setOnUserSelect] = useState<(u: any) => void>(() => { });

  // Información del proyecto (valores por defecto)
  const [projectData, setProjectData] = useState({
    nombre: '',
    objetivo: '',
    unidad_responsable: '',
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

  // Cargar datos del proyecto si estamos en modo edición
  const [dbActivityIds, setDbActivityIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      try {
        const { data } = await apiClient.get(`/proyectos/${id}/seguimiento`);

        setProjectData(prev => ({
          ...prev,
          nombre: data.nombre,
          anio: data.anio,
        }));

        const { data: pFull } = await apiClient.get(`/proyectos/${id}`);

        setProjectData({
          nombre: pFull.nombre,
          objetivo: pFull.objetivo_proyecto || pFull.objetivo || '',
          unidad_responsable: pFull.unidad_facultad || pFull.unidad_responsable || '',
          linea_estrategica: pFull.linea_estrategica || '',
          objetivo_estrategico: pFull.objetivo_estrategico || '',
          accion_estrategica: pFull.accion_estrategica || '',
          anio: pFull.anio,
          fecha_inicio: pFull.fecha_inicio ? pFull.fecha_inicio.split('T')[0] : '',
          fecha_fin: pFull.fecha_fin ? pFull.fecha_fin.split('T')[0] : '',
          id_responsable: pFull.id_responsable || '',
        });

        if (data.actividades) {
          const initialIds = new Set<number>();
          const mappedActivities: Activity[] = data.actividades.map((a: any, index: number) => {
            const monthsBool = new Array(12).fill(false);
            if (a.plan_mensual) {
              a.plan_mensual.forEach((pm: any) => {
                if (pm.planificado && pm.mes >= 1 && pm.mes <= 12) {
                  monthsBool[pm.mes - 1] = true;
                }
              });
            }

            const ind = a.indicadores && a.indicadores.length > 0 ? a.indicadores[0] : {};
            initialIds.add(Number(a.id_actividad));

            return {
              id: Number(a.id_actividad),
              header: `Actividad ${index + 1}`,
              name: a.nombre,
              months: monthsBool,
              id_responsable: a.id_responsable || data.id_responsable || '',
              cargo_responsable: a.cargo_responsable || '',
              kpi: {
                categoria: ind.categoria || '',
                descripcion: ind.nombre || '',
                meta: ind.meta || '',
                unidad: ind.unidad_medida || '',
                beneficiarios: ind.beneficiarios || ''
              },
              evidencias: '',
            };
          });

          setDbActivityIds(initialIds);
          setActivities(mappedActivities);
          setActividadCounter(mappedActivities.length);
          const maxId = mappedActivities.length > 0 ? Math.max(...mappedActivities.map(a => a.id)) : 0;
          setGroupCounter(maxId + 100);

          if (data.costos && Array.isArray(data.costos) && data.costos.length > 0) {
            const vars: CostRow[] = [];
            const fijos: CostRow[] = [];

            data.costos.forEach((c: any) => {
              const row: CostRow = {
                descripcion: c.descripcion,
                qty: String(c.cantidad),
                unidad: c.unidad,
                unit: String(c.precio_unitario),
                actividadId: c.id_actividad ? Number(c.id_actividad) : undefined,
                incluirEnAvance: c.incluir_en_avance !== undefined ? c.incluir_en_avance : true
              };
              if (c.tipo === 'variable') {
                vars.push(row);
              } else {
                fijos.push(row);
              }
            });

            setVariablesRows(vars);
            setFijosRows(fijos);
          } else {
            setVariablesRows([]);
            setFijosRows([]);
          }
        }
      } catch (err) {
        console.error("Error loading project", err);
        setError("Error cargando los datos del proyecto.");
      }
    };
    loadProject();
  }, [id]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [groupCounter, setGroupCounter] = useState(1);
  const [actividadCounter, setActividadCounter] = useState(0);

  const addActivity = () => {
    const nextId = groupCounter;
    const nextNum = actividadCounter + 1;
    setGroupCounter(groupCounter + 1);
    setActividadCounter(nextNum);

    const nueva: Activity = {
      id: nextId,
      header: `Actividad ${nextNum}`,
      name: '',
      months: new Array(12).fill(false),
      id_responsable: '',
      cargo_responsable: '',
      kpi: {
        categoria: '',
        descripcion: '',
        meta: '',
        unidad: '',
        beneficiarios: '',
      },
      evidencias: ''
    };
    setActivities(prev => [...prev, nueva]);

    const nuevoCosto: CostRow = {
      descripcion: '',
      qty: '',
      unidad: '',
      unit: '',
      actividadId: nextId
    };
    setVariablesRows(prev => [...prev, nuevoCosto]);
  };

  const removeActivity = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const [variablesRows, setVariablesRows] = useState<CostRow[]>([]);
  const [fijosRows, setFijosRows] = useState<CostRow[]>([]);

  const addCostRow = (table: 'variables' | 'fijos') => {
    const nuevo: CostRow = { descripcion: '', qty: '', unidad: '', unit: '' };
    if (table === 'variables') setVariablesRows(prev => [...prev, nuevo]);
    else setFijosRows(prev => [...prev, nuevo]);
  };

  const removeCostRow = (table: 'variables' | 'fijos', index: number) => {
    if (table === 'variables') setVariablesRows(prev => prev.filter((_, i) => i !== index));
    else setFijosRows(prev => prev.filter((_, i) => i !== index));
  };

  const updateCostRow = (
    table: 'variables' | 'fijos',
    index: number,
    field: keyof CostRow,
    value: string | number | boolean
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

  const handleSave = async () => {
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

      const costosIniciales = [
        ...variablesRows.map(r => ({
          tipo: 'variable',
          descripcion: r.descripcion,
          cantidad: r.qty,
          unidad: r.unidad,
          precio_unitario: r.unit,
          costo_total: rowTotal(r),
          id_actividad: null
        })),
        ...fijosRows.map(r => ({
          tipo: 'fijo',
          descripcion: r.descripcion,
          cantidad: r.qty,
          unidad: r.unidad,
          precio_unitario: r.unit,
          costo_total: rowTotal(r),
          id_actividad: null,
          incluir_en_avance: r.incluirEnAvance !== undefined ? r.incluirEnAvance : true
        }))
      ];

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
        id_responsable: projectData.id_responsable ? Number(projectData.id_responsable) : null,
        costos: costosIniciales
      };

      let projectId = id ? Number(id) : null;

      if (id) {
        await apiClient.put(`/proyectos/${id}`, proyectoPayload);
      } else {
        const { data: proyecto } = await apiClient.post('/proyectos', proyectoPayload);
        projectId = proyecto.id;
      }

      if (!projectId) throw new Error("No Project ID");

      let actividadesToDelete: number[] = [];
      if (id) {
        const currentIds = new Set(activities.map(a => a.id));
        dbActivityIds.forEach(dbId => {
          if (!currentIds.has(dbId)) {
            actividadesToDelete.push(dbId);
          }
        });
      }

      for (const delId of actividadesToDelete) {
        await apiClient.delete(`/proyectos/actividades/${delId}`);
      }

      const idMap = new Map<number, number>();

      for (const a of actividadesValidas) {
        const costosVinculados = variablesRows.filter(r => r.actividadId === a.id);
        const sumaCostos = costosVinculados.reduce((s, r) => s + rowTotal(r), 0);

        const actPayload = {
          nombre: a.name,
          descripcion: a.kpi.descripcion,
          id_responsable: a.id_responsable ? Number(a.id_responsable) : (projectData.id_responsable ? Number(projectData.id_responsable) : null),
          cargo_responsable: a.cargo_responsable || '',
          unidad_responsable: projectData.unidad_responsable,
          presupuesto_asignado: sumaCostos,
          meses: a.months.map((m, idx) => (m ? idx + 1 : null)).filter(m => m !== null),
          indicador: {
            categoria: a.kpi.categoria,
            descripcion: a.kpi.descripcion,
            meta: a.kpi.meta,
            unidad: a.kpi.unidad,
            beneficiarios: a.kpi.beneficiarios
          }
        };

        const isExisting = id && dbActivityIds.has(a.id);

        if (isExisting) {
          await apiClient.put(`/proyectos/actividades/${a.id}`, actPayload);
          idMap.set(a.id, a.id);
        } else {
          const { data: actCreated } = await apiClient.post(`/proyectos/${projectId}/actividades`, actPayload);
          idMap.set(a.id, actCreated.id);
        }
      }

      const costosFinales = [
        ...variablesRows.map(r => ({
          tipo: 'variable',
          descripcion: r.descripcion,
          cantidad: r.qty,
          unidad: r.unidad,
          precio_unitario: r.unit,
          costo_total: rowTotal(r),
          id_actividad: r.actividadId ? idMap.get(r.actividadId) : null
        })),
        ...fijosRows.map(r => ({
          tipo: 'fijo',
          descripcion: r.descripcion,
          cantidad: r.qty,
          unidad: r.unidad,
          precio_unitario: r.unit,
          costo_total: rowTotal(r),
          id_actividad: null,
          incluir_en_avance: r.incluirEnAvance !== undefined ? r.incluirEnAvance : true
        }))
      ];

      await apiClient.put(`/proyectos/${projectId}`, {
        ...proyectoPayload,
        costos: costosFinales
      });

      setSuccessMsg(id ? 'Datos actualizados' : 'Agregado con éxito el proyecto');
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el proyecto');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout>
      <Card padding="1.8rem">
        <Flex justify="space-between" align="center" wrap="wrap" gap="0.8rem">
          <div>
            <Typography variant="h1">Registro de Proyecto POA</Typography>
            <Typography variant="body" color="var(--texto-secundario)" style={{ marginTop: '0.2rem' }}>
              Información estratégica, actividades, indicadores y presupuesto.
            </Typography>
          </div>

          <Flex gap="0.5rem">
            <Button variant="alt" type="button" onClick={handleSave} disabled={saving}>
              {saving ? '💾 Guardando...' : '💾 Guardar'}
            </Button>
          </Flex>
        </Flex>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
        {successMsg && <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} />}

        <Divider variant="gradient" />

        <form onSubmit={(e) => e.preventDefault()}>
          {/* ESTRATÉGICO */}
          <Section title="Información estratégica" description="Vinculación con el plan institucional.">
            <Grid columns={3}>
              <div>
                <Label>Año</Label>
                <Input
                  type="number"
                  value={projectData.anio}
                  onChange={(e) => setProjectData(p => ({ ...p, anio: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Unidad / Facultad</Label>
                <Input
                  type="text"
                  value={projectData.unidad_responsable}
                  onChange={(e) => setProjectData(p => ({ ...p, unidad_responsable: e.target.value }))}
                />
              </div>
              <div>
                <Label>Línea estratégica</Label>
                <Input
                  type="text"
                  value={projectData.linea_estrategica}
                  onChange={(e) => setProjectData(p => ({ ...p, linea_estrategica: e.target.value }))}
                />
              </div>
            </Grid>

            <Grid columns={2} style={{ marginTop: '1rem' }}>
              <div>
                <Label>Objetivo estratégico</Label>
                <TextArea
                  value={projectData.objetivo_estrategico}
                  onChange={(e) => setProjectData(p => ({ ...p, objetivo_estrategico: e.target.value }))}
                />
              </div>
              <div>
                <Label>Acción / Actividad estratégica</Label>
                <TextArea
                  value={projectData.accion_estrategica}
                  onChange={(e) => setProjectData(p => ({ ...p, accion_estrategica: e.target.value }))}
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
                  onChange={(e) => setProjectData(p => ({ ...p, nombre: e.target.value }))}
                />
              </div>
              <div>
                <Label>Responsable del Proyecto</Label>
                <Flex gap="0.5rem">
                  <Input
                    readOnly
                    type="text"
                    value={responsables.find(r => String(r.id) === String(projectData.id_responsable))?.nombre_completo || ''}
                    placeholder="Seleccione responsable"
                    onClick={() => {
                      setOnUserSelect(() => (u: any) => setProjectData(d => ({ ...d, id_responsable: String(u.id) })));
                      setUserModalOpen(true);
                    }}
                    style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Button variant="alt" type="button" onClick={() => {
                    setOnUserSelect(() => (u: any) => setProjectData(d => ({ ...d, id_responsable: String(u.id) })));
                    setUserModalOpen(true);
                  }}>🔍</Button>
                </Flex>
              </div>
            </Grid>

            <div style={{ marginTop: '0.6rem' }}>
              <Label>Objetivo del proyecto</Label>
              <TextArea
                value={projectData.objetivo}
                onChange={(e) => setProjectData(p => ({ ...p, objetivo: e.target.value }))}
              />
            </div>
          </Section>

          {/* ACTIVIDADES */}
          <Section
            title="Actividades, meses de ejecución e indicadores"
            description="Cada actividad tiene su nombre, meses de ejecución, indicador de logro y evidencias asociadas."
          >
            <Flex direction="column" gap="1.5rem">
              {activities.map((a) => (
                <Card key={a.id} variant="dark" padding="1rem" style={{ border: '1px solid var(--borde)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '1rem' }}>
                    <Typography variant="h2" color="var(--verde-hoja)">{a.header}</Typography>
                    <Button variant="alt" size="sm" type="button" onClick={() => removeActivity(a.id)}>✖ Eliminar Actividad</Button>
                  </Flex>

                  <div style={{ marginBottom: '1rem' }}>
                    <Label>Nombre de la actividad</Label>
                    <Input
                      type="text"
                      placeholder="Nombre de la actividad..."
                      value={a.name}
                      onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))}
                      style={{ fontWeight: 600 }}
                    />
                  </div>

                  {/* Meses */}
                  <div style={{ marginBottom: '1rem' }}>
                    <Label>Meses de ejecución</Label>
                    <Grid columns={12} gap="0.25rem">
                      {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((name, idx) => (
                        <Flex direction="column" align="center" key={idx}>
                          <Typography variant="caption">{name}</Typography>
                          <Checkbox
                            checked={a.months[idx]}
                            onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, months: x.months.map((m, i) => i === idx ? e.target.checked : m) } : x))}
                          />
                        </Flex>
                      ))}
                    </Grid>
                  </div>

                  {/* Responsable de Actividad */}
                  <Grid columns={2} gap="1rem" style={{ marginBottom: '1rem' }}>
                    <div>
                      <Label>Responsable de la actividad</Label>
                      <Flex gap="0.5rem">
                        <Input
                          readOnly
                          type="text"
                          value={responsables.find(r => String(r.id) === String(a.id_responsable))?.nombre_completo || ''}
                          placeholder="Seleccione responsable..."
                          onClick={() => {
                            setOnUserSelect(() => (u: any) => {
                              setActivities(prev => prev.map(x => x.id === a.id ? { ...x, id_responsable: String(u.id), cargo_responsable: u.cargo || '' } : x));
                            });
                            setUserModalOpen(true);
                          }}
                          style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Button variant="alt" size="sm" type="button" onClick={() => {
                          setOnUserSelect(() => (u: any) => {
                            setActivities(prev => prev.map(x => x.id === a.id ? { ...x, id_responsable: String(u.id), cargo_responsable: u.cargo || '' } : x));
                          });
                          setUserModalOpen(true);
                        }}>🔍</Button>
                      </Flex>
                    </div>
                    <div>
                      <Label>Cargo del responsable</Label>
                      <Input
                        type="text"
                        placeholder="Cargo"
                        value={a.cargo_responsable}
                        onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, cargo_responsable: e.target.value } : x))}
                      />
                    </div>
                  </Grid>

                  {/* KPI */}
                  <Typography variant="body" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Indicador de logro</Typography>
                  <Grid columns={3} gap="0.8rem" style={{ marginBottom: '1rem' }}>
                    <div>
                      <Label>Categoría</Label>
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
                        placeholder="Descripción"
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
                      <Label>Unidad de medida</Label>
                      <Input
                        type="text"
                        placeholder="Unidad"
                        value={a.kpi.unidad}
                        onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, unidad: e.target.value } } : x))}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <Label>Beneficiarios</Label>
                      <Input
                        type="text"
                        placeholder="Grupo beneficiado"
                        value={a.kpi.beneficiarios}
                        onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, kpi: { ...x.kpi, beneficiarios: e.target.value } } : x))}
                      />
                    </div>
                  </Grid>

                  <div>
                    <Label>Evidencias</Label>
                    <TextArea
                      placeholder="Actas, minutas, informes..."
                      value={a.evidencias}
                      onChange={(e) => setActivities(prev => prev.map(x => x.id === a.id ? { ...x, evidencias: e.target.value } : x))}
                    />
                  </div>
                </Card>
              ))}
            </Flex>

            <Flex justify="flex-end" style={{ marginTop: '1.5rem' }}>
              <Button variant="main" type="button" onClick={addActivity}>➕ Agregar actividad</Button>
            </Flex>
          </Section>

          {/* PRESUPUESTO VARIABLES */}
          <Section title="Presupuesto - Costos variables" description="Gastos directamente asociados a actividades.">
            <Flex justify="flex-end" style={{ marginBottom: '1rem' }}>
              <Button variant="main" size="sm" type="button" onClick={() => addCostRow('variables')}>➕ Agregar costo variable</Button>
            </Flex>

            <Table variant="compact">
              <Table.Header>
                <Table.Row>
                  <Table.Cell header style={{ width: '20%' }}>Actividad</Table.Cell>
                  <Table.Cell header style={{ width: '30%' }}>Descripción</Table.Cell>
                  <Table.Cell header>Cant.</Table.Cell>
                  <Table.Cell header>Unidad</Table.Cell>
                  <Table.Cell header>Unitario ($)</Table.Cell>
                  <Table.Cell header>Total ($)</Table.Cell>
                  <Table.Cell header center style={{ width: '3%' }}></Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {variablesRows.map((r, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <Select
                        value={r.actividadId || ''}
                        onChange={(e) => updateCostRow('variables', idx, 'actividadId', Number(e.target.value))}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <option value="">Seleccione...</option>
                        {activities.map(a => (
                          <option key={a.id} value={a.id}>{a.header}: {a.name.substring(0, 20)}...</option>
                        ))}
                      </Select>
                    </Table.Cell>
                    <Table.Cell><Input type="text" value={r.descripcion} onChange={(e) => updateCostRow('variables', idx, 'descripcion', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="number" value={r.qty} onChange={(e) => updateCostRow('variables', idx, 'qty', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="text" value={r.unidad} onChange={(e) => updateCostRow('variables', idx, 'unidad', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="number" value={r.unit} onChange={(e) => updateCostRow('variables', idx, 'unit', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="number" readOnly value={rowTotal(r).toFixed(2)} /></Table.Cell>
                    <Table.Cell center>
                      <Button variant="alt" size="sm" type="button" onClick={() => removeCostRow('variables', idx)}>✖</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Cell colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total costos variables ($):</Table.Cell>
                  <Table.Cell><Input type="number" readOnly value={totalVariables.toFixed(2)} style={{ fontWeight: 'bold' }} /></Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Section>

          {/* PRESUPUESTO FIJOS */}
          <Section title="Presupuesto - Costos fijos" description="Costos de personal u otros permanentes.">
            <Flex justify="flex-end" style={{ marginBottom: '1rem' }}>
              <Button variant="main" size="sm" type="button" onClick={() => addCostRow('fijos')}>➕ Agregar costo fijo</Button>
            </Flex>

            <Table variant="compact">
              <Table.Header>
                <Table.Row>
                  <Table.Cell header style={{ width: '30%' }}>Descripción</Table.Cell>
                  <Table.Cell header>Cant.</Table.Cell>
                  <Table.Cell header>Unidad</Table.Cell>
                  <Table.Cell header>Unitario ($)</Table.Cell>
                  <Table.Cell header>Total ($)</Table.Cell>
                  <Table.Cell header center>Avance</Table.Cell>
                  <Table.Cell header center style={{ width: '3%' }}></Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fijosRows.map((r, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell><Input type="text" value={r.descripcion} onChange={(e) => updateCostRow('fijos', idx, 'descripcion', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="number" value={r.qty} onChange={(e) => updateCostRow('fijos', idx, 'qty', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="text" value={r.unidad} onChange={(e) => updateCostRow('fijos', idx, 'unidad', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="number" value={r.unit} onChange={(e) => updateCostRow('fijos', idx, 'unit', e.target.value)} /></Table.Cell>
                    <Table.Cell><Input type="number" readOnly value={rowTotal(r).toFixed(2)} /></Table.Cell>
                    <Table.Cell center>
                      <Checkbox
                        checked={r.incluirEnAvance !== undefined ? r.incluirEnAvance : true}
                        onChange={(e) => updateCostRow('fijos', idx, 'incluirEnAvance', e.target.checked)}
                      />
                    </Table.Cell>
                    <Table.Cell center>
                      <Button variant="alt" size="sm" type="button" onClick={() => removeCostRow('fijos', idx)}>✖</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Cell colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total costos fijos ($):</Table.Cell>
                  <Table.Cell><Input type="number" readOnly value={totalFijos.toFixed(2)} style={{ fontWeight: 'bold' }} /></Table.Cell>
                  <Table.Cell colSpan={2}></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Section>

          {/* RESUMEN FINAL */}
          <Divider variant="solid" />
          <Section title="Resumen de Presupuesto">
            <Grid columns={3}>
              <div>
                <Label>Total Variables ($)</Label>
                <Input type="number" readOnly value={totalVariables.toFixed(2)} />
              </div>
              <div>
                <Label>Total Fijos ($)</Label>
                <Input type="number" readOnly value={totalFijos.toFixed(2)} />
              </div>
              <div>
                <Label>Inversión Total ($)</Label>
                <Input type="number" readOnly value={totalGeneral.toFixed(2)} style={{ fontWeight: 'bold', color: 'var(--verde-hoja)' }} />
              </div>
            </Grid>
          </Section>
        </form>
      </Card>

      <UserSelectModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        users={responsables}
        onSelect={onUserSelect}
      />
    </PageLayout>
  );
};

import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, Divider, Grid, Section, Label, Button, ErrorMessage, SuccessMessage, Input, TextArea, Select, Table, Checkbox, UserSelectModal } from '../components/common';

import apiClient from '../services/apiClient';

// Tipos auxiliares
type Activity = {
  id: number;
  header: string; // "Actividad N"
  name: string;
  months: boolean[]; // 12 meses
  id_responsable: string;
  cargo_responsable: string; // Nuevo campo
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
  actividadId?: number; // Vinculación opcional a actividad
  incluirEnAvance?: boolean; // ← NUEVO: solo para costos fijos
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

  // Cargar datos del proyecto si estamos en modo edición
  // Guardamos los IDs originales de la base de datos para saber cuáles son existentes
  const [dbActivityIds, setDbActivityIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      try {
        // Usamos el endpoint de seguimiento que trae toda la estructura
        const { data } = await apiClient.get(`/proyectos/${id}/seguimiento`);

        // 1. Mapear datos básicos
        setProjectData({
          nombre: data.nombre,
          objetivo: data.nombre, // Ojo: el endpoint seguimiento no trae 'objetivo' descriptivo, trae 'año'. Asumiremos nombre o re-fetch si hace falta.
          // *CORRECCION*: El endpoint seguimiento es optimizado para read-only. Para editar necesitamos todos los campos.
          // Mejor hacer dos llamadas: getProyecto (datos crudos) + getSeguimiento (actividades)
          // OJO: getProyecto ya está disponible.
          unidad_responsable: 'Cargando...', // Se actualizará con getProyecto
          linea_estrategica: '',
          objetivo_estrategico: '',
          accion_estrategica: '',
          anio: data.anio,
          fecha_inicio: '',
          fecha_fin: '',
          id_responsable: '',
        });


        // Llamada complementaria para datos administrativos no presentes en seguimiento
        const { data: pFull } = await apiClient.get(`/proyectos/${id}`);

        setProjectData({
          nombre: pFull.nombre,
          objetivo: pFull.objetivo_proyecto || pFull.objetivo || '',
          unidad_responsable: pFull.unidad_facultad || pFull.unidad_responsable || '', // Trying both
          linea_estrategica: pFull.linea_estrategica || '',
          objetivo_estrategico: pFull.objetivo_estrategico || '',
          accion_estrategica: pFull.accion_estrategica || '',
          anio: pFull.anio,
          fecha_inicio: pFull.fecha_inicio ? pFull.fecha_inicio.split('T')[0] : '',
          fecha_fin: pFull.fecha_fin ? pFull.fecha_fin.split('T')[0] : '',
          id_responsable: pFull.id_responsable || '',
        });


        // 2. Mapear Actividades
        if (data.actividades) {
          const initialIds = new Set<number>();
          const mappedActivities: Activity[] = data.actividades.map((a: any, index: number) => {
            // Mapear meses
            const monthsBool = new Array(12).fill(false);
            if (a.plan_mensual) {
              a.plan_mensual.forEach((pm: any) => {
                if (pm.planificado && pm.mes >= 1 && pm.mes <= 12) {
                  monthsBool[pm.mes - 1] = true;
                }
              });
            }

            // Mapear Indicador (usamos el primero si hay)
            const ind = a.indicadores && a.indicadores.length > 0 ? a.indicadores[0] : {};

            initialIds.add(Number(a.id_actividad));

            return {
              id: Number(a.id_actividad), // ID real de DB
              header: `Actividad ${index + 1}`,
              name: a.nombre,
              months: monthsBool,
              id_responsable: a.id_responsable || data.id_responsable || '',
              cargo_responsable: a.cargo_responsable || '',
              kpi: {
                categoria: ind.categoria || '',
                descripcion: ind.nombre || '', // En seguimiento mapped 'nombre' es descripcion especifica
                meta: ind.meta || '',
                unidad: ind.unidad_medida || '',
                beneficiarios: ind.beneficiarios || ''
              },
              evidencias: '', // No viene en seguimiento
            };
          });

          setDbActivityIds(initialIds);
          setActivities(mappedActivities);
          setActividadCounter(mappedActivities.length);

          // Asegurar que el contador de grupos no colisione con IDs existentes
          const maxId = mappedActivities.length > 0 ? Math.max(...mappedActivities.map(a => a.id)) : 0;
          setGroupCounter(maxId + 100);

          // 3. Mapear Costos (Reales desde backend)
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
                incluirEnAvance: c.incluir_en_avance !== undefined ? c.incluir_en_avance : true // ← NUEVO
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
            // Fallback o init empty si no habia costos guardados (proyectos viejos)
            // Dejamos vacio o lo que estaba por defecto
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


  // Actividades iniciales (3) como en el HTML
  const initialActivities: Activity[] = useMemo(
    () => [
      {
        id: 1,
        header: 'Actividad 1',
        name: 'Acercamiento y entendimiento con ACAAI',
        months: new Array(12).fill(false),
        id_responsable: '',
        cargo_responsable: '',
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
        id_responsable: '',
        cargo_responsable: '',
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
        cargo_responsable: '',
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
      cargo_responsable: '',
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

    // Crear costo vinculado automáticamente
    const nuevoCosto: CostRow = {
      descripcion: `Gastos para ${nueva.header}`,
      qty: '1',
      unidad: 'Global',
      unit: '0',
      actividadId: nextId
    };
    setVariablesRows(prev => [...prev, nuevoCosto]);
  };

  const removeActivity = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  // Costos variables (3 filas iniciales)
  const [variablesRows, setVariablesRows] = useState<CostRow[]>([
    { descripcion: 'Costo de inscripción', qty: '', unidad: 'Evento', unit: '', actividadId: 1 },
    { descripcion: 'Capacitación a personal de la USO', qty: '', unidad: 'Sesión', unit: '', actividadId: 2 },
    { descripcion: 'Viáticos y alimentación', qty: '', unidad: 'Paquete', unit: '', actividadId: 3 },
  ]);

  // Costos fijos (3 filas iniciales)
  const [fijosRows, setFijosRows] = useState<CostRow[]>([
    { descripcion: 'Salario: Carlos Roberto Martínez Martínez', qty: '', unidad: 'Meses', unit: '' },
    { descripcion: 'Salario: Marvin Adonay Alarcón', qty: '', unidad: 'Meses', unit: '' },
    { descripcion: 'Salario: Henry Manuel Pérez', qty: '', unidad: 'Meses', unit: '' },
  ]);

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

      // 1️⃣ PROYECTO (Payload base - Costos con ID NULL)
      // Enviamos id_actividad: null para evitar error de FK (falta crear las actividades)
      const costosIniciales = [
        ...variablesRows.map(r => ({
          tipo: 'variable',
          descripcion: r.descripcion,
          cantidad: r.qty,
          unidad: r.unidad,
          precio_unitario: r.unit,
          costo_total: rowTotal(r),
          id_actividad: null // Se vincula en paso 3
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
        id_responsable: projectData.id_responsable
          ? Number(projectData.id_responsable)
          : null,
        costos: costosIniciales
      };

      let projectId = id ? Number(id) : null;

      if (id) {
        // UPDATE
        await apiClient.put(`/proyectos/${id}`, proyectoPayload);
      } else {
        // CREATE
        const { data: proyecto } = await apiClient.post('/proyectos', proyectoPayload);
        projectId = proyecto.id;
      }

      if (!projectId) throw new Error("No Project ID");

      // 2️⃣ ACTIVIDADES (Sync)
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

      // Mapa para rastrear TempID -> RealID
      const idMap = new Map<number, number>();

      for (const a of actividadesValidas) {
        // Calcular presupuesto sumando costos vinculados (usando datos de UI)
        const costosVinculados = variablesRows.filter(r => r.actividadId === a.id);
        const sumaCostos = costosVinculados.reduce((s, r) => s + rowTotal(r), 0);

        const actPayload = {
          nombre: a.name,
          descripcion: a.kpi.descripcion,
          id_responsable: a.id_responsable
            ? Number(a.id_responsable)
            : (projectData.id_responsable ? Number(projectData.id_responsable) : null),
          cargo_responsable: a.cargo_responsable || '',
          unidad_responsable: projectData.unidad_responsable,
          presupuesto_asignado: sumaCostos,
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

      // 3️⃣ FINAL UPDATE: Vincular costos con IDs reales
      console.log('Mapa de IDs:', Array.from(idMap.entries()));

      const costosFinales = [
        ...variablesRows.map(r => {
          const realActId = r.actividadId ? idMap.get(r.actividadId) : null;
          console.log(`Mapping Cost Var: Desc=${r.descripcion}, UI_ID=${r.actividadId}, Real_ID=${realActId}`);
          return {
            tipo: 'variable',
            descripcion: r.descripcion,
            cantidad: r.qty,
            unidad: r.unidad,
            precio_unitario: r.unit,
            costo_total: rowTotal(r),
            id_actividad: realActId || null
          };
        }),
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

      console.log('Costos Finales Payload:', JSON.stringify(costosFinales, null, 2));

      // Actualizamos solo los costos (y el resto de data por integridad)
      await apiClient.put(`/proyectos/${projectId}`, {
        ...proyectoPayload,
        costos: costosFinales
      });

      setSuccessMsg(id ? 'Datos actualizados' : 'Agregado con éxito el proyecto');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

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

            </div>
          </div>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          {successMsg && <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} />}

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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input
                      readOnly
                      type="text"
                      value={responsables.find(r => String(r.id) === String(projectData.id_responsable))?.nombre_completo || ''}
                      placeholder="Seleccione responsable"
                      onClick={() => {
                        setOnUserSelect(() => (u: any) => setProjectData(d => ({ ...d, id_responsable: String(u.id) })));
                        setUserModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--texto-claro)' }}
                    />
                    <Button variant="alt" type="button" onClick={() => {
                      setOnUserSelect(() => (u: any) => setProjectData(d => ({ ...d, id_responsable: String(u.id) })));
                      setUserModalOpen(true);
                    }}>🔍</Button>
                  </div>
                </div>
              </Grid>

              <div style={{ marginTop: '0.6rem' }}>
                <Label>Objetivo del proyecto</Label>
                <TextArea
                  placeholder="Describir qué se quiere lograr, cómo y para qué..."
                  value={projectData.objetivo}
                  onChange={(e) => setProjectData(p => ({ ...p, objetivo: e.target.value }))}
                />
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

                      {/* BLOQUE: RESPONSABLE Y CARGO */}
                      <tr>
                        <td colSpan={2} style={actividadIndentStyle}>
                          <Grid columns={2} gap="1rem" style={{ marginBottom: '1rem' }}>
                            <div>
                              <Label>Responsable de la actividad</Label>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Input
                                  readOnly
                                  type="text"
                                  value={responsables.find(r => String(r.id) === String(a.id_responsable))?.nombre_completo || ''}
                                  placeholder="Seleccione responsable..."
                                  onClick={() => {
                                    setOnUserSelect(() => (u: any) => {
                                      setActivities(prev => prev.map(x => x.id === a.id ? {
                                        ...x,
                                        id_responsable: String(u.id),
                                        cargo_responsable: u.cargo || ''
                                      } : x));
                                    });
                                    setUserModalOpen(true);
                                  }}
                                  style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--texto-claro)' }}
                                />
                                <Button variant="alt" size="sm" type="button" onClick={() => {
                                  setOnUserSelect(() => (u: any) => {
                                    setActivities(prev => prev.map(x => x.id === a.id ? {
                                      ...x,
                                      id_responsable: String(u.id),
                                      cargo_responsable: u.cargo || ''
                                    } : x));
                                  });
                                  setUserModalOpen(true);
                                }}>🔍</Button>
                              </div>
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
                    <Table.Cell header style={{ width: '20%' }}>Actividad</Table.Cell>
                    <Table.Cell header style={{ width: '30%' }}>Descripción</Table.Cell>
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
                      <Table.Cell>
                        <Select
                          value={r.actividadId || ''}
                          onChange={(e) => updateCostRow('variables', idx, 'actividadId', Number(e.target.value))}
                          style={{ fontSize: '0.8rem', padding: '0.3rem' }}
                        >
                          <option value="">Seleccione...</option>
                          {activities.map(a => (
                            <option key={a.id} value={a.id}>{a.header}: {a.name.substring(0, 20)}...</option>
                          ))}
                        </Select>
                      </Table.Cell>
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
                    <Table.Cell colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total costos variables ($):</Table.Cell>
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
                    <Table.Cell header style={{ width: '32%' }}>Descripción</Table.Cell>
                    <Table.Cell header>Cantidad</Table.Cell>
                    <Table.Cell header>Unidad</Table.Cell>
                    <Table.Cell header>Precio unitario ($)</Table.Cell>
                    <Table.Cell header>Costo total ($)</Table.Cell>
                    <Table.Cell header center style={{ width: '8%' }}>Incluir en avance</Table.Cell>
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
                    <Table.Cell><Input type="number" readOnly value={totalFijos ? totalFijos.toFixed(2) : ''} style={{ fontWeight: 'bold' }} /></Table.Cell>
                    <Table.Cell colSpan={2}>{null}</Table.Cell>
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

      <UserSelectModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        users={responsables}
        onSelect={onUserSelect}
      />
    </div>
  );
}

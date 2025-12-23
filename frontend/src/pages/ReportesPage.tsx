import React, { useState, useEffect } from 'react';
import { PageLayout, Card, Typography, Section, Grid, Button, Select, Label, Divider, LoadingSpinner, Table, Badge, Flex, Input, GanttChart } from '../components/common';
import { poaApi } from '../services/poaApi';

interface ReporteData {
    proyecto: any;
    equipo: any[];
    costos: any[];
    actividades: any[];
}

export const ReportesPage: React.FC = () => {
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [selectedProyectoId, setSelectedProyectoId] = useState<number | string>("");
    const [anio, setAnio] = useState(new Date().getFullYear()); // Year state
    const [reporte, setReporte] = useState<ReporteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingProyectos, setLoadingProyectos] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        loadProyectos();
    }, [anio]); // Reload when year changes

    const loadProyectos = async () => {
        try {
            setLoadingProyectos(true);
            setErrorMsg("");
            console.log("Cargando proyectos para año:", anio);
            const { data } = await poaApi.getProyectos(anio);
            console.log("Proyectos cargados:", data);
            setProyectos(data);
            setSelectedProyectoId(""); // Reset selection
        } catch (error) {
            console.error("Error cargando proyectos", error);
            setErrorMsg("Error al cargar proyectos. Verifique conexión.");
        } finally {
            setLoadingProyectos(false);
        }
    };

    const handleGenerarReporte = async () => {
        if (!selectedProyectoId) return;
        try {
            setLoading(true);
            const { data } = await poaApi.getReporte(Number(selectedProyectoId));
            setReporte(data);
        } catch (error) {
            console.error("Error generando reporte", error);
            alert("Error al generar el reporte");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Helpers
    const formatoDinero = (monto: any) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(monto || 0));
    };

    // Helper functions moved to components or cleaned up

    return (
        <PageLayout>
            <div className="no-print">
                <Typography variant="h1" style={{ marginBottom: '1rem' }}>Generación de Reportes</Typography>

                <Card padding="1.5rem">
                    <Section title="Configuración del Reporte" description="Ingrese el año y seleccione el proyecto para generar el informe.">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div style={{ flex: '0 0 120px' }}>
                                <Label>Año</Label>
                                <Input
                                    type="number"
                                    value={anio}
                                    onChange={e => setAnio(Number(e.target.value))}
                                    placeholder="Ej. 2025"
                                />
                            </div>
                            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                                <Label>Seleccionar Proyecto</Label>
                                <Select
                                    value={selectedProyectoId}
                                    onChange={e => setSelectedProyectoId(e.target.value)}
                                    disabled={loadingProyectos}
                                >
                                    <option value="">-- Seleccione un proyecto --</option>
                                    {proyectos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </Select>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', color: '#666', position: 'absolute', top: '100%', left: 0, width: '100%' }}>
                                    {loadingProyectos ? 'Cargando...' : `${proyectos.length} proyectos encontrados`}
                                    {errorMsg && <span style={{ color: 'red', marginLeft: '0.5rem' }}>{errorMsg}</span>}
                                </div>
                            </div>
                            <Button variant="main" onClick={handleGenerarReporte} disabled={!selectedProyectoId || loading}>
                                {loading ? 'Generando...' : 'Generar Reporte'}
                            </Button>
                            {reporte && (
                                <Button variant="alt" onClick={handlePrint}>
                                    🖨 Imprimir / Guardar PDF
                                </Button>
                            )}
                        </div>
                    </Section>
                </Card>
                <Divider variant="solid" />
            </div>

            {loading && <LoadingSpinner />}

            {reporte && (
                <div id="reporte-content" style={{ marginTop: '2rem', background: 'white', color: 'black', padding: '2rem', borderRadius: '8px' }}>

                    {/* ENCABEZADO REPORTE PROFESIONAL */}
                    <div className="report-header" style={{ marginBottom: '2rem', borderBottom: '3px solid #1a3a5c', paddingBottom: '1rem' }}>
                        <Flex justify="space-between" align="flex-start" style={{ marginBottom: '1rem' }}>
                            <div>
                                <Typography variant="h2" style={{ margin: 0, color: '#1a3a5c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Universidad de Sonsonate
                                </Typography>
                                <Typography variant="h3" style={{ margin: '0.2rem 0 0', color: '#555', fontWeight: 500 }}>
                                    Dirección de Planificación y Desarrollo Institucional
                                </Typography>
                                <Typography variant="caption" style={{ margin: '0.2rem 0 0', color: '#777' }}>
                                    Sistema de Gestión POA
                                </Typography>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Typography variant="caption" style={{ color: '#666', marginBottom: '0.2rem' }}>
                                    Fecha de generación:
                                </Typography>
                                <Typography variant="body" style={{ fontWeight: 600 }}>
                                    {new Date().toLocaleDateString()}
                                </Typography>
                            </div>
                        </Flex>

                        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                            <Typography variant="h1" style={{ fontSize: '1.3rem', margin: 0, color: '#2c3e50', fontWeight: 700 }}>
                                INFORME DE SEGUIMIENTO Y EVALUACIÓN
                            </Typography>
                            <Typography variant="h2" style={{ fontSize: '1.5rem', color: '#1a3a5c', margin: '0.8rem 0', fontWeight: 600 }}>
                                {reporte.proyecto.nombre}
                            </Typography>
                            <Flex justify="center" gap="2rem" style={{ fontSize: '0.9rem', color: '#555' }}>
                                <span><strong>Año:</strong> {reporte.proyecto.anio}</span>
                                <span><strong>Responsable:</strong> {reporte.proyecto.responsable_nombre}</span>
                            </Flex>
                        </div>
                    </div>

                    {/* 1. INFORMACIÓN GENERAL */}
                    <Section title="1. Información General" description="">
                        <Grid columns={2}>
                            <Flex direction="column"><Typography variant="body" weight={600} color="#000000">Unidad/Facultad:</Typography> <Typography variant="body" color="#000000">{reporte.proyecto.unidad_facultad}</Typography></Flex>
                            <Flex direction="column"><Typography variant="body" weight={600} color="#000000">Objetivo Estratégico:</Typography> <Typography variant="body" color="#000000">{reporte.proyecto.objetivo_estrategico || 'N/A'}</Typography></Flex>
                            <Flex direction="column"><Typography variant="body" weight={600} color="#000000">Responsable:</Typography> <Typography variant="body" color="#000000">{reporte.proyecto.responsable_nombre} ({reporte.proyecto.responsable_cargo || 'Sin cargo'})</Typography></Flex>
                            <Flex direction="column"><Typography variant="body" weight={600} color="#000000">Objetivo del Proyecto:</Typography> <Typography variant="body" color="#000000">{reporte.proyecto.objetivo_proyecto}</Typography></Flex>
                        </Grid>
                    </Section>
                    <Divider variant="solid" color="#eee" />

                    {/* 2. RESUMEN FINANCIERO */}
                    <Section title="2. Resumen Financiero" description="">
                        <Table variant="compact">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Cell header>Concepto</Table.Cell>
                                    <Table.Cell header>Monto</Table.Cell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Presupuesto Total Aprobado</Table.Cell>
                                    <Table.Cell><strong>{formatoDinero(reporte.proyecto.presupuesto_total)}</strong></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Total Gastos Ejecutados</Table.Cell>
                                    <Table.Cell>{formatoDinero(reporte.actividades.reduce((acc, act) => {
                                        const gastosAct = act.gastos?.reduce((gSum: any, g: any) => gSum + Number(g.monto), 0) || 0;
                                        return acc + gastosAct;
                                    }, 0))}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>

                        <Typography variant="h4" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Detalle de Costos Planificados</Typography>
                        <Table variant="compact">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Cell header>Tipo</Table.Cell>
                                    <Table.Cell header>Descripción</Table.Cell>
                                    <Table.Cell header>Costo Total</Table.Cell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reporte.costos.map((c, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell>{c.tipo}</Table.Cell>
                                        <Table.Cell>{c.descripcion}</Table.Cell>
                                        <Table.Cell>{formatoDinero(c.costo_total)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Section>
                    <Divider variant="solid" color="#eee" />

                    {/* 3. ACTIVIDADES */}
                    <Section title="3. Actividades del Proyecto" description="">
                        {reporte.actividades.map((act, i) => (
                            <Card key={i} style={{ marginBottom: '1.5rem', background: '#f9f9f9' }} padding="1rem">
                                <Typography variant="h4" style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                                    {i + 1}. {act.nombre}
                                </Typography>
                                <Typography variant="body" style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                                    {act.descripcion}
                                </Typography>
                                <Grid columns={2} style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    <Flex gap="0.5rem"><strong>Responsable:</strong> {act.responsable || 'N/A'}</Flex>
                                    <Flex gap="0.5rem"><strong>Presupuesto:</strong> {formatoDinero(act.presupuesto_asignado)}</Flex>
                                </Grid>
                            </Card>
                        ))}
                    </Section>
                    <Divider variant="solid" color="#eee" />

                    {/* 4. CRONOGRAMA GANTT */}
                    {/* page-break-inside: avoid para intentar que no corte la tabla a la mitad al imprimir */}
                    <Section title="4. Cronograma de Ejecución (Gantt)" description="">
                        <GanttChart actividades={reporte.actividades} />
                    </Section>
                    <div style={{ pageBreakAfter: 'always' }}></div> {/* Salto de página sugerido */}

                    {/* 5. INDICADORES (KPI) */}
                    <Section title="5. Indicadores de Logro (KPIs)" description="">
                        <Table variant="default">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Cell header>Actividad / Indicador</Table.Cell>
                                    <Table.Cell header>Meta</Table.Cell>
                                    <Table.Cell header>Logrado</Table.Cell>
                                    <Table.Cell header>Cumplimiento</Table.Cell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reporte.actividades.map((act) => (
                                    act.indicadores?.map((ind: any, k: number) => (
                                        <Table.Row key={`${act.id}-${k}`}>
                                            <Table.Cell>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{act.nombre}</div>
                                                <div>{ind.descripcion}</div>
                                            </Table.Cell>
                                            <Table.Cell>{ind.meta} {ind.unidad}</Table.Cell>
                                            <Table.Cell>{ind.logrado} {ind.unidad}</Table.Cell>
                                            <Table.Cell>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px' }}>
                                                        <div style={{ width: `${Math.min(ind.cumplimiento, 100)}%`, height: '100%', background: ind.cumplimiento >= 100 ? '#27ae60' : '#3498db', borderRadius: '4px' }}></div>
                                                    </div>
                                                    {ind.cumplimiento}%
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ))}
                            </Table.Body>
                        </Table>
                    </Section>
                    <Divider variant="solid" color="#eee" />

                    {/* 6. REGISTRO DE GASTOS */}
                    <Section title="6. Registro de Gastos" description="">
                        <Table variant="compact">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Cell header>Fecha</Table.Cell>
                                    <Table.Cell header>Actividad</Table.Cell>
                                    <Table.Cell header>Descripción</Table.Cell>
                                    <Table.Cell header>Monto</Table.Cell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reporte.actividades.flatMap(a => a.gastos?.map((g: any) => ({ ...g, actividadNombre: a.nombre })) || []).map((g: any, i: number) => (
                                    <Table.Row key={i}>
                                        <Table.Cell>{g.fecha ? new Date(g.fecha).toLocaleDateString() : '-'}</Table.Cell>
                                        <Table.Cell style={{ fontSize: '0.85rem' }}>{g.actividadNombre}</Table.Cell>
                                        <Table.Cell>{g.descripcion}</Table.Cell>
                                        <Table.Cell>{formatoDinero(g.monto)}</Table.Cell>
                                    </Table.Row>
                                ))}
                                {reporte.actividades.every(a => !a.gastos || a.gastos.length === 0) && (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>No hay gastos registrados</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Section>
                    <Divider variant="solid" color="#eee" />

                    {/* 7. EVIDENCIAS */}
                    <Section title="7. Evidencias Documentales" description="">
                        <Table variant="compact">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Cell header>Actividad</Table.Cell>
                                    <Table.Cell header>Tipo</Table.Cell>
                                    <Table.Cell header>Descripción</Table.Cell>
                                    <Table.Cell header>Archivo</Table.Cell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reporte.actividades.flatMap(a => a.evidencias?.map((e: any) => ({ ...e, actividadNombre: a.nombre })) || []).map((ev: any, i: number) => (
                                    <Table.Row key={i}>
                                        <Table.Cell style={{ fontSize: '0.85rem' }}>{ev.actividadNombre}</Table.Cell>
                                        <Table.Cell>{ev.tipo}</Table.Cell>
                                        <Table.Cell>{ev.descripcion}</Table.Cell>
                                        <Table.Cell>{ev.archivo}</Table.Cell>
                                    </Table.Row>
                                ))}
                                {reporte.actividades.every(a => !a.evidencias || a.evidencias.length === 0) && (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>No hay evidencias registradas</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Section>
                    <Divider variant="solid" color="#eee" />

                    {/* 8. EQUIPO */}
                    <Section title="8. Equipo del Proyecto" description="">
                        <Grid columns={3}>
                            {reporte.equipo.map((u, i) => (
                                <Card key={i} padding="0.8rem" style={{ border: '1px solid #eee', background: 'white' }}>
                                    <Typography variant="body" color="#000000" style={{ fontWeight: 600 }}>{u.nombre_completo}</Typography>
                                    <Typography variant="caption" style={{ color: '#444444' }}>{u.email}</Typography>
                                    <div style={{ marginTop: '0.4rem' }}>
                                        <Badge variant="pill">{u.rol}</Badge>
                                    </div>
                                </Card>
                            ))}
                        </Grid>
                    </Section>

                </div>
            )}

            {/* Estilos para impresión */}
            <style>{`
                @media print {
                    /* Ocultar todo por defecto */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Mostrar solo el contenido del reporte */
                    #reporte-content, #reporte-content * {
                        visibility: visible;
                    }

                    /* Posicionar el reporte en la hoja */
                    #reporte-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 20px !important; /* Margen de impresión */
                        background: white !important;
                        box-shadow: none !important;
                        border: none !important;
                        color: black !important;
                    }

                    /* Forzar estilos simples para impresión */
                    body { 
                        background: white !important; 
                        margin: 0; 
                        padding: 0; 
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Evitar cortes indeseados */
                    .page-break { page-break-after: always; }
                    tr, div { page-break-inside: avoid; }
                    
                    /* Ocultar elementos específicos de la web */
                    .no-print, nav, header, footer, .main-layout { 
                        display: none !important; 
                    }
                }

                /* Estilos específicos para tablas del reporte (Sobrescribir estilos por defecto) */
                #reporte-content table thead {
                    background: transparent !important;
                    border-bottom: 2px solid #1a3a5c;
                }
                #reporte-content table th {
                    color: #1a3a5c !important;
                    font-weight: 700 !important;
                    background: transparent !important;
                    border: none !important;
                }
                #reporte-content table td {
                    border-bottom: 1px solid #eee;
                }
            `}</style>
        </PageLayout>
    );
};

import React, { useState, useEffect } from 'react';
import { PageLayout, Card, Typography, Section, Button, Select, Label, Divider, LoadingSpinner, Flex, Input } from '../components/common';
import { poaApi } from '../services/poaApi';

// Import report components
import { ReporteDetallado } from './reportes/ReporteDetallado';
import { ReporteFinancieroProyecto } from './reportes/ReporteFinancieroProyecto';
import { ReporteFinancieroUnidad } from './reportes/ReporteFinancieroUnidad';

export const ReportesPage: React.FC = () => {
    const [tipoReporte, setTipoReporte] = useState<'detallado' | 'financiero'>('detallado');
    const [vistaFinanciera, setVistaFinanciera] = useState<'proyecto' | 'unidad'>('proyecto');

    const [proyectos, setProyectos] = useState<any[]>([]);
    const [selectedProyectoId, setSelectedProyectoId] = useState<number | string>("");
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [reporte, setReporte] = useState<any | null>(null);
    const [loadingProyectos, setLoadingProyectos] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        loadProyectos();
    }, [anio]);

    const loadProyectos = async () => {
        try {
            setLoadingProyectos(true);
            setErrorMsg("");
            const { data } = await poaApi.getProyectos(anio);
            setProyectos(data);
            setSelectedProyectoId("");
        } catch (error) {
            console.error("Error cargando proyectos", error);
            setErrorMsg("Error al cargar proyectos. Verifique conexión.");
        } finally {
            setLoadingProyectos(false);
        }
    };

    const handleGenerarReporteDetallado = async () => {
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

    const formatoDinero = (monto: any) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(monto || 0));
    };

    // Determine if we have data to show print button
    const hasReportData = reporte || (tipoReporte === 'financiero' && selectedProyectoId);

    return (
        <PageLayout>
            <div className="no-print">
                <Typography variant="h1" style={{ marginBottom: '1rem' }}>Generación de Reportes</Typography>

                <Card padding="1.5rem">
                    <Section title="Configuración del Reporte" description="Seleccione el tipo de reporte y configure los parámetros.">
                        {/* Toggle para tipo de reporte */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Label>Tipo de Reporte</Label>
                            <Flex gap="0.5rem" style={{ marginTop: '0.5rem' }}>
                                <Button
                                    variant={tipoReporte === 'detallado' ? 'main' : 'alt'}
                                    onClick={() => {
                                        setTipoReporte('detallado');
                                        setReporte(null);
                                    }}
                                >
                                    📄 Reporte Detallado
                                </Button>
                                <Button
                                    variant={tipoReporte === 'financiero' ? 'main' : 'alt'}
                                    onClick={() => {
                                        setTipoReporte('financiero');
                                        setReporte(null);
                                    }}
                                >
                                    💰 Reporte Financiero
                                </Button>
                            </Flex>
                        </div>

                        {/* Configuración común */}
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

                            {/* Toggle vista financiera (solo visible en modo financiero) */}
                            {tipoReporte === 'financiero' && (
                                <div style={{ flex: '0 0 200px' }}>
                                    <Label>Vista</Label>
                                    <Select
                                        value={vistaFinanciera}
                                        onChange={e => setVistaFinanciera(e.target.value as 'proyecto' | 'unidad')}
                                    >
                                        <option value="proyecto">Por Proyecto</option>
                                        <option value="unidad">Por Unidad/Facultad</option>
                                    </Select>
                                </div>
                            )}

                            {/* Selector de proyecto (para reporte detallado o financiero por proyecto) */}
                            {(tipoReporte === 'detallado' || vistaFinanciera === 'proyecto') && (
                                <>
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
                                    {tipoReporte === 'detallado' && (
                                        <Button
                                            variant="main"
                                            onClick={handleGenerarReporteDetallado}
                                            disabled={!selectedProyectoId || loading}
                                        >
                                            {loading ? 'Generando...' : 'Generar Reporte'}
                                        </Button>
                                    )}
                                </>
                            )}

                            {hasReportData && (
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

            {/* RENDER CONDITIONAL REPORTS */}
            {tipoReporte === 'detallado' && reporte && (
                <ReporteDetallado reporte={reporte} formatoDinero={formatoDinero} />
            )}

            {tipoReporte === 'financiero' && vistaFinanciera === 'proyecto' && selectedProyectoId && (
                <ReporteFinancieroProyecto proyectoId={Number(selectedProyectoId)} />
            )}

            {tipoReporte === 'financiero' && vistaFinanciera === 'unidad' && (
                <ReporteFinancieroUnidad anio={anio} />
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
                        padding: 20px !important;
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

                /* Estilos específicos para tablas del reporte */
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

import React, { useState, useEffect } from 'react';
import { PageLayout, Card, Typography, Section, Button, Select, Label, Divider, LoadingSpinner, Flex, Input, Modal } from '../components/common';
import { poaApi } from '../services/poaApi';

// Import report components
import { ReporteDetallado } from './reportes/ReporteDetallado';
import { ReporteFinancieroProyecto } from './reportes/ReporteFinancieroProyecto';
import { ReporteFinancieroUnidad } from './reportes/ReporteFinancieroUnidad';
import { ReporteMetricasAnual } from './reportes/ReporteMetricasAnual';

export const ReportesPage: React.FC = () => {
    const [tipoReporte, setTipoReporte] = useState<'detallado' | 'financiero' | 'metricas' | 'pdf'>('detallado');
    const [vistaFinanciera, setVistaFinanciera] = useState<'proyecto' | 'unidad'>('proyecto');

    const [proyectos, setProyectos] = useState<any[]>([]);
    const [unidades, setUnidades] = useState<string[]>([]);
    const [selectedProyectoId, setSelectedProyectoId] = useState<number | string>("");
    const [selectedUnidad, setSelectedUnidad] = useState("");
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [reporte, setReporte] = useState<any | null>(null);
    const [loadingProyectos, setLoadingProyectos] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    useEffect(() => {
        loadProyectos();
        loadUnidades();
    }, [anio]);

    useEffect(() => {
        if (tipoReporte === 'metricas') {
            loadReporteMetricas();
        }
    }, [tipoReporte, anio]);

    const loadReporteMetricas = async () => {
        try {
            setLoading(true);
            const { data } = await poaApi.getReporteMetricasAnual(anio);
            setReporte(data);
        } catch (error) {
            console.error("Error cargando reporte metricas", error);
            setErrorMsg("Error al cargar reporte de métricas.");
        } finally {
            setLoading(false);
        }
    };

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

    const loadUnidades = async () => {
        try {
            const { data } = await poaApi.getUnidades();
            setUnidades(data);
        } catch (error) {
            console.error("Error cargando unidades", error);
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

    const handleGenerarReportePDF = async () => {
        if (!selectedUnidad) return;
        try {
            setLoading(true);
            const response = await poaApi.getReportePDF(selectedUnidad, anio);

            // Crear blob y URL
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPdfPreviewUrl(url);
            setShowPdfModal(true);
        } catch (error) {
            console.error("Error descargando reporte PDF", error);
            alert("Error al obtener reporte");
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
    const hasReportData = reporte || (tipoReporte === 'financiero' && selectedProyectoId) || (tipoReporte === 'financiero' && vistaFinanciera === 'unidad');

    return (
        <PageLayout>
            <div className="no-print">
                <Typography variant="h1" style={{ marginBottom: '1rem' }}>Generación de Reportes</Typography>

                <Card padding="1.5rem">
                    <Section title="Configuración del Reporte" description="Seleccione el tipo de reporte y configure los parámetros.">
                        {/* Toggle para tipo de reporte */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Label>Tipo de Reporte</Label>
                            <Flex gap="0.5rem" style={{ marginTop: '0.5rem' }} wrap="wrap">
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
                                        setPdfPreviewUrl(null);
                                    }}
                                >
                                    💰 Reporte Financiero
                                </Button>
                                <Button
                                    variant={tipoReporte === 'metricas' ? 'main' : 'alt'}
                                    onClick={() => {
                                        setTipoReporte('metricas');
                                        setReporte(null);
                                    }}
                                >
                                    📊 Métricas Anuales
                                </Button>
                                <Button
                                    variant={tipoReporte === 'pdf' ? 'main' : 'alt'}
                                    onClick={() => {
                                        setTipoReporte('pdf');
                                        setReporte(null);
                                        setPdfPreviewUrl(null);
                                    }}
                                >
                                    📄 Reporte PDF
                                </Button>
                            </Flex>
                        </div>

                        {/* Configuración común */}
                        <Flex gap="1rem" align="flex-end" wrap="wrap">
                            <div style={{ flex: '0 0 120px' }}>
                                <Label>Año</Label>
                                <Input
                                    type="number"
                                    value={anio}
                                    onChange={e => setAnio(Number(e.target.value))}
                                    placeholder="Ej. 2025"
                                />
                            </div>

                            {/* Toggle vista financiera */}
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

                            {/* Selector de unidad para reporte PDF */}
                            {tipoReporte === 'pdf' && (
                                <>
                                    <div style={{ flex: '0 0 250px' }}>
                                        <Label>Unidad / Facultad</Label>
                                        <Select
                                            value={selectedUnidad}
                                            onChange={e => setSelectedUnidad(e.target.value)}
                                        >
                                            <option value="">-- Seleccione Unidad --</option>
                                            {unidades.map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '0.5rem' }}>
                                        <Button
                                            variant="alt"
                                            onClick={handleGenerarReportePDF}
                                            disabled={!selectedUnidad || loading}
                                        >
                                            {loading ? 'Cargando...' : '👁 Vista Previa'}
                                        </Button>
                                        {pdfPreviewUrl && (
                                            <Button
                                                variant="main"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = pdfPreviewUrl;
                                                    link.setAttribute('download', `Reporte_Proyectos_${selectedUnidad}_${anio}.pdf`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.remove();
                                                }}
                                            >
                                                ⬇ Descargar PDF
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Selector de proyecto */}
                            {(tipoReporte === 'detallado' || (tipoReporte === 'financiero' && vistaFinanciera === 'proyecto')) && (
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
                                        <Typography variant="caption" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '0.2rem' }}>
                                            {loadingProyectos ? 'Cargando...' : `${proyectos.length} proyectos encontrados`}
                                            {errorMsg && <span style={{ color: 'red', marginLeft: '0.5rem' }}>{errorMsg}</span>}
                                        </Typography>
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
                        </Flex>
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

            {tipoReporte === 'metricas' && reporte && (
                <ReporteMetricasAnual reporte={reporte} anio={anio} />
            )}

            {/* Previsualizador PDF en Modal */}
            <Modal
                isOpen={showPdfModal}
                onClose={() => setShowPdfModal(false)}
                title={`Vista Previa: Reporte de Proyectos - ${selectedUnidad}`}
            >
                <div style={{ height: '80vh', width: '100%' }}>
                    {pdfPreviewUrl && (
                        <iframe
                            src={pdfPreviewUrl}
                            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                            title="Vista previa PDF"
                        />
                    )}
                </div>
            </Modal>

            {/* Estilos para impresión */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #reporte-content, #reporte-content * {
            visibility: visible;
          }
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
          body { 
            background: white !important; 
            margin: 0; 
            padding: 0; 
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break { page-break-after: always; }
          tr, div { page-break-inside: avoid; }
          .no-print, nav, header, footer, .main-layout { 
            display: none !important; 
          }
        }
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

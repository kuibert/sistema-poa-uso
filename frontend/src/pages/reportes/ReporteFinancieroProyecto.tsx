import React, { useEffect } from 'react';
import { Section, Table, Divider, Grid, Flex, ReportHeader, KPICard, ProgressBar } from '../../components/common';
import apiClient from '../../services/apiClient';
import logoUso from '../../assets/images/logo_uso.png';

interface ReporteFinancieroProyectoProps {
    proyectoId: number;
    onDataLoad?: (data: any) => void;
}

export const ReporteFinancieroProyecto: React.FC<ReporteFinancieroProyectoProps> = ({ proyectoId, onDataLoad }) => {
    const [reporteProyecto, setReporteProyecto] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (proyectoId) {
            loadReporte();
        }
    }, [proyectoId]);

    const loadReporte = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get(`/proyectos/reporte-financiero/${proyectoId}`);
            setReporteProyecto(data);
            onDataLoad?.(data);
        } catch (error) {
            console.error("Error cargando reporte financiero", error);
        } finally {
            setLoading(false);
        }
    };

    const formatoDinero = (monto: any) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(monto || 0));
    };

    const formatoPorcentaje = (porcentaje: number) => {
        return `${Math.round(porcentaje || 0)}%`;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando reporte...</div>;
    if (!reporteProyecto) return null;

    return (
        <div id="reporte-content" style={{ marginTop: '2rem', background: 'white', color: 'black', padding: '2rem', borderRadius: '8px' }}>

            <ReportHeader
                title="INFORME FINANCIERO DEL PROYECTO"
                subtitle={reporteProyecto.proyecto.nombre}
                logo={logoUso}
                metadata={[
                    { label: 'Año', value: reporteProyecto.proyecto.anio },
                    { label: 'Responsable', value: reporteProyecto.proyecto.responsable_nombre }
                ]}
            />

            {/* 1. RESUMEN EJECUTIVO */}
            <Section title="1. Resumen Ejecutivo Financiero" description="">
                <Grid columns={4} gap="1rem" style={{ marginBottom: '1.5rem' }}>
                    <KPICard
                        title="Presupuesto Aprobado"
                        value={formatoDinero(reporteProyecto.resumen.totalPresupuesto)}
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                    <KPICard
                        title="Total Ejecutado"
                        value={formatoDinero(reporteProyecto.resumen.totalGastado)}
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />
                    <KPICard
                        title="Disponible"
                        value={formatoDinero(reporteProyecto.resumen.disponible)}
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    />
                    <KPICard
                        title="% Ejecución"
                        value={formatoPorcentaje(reporteProyecto.resumen.porcentajeEjecucion)}
                        gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    />
                </Grid>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 2. DESGLOSE POR ACTIVIDAD */}
            <Section title="2. Desglose Financiero por Actividad" description="">
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Actividad</Table.Cell>
                            <Table.Cell header>Presupuesto Asignado</Table.Cell>
                            <Table.Cell header>Gastado</Table.Cell>
                            <Table.Cell header>Disponible</Table.Cell>
                            <Table.Cell header>% Ejecución</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporteProyecto.actividades.map((act: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell>{act.nombre}</Table.Cell>
                                <Table.Cell>{formatoDinero(act.presupuesto_asignado)}</Table.Cell>
                                <Table.Cell>{formatoDinero(act.gastado)}</Table.Cell>
                                <Table.Cell>{formatoDinero(act.disponible)}</Table.Cell>
                                <Table.Cell>
                                    <Flex align="center" gap="8px">
                                        <ProgressBar
                                            progress={act.porcentaje_ejecucion}
                                            height="8px"
                                            color={act.porcentaje_ejecucion >= 100 ? '#27ae60' : '#3498db'}
                                            trackColor="#eee"
                                        />
                                        <span style={{ fontSize: '0.85rem', minWidth: '45px', textAlign: 'right' }}>
                                            {formatoPorcentaje(act.porcentaje_ejecucion)}
                                        </span>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        {reporteProyecto.actividades.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={5} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                    No hay actividades registradas
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Section>

        </div>
    );
};

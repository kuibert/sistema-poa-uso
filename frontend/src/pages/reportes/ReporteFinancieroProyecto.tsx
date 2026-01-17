import React, { useEffect } from 'react';
import { Section, Table, Divider, Grid, Flex, ReportHeader, KPICard, ProgressBar, LoadingSpinner, Typography } from '../../components/common';
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

    if (loading) return (
        <Flex justify="center" direction="column" align="center" padding="4rem" gap="1rem">
            <LoadingSpinner />
            <Typography variant="body">Cargando reporte...</Typography>
        </Flex>
    );

    if (!reporteProyecto) return null;

    return (
        <div id="reporte-content" style={{
            marginTop: '2rem',
            background: 'white',
            color: 'black',
            padding: '2rem',
            borderRadius: '8px',
            '--typo-color-h': '#1a3a5c',
            '--typo-color-body': '#334155'
        } as React.CSSProperties}>

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
                                        <Typography variant="caption" style={{ minWidth: '45px', textAlign: 'right' }}>
                                            {formatoPorcentaje(act.porcentaje_ejecucion)}
                                        </Typography>
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

            {/* 3. COSTOS VARIABLES DEL PROYECTO */}
            <Divider variant="solid" color="#eee" />
            <Section title="3. Costos Variables del Proyecto">
                <Typography variant="body" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                    Detalle de los costos variables del proyecto.
                </Typography>
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Descripción</Table.Cell>
                            <Table.Cell header>Cantidad</Table.Cell>
                            <Table.Cell header>Unidad</Table.Cell>
                            <Table.Cell header>Precio Unitario</Table.Cell>
                            <Table.Cell header>Costo Total</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporteProyecto.costos?.filter((c: any) => c.tipo === 'variable').map((costo: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell>{costo.descripcion}</Table.Cell>
                                <Table.Cell>{costo.cantidad}</Table.Cell>
                                <Table.Cell>{costo.unidad}</Table.Cell>
                                <Table.Cell>{formatoDinero(costo.precio_unitario)}</Table.Cell>
                                <Table.Cell>{formatoDinero(costo.costo_total)}</Table.Cell>
                            </Table.Row>
                        ))}
                        {(!reporteProyecto.costos || reporteProyecto.costos.filter((c: any) => c.tipo === 'variable').length === 0) && (
                            <Table.Row>
                                <Table.Cell colSpan={5} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                    No hay costos variables registrados
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Section>

            {/* 4. COSTOS FIJOS DEL PROYECTO */}
            <Divider variant="solid" color="#eee" />
            <Section title="4. Costos Fijos del Proyecto">
                <Typography variant="body" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                    Detalle de los costos fijos del proyecto.
                </Typography>
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Descripción</Table.Cell>
                            <Table.Cell header>Cantidad</Table.Cell>
                            <Table.Cell header>Unidad</Table.Cell>
                            <Table.Cell header>Precio Unitario</Table.Cell>
                            <Table.Cell header>Costo Total</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporteProyecto.costos?.filter((c: any) => c.tipo !== 'variable').map((costo: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell>{costo.descripcion}</Table.Cell>
                                <Table.Cell>{costo.cantidad}</Table.Cell>
                                <Table.Cell>{costo.unidad}</Table.Cell>
                                <Table.Cell>{formatoDinero(costo.precio_unitario)}</Table.Cell>
                                <Table.Cell>{formatoDinero(costo.costo_total)}</Table.Cell>
                            </Table.Row>
                        ))}
                        {(!reporteProyecto.costos || reporteProyecto.costos.filter((c: any) => c.tipo !== 'variable').length === 0) && (
                            <Table.Row>
                                <Table.Cell colSpan={5} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                    No hay costos fijos registrados
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Section>

        </div>
    );
};

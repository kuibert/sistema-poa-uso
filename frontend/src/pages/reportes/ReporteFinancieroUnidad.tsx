import React, { useEffect } from 'react';
import { Section, Table, Flex, ReportHeader, ProgressBar, LoadingSpinner, Typography } from '../../components/common';
import apiClient from '../../services/apiClient';
import logoUso from '../../assets/images/logo_uso.png';

interface ReporteFinancieroUnidadProps {
    anio: number;
    onDataLoad?: (data: any) => void;
}

export const ReporteFinancieroUnidad: React.FC<ReporteFinancieroUnidadProps> = ({ anio, onDataLoad }) => {
    const [reporteUnidades, setReporteUnidades] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (anio) {
            loadReporte();
        }
    }, [anio]);

    const loadReporte = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get(`/proyectos/reporte-financiero-unidades?anio=${anio}`);
            setReporteUnidades(data);
            onDataLoad?.(data);
        } catch (error) {
            console.error("Error cargando reporte por unidades", error);
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

    if (reporteUnidades.length === 0) return (
        <Flex justify="center" direction="column" align="center" padding="4rem" gap="1rem">
            <Typography variant="body" color="var(--texto-sec)" style={{ fontStyle: 'italic' }}>
                No hay datos para el año {anio}
            </Typography>
        </Flex>
    );

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
                title="INFORME FINANCIERO CONSOLIDADO POR UNIDAD"
                year={anio}
                logo={logoUso}
                description="Resumen financiero de todos los proyectos agrupados por Unidad/Facultad"
            />

            {/* TABLA CONSOLIDADA */}
            <Section title="Consolidado Financiero por Unidad" description="">
                <Table variant="default">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Unidad/Facultad</Table.Cell>
                            <Table.Cell header># Proyectos</Table.Cell>
                            <Table.Cell header>Presupuesto Total</Table.Cell>
                            <Table.Cell header>Ejecutado</Table.Cell>
                            <Table.Cell header>Disponible</Table.Cell>
                            <Table.Cell header>% Ejecución</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporteUnidades.map((unidad: any, i: number) => (
                            <React.Fragment key={i}>
                                <Table.Row style={{ background: '#f8f9fa' }}>
                                    <Table.Cell><Typography component="span" weight={600}>{unidad.unidad_facultad}</Typography></Table.Cell>
                                    <Table.Cell><Typography component="span" weight={600}>{unidad.num_proyectos}</Typography></Table.Cell>
                                    <Table.Cell><Typography component="span" weight={600}>{formatoDinero(unidad.presupuesto_total)}</Typography></Table.Cell>
                                    <Table.Cell><Typography component="span" weight={600}>{formatoDinero(unidad.total_gastado)}</Typography></Table.Cell>
                                    <Table.Cell><Typography component="span" weight={600}>{formatoDinero(unidad.disponible)}</Typography></Table.Cell>
                                    <Table.Cell>
                                        <Flex align="center" gap="8px">
                                            <ProgressBar
                                                progress={unidad.porcentaje_ejecucion}
                                                height="8px"
                                                color={unidad.porcentaje_ejecucion >= 75 ? '#27ae60' : '#3498db'}
                                                trackColor="#eee"
                                            />
                                            <Typography variant="caption" style={{ minWidth: '45px', textAlign: 'right' }}>
                                                {formatoPorcentaje(unidad.porcentaje_ejecucion)}
                                            </Typography>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                                {unidad.proyectos.map((proyecto: any, j: number) => (
                                    <Table.Row key={`${i}-${j}`} style={{ background: 'white' }}>
                                        <Table.Cell style={{ paddingLeft: '2rem' }}>
                                            <Typography variant="body" style={{ fontSize: '0.9rem' }}>↳ {proyecto.nombre}</Typography>
                                        </Table.Cell>
                                        <Table.Cell><Typography variant="body" style={{ fontSize: '0.9rem' }}>-</Typography></Table.Cell>
                                        <Table.Cell><Typography variant="body" style={{ fontSize: '0.9rem' }}>{formatoDinero(proyecto.presupuesto)}</Typography></Table.Cell>
                                        <Table.Cell><Typography variant="body" style={{ fontSize: '0.9rem' }}>{formatoDinero(proyecto.gastado)}</Typography></Table.Cell>
                                        <Table.Cell><Typography variant="body" style={{ fontSize: '0.9rem' }}>{formatoDinero(proyecto.disponible)}</Typography></Table.Cell>
                                        <Table.Cell><Typography variant="body" style={{ fontSize: '0.9rem' }}>{formatoPorcentaje(proyecto.porcentaje_ejecucion)}</Typography></Table.Cell>
                                    </Table.Row>
                                ))}
                            </React.Fragment>
                        ))}
                    </Table.Body>
                </Table>
            </Section>

        </div>
    );
};

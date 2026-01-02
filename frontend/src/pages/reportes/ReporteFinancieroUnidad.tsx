import React, { useEffect } from 'react';
import { Section, Table, Flex, ReportHeader, ProgressBar } from '../../components/common';
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

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando reporte...</div>;
    if (reporteUnidades.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', fontStyle: 'italic' }}>No hay datos para el año {anio}</div>;

    return (
        <div id="reporte-content" style={{ marginTop: '2rem', background: 'white', color: 'black', padding: '2rem', borderRadius: '8px' }}>

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
                                <Table.Row style={{ background: '#f8f9fa', fontWeight: 600 }}>
                                    <Table.Cell>{unidad.unidad_facultad}</Table.Cell>
                                    <Table.Cell>{unidad.num_proyectos}</Table.Cell>
                                    <Table.Cell>{formatoDinero(unidad.presupuesto_total)}</Table.Cell>
                                    <Table.Cell>{formatoDinero(unidad.total_gastado)}</Table.Cell>
                                    <Table.Cell>{formatoDinero(unidad.disponible)}</Table.Cell>
                                    <Table.Cell>
                                        <Flex align="center" gap="8px">
                                            <ProgressBar
                                                progress={unidad.porcentaje_ejecucion}
                                                height="8px"
                                                color={unidad.porcentaje_ejecucion >= 75 ? '#27ae60' : '#3498db'}
                                                trackColor="#eee"
                                            />
                                            <span style={{ fontSize: '0.85rem', minWidth: '45px', textAlign: 'right' }}>
                                                {formatoPorcentaje(unidad.porcentaje_ejecucion)}
                                            </span>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                                {unidad.proyectos.map((proyecto: any, j: number) => (
                                    <Table.Row key={`${i}-${j}`} style={{ background: 'white', fontSize: '0.9rem' }}>
                                        <Table.Cell style={{ paddingLeft: '2rem' }}>↳ {proyecto.nombre}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                        <Table.Cell>{formatoDinero(proyecto.presupuesto)}</Table.Cell>
                                        <Table.Cell>{formatoDinero(proyecto.gastado)}</Table.Cell>
                                        <Table.Cell>{formatoDinero(proyecto.disponible)}</Table.Cell>
                                        <Table.Cell>{formatoPorcentaje(proyecto.porcentaje_ejecucion)}</Table.Cell>
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

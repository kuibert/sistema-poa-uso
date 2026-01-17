import React from 'react';
import { Table, Badge, Grid, ReportHeader, Section, Divider, KPICard, Typography } from '../../components/common';

import logoUso from '../../assets/images/logo_uso.png';

interface ReporteMetricasAnualProps {
    reporte: any[];
    anio: number;
}

export const ReporteMetricasAnual: React.FC<ReporteMetricasAnualProps> = ({ reporte, anio }) => {

    // Cálculos Globales
    const totalProyectos = reporte.length;
    const promedioAvanceFisico = totalProyectos > 0
        ? Math.round(reporte.reduce((acc, p) => acc + Number(p.avanceFisico), 0) / totalProyectos)
        : 0;
    const promedioLogroKPI = totalProyectos > 0
        ? Math.round(reporte.reduce((acc, p) => acc + Number(p.logroKpi), 0) / totalProyectos)
        : 0;

    const totalPresupuesto = reporte.reduce((acc, p) => acc + p.presupuesto, 0);
    const totalGastado = reporte.reduce((acc, p) => acc + p.gastado, 0);
    const eficienciaPresupuestaria = totalPresupuesto > 0
        ? (totalGastado / totalPresupuesto) * 100
        : 0;

    const formatoDinero = (monto: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(monto || 0));
    };

    const getSemaforoColor = (valor: number) => {
        if (valor >= 80) return '#2e7d32'; // Green
        if (valor >= 50) return '#ed6c02'; // Orange
        return '#d32f2f'; // Red
    };

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
                title="INFORME ANUAL DE MÉTRICAS DE AVANCE"
                subtitle={`Año ${anio}`}
                logo={logoUso}
                metadata={[
                    { label: 'Fecha de Emisión', value: new Date().toLocaleDateString() },
                    { label: 'Total Proyectos', value: totalProyectos }
                ]}
            />

            {/* 1. RESUMEN EJECUTIVO */}
            <Section title="1. Resumen Ejecutivo Global" description="">
                <Grid columns={4} gap="1rem">
                    {/* Avance Operativo - Blue Scheme */}
                    <KPICard
                        title="Avance Operativo Global"
                        value={`${promedioAvanceFisico}%`}
                        variant="light"
                        colorScheme="blue"
                        progress={promedioAvanceFisico}
                    />

                    {/* KPI - Purple/Indigo Scheme */}
                    <KPICard
                        title="Logro Impacto (KPI)"
                        value={`${promedioLogroKPI}%`}
                        variant="light"
                        colorScheme="purple"
                        progress={promedioLogroKPI}
                    />

                    {/* Eficiencia - Green Scheme */}
                    <KPICard
                        title="Eficiencia Presupuestaria"
                        value={`${Math.round(eficienciaPresupuestaria)}%`}
                        subValue={`Gastado: ${formatoDinero(totalGastado)}`}
                        variant="light"
                        colorScheme="green"
                        progress={Math.min(eficienciaPresupuestaria, 100)}
                    />

                    {/* Proyectos - Gray/Neutral Scheme */}
                    <KPICard
                        title="Proyectos Reportados"
                        value={totalProyectos}
                        variant="light"
                        colorScheme="gray"
                    />
                </Grid>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 2. DETALLE POR PROYECTO */}
            <Section title="2. Detalle de Desempeño por Proyecto" description="">
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Proyecto</Table.Cell>
                            <Table.Cell header>Unidad / Facultad</Table.Cell>
                            <Table.Cell header>Responsable</Table.Cell>
                            <Table.Cell header center>Avance Físico</Table.Cell>
                            <Table.Cell header center>Avance Financiero</Table.Cell>
                            <Table.Cell header center>Logro KPI</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporte.map((p) => (
                            <Table.Row key={p.id}>
                                <Table.Cell><Typography component="span" weight={600}>{p.proyecto}</Typography></Table.Cell>
                                <Table.Cell>{p.unidad}</Table.Cell>
                                <Table.Cell>{p.responsable || 'Sin asignar'}</Table.Cell>
                                <Table.Cell center>
                                    <Badge variant="pill" style={{ backgroundColor: getSemaforoColor(p.avanceFisico), color: 'white' }}>
                                        {p.avanceFisico}%
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell center>
                                    <Typography variant="body" color="inherit">
                                        {p.avanceFinanciero}%
                                    </Typography>
                                    <Typography variant="caption">
                                        ({formatoDinero(p.gastado)})
                                    </Typography>
                                </Table.Cell>
                                <Table.Cell center>
                                    <Badge variant="pill" style={{ backgroundColor: getSemaforoColor(p.logroKpi), color: 'white' }}>
                                        {p.logroKpi}%
                                    </Badge>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Section>
        </div>
    );
};

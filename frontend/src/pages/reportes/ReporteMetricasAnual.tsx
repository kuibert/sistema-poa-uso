import React from 'react';
import { Card, Table, Badge, Grid, ReportHeader, Section, Divider, Typography } from '../../components/common';

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
        <div id="reporte-content" style={{ marginTop: '2rem', background: 'white', color: 'black', padding: '2rem', borderRadius: '8px' }}>

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
                    <Card padding="1rem" style={{ background: '#f0f7ff', border: '1px solid #d4e6ff' }}>
                        <Typography variant="caption" style={{ color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                            Avance Operativo Global
                        </Typography>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a3a5c', marginBottom: '0.5rem' }}>
                            {promedioAvanceFisico}%
                        </div>
                        <div style={{ background: '#dbeafe', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${promedioAvanceFisico}%`, background: '#3b82f6', height: '100%' }}></div>
                        </div>
                    </Card>

                    {/* KPI - Purple/Indigo Scheme */}
                    <Card padding="1rem" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                        <Typography variant="caption" style={{ color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                            Logro Impacto (KPI)
                        </Typography>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#5b21b6', marginBottom: '0.5rem' }}>
                            {promedioLogroKPI}%
                        </div>
                        <div style={{ background: '#ede9fe', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${promedioLogroKPI}%`, background: '#8b5cf6', height: '100%' }}></div>
                        </div>
                    </Card>

                    {/* Eficiencia - Green Scheme */}
                    <Card padding="1rem" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                        <Typography variant="caption" style={{ color: '#555', marginBottom: '0.5rem', display: 'block' }}>
                            Eficiencia Presupuestaria
                        </Typography>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.2rem' }}>
                            {Math.round(eficienciaPresupuestaria)}%
                        </div>
                        <Typography variant="caption" style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>
                            Gastado: {formatoDinero(totalGastado)}
                        </Typography>
                        <div style={{ background: '#dcfce7', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(eficienciaPresupuestaria, 100)}%`, background: '#22c55e', height: '100%' }}></div>
                        </div>
                    </Card>

                    {/* Proyectos - Gray/Neutral Scheme */}
                    <Card padding="1rem" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" style={{ color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>
                            Proyectos Reportados
                        </Typography>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#334155' }}>
                            {totalProyectos}
                        </div>
                    </Card>
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
                                <Table.Cell><strong>{p.proyecto}</strong></Table.Cell>
                                <Table.Cell>{p.unidad}</Table.Cell>
                                <Table.Cell>{p.responsable || 'Sin asignar'}</Table.Cell>
                                <Table.Cell center>
                                    <Badge variant="pill" style={{ backgroundColor: getSemaforoColor(p.avanceFisico), color: 'white' }}>
                                        {p.avanceFisico}%
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell center>
                                    {p.avanceFinanciero}% <br />
                                    <small style={{ color: '#666' }}>({formatoDinero(p.gastado)})</small>
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

import React from 'react';
import { Section, Table, Divider, Grid, Card, Typography, Badge, GanttChart, ReportHeader, Flex } from '../../components/common';
import logoUso from '../../assets/images/logo_uso.png';

interface ReporteDetalladoProps {
    reporte: any;
    formatoDinero: (monto: any) => string;
}

export const ReporteDetallado: React.FC<ReporteDetalladoProps> = ({ reporte, formatoDinero }) => {
    if (!reporte) return null;

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
                title="PLAN OPERATIVO ANUAL (POA)"
                subtitle={reporte.proyecto.nombre}
                logo={logoUso}
                metadata={[
                    { label: 'Año', value: reporte.proyecto.anio },
                    { label: 'Responsable', value: reporte.proyecto.responsable }
                ]}
            />

            {/* 1. INFORMACIÓN GENERAL */}
            <Section title="1. Información General del Proyecto" description="">
                <Grid columns={2}>
                    <div>
                        <Typography variant="caption">Nombre del Proyecto</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{reporte.proyecto.nombre}</Typography>
                    </div>
                    <div>
                        <Typography variant="caption">Año</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{reporte.proyecto.anio}</Typography>
                    </div>
                    <div>
                        <Typography variant="caption">Responsable</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{reporte.proyecto.responsable}</Typography>
                    </div>
                    <div>
                        <Typography variant="caption">Unidad/Facultad</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{reporte.proyecto.unidad_facultad || 'No especificada'}</Typography>
                    </div>
                </Grid>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 2. RESUMEN FINANCIERO */}
            <Section title="2. Resumen Financiero" description="">
                <Grid columns={3}>
                    <Card padding="1rem" style={{ background: '#f0f7ff', border: '1px solid #d4e6ff' }}>
                        <Typography variant="caption">Presupuesto Aprobado</Typography>
                        <Typography variant="h3" style={{ color: '#1a3a5c', margin: '0.5rem 0 0' }}>
                            {formatoDinero(reporte.proyecto.presupuesto_total)}
                        </Typography>
                    </Card>
                    <Card padding="1rem" style={{ background: '#fff4e6', border: '1px solid #ffd699' }}>
                        <Typography variant="caption">Costos Asociados</Typography>
                        <Typography variant="h3" style={{ color: '#d97706', margin: '0.5rem 0 0' }}>
                            {formatoDinero(reporte.costos.reduce((sum: number, c: any) => sum + Number(c.monto || 0), 0))}
                        </Typography>
                    </Card>
                    <Card padding="1rem" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                        <Typography variant="caption">Balance</Typography>
                        <Typography variant="h3" style={{ color: '#16a34a', margin: '0.5rem 0 0' }}>
                            {formatoDinero(
                                Number(reporte.proyecto.presupuesto_total || 0) -
                                reporte.costos.reduce((sum: number, c: any) => sum + Number(c.monto || 0), 0)
                            )}
                        </Typography>
                    </Card>
                </Grid>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 3. ACTIVIDADES */}
            <Section title="3. Actividades del Proyecto" description="">
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Actividad</Table.Cell>
                            <Table.Cell header>Descripción</Table.Cell>
                            <Table.Cell header>Presupuesto</Table.Cell>
                            <Table.Cell header>Estado</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporte.actividades.map((act: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell>{act.nombre}</Table.Cell>
                                <Table.Cell style={{ fontSize: '0.85rem' }}>{act.descripcion || '-'}</Table.Cell>
                                <Table.Cell>{formatoDinero(act.presupuesto_asignado)}</Table.Cell>
                                <Table.Cell>
                                    <Badge variant="pill" style={{ background: act.completado ? '#27ae60' : '#f39c12', color: 'white' }}>
                                        {act.completado ? 'Completada' : 'En progreso'}
                                    </Badge>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        {reporte.actividades.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                    No hay actividades registradas
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 4. CRONOGRAMA */}
            <Section title="4. Cronograma de Actividades (Gantt)" description="">
                <GanttChart actividades={reporte.actividades} />
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 5. INDICADORES */}
            <Section title="5. Indicadores de Desempeño (KPIs)" description="">
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Actividad</Table.Cell>
                            <Table.Cell header>Indicador</Table.Cell>
                            <Table.Cell header>Meta</Table.Cell>
                            <Table.Cell header>Valor Actual</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporte.actividades.flatMap((a: any) => a.kpis?.map((k: any) => ({ ...k, actividadNombre: a.nombre })) || []).map((kpi: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell style={{ fontSize: '0.85rem' }}>{kpi.actividadNombre}</Table.Cell>
                                <Table.Cell>{kpi.nombre}</Table.Cell>
                                <Table.Cell>{kpi.meta}</Table.Cell>
                                <Table.Cell>{kpi.valor_actual || '-'}</Table.Cell>
                            </Table.Row>
                        ))}
                        {reporte.actividades.every((a: any) => !a.kpis || a.kpis.length === 0) && (
                            <Table.Row>
                                <Table.Cell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>No hay indicadores registrados</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 6. GASTOS */}
            <Section title="6. Gastos Registrados" description="">
                <Table variant="compact">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell header>Actividad</Table.Cell>
                            <Table.Cell header>Descripción</Table.Cell>
                            <Table.Cell header>Monto</Table.Cell>
                            <Table.Cell header>Fecha</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reporte.actividades.flatMap((a: any) => a.gastos?.map((g: any) => ({ ...g, actividadNombre: a.nombre })) || []).map((gasto: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell style={{ fontSize: '0.85rem' }}>{gasto.actividadNombre}</Table.Cell>
                                <Table.Cell>{gasto.descripcion}</Table.Cell>
                                <Table.Cell style={{ fontWeight: 600 }}>{formatoDinero(gasto.monto)}</Table.Cell>
                                <Table.Cell>{new Date(gasto.fecha).toLocaleDateString()}</Table.Cell>
                            </Table.Row>
                        ))}
                        {reporte.actividades.every((a: any) => !a.gastos || a.gastos.length === 0) && (
                            <Table.Row>
                                <Table.Cell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>No hay gastos registrados</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Section>
            <Divider variant="solid" color="#eee" />

            {/* 7. EVIDENCIAS */}
            <Section title="7. Evidencias" description="">
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
                        {reporte.actividades.flatMap((a: any) => a.evidencias?.map((e: any) => ({ ...e, actividadNombre: a.nombre })) || []).map((ev: any, i: number) => (
                            <Table.Row key={i}>
                                <Table.Cell style={{ fontSize: '0.85rem' }}>{ev.actividadNombre}</Table.Cell>
                                <Table.Cell>{ev.tipo}</Table.Cell>
                                <Table.Cell>{ev.descripcion}</Table.Cell>
                                <Table.Cell>{ev.archivo}</Table.Cell>
                            </Table.Row>
                        ))}
                        {reporte.actividades.every((a: any) => !a.evidencias || a.evidencias.length === 0) && (
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
                    {reporte.equipo.map((u: any, i: number) => (
                        <Card key={i} padding="0.8rem" style={{ border: '1px solid #eee', background: 'white' }}>
                            <Typography variant="body" color="#000000" weight={600}>{u.nombre_completo}</Typography>
                            <Typography variant="caption" style={{ color: '#444444' }}>{u.email}</Typography>
                            <Flex style={{ marginTop: '0.4rem' }}>
                                <Badge variant="pill" style={{ background: '#3498db', color: 'white' }}>{u.rol}</Badge>
                            </Flex>
                        </Card>
                    ))}
                </Grid>
            </Section>

        </div >
    );
};

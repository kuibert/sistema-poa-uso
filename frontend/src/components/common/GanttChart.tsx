import React from 'react';
import { Flex } from './Flex';
import { Typography } from './Typography';

interface GanttProps {
    actividades: any[];
}

export const GanttChart: React.FC<GanttProps> = ({ actividades }) => {

    const getStatusGantt = (mes: number, mesesPlan: number[], seguimiento: any[]) => {
        const planificado = mesesPlan?.includes(mes);
        const estadoMes = seguimiento?.find((s: any) => s.mes === mes)?.estado;

        if (estadoMes === 'F') return { bg: '#27ae60', title: 'Finalizado' }; // Verde
        if (estadoMes === 'I') return { bg: '#f1c40f', title: 'Iniciado' }; // Amarillo
        if (estadoMes === 'P') return { bg: '#e74c3c', title: 'Pendiente' }; // Rojo
        if (planificado) return { bg: '#3498db', title: 'Planificado' }; // Azul (Planificado pero sin seguimiento aun)
        return { bg: 'transparent', title: '' };
    };

    return (
        <div style={{ overflowX: 'auto', pageBreakInside: 'avoid' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', width: '30%' }}>Actividad</th>
                        {[...Array(12)].map((_, m) => (
                            <th key={m} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', minWidth: '30px' }}>{m + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {actividades.map((act, i) => (
                        <tr key={i}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{act.nombre}</td>
                            {[...Array(12)].map((_, m) => {
                                const mesIdx = m + 1;
                                const style = getStatusGantt(mesIdx, act.meses_plan, act.seguimiento);
                                return (
                                    <td key={m} style={{ border: '1px solid #ddd', padding: '0', textAlign: 'center' }}>
                                        <div style={{
                                            width: '100%',
                                            height: '24px',
                                            background: style.bg,
                                            opacity: 0.8
                                        }} title={style.title}></div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Flex gap="1rem" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                <Flex align="center" gap="4px"><div style={{ width: '12px', height: '12px', background: '#3498db' }}></div> <Typography variant="caption">Planificado</Typography></Flex>
                <Flex align="center" gap="4px"><div style={{ width: '12px', height: '12px', background: '#f1c40f' }}></div> <Typography variant="caption">Iniciado</Typography></Flex>
                <Flex align="center" gap="4px"><div style={{ width: '12px', height: '12px', background: '#27ae60' }}></div> <Typography variant="caption">Finalizado</Typography></Flex>
                <Flex align="center" gap="4px"><div style={{ width: '12px', height: '12px', background: '#e74c3c' }}></div> <Typography variant="caption">Pendiente</Typography></Flex>
            </Flex>
        </div>
    );
};

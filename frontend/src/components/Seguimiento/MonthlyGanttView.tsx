import React from 'react';
import { Status, StatusPill } from '../poa';

type MonthlyGanttViewProps = {
    seguimientoMensual: { mes: number; estado: Status }[] | null;
    onStatusClick: (mesIndex: number) => void;
    disabled?: boolean;
};

export const MonthlyGanttView: React.FC<MonthlyGanttViewProps> = ({
    seguimientoMensual,
    onStatusClick,
    disabled = false
}) => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const getEstadoMes = (mesIndex: number): Status | undefined => {
        if (!seguimientoMensual) return undefined;
        const seguimiento = seguimientoMensual.find(s => s.mes === mesIndex + 1);
        return seguimiento?.estado as Status | undefined;
    };

    const containerStyle: React.CSSProperties = {
        marginTop: '0.5rem',
    };

    const ganttGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '0.4rem',
    };

    const monthCellStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.3rem',
    };

    const monthLabelStyle: React.CSSProperties = {
        fontSize: '0.7rem',
        color: 'var(--texto-sec)',
        fontWeight: '500',
    };

    const statusButtonStyle = (estado: Status | undefined): React.CSSProperties => ({
        width: '100%',
        minHeight: '42px',
        padding: '0.4rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: estado ? 'var(--card-dark-bg)' : 'transparent',
        border: '1px solid var(--borde)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--texto-claro)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
    });

    return (
        <div style={containerStyle}>
            <div style={ganttGridStyle}>
                {meses.map((mes, mesIdx) => {
                    const estado = getEstadoMes(mesIdx);
                    return (
                        <div key={mes} style={monthCellStyle}>
                            <span style={monthLabelStyle}>{mes}</span>
                            <button
                                style={statusButtonStyle(estado)}
                                onClick={() => !disabled && onStatusClick(mesIdx)}
                                disabled={disabled}
                                title={disabled ? 'Guardando...' : 'Click para cambiar estado'}
                            >
                                {estado ? <StatusPill status={estado} /> : '-'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

import React from 'react';
import { Status } from '../poa';

type MonthlyGanttViewProps = {
    seguimientoMensual: { mes: number; estado: Status }[] | null;
    onStatusClick: (mesIndex: number) => void; // Deprecated but keeping signature compatible if needed, though likely unused in new design
    onStatusChange?: (mesIndex: number, newStatus: Status | undefined) => void; // New handler
    disabled?: boolean;
};

export const MonthlyGanttView: React.FC<MonthlyGanttViewProps> = ({
    seguimientoMensual,
    onStatusChange,
    disabled = false
}) => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const getEstadoMes = (mesIndex: number): Status | '' => {
        if (!seguimientoMensual) return '';
        const seguimiento = seguimientoMensual.find(s => s.mes === mesIndex + 1);
        return seguimiento?.estado || '';
    };

    // Styles matching page2.html
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0.35rem',
        width: '100%',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
    };

    const mesColumnStyle: React.CSSProperties = {
        flex: '1 1 0',
        minWidth: '40px',
        textAlign: 'center',
    };

    const mesLabelStyle: React.CSSProperties = {
        fontSize: '0.65rem',
        color: 'var(--texto-sec)',
        marginBottom: '0.1rem',
        display: 'block'
    };

    // Helper to get background color based on status
    const getSelectStyle = (estado: Status | ''): React.CSSProperties => {
        let baseStyle: React.CSSProperties = {
            width: '100%',
            borderRadius: '999px',
            padding: '0.16rem 0.2rem',
            fontSize: '0.68rem',
            color: '#000', // Text color inside pill is black in HTML
            border: '1px solid transparent',
            appearance: 'none', // Remove default arrow if desired, or keep it. HTML select has arrow.
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.7 : 1,
        };

        switch (estado) {
            case 'P':
                return { ...baseStyle, background: 'rgba(169, 50, 38, 0.22)', borderColor: 'var(--P)' };
            case 'I':
                return { ...baseStyle, background: 'rgba(165, 103, 63, 0.25)', borderColor: 'var(--I)' };
            case 'F':
                return { ...baseStyle, background: 'rgba(46, 204, 113, 0.28)', borderColor: 'var(--F)' };
            default: // Empty / '-'
                return { ...baseStyle, background: 'rgba(255, 255, 255, 0.18)', borderColor: '#5e6377' };
        }
    };

    return (
        <div style={containerStyle}>
            {meses.map((mes, mesIdx) => {
                const estado = getEstadoMes(mesIdx);
                const style = getSelectStyle(estado);

                return (
                    <div key={mes} style={mesColumnStyle}>
                        <span style={mesLabelStyle}>{mes}</span>
                        <select
                            value={estado}
                            onChange={(e) => {
                                if (disabled || !onStatusChange) return;
                                const val = e.target.value as Status | '';
                                onStatusChange(mesIdx, val === '' ? undefined : val);
                            }}
                            disabled={disabled}
                            style={style}
                            className="estado-mes-select" // Helper class if global CSS needed
                        >
                            <option value="">-</option>
                            <option value="P">P</option>
                            <option value="I">I</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                );
            })}
        </div>
    );
};

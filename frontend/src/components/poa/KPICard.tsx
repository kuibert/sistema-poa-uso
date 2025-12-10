import React from 'react';

interface KPICardProps {
    label: string;
    value: string | number;
    subtitle?: string;
    progress?: number;
    showBar?: boolean;
    className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
    label,
    value,
    subtitle,
    progress = 0,
    showBar = false,
    className = ''
}) => {
    const cardStyle: React.CSSProperties = {
        background: 'var(--panel-kpi)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--borde)',
        padding: '0.75rem 0.9rem',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.78rem',
        color: 'var(--texto-sec)',
        marginBottom: '0.25rem',
    };

    const valueStyle: React.CSSProperties = {
        fontSize: '1.15rem',
        fontWeight: 600,
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        color: 'var(--texto-sec)',
        marginTop: '0.15rem',
    };

    const barBgStyle: React.CSSProperties = {
        marginTop: '0.4rem',
        width: '100%',
        height: '6px',
        borderRadius: '999px',
        background: 'rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
    };

    const barFillStyle: React.CSSProperties = {
        height: '100%',
        width: `${Math.min(progress, 100)}%`,
        borderRadius: '999px',
        background: 'var(--verde-hoja)',
        transition: 'width 0.3s ease',
    };

    return (
        <div style={cardStyle} className={className}>
            <div style={labelStyle}>{label}</div>
            <div style={valueStyle}>{value}</div>
            {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
            {showBar && (
                <div style={barBgStyle}>
                    <div style={barFillStyle}></div>
                </div>
            )}
        </div>
    );
};

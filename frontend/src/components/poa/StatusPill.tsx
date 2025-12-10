import React from 'react';

export type Status = 'P' | 'I' | 'F';

interface StatusPillProps {
    status: Status;
    className?: string;
}

const statusConfig: Record<Status, { text: string; color: string; bg: string; border: string }> = {
    P: {
        text: 'Pendiente',
        color: '#f7d5d0',
        bg: 'rgba(169, 50, 38, 0.2)',
        border: 'var(--estado-P)',
    },
    I: {
        text: 'En proceso',
        color: '#f7ddcc',
        bg: 'rgba(165, 103, 63, 0.2)',
        border: 'var(--estado-I)',
    },
    F: {
        text: 'Finalizada',
        color: '#daf8e6',
        bg: 'rgba(46, 204, 113, 0.2)',
        border: 'var(--estado-F)',
    },
};

export const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
    const config = statusConfig[status];

    const pillStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.1rem 0.5rem',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 600,
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
    };

    return (
        <span style={pillStyle} className={className}>
            {config.text}
        </span>
    );
};

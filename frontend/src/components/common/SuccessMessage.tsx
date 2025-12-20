import React from 'react';

interface SuccessMessageProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
    message,
    onDismiss,
    className = ''
}) => {
    const successStyle: React.CSSProperties = {
        padding: '12px 16px',
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // green-500 with opacity
        border: '1px solid var(--verde-hoja)', // using existing var similar to green
        borderRadius: 'var(--radius-md)',
        color: 'var(--verde-hoja)',
        fontSize: '0.875rem',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 600
    };

    const buttonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: 'var(--verde-hoja)',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '0 0.5rem',
    };

    return (
        <div style={successStyle} className={className}>
            <span>{message}</span>
            {onDismiss && (
                <button onClick={onDismiss} style={buttonStyle} aria-label="Cerrar">
                    ×
                </button>
            )}
        </div>
    );
};

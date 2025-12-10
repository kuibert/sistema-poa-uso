import React from 'react';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onDismiss,
    className = ''
}) => {
    const errorStyle: React.CSSProperties = {
        padding: '12px 16px',
        backgroundColor: 'var(--error-bg)',
        border: '1px solid var(--error-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--error-text)',
        fontSize: '0.875rem',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const buttonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: 'var(--error-text)',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '0 0.5rem',
    };

    return (
        <div style={errorStyle} className={className}>
            <span>{message}</span>
            {onDismiss && (
                <button onClick={onDismiss} style={buttonStyle} aria-label="Cerrar">
                    ×
                </button>
            )}
        </div>
    );
};

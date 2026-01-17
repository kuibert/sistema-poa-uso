import React from 'react';

interface FormGroupProps {
    label?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
    label,
    error,
    required = false,
    children,
    className = ''
}) => {
    const groupStyle: React.CSSProperties = {
        marginBottom: '24px',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--texto-sec)',
    };

    const errorStyle: React.CSSProperties = {
        padding: '12px 16px',
        backgroundColor: 'var(--error-bg)',
        border: '1px solid var(--error-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--error-text)',
        fontSize: '0.875rem',
        marginTop: '8px',
    };

    return (
        <div style={groupStyle} className={className}>
            {label && (
                <label style={labelStyle}>
                    {label}
                    {required && <span style={{ color: '#dc2626' }}> *</span>}
                </label>
            )}
            {children}
            {error && <div style={errorStyle}>{error}</div>}
        </div>
    );
};

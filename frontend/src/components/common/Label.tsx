import React from 'react';

interface LabelProps {
    children: React.ReactNode;
    required?: boolean;
    htmlFor?: string;
    className?: string;
}

export const Label: React.FC<LabelProps> = ({
    children,
    required = false,
    htmlFor,
    className = ''
}) => {
    const labelStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        color: 'var(--texto-secundario)',
    };

    return (
        <label htmlFor={htmlFor} style={labelStyle} className={className}>
            {children}
            {required && <span style={{ color: '#dc2626' }}> *</span>}
        </label>
    );
};

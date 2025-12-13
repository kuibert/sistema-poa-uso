import React from 'react';

interface SectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
    title,
    description,
    children,
    className = '',
    headerAction
}) => {
    const sectionStyle: React.CSSProperties = {
        marginBottom: '1.7rem',
    };

    const headerAreaStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '1rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    };

    const titleBeforeStyle: React.CSSProperties = {
        width: '4px',
        height: '18px',
        background: 'var(--verde-hoja)',
        borderRadius: '50px',
    };

    const descStyle: React.CSSProperties = {
        fontSize: '0.8rem',
        color: 'var(--texto-secundario)',
        margin: '0.25rem 0 0.6rem',
    };

    const dividerStyle: React.CSSProperties = {
        height: '1px',
        background: 'var(--verde-hoja)',
        opacity: 0.4,
        margin: '0.5rem 0 0.9rem',
    };

    return (
        <div style={sectionStyle} className={className}>
            <div style={headerAreaStyle}>
                <h2 style={titleStyle}>
                    <span style={titleBeforeStyle}></span>
                    {title}
                </h2>
                {headerAction && <div>{headerAction}</div>}
            </div>
            {description && <p style={descStyle}>{description}</p>}
            <div style={dividerStyle}></div>
            {children}
        </div>
    );
};

import React from 'react';

export type BadgeVariant = 'circle' | 'pill';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'circle',
    className = ''
}) => {
    const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
        circle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.6rem',
            height: '1.6rem',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.55)',
            fontSize: '0.75rem',
            color: 'var(--texto-claro)',
        },
        pill: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: '1px solid rgba(255, 255, 255, 0.3)',
        },
    };

    return (
        <span style={variantStyles[variant]} className={className}>
            {children}
        </span>
    );
};

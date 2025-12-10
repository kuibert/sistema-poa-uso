import React from 'react';

export type CardVariant = 'default' | 'dark' | 'accent';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  padding,
  style
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-xl)',
    padding: padding || '1.6rem 1.7rem 1.4rem',
    border: '1px solid var(--borde)',
    boxShadow: 'var(--shadow-lg)',
  };

  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    default: {
      background: 'var(--tarjeta-azul)',
    },
    dark: {
      background: 'var(--panel-proyectos)',
    },
    accent: {
      background: 'var(--panel-actividades)',
      border: '1px solid rgba(63, 166, 91, 0.65)',
    },
  };

  return (
    <div
      className={className}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {children}
    </div>
  );
};

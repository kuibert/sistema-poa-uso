import React from 'react';

export type DividerVariant = 'gradient' | 'solid' | 'thick';

interface DividerProps {
  variant?: DividerVariant;
  color?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'gradient',
  color = 'var(--verde-hoja)',
  className = ''
}) => {
  const variantStyles: Record<DividerVariant, React.CSSProperties> = {
    gradient: {
      height: '2px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      margin: '1.2rem 0',
    },
    solid: {
      height: '1px',
      background: color,
      opacity: 0.4,
      margin: '0.5rem 0 0.9rem',
    },
    thick: {
      height: '3px',
      background: color,
      opacity: 0.85,
      margin: '0.8rem 0 0.9rem',
      borderRadius: '999px',
    },
  };

  return <div style={variantStyles[variant]} className={className}></div>;
};

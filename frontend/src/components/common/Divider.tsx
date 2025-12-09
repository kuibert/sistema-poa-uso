import React from 'react';

const colors = {
  green: 'var(--verde-hoja, #3fa65b)',
  border: 'var(--borde, rgba(255,255,255,0.08))',
};

export const Divider: React.FC<{ variant?: 'green' | 'subtle'; className?: string }>
  = ({ variant = 'green', className }) => {
    const style: React.CSSProperties = {
      height: variant === 'green' ? 2 : 1,
      background: variant === 'green'
        ? `linear-gradient(90deg, transparent, ${colors.green}, transparent)`
        : colors.border,
      margin: '1.2rem 0'
    };
    return <div className={className} style={style} />;
};

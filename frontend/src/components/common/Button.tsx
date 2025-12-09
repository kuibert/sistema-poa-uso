import React from 'react';

const colors = {
  green: 'var(--verde-hoja, #3fa65b)',
  border: 'var(--borde, rgba(255,255,255,0.08))',
  text: 'var(--texto-claro, #e9edf3)',
};

export type ButtonVariant = 'main' | 'alt' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...rest
}) => {
  const base: React.CSSProperties = {
    border: 'none',
    padding: size === 'sm' ? '.25rem .6rem' : '.45rem 1.1rem',
    borderRadius: 999,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontSize: '.8rem',
    opacity: disabled || loading ? 0.7 : 1,
  };

  const styleByVariant: Record<ButtonVariant, React.CSSProperties> = {
    main: { background: colors.green, color: '#081a10', fontWeight: 600 },
    alt: { background: 'transparent', border: `1px solid ${colors.green}`, color: colors.green },
    danger: { background: '#b91c1c', color: '#fff' },
    ghost: { background: 'transparent', color: colors.text },
  };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`btn ${variant === 'main' ? 'btn-main' : variant === 'alt' ? 'btn-alt' : ''} ${size === 'sm' ? 'btn-mini' : ''} ${className ?? ''}`}
      style={{ ...base, ...styleByVariant[variant] }}
    >
      {loading ? '...' : children}
    </button>
  );
};

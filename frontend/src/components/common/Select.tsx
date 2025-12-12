import React from 'react';

type SelectProps = {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  children,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--borde, #d1d5db)',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    backgroundColor: 'var(--input-bg, white)',
    color: 'var(--texto-claro, #1f2937)',
    cursor: 'pointer',
    ...style,
  };

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      style={baseStyle}
    >
      {children}
    </select>
  );
};

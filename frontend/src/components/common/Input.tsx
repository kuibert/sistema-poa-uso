import React from 'react';

type InputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'file';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  style?: React.CSSProperties;
  list?: string;
};

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  min,
  max,
  step,
  style,
  list,
}) => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--borde, #d1d5db)',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    backgroundColor: readOnly ? 'var(--input-readonly-bg, #f3f4f6)' : 'var(--input-bg, white)',
    color: 'var(--texto-claro, #1f2937)',
    ...style,
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      min={min}
      max={max}
      step={step}
      style={baseStyle}
      list={list}
    />
  );
};

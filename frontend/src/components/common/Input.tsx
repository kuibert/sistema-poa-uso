import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  style?: React.CSSProperties;
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
  ...rest
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
      {...rest}
    />
  );
};

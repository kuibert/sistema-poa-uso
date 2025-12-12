import React from 'react';

type TextAreaProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  style?: React.CSSProperties;
};

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 4,
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
    resize: 'vertical' as const,
    minHeight: '80px',
    backgroundColor: readOnly ? 'var(--input-readonly-bg, #f3f4f6)' : 'var(--input-bg, white)',
    color: 'var(--texto-claro, #1f2937)',
    fontFamily: 'inherit',
    ...style,
  };

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      style={baseStyle}
    />
  );
};

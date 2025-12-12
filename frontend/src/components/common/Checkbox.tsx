import React from 'react';

type CheckboxProps = {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const inputStyle: React.CSSProperties = {
    marginRight: label ? '0.5rem' : 0,
    width: '1.2rem',
    height: '1.2rem',
    cursor: 'pointer',
  };

  return (
    <div style={style && !label ? style : containerStyle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={inputStyle}
      />
      {label && <span>{label}</span>}
    </div>
  );
};

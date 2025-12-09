import React from 'react';

const colors = {
  border: 'var(--borde, rgba(255,255,255,0.08))',
  text: 'var(--texto-claro, #e9edf3)',
  textSec: 'var(--texto-sec, #bfc7d1)',
  inputBg: '#0d213f',
};

interface SelectOption { value: string; label: string; }
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, onChange, value, className, ...rest }) => {
  const selStyle: React.CSSProperties = {
    width: '100%',
    marginTop: '.2rem',
    background: colors.inputBg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    padding: '.45rem .6rem',
    borderRadius: 6,
    fontSize: '.82rem',
  };

  return (
    <div className={className}>
      {label && <label style={{ fontSize: '.75rem', color: colors.textSec }}>{label}</label>}
      <select {...rest} value={value as any} onChange={(e) => onChange?.(e.target.value)} style={selStyle}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <div style={{ color: '#fecaca', fontSize: '.75rem', marginTop: 4 }}>{error}</div>}
    </div>
  );
};

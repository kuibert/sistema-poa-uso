import React from 'react';

const colors = {
  border: 'var(--borde, rgba(255,255,255,0.08))',
  text: 'var(--texto-claro, #e9edf3)',
  textSec: 'var(--texto-sec, #bfc7d1)',
  inputBg: '#0d213f',
};

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, onChange, value, className, ...rest }) => {
  const style: React.CSSProperties = {
    width: '100%',
    marginTop: '.2rem',
    background: colors.inputBg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    padding: '.45rem .6rem',
    borderRadius: 6,
    fontSize: '.82rem',
    minHeight: 80,
    resize: 'vertical',
  };
  return (
    <div className={className}>
      {label && <label style={{ fontSize: '.75rem', color: colors.textSec }}>{label}</label>}
      <textarea {...rest} value={value as any} onChange={(e) => onChange?.(e.target.value)} style={style} />
      {error && <div style={{ color: '#fecaca', fontSize: '.75rem', marginTop: 4 }}>{error}</div>}
    </div>
  );
};

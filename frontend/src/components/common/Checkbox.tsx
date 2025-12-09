import React from 'react';

const colors = {
  text: 'var(--texto-claro, #e9edf3)',
};

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label?: string;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, onChange, checked, size = 'md', className, ...rest }) => {
  const boxSize = size === 'sm' ? 14 : 16;
  return (
    <label className={className} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: colors.text }}>
      <input
        {...rest}
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ width: boxSize, height: boxSize }}
      />
      {label && <span style={{ fontSize: '.85rem' }}>{label}</span>}
    </label>
  );
};

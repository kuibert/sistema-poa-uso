import React from 'react';

const colors = {
  green: 'var(--verde-hoja, #3fa65b)',
  textSec: 'var(--texto-sec, #bfc7d1)'
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightActions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, rightActions, className }) => {
  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.8rem' }}>
      <div>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ color: colors.textSec, fontSize: '.9rem', marginTop: '.2rem' }}>{subtitle}</p>}
      </div>
      <div>{rightActions}</div>
    </div>
  );
};

interface SectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  withDivider?: boolean;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, description, withDivider = true, children, className }) => {
  return (
    <div className={className} style={{ marginBottom: '1.7rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 600 }}>
        <span style={{ display: 'inline-block', width: 4, height: 18, borderRadius: 50, background: colors.green }} />
        <h2 style={{ fontSize: '1rem', margin: 0 }}>{title}</h2>
      </div>
      {description && <p style={{ fontSize: '.8rem', color: colors.textSec, margin: '.25rem 0 .6rem' }}>{description}</p>}
      {withDivider && <div style={{ height: 1, background: colors.green, opacity: .4, margin: '0.5rem 0 0.9rem' }} />}
      {children}
    </div>
  );
};

import React from 'react';
import { Card, Typography } from './index';

interface KPICardProps {
    title: string;
    value: string | number;
    gradient?: string;
    icon?: string;
    variant?: 'gradient' | 'light';
    colorScheme?: 'blue' | 'purple' | 'green' | 'gray';
    progress?: number;
    subValue?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon,
    variant = 'gradient',
    colorScheme = 'blue',
    progress,
    subValue
}) => {
    // Definir estilos para variante light
    const lightStyles = {
        blue: { bg: '#f0f7ff', border: '#d4e6ff', text: '#1a3a5c', bar: '#3b82f6', barBg: '#dbeafe', icon: '#3b82f6' },
        purple: { bg: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6', bar: '#8b5cf6', barBg: '#ede9fe', icon: '#8b5cf6' },
        green: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', bar: '#22c55e', barBg: '#dcfce7', icon: '#22c55e' },
        gray: { bg: '#f8fafc', border: '#e2e8f0', text: '#334155', bar: '#64748b', barBg: '#e2e8f0', icon: '#64748b' }
    };

    const isLight = variant === 'light';
    const styles = isLight ? lightStyles[colorScheme] : null;

    if (isLight && styles) {
        return (
            <Card padding="1rem" style={{ background: styles.bg, border: `1px solid ${styles.border}` }}>
                <Typography variant="caption" style={{ color: '#555', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {icon && <span style={{ color: styles.icon }}>{icon}</span>}
                    {title}
                </Typography>

                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: styles.text, marginBottom: subValue ? '0.2rem' : '0.5rem' }}>
                    {value}
                </div>

                {subValue && (
                    <Typography variant="caption" style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>
                        {subValue}
                    </Typography>
                )}

                {progress !== undefined && (
                    <div style={{ background: styles.barBg, borderRadius: '999px', height: '6px', overflow: 'hidden', marginTop: 'auto' }}>
                        <div style={{ width: `${Math.min(Math.max(progress, 0), 100)}%`, background: styles.bar, height: '100%' }}></div>
                    </div>
                )}
            </Card>
        );
    }

    // Default Gradient Style
    return (
        <Card padding="1rem" style={{ background: gradient, color: 'white' }}>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon && <span>{icon}</span>}
                {title}
            </Typography>
            <Typography variant="h2" style={{ margin: 0 }}>
                {value}
            </Typography>
            {subValue && (
                <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    {subValue}
                </Typography>
            )}
        </Card>
    );
};

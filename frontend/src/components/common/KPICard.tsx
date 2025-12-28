import React from 'react';
import { Card, Typography } from './index';

interface KPICardProps {
    title: string;
    value: string | number;
    gradient?: string;
    icon?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon
}) => {
    return (
        <Card padding="1rem" style={{ background: gradient, color: 'white' }}>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon && <span>{icon}</span>}
                {title}
            </Typography>
            <Typography variant="h2" style={{ margin: 0 }}>
                {value}
            </Typography>
        </Card>
    );
};

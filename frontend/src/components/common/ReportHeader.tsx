import React from 'react';
import { Typography, Flex } from './index';

interface ReportHeaderProps {
    title: string;
    subtitle?: string;
    year?: number;
    metadata?: Array<{ label: string; value: string | number }>;
    description?: string;
    logo?: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
    title,
    subtitle,
    year,
    metadata = [],
    description,
    logo
}) => {
    return (
        <div className="report-header" style={{ marginBottom: '2rem', borderBottom: '3px solid #1a3a5c', paddingBottom: '1rem' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: '1rem' }}>
                <Flex align="center" gap="1.5rem">
                    {logo && (
                        <img
                            src={logo}
                            alt="Logo Institucional"
                            style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                        />
                    )}
                    <div>
                        <Typography variant="h2" style={{ margin: 0, color: '#1a3a5c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Universidad de Sonsonate
                        </Typography>
                        <Typography variant="h3" style={{ margin: '0.2rem 0 0', color: '#555', fontWeight: 500 }}>
                            Dirección de Planificación y Desarrollo Institucional
                        </Typography>
                        <Typography variant="caption" style={{ margin: '0.2rem 0 0', color: '#777' }}>
                            Sistema de Gestión POA
                        </Typography>
                    </div>
                </Flex>
                <div style={{ textAlign: 'right' }}>
                    <Typography variant="caption" style={{ color: '#666', marginBottom: '0.2rem' }}>
                        Fecha de generación:
                    </Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>
                        {new Date().toLocaleDateString()}
                    </Typography>
                </div>
            </Flex>

            <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <Typography variant="h1" style={{ fontSize: '1.3rem', margin: 0, color: '#2c3e50', fontWeight: 700 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="h2" style={{ fontSize: '1.5rem', color: '#1a3a5c', margin: '0.8rem 0', fontWeight: 600 }}>
                        {subtitle}
                    </Typography>
                )}
                {year && !subtitle && (
                    <Typography variant="h2" style={{ fontSize: '1.5rem', color: '#1a3a5c', margin: '0.8rem 0', fontWeight: 600 }}>
                        Año {year}
                    </Typography>
                )}
                {metadata.length > 0 && (
                    <Flex justify="center" gap="2rem" style={{ fontSize: '0.9rem', color: '#555' }}>
                        {metadata.map((item, i) => (
                            <span key={i}>
                                <strong>{item.label}:</strong> {item.value}
                            </span>
                        ))}
                    </Flex>
                )}
                {description && (
                    <Typography variant="caption" style={{ color: '#666' }}>
                        {description}
                    </Typography>
                )}
            </div>
        </div>
    );
};

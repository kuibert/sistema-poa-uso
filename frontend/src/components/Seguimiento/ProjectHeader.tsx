import React from 'react';
import { Grid } from '../common';

type ProjectHeaderProps = {
    proyectoNombre: string;
    proyectoAnio: number;
};

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ proyectoNombre, proyectoAnio }) => {
    const containerStyle: React.CSSProperties = {
        marginBottom: '1.5rem',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        color: 'var(--texto-sec)',
        marginBottom: '0.4rem',
        display: 'block',
    };

    const boxStyle: React.CSSProperties = {
        background: 'var(--card-dark-bg)',
        padding: '0.7rem 1rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--borde)',
    };

    const valueStyle: React.CSSProperties = {
        fontSize: '0.9rem',
        color: 'var(--texto-claro)',
        margin: 0,
    };

    return (
        <div style={containerStyle}>
            <Grid columns={2}>
                <div>
                    <span style={labelStyle}>Proyecto</span>
                    <div style={boxStyle}>
                        <p style={valueStyle}>{proyectoNombre}</p>
                    </div>
                </div>
                <div>
                    <span style={labelStyle}>Año</span>
                    <div style={boxStyle}>
                        <p style={valueStyle}>{proyectoAnio}</p>
                    </div>
                </div>
            </Grid>
        </div>
    );
};

import React from 'react';
import { Label } from '../common';

type Indicador = {
    id_indicador: number;
    nombre: string;
    unidad_medida: string;
    meta: number;
    valor_logrado: number;
    porcentaje_cumplimiento: number;
};

type IndicadoresTableProps = {
    indicadores: Indicador[] | null;
    categoria?: string;
    beneficiarios?: string;
};

export const IndicadoresTable: React.FC<IndicadoresTableProps> = ({
    indicadores,
    categoria,
    beneficiarios
}) => {
    if (!indicadores || indicadores.length === 0) {
        return (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--texto-sec)' }}>
                No hay indicadores registrados
            </div>
        );
    }

    const containerStyle: React.CSSProperties = {
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--borde)',
    };

    const tableContainerStyle: React.CSSProperties = {
        marginTop: '0.6rem',
        overflowX: 'auto',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
    };

    const thStyle: React.CSSProperties = {
        textAlign: 'left',
        padding: '0.6rem',
        color: 'var(--texto-sec)',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderBottom: '1px solid var(--borde)',
        whiteSpace: 'nowrap',
    };

    const tdStyle: React.CSSProperties = {
        padding: '0.6rem',
        borderBottom: '1px solid var(--borde-sutil)',
        color: 'var(--texto-claro)',
    };

    const infoRowStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '0.8rem',
    };

    const infoItemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
    };

    const infoLabelStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        color: 'var(--texto-sec)',
    };

    const infoValueStyle: React.CSSProperties = {
        fontSize: '0.85rem',
        color: 'var(--texto-claro)',
    };

    return (
        <div style={containerStyle}>
            <Label>Indicador de logro de la actividad</Label>

            {categoria && beneficiarios && (
                <div style={infoRowStyle}>
                    <div style={infoItemStyle}>
                        <span style={infoLabelStyle}>Categoría</span>
                        <span style={infoValueStyle}>{categoria}</span>
                    </div>
                    <div style={infoItemStyle}>
                        <span style={infoLabelStyle}>Beneficiarios</span>
                        <span style={infoValueStyle}>{beneficiarios}</span>
                    </div>
                </div>
            )}

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Metas</th>
                            <th style={thStyle}>Unidad</th>
                            <th style={thStyle}>Descripción específica del indicador</th>
                            <th style={thStyle}>Valor alcanzado a la fecha</th>
                            <th style={thStyle}>Cumplimiento del indicador</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indicadores.map((ind) => (
                            <tr key={ind.id_indicador}>
                                <td style={tdStyle}>{ind.meta}</td>
                                <td style={tdStyle}>{ind.unidad_medida}</td>
                                <td style={tdStyle}>{ind.nombre}</td>
                                <td style={tdStyle}>{ind.valor_logrado}</td>
                                <td style={{ ...tdStyle, color: 'var(--acento-verde)', fontWeight: '600' }}>
                                    {ind.porcentaje_cumplimiento}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

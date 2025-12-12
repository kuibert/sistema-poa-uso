import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common';

type ActivityActionButtonsProps = {
    actividadId: number;
};

export const ActivityActionButtons: React.FC<ActivityActionButtonsProps> = ({ actividadId }) => {
    const navigate = useNavigate();

    const buttonGroupStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0.8rem',
        marginTop: '1rem',
    };

    return (
        <div style={buttonGroupStyle}>
            <Button
                variant="alt"
                type="button"
                onClick={() => navigate(`/actividad/${actividadId}/evidencias`)}
            >
                📄 Evidencias
            </Button>
            <Button
                variant="alt"
                type="button"
                onClick={() => navigate(`/actividad/${actividadId}/gastos`)}
            >
                💰 Gastos
            </Button>
        </div>
    );
};

import React from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'main' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmVariant = 'danger',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
    };

    const dialogStyle: React.CSSProperties = {
        background: 'var(--tarjeta-azul)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid var(--borde)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    };

    const headerStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--texto-claro)',
        marginBottom: '0.75rem',
    };

    const messageStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        color: 'var(--texto-sec)',
        marginBottom: '1.5rem',
        lineHeight: 1.5,
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div style={overlayStyle} onClick={handleOverlayClick}>
            <div style={dialogStyle}>
                <h2 style={headerStyle}>{title}</h2>
                <p style={messageStyle}>{message}</p>
                <div style={actionsStyle}>
                    <Button variant="alt" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

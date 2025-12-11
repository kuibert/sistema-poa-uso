import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    userName?: string;
    onLogout?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, userName, onLogout }) => {
    const headerStyle: React.CSSProperties = {
        background: 'var(--banner-azul)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const brandTitleStyle: React.CSSProperties = {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '1.05rem',
        letterSpacing: '0.05em',
    };

    const brandSubStyle: React.CSSProperties = {
        fontSize: '0.82rem',
        color: 'var(--texto-sec)',
    };

    const userStyle: React.CSSProperties = {
        textAlign: 'right',
        fontSize: '0.78rem',
    };

    return (
        <header style={headerStyle}>
            <div>
                <div style={brandTitleStyle}>{title}</div>
                <div style={brandSubStyle}>{subtitle}</div>
            </div>
            {userName && (
                <div style={userStyle}>
                    Usuario:<br />
                    <strong>{userName}</strong>
                    {onLogout && (
                        <div style={{ marginTop: '4px' }}>
                            <button
                                onClick={onLogout}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ff8a8a',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    textDecoration: 'underline',
                                    padding: 0
                                }}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

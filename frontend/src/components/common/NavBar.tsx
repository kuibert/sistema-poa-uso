import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/authApi';

interface NavBarProps {
    userName?: string;
}

export const NavBar: React.FC<NavBarProps> = ({ userName }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [displayName, setDisplayName] = React.useState<string>(userName || "Usuario");

    const [userRole, setUserRole] = React.useState<string>('VIEWER');

    React.useEffect(() => {
        if (userName) {
            setDisplayName(userName);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    setDisplayName(parsed.nombre || "Usuario");
                    setUserRole(parsed.rol || "VIEWER");
                } catch (e) {
                    console.error("Error parsing user", e);
                }
            }
        }
    }, [userName]);

    const handleLogout = () => {
        authApi.logout();
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/proyecto', label: 'Registrar Proyecto' },
        { path: '/seguimiento', label: 'Seguimiento' },
        { path: '/gastos', label: 'Gastos' },
        { path: '/evidencias', label: 'Evidencias' },
        ...(userRole === 'ADMIN' ? [{ path: '/admin/usuarios', label: 'Usuarios' }] : [])
    ];

    const isActive = (path: string) => location.pathname === path;

    const containerStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0d1f35 100%)',
        padding: '0.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    };

    const leftSectionStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    };

    const titleStyle: React.CSSProperties = {
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: 600,
        margin: 0,
    };

    const subtitleStyle: React.CSSProperties = {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.75rem',
        margin: 0,
    };

    const navListStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0.5rem',
        listStyle: 'none',
        margin: 0,
        padding: 0,
    };

    const navItemStyle = (active: boolean): React.CSSProperties => ({
        padding: '0.5rem 1.2rem',
        background: active ? 'var(--acento-verde)' : 'transparent',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s ease',
        opacity: active ? 1 : 0.8,
    });

    const userSectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    };

    const userLabelStyle: React.CSSProperties = {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.7rem',
        margin: 0,
    };

    const userNameStyle: React.CSSProperties = {
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 500,
        margin: 0,
    };

    return (
        <nav style={containerStyle}>
            <div style={leftSectionStyle}>
                <div>
                    <h1 style={titleStyle}>UNIVERSIDAD DE SONSONATE</h1>
                    <p style={subtitleStyle}>Sistema de Gestión POA</p>
                </div>

                <ul style={navListStyle}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <button
                                onClick={() => navigate(item.path)}
                                style={navItemStyle(isActive(item.path))}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={userSectionStyle}>
                <p style={userLabelStyle}>Usuario:</p>
                <p style={userNameStyle}>{displayName}</p>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#ff8a8a',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '0.3rem',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

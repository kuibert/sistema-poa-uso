import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { Flex, Typography } from './index';

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
        { path: '/reportes', label: 'Reportes' },
        ...(userRole === 'ADMIN' ? [{ path: '/admin/usuarios', label: 'Usuarios' }] : [])
    ];

    const isActive = (path: string) => location.pathname === path;

    const navItemStyle = (active: boolean): React.CSSProperties => ({
        padding: '0.5rem 1.2rem',
        background: active ? 'var(--verde-hoja)' : 'transparent',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s ease',
        opacity: active ? 1 : 0.8,
    });

    return (
        <Flex
            as="nav"
            justify="space-between"
            align="center"
            padding="0.9rem 10rem"
            style={{
                background: 'linear-gradient(135deg, #1a3a5c 0%, #0d1f35 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                width: '100%',
                boxSizing: 'border-box',
                minHeight: '70px'
            }}
        >
            {/* Lado izquierdo: Logo + Enlaces */}
            <Flex align="center" gap="3.5rem">
                <Flex direction="column">
                    <Typography variant="body" weight={700} style={{ color: 'white', fontSize: '1.1rem', margin: 0, letterSpacing: '0.4px' }}>
                        UNIVERSIDAD DE SONSONATE
                    </Typography>
                    <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8rem' }}>
                        Sistema de Gestión POA
                    </Typography>
                </Flex>

                <Flex as="ul" gap="0.3rem" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
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
                </Flex>
            </Flex>

            {/* Lado derecho: Info de Usuario */}
            <Flex align="center" gap="1.5rem">
                <Flex direction="column" align="flex-end" style={{ marginRight: '0.2rem' }}>
                    <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.75rem' }}>
                        Usuario:
                    </Typography>
                    <Typography variant="body" weight={600} style={{ color: 'white', fontSize: '0.9rem', margin: 0 }}>
                        {displayName}
                    </Typography>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff8a8a',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0,
                            marginTop: '2px',
                            fontWeight: 500
                        }}
                    >
                        Cerrar sesión
                    </button>
                </Flex>
            </Flex>
        </Flex>
    );
};

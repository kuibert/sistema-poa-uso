import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { Flex, Typography, Button } from './index';

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

    return (
        <Flex
            as="nav"
            justify="center"
            style={{
                background: 'linear-gradient(135deg, #1a3a5c 0%, #0d1f35 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                padding="0.6rem 2rem"
                style={{
                    width: '100%',
                    maxWidth: '1200px',
                }}
            >
                <Flex align="center" gap="3rem">
                    <Flex direction="column">
                        <Typography variant="body" weight={600} style={{ color: 'white', fontSize: '1rem', margin: 0, letterSpacing: '0.5px' }}>
                            UNIVERSIDAD DE SONSONATE
                        </Typography>
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.75rem' }}>
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

                <Flex align="center" gap="1.5rem">
                    <Flex direction="column" align="flex-end">
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.7rem' }}>
                            Usuario:
                        </Typography>
                        <Typography variant="body" weight={500} style={{ color: 'white', fontSize: '0.85rem', margin: 0 }}>
                            {displayName}
                        </Typography>
                    </Flex>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        style={{
                            color: '#ff8a8a',
                            background: 'rgba(255,255,255,0.08)',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            border: '1px solid rgba(255, 138, 138, 0.2)'
                        }}
                    >
                        Cerrar sesión
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

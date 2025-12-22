import React from 'react';
import { NavBar } from './NavBar';

interface PageLayoutProps {
    children: React.ReactNode;
    maxWidth?: string;
    hideNavBar?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    maxWidth = '1150px',
    hideNavBar = false
}) => {
    const containerStyle: React.CSSProperties = {
        background: 'var(--fondo-azul)',
        color: 'var(--texto-claro)',
        minHeight: '100vh',
    };

    const mainStyle: React.CSSProperties = {
        maxWidth,
        margin: '1.5rem auto 0',
        padding: '0 1rem 1rem',
    };

    return (
        <div style={containerStyle}>
            {!hideNavBar && <NavBar />}
            <main style={mainStyle}>
                {children}
            </main>
        </div>
    );
};

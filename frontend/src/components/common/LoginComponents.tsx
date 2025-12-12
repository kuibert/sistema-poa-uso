import React from 'react';

type LoginCardProps = {
    children: React.ReactNode;
};

export const LoginCard: React.FC<LoginCardProps> = ({ children }) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--login-gradient-start) 0%, var(--login-gradient-end) 100%)',
        padding: '20px',
    };

    const cardStyle: React.CSSProperties = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '420px',
        overflow: 'hidden',
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {children}
            </div>
        </div>
    );
};

type LoginHeaderProps = {
    title: string;
    subtitle: string;
    icon?: string;
};

export const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle, icon = '🎓' }) => {
    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '40px 40px 30px',
        background: 'linear-gradient(135deg, var(--login-gradient-start) 0%, var(--login-gradient-end) 100%)',
        color: 'white',
    };

    const logoStyle: React.CSSProperties = {
        fontSize: '4rem',
        marginBottom: '16px',
    };

    const h1Style: React.CSSProperties = {
        margin: '0 0 8px',
        fontSize: '1.75rem',
        fontWeight: 600,
    };

    const pStyle: React.CSSProperties = {
        margin: 0,
        fontSize: '0.875rem',
        opacity: 0.9,
    };

    return (
        <div style={headerStyle}>
            <div style={logoStyle}>{icon}</div>
            <h1 style={h1Style}>{title}</h1>
            <p style={pStyle}>{subtitle}</p>
        </div>
    );
};

type LoginFormProps = {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ children, onSubmit }) => {
    const formStyle: React.CSSProperties = {
        padding: '40px',
    };

    return (
        <form onSubmit={onSubmit} style={formStyle}>
            {children}
        </form>
    );
};

type LoginFooterProps = {
    text: string;
};

export const LoginFooter: React.FC<LoginFooterProps> = ({ text }) => {
    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
    };

    const pStyle: React.CSSProperties = {
        margin: 0,
        fontSize: '0.75rem',
        color: '#6b7280',
    };

    return (
        <div style={footerStyle}>
            <p style={pStyle}>{text}</p>
        </div>
    );
};

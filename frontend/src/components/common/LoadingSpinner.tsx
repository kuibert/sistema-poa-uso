import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    message?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'var(--verde-hoja)',
    message,
    fullScreen = false
}) => {
    const sizes = {
        sm: 24,
        md: 40,
        lg: 60,
    };

    const spinnerSize = sizes[size];

    const containerStyle: React.CSSProperties = fullScreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(11, 36, 71, 0.9)',
        zIndex: 9999,
    } : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    };

    const spinnerStyle: React.CSSProperties = {
        width: spinnerSize,
        height: spinnerSize,
        border: `3px solid rgba(255, 255, 255, 0.1)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    };

    const messageStyle: React.CSSProperties = {
        marginTop: '1rem',
        color: 'var(--texto-claro)',
        fontSize: '0.875rem',
    };

    // Inject keyframes animation
    React.useEffect(() => {
        const styleId = 'loading-spinner-keyframes';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            {message && <div style={messageStyle}>{message}</div>}
        </div>
    );
};

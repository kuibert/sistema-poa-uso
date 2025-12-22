import React from 'react';

interface ProgressBarProps {
    progress: number;
    height?: string;
    color?: string;
    trackColor?: string;
    showLabel?: boolean;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = '6px',
    color = 'var(--verde-hoja)',
    trackColor = 'rgba(255,255,255,0.15)',
    showLabel = false,
    className = ''
}) => {
    const trackStyle: React.CSSProperties = {
        width: '100%',
        height,
        borderRadius: '999px',
        background: trackColor,
        overflow: 'hidden',
    };

    const fillStyle: React.CSSProperties = {
        height: '100%',
        width: `${Math.min(100, Math.max(0, progress))}%`,
        background: color,
        transition: 'width 0.25s ease-out',
    };

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={trackStyle}>
                <div style={fillStyle} />
            </div>
            {showLabel && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{progress}%</span>
            )}
        </div>
    );
};

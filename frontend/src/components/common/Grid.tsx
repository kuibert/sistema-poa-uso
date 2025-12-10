import React from 'react';

interface GridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    gap?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Grid: React.FC<GridProps> = ({
    children,
    columns = 2,
    gap = '1rem',
    className = '',
    style
}) => {
    const minWidths: Record<number, string> = {
        2: '240px',
        3: '160px',
        4: '220px',
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidths[columns]}, 1fr))`,
        gap,
        ...style,
    };

    return (
        <div style={gridStyle} className={className}>
            {children}
        </div>
    );
};

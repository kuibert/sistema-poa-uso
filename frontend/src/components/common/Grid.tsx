import React from 'react';

interface GridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | string;
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
        1: '100%',
        2: '240px',
        3: '160px',
        4: '220px',
        5: '150px',
        6: '120px',
        7: '100px',
        8: '80px',
        9: '70px',
        10: '60px',
        11: '50px',
        12: '40px',
    };

    const gridTemplate = typeof columns === 'number'
        ? `repeat(auto-fit, minmax(${minWidths[columns]}, 1fr))`
        : columns;

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gap,
        ...style,
    };

    return (
        <div style={gridStyle} className={className}>
            {children}
        </div>
    );
};

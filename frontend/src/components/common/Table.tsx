import React from 'react';

export type TableVariant = 'default' | 'compact' | 'activities';

interface TableProps {
    children: React.ReactNode;
    variant?: TableVariant;
    className?: string;
}

interface TableHeaderProps {
    children: React.ReactNode;
}

interface TableBodyProps {
    children: React.ReactNode;
}

interface TableFooterProps {
    children: React.ReactNode;
}



interface TableCellProps {
    children: React.ReactNode;
    header?: boolean;
    center?: boolean;
    colSpan?: number;
    style?: React.CSSProperties;
}

const TableRoot: React.FC<TableProps> = ({ children, variant = 'default', className = '' }) => {
    const baseStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: variant === 'compact' ? '0.75rem' : '0.78rem',
        marginTop: '0.5rem',
    };

    const variantStyles: Record<TableVariant, React.CSSProperties> = {
        default: {},
        compact: {
            fontSize: '0.75rem',
        },
        activities: {
            color: 'var(--texto-actividades)',
        },
    };

    return (
        <table style={{ ...baseStyle, ...variantStyles[variant] }} className={className}>
            {children}
        </table>
    );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
    const headerStyle: React.CSSProperties = {
        background: 'rgba(0, 0, 0, 0.3)',
    };

    return <thead style={headerStyle}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
    return <tbody>{children}</tbody>;
};

const TableFooter: React.FC<TableFooterProps> = ({ children }) => {
    return <tfoot>{children}</tfoot>;
};

interface TableRowProps {
    children: React.ReactNode;
    hover?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const TableRow: React.FC<TableRowProps> = ({ children, hover = true, style, className }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const rowStyle: React.CSSProperties = {
        background: isHovered && hover ? 'rgba(255, 255, 255, 0.05)' : undefined,
        ...style,
    };

    return (
        <tr
            style={rowStyle}
            className={className}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </tr>
    );
};

const TableCell: React.FC<TableCellProps> = ({
    children,
    header = false,
    center = false,
    colSpan,
    style = {}
}) => {
    const cellStyle: React.CSSProperties = {
        padding: '0.4rem 0.35rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        textAlign: center ? 'center' : header ? 'left' : undefined,
        color: header ? 'var(--texto-sec)' : undefined,
        fontWeight: header ? 500 : undefined,
        verticalAlign: 'middle',
        ...style,
    };

    const Component = header ? 'th' : 'td';

    return (
        <Component style={cellStyle} colSpan={colSpan}>
            {children}
        </Component>
    );
};

export const Table = Object.assign(TableRoot, {
    Header: TableHeader,
    Body: TableBody,
    Footer: TableFooter,
    Row: TableRow,
    Cell: TableCell,
});

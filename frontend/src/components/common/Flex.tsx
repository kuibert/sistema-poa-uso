import React from 'react';

interface FlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: string;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
    [key: string]: any; // Allow other props
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({
    children,
    direction = 'row',
    justify = 'flex-start',
    align = 'stretch',
    wrap = 'nowrap',
    gap = '0',
    style,
    className = '',
    id,
    ...rest
}, ref) => {
    const flexStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        gap,
        ...style
    };

    return (
        <div style={flexStyle} className={className} id={id} ref={ref} {...rest}>
            {children}
        </div>
    );
});

import React from 'react';

interface FlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: string;
    padding?: string;
    paddingX?: string;
    paddingY?: string;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
    as?: any; // To allow as="nav", etc.
    [key: string]: any;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({
    children,
    direction = 'row',
    justify = 'flex-start',
    align = 'stretch',
    wrap = 'nowrap',
    gap = '0',
    padding,
    paddingX,
    paddingY,
    style,
    className = '',
    id,
    as: Component = 'div',
    ...rest
}, ref) => {
    const flexStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        gap,
        ...(padding && { padding }),
        ...(paddingX && { paddingLeft: paddingX, paddingRight: paddingX }),
        ...(paddingY && { paddingTop: paddingY, paddingBottom: paddingY }),
        ...style
    };

    return (
        <Component style={flexStyle} className={className} id={id} ref={ref} {...rest}>
            {children}
        </Component>
    );
});

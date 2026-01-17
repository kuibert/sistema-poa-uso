import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
    color?: string; // Hex or css var
    weight?: 400 | 500 | 600 | 700;
    align?: 'left' | 'center' | 'right' | 'justify';
    style?: React.CSSProperties;
    className?: string;
    component?: any; // To override the tag
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color,
    weight,
    align,
    style,
    className = '',
    component
}) => {
    // Default tag mapping
    const tagMap: Record<string, any> = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        body: 'p',
        caption: 'span',
        label: 'label'
    };

    // Default styles mapping
    const variantStyles: Record<string, React.CSSProperties> = {
        h1: { fontSize: '1.2rem', margin: 0, fontWeight: 700, color: 'var(--typo-color-h, var(--texto-claro))' },
        h2: { fontSize: '1rem', margin: 0, fontWeight: 600, color: 'var(--typo-color-h, var(--texto-claro))' },
        h3: { fontSize: '0.9rem', margin: 0, fontWeight: 600, color: 'var(--typo-color-h, var(--texto-claro))' },
        body: { fontSize: '0.9rem', color: 'var(--typo-color-body, var(--texto-sec))' },
        caption: { fontSize: '0.78rem', color: 'var(--typo-color-body, var(--texto-sec))' },
        label: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--typo-color-body, var(--texto-sec))' }
    };

    const Tag = component || tagMap[variant] || 'div';

    const computedStyle: React.CSSProperties = {
        ...variantStyles[variant],
        ...(color && { color }),
        ...(weight && { fontWeight: weight }),
        ...(align && { textAlign: align }),
        ...style
    };

    return (
        <Tag style={computedStyle} className={className}>
            {children}
        </Tag>
    );
};

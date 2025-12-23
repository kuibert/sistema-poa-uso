import React from 'react';
import { Button } from './Button';
import { Flex } from './Flex';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
    style
}) => {
    if (totalPages <= 1) return null;

    return (
        <Flex justify="center" gap="0.5rem" style={{ marginTop: '1.5rem', ...style }} className={className}>
            <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &laquo; Anterior
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'main' : 'ghost'}
                    onClick={() => onPageChange(page)}
                    style={{ minWidth: '32px', padding: '0 0.6rem' }}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Siguiente &raquo;
            </Button>
        </Flex>
    );
};

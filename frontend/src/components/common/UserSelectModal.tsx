import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { SearchBar } from './SearchBar';

interface User {
    id: string | number;
    nombre_completo: string;
    cargo?: string;
    email?: string;
}

interface UserSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (user: User) => void;
    users: User[];
    title?: string;
}

export const UserSelectModal: React.FC<UserSelectModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    users,
    title = "Seleccionar Usuario"
}) => {
    const [search, setSearch] = useState('');

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const lower = search.toLowerCase();
        return users.filter(u =>
            u.nombre_completo.toLowerCase().includes(lower) ||
            (u.cargo && u.cargo.toLowerCase().includes(lower)) ||
            (u.email && u.email.toLowerCase().includes(lower))
        );
    }, [users, search]);

    const handleSelect = (user: User) => {
        onSelect(user);
        onClose();
        setSearch('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div style={{ marginBottom: '1rem' }}>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Buscar por nombre, cargo o correo..."
                    width="100%"
                />
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                {filteredUsers.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No se encontraron usuarios</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {filteredUsers.map(user => (
                            <li
                                key={user.id}
                                onClick={() => handleSelect(user)}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    color: 'var(--texto-claro)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ fontWeight: 500, color: 'var(--texto-claro)' }}>{user.nombre_completo}</div>
                                {user.cargo && <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{user.cargo}</div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
    );
};

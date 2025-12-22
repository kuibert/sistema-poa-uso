import React, { useState, useEffect } from 'react';
import { NavBar, Card, LoadingSpinner, ErrorMessage, Button, Input, Label, Select, Modal, FormGroup, Table } from '../components/common';
import apiClient from '../services/apiClient';
import { Usuario } from '../types';

export const AdminUsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create State
    const [modalOpen, setModalOpen] = useState(false);
    const [newUserA, setNewUserA] = useState({
        nombre: '',
        email: '',
        rol: 'VIEWER' as 'ADMIN' | 'EDITOR' | 'VIEWER'
    });
    const [creating, setCreating] = useState(false);

    // Update State (for Role change)
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/auth/users');
            setUsuarios(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        try {
            setCreating(true);
            await apiClient.post('/auth/register', newUserA);
            setModalOpen(false);
            setNewUserA({ nombre: '', email: '', rol: 'VIEWER' });
            loadUsuarios();
            alert('Usuario creado correctamente');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al crear usuario');
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateRole = async (userId: number, newRole: string) => {
        if (!window.confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`)) return;
        try {
            await apiClient.put(`/auth/users/${userId}/rol`, { rol: newRole });
            loadUsuarios();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al actualizar rol');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;
        try {
            await apiClient.delete(`/auth/users/${userId}`);
            loadUsuarios();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al eliminar usuario');
        }
    };

    const styles = {
        container: {
            background: 'var(--fondo-azul)',
            color: 'var(--texto-claro)',
            minHeight: '100vh',
        },
        main: {
            maxWidth: '1000px',
            margin: '2rem auto',
            padding: '0 1rem',
        }
    };

    return (
        <div style={styles.container}>
            <NavBar />
            <main style={styles.main}>
                <Card padding="2rem">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Administración de Usuarios</h1>
                            <p style={{ color: 'var(--texto-sec)' }}>Gestión de accesos y roles del sistema.</p>
                        </div>
                        <Button variant="main" onClick={() => setModalOpen(true)}>
                            + Nuevo Usuario
                        </Button>
                    </div>

                    {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table variant="default">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.Cell header>Nombre</Table.Cell>
                                        <Table.Cell header>Correo</Table.Cell>
                                        <Table.Cell header>Rol Actual</Table.Cell>
                                        <Table.Cell header>Acciones</Table.Cell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {usuarios.map(u => (
                                        <Table.Row key={u.id_usuario || (u as any).id}>
                                            <Table.Cell>{u.nombre || (u as any).nombre_completo}</Table.Cell>
                                            <Table.Cell>{u.email || (u as any).correo}</Table.Cell>
                                            <Table.Cell>
                                                <span style={{
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '4px',
                                                    background: u.rol === 'ADMIN' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.15)',
                                                    color: u.rol === 'ADMIN' ? '#e74c3c' : 'var(--verde-hoja)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}>
                                                    {u.rol}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <div style={{ width: '120px' }}>
                                                        <Select
                                                            value={u.rol}
                                                            onChange={(e) => handleUpdateRole(u.id_usuario || (u as any).id, e.target.value)}
                                                            style={{
                                                                padding: '0.3rem',
                                                                fontSize: '0.85rem',
                                                                background: '#081529',
                                                                borderColor: 'var(--borde)'
                                                            }}
                                                        >
                                                            <option value="ADMIN">ADMIN</option>
                                                            <option value="EDITOR">EDITOR</option>
                                                            <option value="VIEWER">VIEWER</option>
                                                        </Select>
                                                    </div>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteUser(u.id_usuario || (u as any).id)}
                                                        style={{
                                                            padding: '0.3rem 0.5rem',
                                                            fontSize: '0.8rem',
                                                            background: 'rgba(231, 76, 60, 0.2)',
                                                            color: '#e74c3c',
                                                            border: '1px solid rgba(231, 76, 60, 0.3)'
                                                        }}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
                </Card>
            </main>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Nuevo Usuario">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '350px' }}>
                    <FormGroup>
                        <Label>Nombre Completo</Label>
                        <Input
                            type="text"
                            value={newUserA.nombre}
                            onChange={e => setNewUserA({ ...newUserA, nombre: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Correo Electrónico</Label>
                        <Input
                            type="email"
                            value={newUserA.email}
                            onChange={e => setNewUserA({ ...newUserA, email: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Rol Asignado</Label>
                        <Select
                            value={newUserA.rol}
                            onChange={e => setNewUserA({ ...newUserA, rol: e.target.value as any })}
                        >
                            <option value="VIEWER">VIEWER (Lectura)</option>
                            <option value="EDITOR">EDITOR (Operativo)</option>
                            <option value="ADMIN">ADMIN (Control Total)</option>
                        </Select>
                    </FormGroup>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button variant="main" onClick={handleCreateUser} disabled={creating}>
                            {creating ? 'Creando...' : 'Crear Usuario'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { PageLayout, Card, LoadingSpinner, ErrorMessage, Button, Input, Label, Select, Modal, FormGroup, Table, Flex, Typography, Badge, ConfirmDialog } from '../components/common';
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
        password: '',
        rol: 'VIEWER' as 'ADMIN' | 'EDITOR' | 'VIEWER'
    });
    const [creating, setCreating] = useState(false);

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
            setNewUserA({ nombre: '', email: '', password: '', rol: 'VIEWER' });
            loadUsuarios();
            alert('Usuario creado correctamente');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al crear usuario');
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateRole = async (userId: number, newRole: string) => {
        // if (!window.confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`)) return; // Commented for smoother UX or use ConfirmDialog
        try {
            await apiClient.put(`/auth/users/${userId}/rol`, { rol: newRole });
            loadUsuarios();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al actualizar rol');
        }
    };

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const handleDeleteUser = (userId: number) => {
        setDeleteTargetId(userId);
        setShowDeleteDialog(true);
    };

    const confirmDeleteUser = async () => {
        if (!deleteTargetId) return;
        try {
            await apiClient.delete(`/auth/users/${deleteTargetId}`);
            loadUsuarios();
            alert('Usuario eliminado correctamente'); // Optional: replace with toast if available, but alert is fine for success feedback for now or just silent refresh
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al eliminar usuario');
        } finally {
            setShowDeleteDialog(false);
            setDeleteTargetId(null);
        }
    };

    const getRoleBadgeStyle = (rol: string) => {
        switch (rol) {
            case 'ADMIN': return { background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c' };
            case 'EDITOR': return { background: 'rgba(52, 152, 219, 0.2)', color: '#3498db' };
            default: return { background: 'rgba(46, 204, 113, 0.15)', color: 'var(--verde-hoja)' };
        }
    };

    return (
        <PageLayout>
            <Flex justify="space-between" align="center" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                <Flex direction="column">
                    <Typography variant="h1">Administración de Usuarios</Typography>
                    <Typography variant="body" style={{ color: 'var(--texto-sec)' }}>Gestión de accesos y roles del sistema.</Typography>
                </Flex>
                <Button variant="main" onClick={() => setModalOpen(true)}>
                    + Nuevo Usuario
                </Button>
            </Flex>

            <Card padding="2rem">
                {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <Flex style={{ overflowX: 'auto' }}>
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
                                            <Badge variant="pill" style={getRoleBadgeStyle(u.rol)}>
                                                {u.rol}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Flex gap="0.5rem" align="center">
                                                <Flex style={{ width: '120px' }}>
                                                    <Select
                                                        value={u.rol}
                                                        onChange={(e) => handleUpdateRole(u.id_usuario || (u as any).id, e.target.value)}
                                                        style={{
                                                            padding: '0.3rem',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="EDITOR">EDITOR</option>
                                                        <option value="VIEWER">VIEWER</option>
                                                    </Select>
                                                </Flex>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteUser(u.id_usuario || (u as any).id)}
                                                    style={{
                                                        padding: '0.3rem 0.5rem',
                                                        fontSize: '0.8rem',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                    title="Eliminar usuario"
                                                >
                                                    🗑️
                                                </Button>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Flex>
                )}
            </Card>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Nuevo Usuario">
                <Flex direction="column" gap="1rem" style={{ minWidth: '350px' }}>
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
                        <Label>Contraseña</Label>
                        <Input
                            type="password"
                            value={newUserA.password}
                            onChange={e => setNewUserA({ ...newUserA, password: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
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

                    <Flex justify="flex-end" gap="0.5rem" style={{ marginTop: '1rem' }}>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button variant="main" onClick={handleCreateUser} disabled={creating}>
                            {creating ? 'Creando...' : 'Crear Usuario'}
                        </Button>
                    </Flex>
                </Flex>
            </Modal>


            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Eliminar Usuario"
                message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
                onConfirm={confirmDeleteUser}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </PageLayout >
    );
};

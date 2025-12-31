import React, { useState, useEffect } from 'react';
import { PageLayout, Card, LoadingSpinner, ErrorMessage, SuccessMessage, Button, Input, Label, Select, Modal, FormGroup, Table, Flex, Typography, Badge, ConfirmDialog, Pagination, SearchBar } from '../components/common';
import apiClient from '../services/apiClient';
import { Usuario } from '../types';

export const AdminUsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Create State
    const [modalOpen, setModalOpen] = useState(false);
    const [newUserA, setNewUserA] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'VIEWER' as 'ADMIN' | 'EDITOR' | 'VIEWER',
        cargo: '',
        unidad: ''
    });
    const [creating, setCreating] = useState(false);



    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Ajustar según necesidad

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

    useEffect(() => {
        loadUsuarios();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset page on search or filter
    }, [searchTerm, roleFilter]);

    // Derived state
    const filteredUsuarios = usuarios.filter(u => {
        const matchesSearch = (u.nombre || (u as any).nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || (u as any).correo || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? u.rol === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const paginatedUsuarios = filteredUsuarios.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };



    const handleCreateUser = async () => {
        try {
            setCreating(true);
            await apiClient.post('/auth/register', newUserA);
            setModalOpen(false);
            setNewUserA({ nombre: '', email: '', password: '', rol: 'VIEWER', cargo: '', unidad: '' });
            loadUsuarios();
            loadUsuarios();
            setSuccessMsg('Usuario creado correctamente');
            setTimeout(() => setSuccessMsg(null), 3000);
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
                {successMsg && <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} />}
                {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <Flex style={{ overflowX: 'auto', flexDirection: 'column' }}>
                        <Flex justify="flex-end" gap="1rem" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ width: '200px' }}>
                                <Select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="">Todos los Roles</option>
                                    <option value="ADMIN">Administrador</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="VIEWER">Visualizador</option>
                                </Select>
                            </div>
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="🔍 Buscar usuarios..."
                                width="300px"
                            />
                        </Flex>

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
                                {paginatedUsuarios.map(u => (
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

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
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
                    <FormGroup>
                        <Label>Cargo</Label>
                        <Input
                            type="text"
                            value={newUserA.cargo}
                            onChange={e => setNewUserA({ ...newUserA, cargo: e.target.value })}
                            placeholder="Ej. Docente, Decana"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Unidad / Facultad</Label>
                        <Input
                            type="text"
                            value={newUserA.unidad}
                            onChange={e => setNewUserA({ ...newUserA, unidad: e.target.value })}
                            placeholder="Ej. Facultad de Ingeniería"
                        />
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

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, Divider, Grid, Section, Label, Button, LoadingSpinner, ErrorMessage, Input, Select, Table, ConfirmDialog } from '../components/common';
import apiClient from '../services/apiClient';

type Evidencia = {
  id_evidencia?: number;
  tipo: string;
  descripcion: string;
  archivo: string | File; // Can be filename string or File object
  fecha?: string;
};

export default function ActividadEvidencias() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Obtener usuario y permisos
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Permitir solo a ADMIN y EDITOR
        const role = user.rol?.toUpperCase();
        setCanEdit(role === 'ADMIN' || role === 'EDITOR');
      }
    } catch (e) {
      console.error("Error leyendo usuario", e);
      setCanEdit(false);
    }
  }, []);

  const [headerInfo, setHeaderInfo] = useState({
    proyecto: '',
    actividad: '',
    anio: 2024,
    responsable: '',
    cargo: ''
  });

  // Lista de evidencias
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);

  // Formulario para nueva evidencia
  const [nuevaEvidencia, setNuevaEvidencia] = useState<Evidencia>({
    tipo: "",
    descripcion: "",
    archivo: "",
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado para confirmación de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

  // Cargar evidencias y datos al montar el componente
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Cargar datos de la actividad (header)
      // Endpoint: GET /api/proyectos/actividades/:id
      const actResponse = await apiClient.get(`/proyectos/actividades/${id}`);
      const actData = actResponse.data;

      setHeaderInfo({
        proyecto: actData.proyecto_nombre,
        actividad: actData.nombre,
        anio: actData.anio,
        responsable: actData.responsable_nombre || 'No asignado',
        cargo: 'Responsable de Actividad' // Dato no disponible en backend aun, placeholder
      });

      // 2. Cargar evidencias
      const evResponse = await apiClient.get(`/actividades/${id}/evidencias`);
      const evidenciasTransformadas = evResponse.data.map((e: any) => ({
        id_evidencia: e.id_evidencia,
        tipo: e.tipo_evidencia,
        descripcion: e.descripcion,
        archivo: e.ruta_archivo,
        fecha: e.fecha_subida
      }));

      setEvidencias(evidenciasTransformadas);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los datos');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarCampos = () => {
    setNuevaEvidencia({
      tipo: "",
      descripcion: "",
      archivo: "",
    });
  };

  const agregarEvidencia = async () => {
    if (!canEdit) return;

    // Validar campos
    if (!nuevaEvidencia.tipo || !nuevaEvidencia.descripcion || !nuevaEvidencia.archivo) {
      setError('Por favor completa todos los campos de la evidencia');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('tipo_evidencia', nuevaEvidencia.tipo);
      formData.append('descripcion', nuevaEvidencia.descripcion);
      if (nuevaEvidencia.archivo instanceof File) {
        formData.append('archivo', nuevaEvidencia.archivo);
      }
      if (nuevaEvidencia.fecha) {
        formData.append('fecha', nuevaEvidencia.fecha);
      }

      const response = await apiClient.post(`/actividades/${id}/evidencias`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Agregar la nueva evidencia a la lista
      setEvidencias([
        ...evidencias,
        {
          id_evidencia: response.data.id_evidencia,
          tipo: nuevaEvidencia.tipo,
          descripcion: nuevaEvidencia.descripcion,
          archivo: response.data.ruta_archivo || (nuevaEvidencia.archivo instanceof File ? nuevaEvidencia.archivo.name : nuevaEvidencia.archivo),
          fecha: response.data.fecha_subida || nuevaEvidencia.fecha || new Date().toISOString()
        }
      ]);

      // Limpiar formulario
      limpiarCampos();
      setSuccess('Evidencia agregada correctamente');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar la evidencia');
      console.error('Error guardando evidencia:', err);
    } finally {
      setSaving(false);
    }
  };

  const eliminarEvidencia = (index: number) => {
    if (!canEdit) return;
    const evidencia = evidencias[index];
    if (!evidencia.id_evidencia) return;

    setDeleteTargetIndex(index);
    setShowDeleteDialog(true);
  };

  const confirmarEliminacion = async () => {
    if (deleteTargetIndex === null) return;
    if (!canEdit) return;

    const index = deleteTargetIndex;
    const evidencia = evidencias[index];

    try {
      setSaving(true);
      await apiClient.delete(`/evidencias/${evidencia.id_evidencia}`);
      setEvidencias(evidencias.filter((_, i) => i !== index));
      setSuccess('Evidencia eliminada correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar la evidencia');
      console.error('Error eliminando evidencia:', err);
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
      setDeleteTargetIndex(null);
    }
  };

  const handleDownload = async (archivo: string | File) => {
    if (archivo instanceof File) {
      // If it's a File object (not yet uploaded), can't download
      setError('El archivo aún no ha sido subido');
      return;
    }

    try {
      // Clean filename: remove /uploads/ prefix if present
      const filename = archivo.startsWith('/uploads/')
        ? archivo.substring(9)
        : archivo.startsWith('uploads/')
          ? archivo.substring(8)
          : archivo;

      // Fetch file with credentials
      const response = await apiClient.get(`/uploads/${filename}`, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Use cleaned filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Error al descargar el archivo: ' + (err.response?.data?.error || err.message));
      console.error('Error downloading file:', err);
    }
  };

  // Estilos inline
  const containerStyle: React.CSSProperties = {
    background: 'var(--fondo-azul)',
    color: 'var(--texto-claro)',
    minHeight: '100vh',
  };

  const mainStyle: React.CSSProperties = {
    maxWidth: '1150px',
    margin: '1.5rem auto 0',
    padding: '0 1rem 1rem',
  };





  if (!id) {
    return (
      <div style={containerStyle}>
        <NavBar />
        <main style={mainStyle}>
          <Card padding="1.8rem">
            <h1 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Gestión de Evidencias</h1>
            <p style={{ color: 'var(--texto-sec)', marginBottom: '1.5rem' }}>
              Para gestionar las evidencias de una actividad, necesitas acceder desde el seguimiento del proyecto.
            </p>
            <p style={{ color: 'var(--texto-sec)', marginBottom: '1.5rem' }}>
              💡 <strong>Tip:</strong> Navega a Seguimiento → Selecciona un proyecto → Haz clic en "Evidencias" de una actividad
            </p>
            <Button variant="main" onClick={() => navigate('/seguimiento')}>
              Ir a Seguimiento
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <NavBar />

      <main style={mainStyle}>
        <Card padding="1.8rem">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.2rem', margin: 0 }}>
                Evidencias de la actividad: {headerInfo.actividad}
              </h1>
              <p style={{ color: 'var(--texto-sec)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Tipo, descripción y archivo adjunto de cada evidencia.
              </p>
            </div>

          </div>

          <Divider variant="gradient" />

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {success && (
            <div style={{
              background: 'rgba(39, 174, 96, 0.15)',
              border: '1px solid #27ae60',
              color: '#27ae60',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>✅</span> {success}
            </div>
          )}

          {loading ? (
            <LoadingSpinner size="lg" fullScreen={false} />
          ) : (
            <>
              {/* Información del proyecto y actividad */}
              <Section title="Proyecto y actividad" description="">
                <Grid columns={2} style={{ marginBottom: '1rem' }}>
                  <div>
                    <Label>Proyecto</Label>
                    <Input type="text" value={headerInfo.proyecto} readOnly />
                  </div>
                  <div>
                    <Label>Actividad</Label>
                    <Input type="text" value={headerInfo.actividad} readOnly />
                  </div>
                </Grid>

                <Grid columns={3}>
                  <div>
                    <Label>Año</Label>
                    <Input type="number" value={headerInfo.anio} readOnly style={{ textAlign: 'center' }} />
                  </div>
                  <div>
                    <Label>Responsable de la actividad</Label>
                    <Input type="text" value={headerInfo.responsable} readOnly />
                  </div>
                  <div>
                    <Label>Cargo / Unidad</Label>
                    <Input type="text" value={headerInfo.cargo} readOnly />
                  </div>
                </Grid>
              </Section>

              {/* Formulario para agregar evidencia */}
              {canEdit ? (
                <Section
                  title="Registro de nueva evidencia"
                  description="Cada evidencia puede ser un archivo (acta, lista, informe, fotografía, etc.) con su descripción y fecha."
                >
                  <div style={{ background: 'var(--panel-contenido)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--borde)' }}>
                    <Grid columns={3} style={{ marginBottom: '1rem' }}>
                      <div>
                        <Label>Fecha de la evidencia</Label>
                        <Input
                          type="date"
                          value={nuevaEvidencia.fecha ? new Date(nuevaEvidencia.fecha).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNuevaEvidencia({ ...nuevaEvidencia, fecha: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <Label>Tipo de evidencia</Label>
                        <Select
                          value={nuevaEvidencia.tipo}
                          onChange={(e) => setNuevaEvidencia({ ...nuevaEvidencia, tipo: e.target.value })}
                          disabled={saving}
                        >
                          <option value="">Seleccione...</option>
                          <option value="Acta / minuta">Acta / minuta</option>
                          <option value="Informe">Informe</option>
                          <option value="Lista de asistencia">Lista de asistencia</option>
                          <option value="Constancia / certificado">Constancia / certificado</option>
                          <option value="Registro fotográfico">Registro fotográfico</option>
                          <option value="Otro">Otro</option>
                        </Select>
                      </div>
                      <div>
                        <Label>Archivo</Label>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNuevaEvidencia({ ...nuevaEvidencia, archivo: file });
                            }
                          }}
                          disabled={saving}
                        />
                      </div>
                    </Grid>

                    <div style={{ marginBottom: '1rem' }}>
                      <Label>Descripción de la evidencia</Label>
                      <Input
                        type="text"
                        placeholder="Describe brevemente qué evidencia es, qué actividad documenta y en qué contexto."
                        value={nuevaEvidencia.descripcion}
                        onChange={(e) => setNuevaEvidencia({ ...nuevaEvidencia, descripcion: e.target.value })}
                        disabled={saving}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button variant="alt" type="button" onClick={limpiarCampos} disabled={saving}>
                        ↺ Limpiar campos
                      </Button>
                      <Button variant="main" type="button" onClick={agregarEvidencia} disabled={saving}>
                        ➕ Agregar evidencia
                      </Button>
                    </div>
                  </div>
                </Section>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--texto-sec)', padding: '1rem', background: 'var(--panel-contenido)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--borde)' }}>
                  🔒 Solo los administradores o editores pueden agregar nuevas evidencias.
                </p>
              )}

              {/* Lista de evidencias */}
              <Section
                title="Evidencias registradas"
                description="En el sistema real, desde aquí se podría descargar cada evidencia y usarla para auditorías o procesos de acreditación."
              >
                {evidencias.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--texto-sec)', padding: '2rem' }}>
                    {canEdit ? 'No hay evidencias registradas. Agrega la primera evidencia arriba.' : 'No hay evidencias registradas.'}
                  </p>
                ) : (
                  <Table variant="compact">
                    <Table.Header>
                      <Table.Row>
                        <Table.Cell header style={{ width: '10%' }}>Fecha</Table.Cell>
                        <Table.Cell header style={{ width: '20%' }}>Tipo</Table.Cell>
                        <Table.Cell header style={{ width: '23%' }}>Archivo</Table.Cell>
                        <Table.Cell header style={{ width: '35%' }}>Descripción</Table.Cell>
                        <Table.Cell header center style={{ width: '12%' }}>Acciones</Table.Cell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {evidencias.map((ev, i) => (
                        <Table.Row key={i}>
                          <Table.Cell>{ev.fecha ? new Date(ev.fecha).toLocaleDateString() : '-'}</Table.Cell>
                          <Table.Cell>{ev.tipo}</Table.Cell>
                          <Table.Cell>{ev.archivo instanceof File ? ev.archivo.name : ev.archivo}</Table.Cell>
                          <Table.Cell>{ev.descripcion}</Table.Cell>
                          <Table.Cell center>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <Button
                                variant="main"
                                size="sm"
                                type="button"
                                onClick={() => handleDownload(ev.archivo)}
                                title="Descargar/Ver archivo"
                              >
                                ⬇
                              </Button>
                              {canEdit && (
                                <Button variant="alt" size="sm" type="button" onClick={() => eliminarEvidencia(i)}>✖</Button>
                              )}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                )}
              </Section>

              <Divider variant="gradient" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', gap: '0.7rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--texto-sec)' }}>
                  Esta pantalla sirve como memoria de respaldo documental del proyecto en procesos de evaluación y acreditación.
                </div>
                <Button variant="alt" type="button" onClick={() => alert("Función de exportar no implementada aún")}>
                  ⬇ Exportar listado
                </Button>
              </div>
            </>
          )}
          <ConfirmDialog
            isOpen={showDeleteDialog}
            title="Eliminar Evidencia"
            message="¿Está seguro de que desea eliminar esta evidencia? Esta acción no se puede deshacer."
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            confirmVariant="danger"
            onConfirm={confirmarEliminacion}
            onCancel={() => setShowDeleteDialog(false)}
          />
        </Card>
      </main>
    </div >
  );
}

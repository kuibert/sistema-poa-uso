import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, Divider, Grid, Section, Label, Button, LoadingSpinner, ErrorMessage, Input, Select } from '../components/common';
import apiClient from '../services/apiClient';

type Evidencia = {
  id_evidencia?: number;
  tipo: string;
  descripcion: string;
  archivo: string;
  fecha?: string;
};

export default function ActividadEvidencias() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Valores iniciales
  const [proyecto] = useState("Gestión de acreditación de la Carrera de Ingeniería Industrial");
  const [actividad] = useState("Acercamiento y entendimiento con ACAAI");

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
  const [saving, setSaving] = useState(false);

  // Cargar evidencias al montar el componente
  useEffect(() => {
    if (id) {
      loadEvidencias();
    }
  }, [id]);

  const loadEvidencias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/actividades/${id}/evidencias`);

      // Transformar datos del backend al formato del componente
      const evidenciasTransformadas = response.data.map((e: any) => ({
        id_evidencia: e.id_evidencia,
        tipo: e.tipo_evidencia,
        descripcion: e.descripcion,
        archivo: e.ruta_archivo,
        fecha: e.fecha_subida
      }));

      setEvidencias(evidenciasTransformadas);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar las evidencias');
      console.error('Error cargando evidencias:', err);
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
    // Validar campos
    if (!nuevaEvidencia.tipo || !nuevaEvidencia.descripcion || !nuevaEvidencia.archivo) {
      setError('Por favor completa todos los campos de la evidencia');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await apiClient.post(`/actividades/${id}/evidencias`, {
        tipo_evidencia: nuevaEvidencia.tipo,
        descripcion: nuevaEvidencia.descripcion,
        ruta_archivo: nuevaEvidencia.archivo
      });

      // Agregar la nueva evidencia a la lista
      setEvidencias([
        ...evidencias,
        {
          id_evidencia: response.data.id_evidencia,
          tipo: nuevaEvidencia.tipo,
          descripcion: nuevaEvidencia.descripcion,
          archivo: nuevaEvidencia.archivo,
          fecha: new Date().toISOString()
        }
      ]);

      // Limpiar formulario
      limpiarCampos();

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar la evidencia');
      console.error('Error guardando evidencia:', err);
    } finally {
      setSaving(false);
    }
  };

  const eliminarEvidencia = async (index: number) => {
    const evidencia = evidencias[index];

    if (!evidencia.id_evidencia) {
      return;
    }

    try {
      setSaving(true);
      await apiClient.delete(`/evidencias/${evidencia.id_evidencia}`);
      setEvidencias(evidencias.filter((_, i) => i !== index));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar la evidencia');
      console.error('Error eliminando evidencia:', err);
    } finally {
      setSaving(false);
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



  const evidenciaItemStyle: React.CSSProperties = {
    background: 'var(--card-dark-bg)',
    padding: '1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--borde)',
    marginBottom: '0.75rem',
  };

  if (!id) {
    return (
      <div style={containerStyle}>
        <NavBar userName="Carlos Roberto Martínez Martínez" />
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
                Evidencias de la actividad: {actividad}
              </h1>
              <p style={{ color: 'var(--texto-sec)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Tipo, descripción y archivo adjunto de cada evidencia.
              </p>
            </div>
            <Button variant="alt" type="button" onClick={() => window.print()}>
              🖨 Imprimir
            </Button>
          </div>

          <Divider variant="gradient" />

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {loading ? (
            <LoadingSpinner size="lg" fullScreen={false} />
          ) : (
            <>
              {/* Información del proyecto y actividad */}
              <Grid columns={2} style={{ marginBottom: '1.5rem' }}>
                <div>
                  <Label>Proyecto</Label>
                  <Input type="text" value={proyecto} readOnly />
                </div>
                <div>
                  <Label>Nombre de la actividad</Label>
                  <Input type="text" value={actividad} readOnly />
                </div>
              </Grid>

              {/* Formulario para agregar evidencia */}
              <Section
                title="Agregar Nueva Evidencia"
                description="Completa los campos y haz clic en Agregar"
              >
                <Grid columns={3} style={{ marginBottom: '1rem' }}>
                  <div>
                    <Label required>Tipo de evidencia</Label>
                    <Select
                      value={nuevaEvidencia.tipo}
                      onChange={(e) => setNuevaEvidencia({ ...nuevaEvidencia, tipo: e.target.value })}
                      disabled={saving}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Acta">Acta</option>
                      <option value="Informe">Informe</option>
                      <option value="Fotografía">Fotografía</option>
                      <option value="Video">Video</option>
                      <option value="Documento">Documento</option>
                      <option value="Otro">Otro</option>
                    </Select>
                  </div>

                  <div>
                    <Label required>Descripción</Label>
                    <Input
                      type="text"
                      placeholder="Breve descripción de la evidencia"
                      value={nuevaEvidencia.descripcion}
                      onChange={(e) => setNuevaEvidencia({ ...nuevaEvidencia, descripcion: e.target.value })}
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <Label required>Archivo / Enlace</Label>
                    <Input
                      type="text"
                      placeholder="URL o nombre del archivo"
                      value={nuevaEvidencia.archivo}
                      onChange={(e) => setNuevaEvidencia({ ...nuevaEvidencia, archivo: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                </Grid>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="main" type="button" onClick={agregarEvidencia} disabled={saving}>
                    ➕ Agregar evidencia
                  </Button>
                  <Button variant="alt" type="button" onClick={limpiarCampos} disabled={saving}>
                    🔄 Limpiar
                  </Button>
                </div>
              </Section>

              {/* Lista de evidencias */}
              <Section
                title="Evidencias Registradas"
                description={`Total: ${evidencias.length} evidencia(s)`}
              >
                {evidencias.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--texto-sec)', padding: '2rem' }}>
                    No hay evidencias registradas. Agrega la primera evidencia arriba.
                  </p>
                ) : (
                  evidencias.map((ev, i) => (
                    <div key={i} style={evidenciaItemStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div>
                              <Label>Tipo</Label>
                              <p style={{ margin: 0, color: 'var(--acento-verde)' }}>{ev.tipo}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                              <Label>Descripción</Label>
                              <p style={{ margin: 0 }}>{ev.descripcion}</p>
                            </div>
                          </div>
                          <div>
                            <Label>Archivo</Label>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--texto-sec)' }}>
                              {ev.archivo}
                            </p>
                          </div>
                          {ev.fecha && (
                            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--texto-sec)' }}>
                              Subido: {new Date(ev.fecha).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="alt"
                          size="sm"
                          type="button"
                          onClick={() => eliminarEvidencia(i)}
                          disabled={saving}
                        >
                          ✖ Eliminar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </Section>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}

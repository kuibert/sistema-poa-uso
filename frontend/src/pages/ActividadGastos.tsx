import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, Divider, Grid, Section, Label, Button, LoadingSpinner, ErrorMessage, Input } from '../components/common';
import { Table } from '../components/common/Table';
import apiClient from '../services/apiClient';

type Gasto = {
  id_gasto?: number;
  fecha: string;
  descripcion: string;
  monto: number;
};

export default function ActividadGastos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Valores iniciales
  const [proyecto] = useState("Gestión de acreditación de la Carrera de Ingeniería Industrial");
  const [actividad] = useState("Acercamiento y entendimiento con ACAAI");

  // Totales
  const [montoAsignado, setMontoAsignado] = useState<number>(0);
  const [montoGastado, setMontoGastado] = useState<number>(0);
  const [montoDisponible, setMontoDisponible] = useState<number>(0);

  // Lista de gastos
  const [gastos, setGastos] = useState<Gasto[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Cargar gastos al montar el componente
  useEffect(() => {
    if (id) {
      loadGastos();
    }
  }, [id]);

  // Recalcular totales cuando cambian los gastos o el monto asignado
  useEffect(() => {
    const total = gastos.reduce((sum, g) => sum + (g.monto ? Number(g.monto) : 0), 0);
    setMontoGastado(total);
    setMontoDisponible(montoAsignado - total);
  }, [gastos, montoAsignado]);

  const loadGastos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/actividades/${id}/gastos`);

      // Transformar datos del backend al formato del componente
      const gastosTransformados = response.data.map((g: any) => ({
        id_gasto: g.id_gasto,
        fecha: g.fecha_gasto,
        descripcion: g.descripcion,
        monto: g.monto
      }));

      setGastos(gastosTransformados);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los gastos');
      console.error('Error cargando gastos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar fila vacía para nuevo gasto
  const agregarFila = () => {
    setGastos([...gastos, { fecha: "", descripcion: "", monto: 0 }]);
  };

  // Eliminar gasto
  const eliminarGasto = async (index: number) => {
    const gasto = gastos[index];

    // Si el gasto tiene ID, eliminarlo del backend
    if (gasto.id_gasto) {
      try {
        setSaving(true);
        await apiClient.delete(`/gastos/${gasto.id_gasto}`);
        setGastos(gastos.filter((_, i) => i !== index));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al eliminar el gasto');
        console.error('Error eliminando gasto:', err);
      } finally {
        setSaving(false);
      }
    } else {
      // Si no tiene ID, solo quitarlo del array local
      setGastos(gastos.filter((_, i) => i !== index));
    }
  };

  // Actualizar campo de gasto
  const actualizarFila = (index: number, campo: keyof Gasto, valor: string | number) => {
    const copia = [...gastos];
    (copia[index] as any)[campo] = valor;
    setGastos(copia);
  };

  // Guardar nuevo gasto en el backend
  const guardarGasto = async (index: number) => {
    const gasto = gastos[index];

    // Validar que tenga datos
    if (!gasto.fecha || !gasto.descripcion || !gasto.monto) {
      setError('Por favor completa todos los campos del gasto');
      return;
    }

    // Si ya tiene ID, no hacer nada (ya está guardado)
    if (gasto.id_gasto) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await apiClient.post(`/actividades/${id}/gastos`, {
        fecha_gasto: gasto.fecha,
        descripcion: gasto.descripcion,
        monto: Number(gasto.monto)
      });

      // Actualizar el gasto con el ID del backend
      const copia = [...gastos];
      copia[index] = {
        ...gasto,
        id_gasto: response.data.id_gasto
      };
      setGastos(copia);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el gasto');
      console.error('Error guardando gasto:', err);
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



  if (!id) {
    return (
      <div style={containerStyle}>
        <NavBar />
        <main style={mainStyle}>
          <Card padding="1.8rem">
            <h1 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Gestión de Gastos</h1>
            <p style={{ color: 'var(--texto-sec)', marginBottom: '1.5rem' }}>
              Para gestionar los gastos de una actividad, necesitas acceder desde el seguimiento del proyecto.
            </p>
            <p style={{ color: 'var(--texto-sec)', marginBottom: '1.5rem' }}>
              💡 <strong>Tip:</strong> Navega a Seguimiento → Selecciona un proyecto → Haz clic en "Gastos" de una actividad
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
      <NavBar userName="Carlos Roberto Martínez Martínez" />

      <main style={mainStyle}>
        <Card padding="1.8rem">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.2rem', margin: 0 }}>
                Gastos de la actividad: {actividad}
              </h1>
              <p style={{ color: 'var(--texto-sec)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Fecha, descripción y monto, actualizando el disponible de la actividad.
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

              {/* Resumen Financiero */}
              <Section title="Resumen Financiero" description="Montos asignados, gastados y disponibles">
                <Grid columns={3}>
                  <div>
                    <Label>Monto asignado a la actividad ($)</Label>
                    <Input
                      type="number"
                      value={montoAsignado}
                      onChange={(e) => setMontoAsignado(Number(e.target.value))}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label>Total gastado ($)</Label>
                    <Input type="number" value={montoGastado.toFixed(2)} readOnly />
                  </div>
                  <div>
                    <Label>Disponible ($)</Label>
                    <Input type="number" value={montoDisponible.toFixed(2)} readOnly />
                  </div>
                </Grid>
              </Section>

              {/* Tabla de Gastos */}
              <Section
                title="Lista de Gastos"
                description="Registro detallado de gastos: fecha, descripción y monto."
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                  <Button variant="main" size="sm" type="button" onClick={agregarFila} disabled={saving}>
                    ➕ Agregar gasto
                  </Button>
                </div>

                <Card variant="dark" padding="1rem">
                  <Table>
                    <Table.Header>
                      <Table.Row hover={false}>
                        <Table.Cell header style={{ width: '20%' }}>Fecha</Table.Cell>
                        <Table.Cell header style={{ width: '45%' }}>Descripción</Table.Cell>
                        <Table.Cell header style={{ width: '20%' }}>Monto ($)</Table.Cell>
                        <Table.Cell header center style={{ width: '15%' }}>Acción</Table.Cell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {gastos.map((g, i) => (
                        <Table.Row key={i}>
                          <Table.Cell>
                            <Input
                              type="date"
                              value={g.fecha}
                              onChange={(e) => actualizarFila(i, "fecha", e.target.value)}
                              disabled={saving}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              type="text"
                              placeholder="Detalle del gasto"
                              value={g.descripcion}
                              onChange={(e) => actualizarFila(i, "descripcion", e.target.value)}
                              disabled={saving}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              type="number"
                              step="0.01"
                              value={g.monto}
                              onChange={(e) => actualizarFila(i, "monto", Number(e.target.value))}
                              disabled={saving}
                            />
                          </Table.Cell>
                          <Table.Cell center>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              {!g.id_gasto && (
                                <Button
                                  variant="main"
                                  size="sm"
                                  type="button"
                                  onClick={() => guardarGasto(i)}
                                  disabled={saving}
                                >
                                  💾
                                </Button>
                              )}
                              <Button
                                variant="alt"
                                size="sm"
                                type="button"
                                onClick={() => eliminarGasto(i)}
                                disabled={saving}
                              >
                                ✖
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>

                  {gastos.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--texto-sec)', padding: '2rem' }}>
                      No hay gastos registrados. Haz clic en "Agregar gasto" para comenzar.
                    </p>
                  )}
                </Card>
              </Section>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}

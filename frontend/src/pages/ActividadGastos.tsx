import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Card, Divider, Section, Label, Button, LoadingSpinner, ErrorMessage, Input } from '../components/common';
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
  // const [proyecto] = useState("Gestión de acreditación de la Carrera de Ingeniería Industrial");
  // const [actividad] = useState("Acercamiento y entendimiento con ACAAI");

  const [headerInfo, setHeaderInfo] = useState({
    proyecto: '',
    actividad: '',
    presupuesto: 0
  });

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
      loadData();
    }
  }, [id]);

  // Recalcular totales cuando cambian los gastos o el monto asignado
  useEffect(() => {
    const total = gastos.reduce((sum, g) => sum + (g.monto ? Number(g.monto) : 0), 0);
    setMontoGastado(total);
    setMontoDisponible(montoAsignado - total);
  }, [gastos, montoAsignado]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Cargar datos de la actividad (header)
      const actResponse = await apiClient.get(`/proyectos/actividades/${id}`);
      const actData = actResponse.data;

      setHeaderInfo({
        proyecto: actData.proyecto_nombre,
        actividad: actData.nombre,
        presupuesto: Number(actData.presupuesto_asignado) || 0
      });
      setMontoAsignado(Number(actData.presupuesto_asignado) || 0);

      // 2. Cargar gastos
      const response = await apiClient.get(`/actividades/${id}/gastos`);

      // Transformar datos del backend al formato del componente
      const gastosTransformados = response.data.map((g: any) => ({
        id_gasto: g.id_gasto,
        fecha: g.fecha_gasto ? new Date(g.fecha_gasto).toISOString().split('T')[0] : '',
        descripcion: g.descripcion,
        monto: g.monto
      }));

      setGastos(gastosTransformados);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los datos');
      console.error('Error cargando datos:', err);
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
                Gastos de la actividad: {headerInfo.actividad}
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
              {/* Grid Principal: Proyecto/Actividad + Resumen es un solo bloque visual en HTML */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Columna Izquierda: Información */}
                <div>
                  <Label>Proyecto</Label>
                  <Input type="text" value={headerInfo.proyecto} readOnly style={{ marginBottom: '0.6rem' }} />
                  <Label>Nombre de la actividad</Label>
                  <Input type="text" value={headerInfo.actividad} readOnly />
                </div>

                {/* Columna Derecha: Resumen Panel */}
                <div style={{
                  background: 'var(--panel-contenido)',
                  borderRadius: '10px',
                  border: '1px solid var(--borde)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.7rem' }}>
                    <div>
                      <Label>Monto asignado ($)</Label>
                      <Input
                        type="number"
                        value={montoAsignado}
                        onChange={(e) => setMontoAsignado(Number(e.target.value))}
                        step="0.01"
                        min="0"
                        style={{ textAlign: 'right' }}
                      />
                    </div>
                    <div>
                      <Label>Total gastado ($)</Label>
                      <Input type="number" value={montoGastado.toFixed(2)} readOnly style={{ textAlign: 'right' }} />
                    </div>
                    <div>
                      <Label>Disponible ($)</Label>
                      <Input type="number" value={montoDisponible.toFixed(2)} readOnly style={{ textAlign: 'right', fontWeight: 'bold' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de Gastos */}
              <div style={{
                background: 'var(--panel-contenido)',
                borderRadius: '10px',
                border: '1px solid var(--borde)',
                padding: '1.2rem',
                marginTop: '1.5rem'
              }}>
                <Section
                  title="Lista simple de gastos"
                  description="Fecha, descripción y monto."
                  headerAction={
                    <Button variant="main" size="sm" type="button" onClick={agregarFila} disabled={saving}>
                      ➕ Agregar gasto
                    </Button>
                  }
                >
                  <Table variant="compact">
                    <Table.Header>
                      <Table.Row hover={false}>
                        <Table.Cell header style={{ width: '18%' }}>Fecha</Table.Cell>
                        <Table.Cell header style={{ width: '57%' }}>Descripción del gasto</Table.Cell>
                        <Table.Cell header style={{ width: '15%' }}>Monto ($)</Table.Cell>
                        <Table.Cell header center style={{ width: '10%' }}>Acc.</Table.Cell>
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
                              style={{ padding: '0.3rem', fontSize: '0.85rem' }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              type="text"
                              placeholder="Detalle del gasto"
                              value={g.descripcion}
                              onChange={(e) => actualizarFila(i, "descripcion", e.target.value)}
                              disabled={saving}
                              style={{ padding: '0.3rem', fontSize: '0.85rem' }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={g.monto}
                              onChange={(e) => actualizarFila(i, "monto", Number(e.target.value))}
                              disabled={saving}
                              style={{ padding: '0.3rem', fontSize: '0.85rem', textAlign: 'right' }}
                            />
                          </Table.Cell>
                          <Table.Cell center>
                            <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                              {!g.id_gasto && (
                                <Button
                                  variant="main"
                                  size="sm"
                                  type="button"
                                  onClick={() => guardarGasto(i)}
                                  disabled={saving}
                                  title="Guardar fila individualmente (opcional)"
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
                                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                      No hay gastos registrados. Haz clic en el botón superior para agregar.
                    </p>
                  )}
                </Section>
              </div>

              <Divider variant="gradient" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--texto-sec)', flex: 1 }}>
                  Los montos se reflejan en el disponible de la actividad y en el tablero general de proyectos (en el sistema final).
                </div>
                <div>
                  <Button variant="main" type="button" onClick={() => alert("Simulación: Guardado global")} disabled={saving}>
                    💾 Guardar (simulado)
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Divider, Section, Label, Button, LoadingSpinner, ErrorMessage, Input, ConfirmDialog, PageLayout, Flex, Typography, SuccessMessage, Grid, Table } from '../components/common';
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
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado para confirmación de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

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
    if (!canEdit) return;
    if (montoDisponible <= 0) {
      setError('No hay presupuesto disponible para agregar más gastos.');
      return;
    }
    setGastos([...gastos, { fecha: "", descripcion: "", monto: 0 }]);
    setSuccess(null);
  };

  // Eliminar gasto
  const eliminarGasto = (index: number) => {
    if (!canEdit) return;
    const gasto = gastos[index];
    if (gasto.id_gasto) {
      setDeleteTargetIndex(index);
      setShowDeleteDialog(true);
    } else {
      setGastos(gastos.filter((_, i) => i !== index));
    }
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (deleteTargetIndex === null) return;
    if (!canEdit) return;

    const index = deleteTargetIndex;
    const gasto = gastos[index];

    try {
      setSaving(true);
      await apiClient.delete(`/gastos/${gasto.id_gasto}`);
      setGastos(gastos.filter((_, i) => i !== index));
      setSuccess('Gasto eliminado correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar el gasto');
      console.error('Error eliminando gasto:', err);
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
      setDeleteTargetIndex(null);
    }
  };

  // Actualizar campo de gasto
  const actualizarFila = (index: number, campo: keyof Gasto, valor: string | number) => {
    if (!canEdit) return;
    const copia = [...gastos];
    (copia[index] as any)[campo] = valor;
    setGastos(copia);
  };

  // Guardar nuevo gasto
  const guardarGasto = async (index: number) => {
    if (!canEdit) return;
    const gasto = gastos[index];

    if (!gasto.fecha || !gasto.descripcion || !gasto.monto) {
      setError('Por favor completa todos los campos del gasto');
      return;
    }

    if (montoDisponible < 0) {
      setError(`El gasto excede el presupuesto disponible. Exceso: $${Math.abs(montoDisponible).toFixed(2)}`);
      return;
    }

    if (gasto.id_gasto) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await apiClient.post(`/actividades/${id}/gastos`, {
        fecha_gasto: gasto.fecha,
        descripcion: gasto.descripcion,
        monto: Number(gasto.monto)
      });

      const copia = [...gastos];
      copia[index] = {
        ...gasto,
        id_gasto: response.data.id_gasto
      };
      setGastos(copia);
      setSuccess('Gasto guardado correctamente');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el gasto');
      console.error('Error guardando gasto:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <PageLayout>
        <Card padding="1.8rem">
          <Typography variant="h1">Gestión de Gastos</Typography>
          <Typography variant="body" style={{ color: 'var(--texto-sec)', marginBottom: '1.5rem' }}>
            Para gestionar los gastos de una actividad, necesitas acceder desde el seguimiento del proyecto.
          </Typography>
          <Typography variant="body" style={{ color: 'var(--texto-sec)', marginBottom: '1.5rem' }}>
            💡 <strong>Tip:</strong> Navega a Seguimiento → Selecciona un proyecto → Haz clic en "Gastos" de una actividad
          </Typography>
          <Button variant="main" onClick={() => navigate('/seguimiento')}>
            Ir a Seguimiento
          </Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="1150px">
      <Card padding="1.8rem">
        {/* Header */}
        <Flex justify="space-between" align="center" style={{ marginBottom: '1rem' }}>
          <div>
            <Typography variant="h1">
              Gastos de la actividad: {headerInfo.actividad}
            </Typography>
            <Typography variant="body" color="var(--texto-sec)" style={{ marginTop: '0.2rem' }}>
              Fecha, descripción y monto, actualizando el disponible de la actividad.
            </Typography>
          </div>
        </Flex>

        <Divider variant="gradient" />

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />}

        {loading ? (
          <LoadingSpinner size="lg" fullScreen={false} />
        ) : (
          <>
            {/* Grid Principal */}
            <Grid columns="1.5fr 1fr" gap="1rem" style={{ marginBottom: '1.5rem' }}>
              <div>
                <Label>Proyecto</Label>
                <Input type="text" value={headerInfo.proyecto} readOnly style={{ marginBottom: '0.6rem' }} />
                <Label>Nombre de la actividad</Label>
                <Input type="text" value={headerInfo.actividad} readOnly />
              </div>

              <Card variant="dark" padding="1rem" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Grid columns={1} gap="0.7rem">
                  <div>
                    <Label>Monto asignado ($)</Label>
                    <Input
                      type="number"
                      value={montoAsignado}
                      onChange={(e) => setMontoAsignado(Number(e.target.value))}
                      step="0.01"
                      min="0"
                      style={{ textAlign: 'right' }}
                      readOnly={!canEdit}
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
                </Grid>
              </Card>
            </Grid>

            {/* Tabla de Gastos */}
            <Card variant="dark" padding="1.2rem" style={{ marginTop: '1.5rem' }}>
              <Section
                title="Lista simple de gastos"
                description="Fecha, descripción y monto."
                headerAction={
                  canEdit ? (
                    <Button variant="main" size="sm" type="button" onClick={agregarFila} disabled={saving}>
                      ➕ Agregar gasto
                    </Button>
                  ) : null
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
                            disabled={saving || !canEdit}
                            style={{ padding: '0.3rem', fontSize: '0.85rem' }}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Input
                            type="text"
                            placeholder="Detalle del gasto"
                            value={g.descripcion}
                            onChange={(e) => actualizarFila(i, "descripcion", e.target.value)}
                            disabled={saving || !canEdit}
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
                            disabled={saving || !canEdit}
                            style={{ padding: '0.3rem', fontSize: '0.85rem', textAlign: 'right' }}
                          />
                        </Table.Cell>
                        <Table.Cell center>
                          <Flex gap="0.3rem" justify="center">
                            {!g.id_gasto && canEdit && (
                              <Button
                                variant="main"
                                size="sm"
                                type="button"
                                onClick={() => guardarGasto(i)}
                                disabled={saving}
                                title="Guardar fila individualmente"
                              >
                                💾
                              </Button>
                            )}
                            {canEdit && (
                              <Button
                                variant="alt"
                                size="sm"
                                type="button"
                                onClick={() => eliminarGasto(i)}
                                disabled={saving}
                                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                              >
                                ✖
                              </Button>
                            )}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>

                {gastos.length === 0 && (
                  <Typography variant="body" align="center" color="var(--texto-sec)" style={{ padding: '2rem' }}>
                    {canEdit ? 'No hay gastos registrados. Haz clic en el botón superior para agregar.' : 'No hay gastos registrados.'}
                  </Typography>
                )}
              </Section>
            </Card>

            <Divider variant="gradient" />

            <Flex justify="space-between" align="center" style={{ marginTop: '1rem' }} wrap="wrap" gap="1rem">
              <Typography variant="caption" color="var(--texto-sec)" style={{ flex: 1 }}>
                Los montos se reflejan en el disponible de la actividad y en el tablero general de proyectos (en el sistema final).
              </Typography>
            </Flex>
          </>
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Eliminar Gasto"
          message="¿Está seguro de que desea eliminar este gasto? Esta acción liberará el presupuesto asignado pero no se puede deshacer."
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={confirmarEliminacion}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </Card>
    </PageLayout>
  );
}

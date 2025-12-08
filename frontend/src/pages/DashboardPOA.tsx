import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { poaApi } from '../services/poaApi';
import { Proyecto } from '../types';
import { KPICard } from '../components/dashboard/KPICard';
import { ProyectosTable } from '../components/dashboard/ProyectosTable';
import { Button } from '../components/common/Button';
import './DashboardPOA.css';

interface DashboardData {
  total_proyectos: number;
  presupuesto_total: number;
  total_ejecutado: number;
  porcentaje_avance: number;
}

export const DashboardPOA: React.FC = () => {
  const navigate = useNavigate();
  const [anio, setAnio] = useState(2026);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [anio]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboardData, proyectosData] = await Promise.all([
        poaApi.getDashboard(anio),
        poaApi.getProyectos(anio)
      ]);
      setDashboard(dashboardData);
      setProyectos(proyectosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-poa">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard POA</h1>
          <p>Resumen ejecutivo de proyectos</p>
        </div>
        <div className="dashboard-actions">
          <select 
            value={anio} 
            onChange={(e) => setAnio(Number(e.target.value))}
            className="year-select"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
          <Button 
            variant="primary" 
            onClick={() => navigate('/proyectos/nuevo')}
          >
            ➕ Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPICard
          title="Total Proyectos"
          value={dashboard?.total_proyectos || 0}
          icon="📊"
          color="blue"
        />
        <KPICard
          title="Presupuesto Total"
          value={formatCurrency(dashboard?.presupuesto_total || 0)}
          icon="💰"
          color="green"
        />
        <KPICard
          title="Total Ejecutado"
          value={formatCurrency(dashboard?.total_ejecutado || 0)}
          icon="💵"
          color="orange"
        />
        <KPICard
          title="% Avance Promedio"
          value={`${dashboard?.porcentaje_avance || 0}%`}
          icon="📈"
          color="purple"
        />
      </div>

      {/* Tabla de Proyectos */}
      <div className="proyectos-section">
        <h2>Proyectos {anio}</h2>
        <ProyectosTable proyectos={proyectos} />
      </div>
    </div>
  );
};

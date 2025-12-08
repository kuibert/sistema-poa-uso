import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Proyecto } from '../../types';
import { Button } from '../common/Button';
import './ProyectosTable.css';

interface ProyectosTableProps {
  proyectos: Proyecto[];
}

export const ProyectosTable: React.FC<ProyectosTableProps> = ({ proyectos }) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const calcularAvance = (proyecto: Proyecto) => {
    if (!proyecto.presupuesto_total || proyecto.presupuesto_total === 0) return 0;
    return Math.round((proyecto.total_gastado / proyecto.presupuesto_total) * 100);
  };

  return (
    <div className="table-container">
      <table className="proyectos-table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Responsable</th>
            <th>Presupuesto</th>
            <th>Gastado</th>
            <th>% Avance</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                No hay proyectos registrados
              </td>
            </tr>
          ) : (
            proyectos.map((proyecto) => (
              <tr key={proyecto.id}>
                <td>
                  <div className="proyecto-info">
                    <strong>{proyecto.nombre}</strong>
                    <small>{proyecto.unidad_responsable}</small>
                  </div>
                </td>
                <td>{proyecto.responsable_nombre}</td>
                <td>{formatCurrency(proyecto.presupuesto_total)}</td>
                <td>{formatCurrency(proyecto.total_gastado)}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${calcularAvance(proyecto)}%` }}
                      />
                    </div>
                    <span>{calcularAvance(proyecto)}%</span>
                  </div>
                </td>
                <td>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(`/proyectos/${proyecto.id}`)}
                  >
                    Ver Detalle
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

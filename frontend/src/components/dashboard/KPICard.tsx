import React from 'react';
import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'blue' 
}) => {
  return (
    <div className={`kpi-card kpi-${color}`}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <h3 className="kpi-value">{value}</h3>
        <p className="kpi-title">{title}</p>
      </div>
    </div>
  );
};

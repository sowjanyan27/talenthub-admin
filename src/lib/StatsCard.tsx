// src/components/ui/StatsCard.tsx   (or wherever you want to place it)
import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;                 // positive or negative number
  changeText?: string;             // "this week", "from last month", etc.
  subtitle?: string;               // for secondary value like "15 this week"
  icon?: string | React.ReactNode; // emoji or icon component
  trend?: 'up' | 'down' | 'neutral'; // optional - controls color
  status?: 'success' | 'warning' | 'danger' | 'info'; // for color accent
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeText = '',
  subtitle,
  icon,
  trend = 'neutral',
  status = 'info',
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const getStatusBg = () => {
    const colors = {
      success: 'bg-emerald-50 text-emerald-700',
      warning: 'bg-amber-50 text-amber-700',
      danger: 'bg-rose-50 text-rose-700',
      info: 'bg-blue-50 text-blue-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="stats-card">
      <div className="header">
        <h3 className="title">{title}</h3>
        {icon && <div className="icon">{icon}</div>}
      </div>

      <div className="main-value">{value}</div>

      <div className="footer">
        {change !== undefined && (
          <span className={`change ${getTrendColor()}`}>
            {change > 0 ? '+' : ''}{change}%
            {changeText && <span className="change-text"> {changeText}</span>}
          </span>
        )}

        {subtitle && (
          <span className="subtitle">{subtitle}</span>
        )}
      </div>

      {/* Optional small status indicator pill */}
      {status !== 'info' && (
        <div className={`status-pill ${getStatusBg()}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
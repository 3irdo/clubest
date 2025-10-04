import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof LucideIcon;
  color?: 'primary' | 'green' | 'secondary';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'text-primary',
    green: 'text-accent-green',
    secondary: 'text-secondary'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium mb-2">{title}</p>
          <h3 className={`text-3xl font-bold mb-1 ${colorClasses[color]}`}>{value}</h3>
          {subtitle && (
            <p className="text-text-secondary text-sm">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <Icon size={32} className={colorClasses[color]} />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  FileText,
  ShoppingBag,
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = '/dashboard' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Entrenamientos', path: '/training' },
    { icon: CreditCard, label: 'Pagos', path: '/payments' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    { icon: ShoppingBag, label: 'Tienda', path: '/store' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: Settings, label: 'Administración', path: '/admin' }
  ];

  return (
    <aside
      className={`bg-primary-dark text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen relative`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-primary text-white p-1 rounded-full shadow-lg hover:bg-primary-light transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-6">
        <div className="flex flex-col space-y-2 mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-accent-green'
                    : 'hover:bg-primary hover:text-accent-green'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

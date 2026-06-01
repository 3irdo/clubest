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
import { withBase } from '@/lib/withBase';
import { useAuth, ROLE_NAMES } from '../../context/AuthContext';

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = withBase('dashboard') }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, role: roleName, hasRole } = useAuth();
  const fullName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : ''
  const firstNameLetter = profile ? (profile.first_name ?? '?').charAt(0).toUpperCase() : '?'

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: withBase('/dashboard'), roles: [ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER] },
    { icon: Calendar, label: 'Entrenamientos', path: withBase('training'), roles: [ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER] },
    { icon: CreditCard, label: 'Pagos', path: withBase('payments'), roles: [ROLE_NAMES.ADMIN, ROLE_NAMES.MEMBER] },
    { icon: FileText, label: 'Documentos', path: withBase('documents'), roles: [ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER] },
    { icon: ShoppingBag, label: 'Tienda', path: withBase('store'), roles: [ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER] },
    { icon: User, label: 'Perfil', path: withBase('profile'), roles: [ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER] },
    { icon: Settings, label: 'Administración', path: withBase('admin'), roles: [ROLE_NAMES.ADMIN] }
  ];

  const visibleItems = menuItems.filter(item => hasRole(...item.roles));

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
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary">
          {profile?.image_url ? (
            <img
              src={profile.image_url}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-accent-green"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary border-2 border-accent-green flex items-center justify-center text-white text-sm font-bold">
              {firstNameLetter}
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{fullName}</p>
              <p className="text-xs text-text-secondary capitalize">{roleName}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          {visibleItems.map((item) => {
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

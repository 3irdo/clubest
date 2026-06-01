import React from 'react';
import { AppProviders } from '../components/providers/AppProviders';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleRoute from '../components/auth/RoleRoute';
import { Sidebar } from '../components/navigation/Sidebar';
import { Navbar } from '../components/navigation/Navbar';

interface ReactDashboardLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  className?: string;
  allowedRoles?: string[];
}

export const ReactDashboardLayout: React.FC<ReactDashboardLayoutProps> = ({ children, currentPath, className = "max-w-6xl mx-auto", allowedRoles }) => {
  const inner = allowedRoles ? (
    <RoleRoute allowedRoles={allowedRoles}>
      {children}
    </RoleRoute>
  ) : <>{children}</>;

  return (
    <AppProviders>
      <ProtectedRoute>
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:block transition-all duration-300 shadow-xl z-20">
              <Sidebar currentPath={currentPath} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <header className="z-10 shadow-sm relative">
                  <Navbar isLanding={false} />
              </header>
              
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8 lg:p-10">
                <div className={className}>
                  {inner}
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
    </AppProviders>
  );
};

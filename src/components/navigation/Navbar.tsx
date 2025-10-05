import React, { useState } from 'react';
import { Menu, X, User, Bell } from 'lucide-react';
import { withBase } from '../../lib/withBase';

interface NavbarProps {
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLanding = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLanding) {
    return (
      <nav className="bg-primary-dark text-white fixed w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href={withBase('')} className="text-2xl font-bold">
                <span className="text-accent-green">CLUBEST</span>
              </a>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href={withBase('#equipamiento')} className="hover:text-accent-green transition-colors">
                  Equipamiento
                </a>
                <a href={withBase('#nosotros')} className="hover:text-accent-green transition-colors">
                  Nosotros
                </a>
                <a href={withBase('#contacto')} className="hover:text-accent-green transition-colors">
                  Contacto
                </a>
                <a href={withBase('login')} className="bg-primary hover:bg-primary-light px-6 py-2 rounded-lg transition-colors">
                  Iniciar sesión
                </a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-dark border-t border-primary z-50 relative">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href={withBase('#equipamiento')} className="block px-3 py-2 hover:bg-primary rounded-md">
                Equipamiento
              </a>
              <a href={withBase('#nosotros')} className="block px-3 py-2 hover:bg-primary rounded-md">
                Nosotros
              </a>
              <a href={withBase('#contacto')} className="block px-3 py-2 hover:bg-primary rounded-md">
                Contacto
              </a>
              <a href={withBase('login')} className="block px-3 py-2 bg-primary hover:bg-primary-light rounded-md">
                Iniciar sesión
              </a>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="bg-primary-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href={withBase('dashboard')} className="text-2xl font-bold">
              <span className="text-accent-green">CLUBEST</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-primary rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-green rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-primary rounded-lg transition-colors">
              <User size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

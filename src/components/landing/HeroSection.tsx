import React from 'react';
import { Button } from '../ui/Button';

 export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-primary-dark text-white pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Pasión en <br />
              <span className="text-accent-green">Cada Tiro</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Únete al club de tiro con arco más prestigioso.
              Entrenamiento profesional, comunidad apasionada y
              equipamiento de primera calidad para todos los niveles.
            </p>
            <div className="flex gap-4">
              <Button variant="accent" size="lg" onClick={() => window.location.href = '#'}>
                Ver equipamiento
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="src/assets/landing/womanArcher.jpg"
              alt="Tiro con arco"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


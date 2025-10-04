import React from 'react';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Aprende según tu nivel',
      description: 'Clases personalizadas desde principiantes hasta avanzados'
    },
    {
      icon: Users,
      title: 'Competencias',
      description: 'Participa en torneos locales e internacionales'
    },
    {
      icon: Award,
      title: 'Comunidad activa',
      description: 'Únete a miles de arqueros apasionados'
    },
    {
      icon: TrendingUp,
      title: 'Formación continua',
      description: 'Cursos y talleres para mejorar tus habilidades'
    }
  ];

  return (
    <section id="nosotros" className="py-20 px-4 bg-background-base">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-dark mb-4">
            Más que un club, <span className="text-accent-green">una Pasión</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            CLUBEST ha sido el hogar de arqueros apasionados durante años.
            Nuestra misión es brindar un espacio profesional y acogedor
            donde cada arquero pueda alcanzar su máximo potencial.
            Descubre lo que nos hace únicos y por qué nuestra
            comunidad sigue creciendo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-full mb-4">
                  <Icon size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

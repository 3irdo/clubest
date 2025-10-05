import React from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { withBase } from '../../lib/withBase';

export const ContactSection: React.FC = () => {
  return (
    <section id="contacto" className="py-20 px-4 bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-accent-green">Enlaces Rápidos</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-green">Nosotros</h3>
            <ul className="space-y-2">
              <li><a href={withBase('#nosotros')} className="hover:text-accent-green transition-colors">Quiénes somos</a></li>
              <li><a href={withBase('entrenamientos')} className="hover:text-accent-green transition-colors">Entrenamientos</a></li>
              <li><a href={withBase('tienda')} className="hover:text-accent-green transition-colors">Tienda</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-green">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-accent-green transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-accent-green transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-accent-green transition-colors">Cookies</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-green">Redes</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-accent-green transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-accent-green transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent-green transition-colors">Twitter</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-green">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="text-sm">Envigado, Medellín, Antioquia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span className="text-sm">3014556789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span className="text-sm">care@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary text-center">
          <p className="text-gray-400">
            CLUBEST. Tu club de tiro con arco favorito.
            <br />
            Una comunidad apasionada por la disciplina.
          </p>
        </div>

        <div className="fixed bottom-8 right-8">
          <button className="bg-accent-green hover:bg-secondary text-primary-dark p-4 rounded-full shadow-lg transition-colors">
            <MessageCircle size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

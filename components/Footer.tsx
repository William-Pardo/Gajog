// components/Footer.tsx
// Este componente renderiza el pie de página de la aplicación.

import React from 'react';
import { IconoFacebook, IconoXTwitter, IconoLinkedIn } from './Iconos';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: '#', // Reemplazar con URL real
      icon: IconoFacebook,
      label: 'Facebook',
    },
    {
      href: '#', // Reemplazar con URL real
      icon: IconoXTwitter,
      label: 'X (Twitter)',
    },
    {
      href: '#', // Reemplazar con URL real
      icon: IconoLinkedIn,
      label: 'LinkedIn',
    },
  ];

  return (
    <footer className="p-4 bg-white border-t dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} TaekwondoGa Jog. Todos los derechos reservados.
        </p>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visita nuestro perfil de ${link.label}`}
              className="text-gray-500 hover:text-tkd-blue dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

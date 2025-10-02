// components/NotificacionToast.tsx
// Componente que muestra las notificaciones (toasts) en la interfaz.

import React from 'react';
import { useNotificacion } from '../context/NotificacionContext';
import { IconoCerrar, IconoAprobar, IconoRechazar, IconoInformacion, IconoAlertaTriangulo } from './Iconos';


const NotificacionToast: React.FC = () => {
  const { toasts, ocultarNotificacion } = useNotificacion();

  if (!toasts.length) return null;
  
  const toastConfig = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/50',
      border: 'border-green-400 dark:border-green-600',
      iconColor: 'text-green-500',
      Icon: IconoAprobar,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/50',
      border: 'border-red-400 dark:border-red-600',
      iconColor: 'text-red-500',
      Icon: IconoRechazar,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/50',
      border: 'border-blue-400 dark:border-blue-600',
      iconColor: 'text-blue-500',
      Icon: IconoInformacion,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/50',
      border: 'border-yellow-400 dark:border-yellow-600',
      iconColor: 'text-yellow-500',
      Icon: IconoAlertaTriangulo,
    },
  };


  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {toasts.map((toast) => {
        const config = toastConfig[toast.tipo];
        return (
          <div
            key={toast.id}
            className={`relative flex items-start w-full p-4 border-l-4 rounded-r-lg shadow-lg animate-slide-in-right ${config.bg} ${config.border}`}
            role="alert"
          >
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <config.Icon />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {toast.mensaje}
              </p>
            </div>
            <button
              onClick={() => ocultarNotificacion(toast.id)}
              className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 inline-flex h-8 w-8"
              aria-label="Cerrar"
            >
              <IconoCerrar className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificacionToast;

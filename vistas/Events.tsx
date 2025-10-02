// vistas/Events.tsx - Duplicado de Eventos para evitar errores
import React from 'react';

export const VistaEvents: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white mb-6">
                Gestión de Eventos (Events)
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Eventos Programados</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Organización y gestión de competencias y eventos del club Taekwondo Ga Jog.
                </p>
                <div className="space-y-3">
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">Campeonato Regional</h3>
                                <p className="text-gray-600 dark:text-gray-400">📅 15 de Noviembre, 2024</p>
                                <p className="text-gray-600 dark:text-gray-400">📍 Gimnasio Municipal</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Próximo</span>
                        </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">Examen de Cinturones</h3>
                                <p className="text-gray-600 dark:text-gray-400">📅 20 de Diciembre, 2024</p>
                                <p className="text-gray-600 dark:text-gray-400">📍 Dojang Ga Jog</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Confirmado</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const VistaEventPublico: React.FC = () => {
    return (
        <div className="min-h-screen bg-tkd-gray dark:bg-tkd-dark p-4 sm:p-8 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">Vista Pública del Evento</h1>
                <p className="text-center text-gray-600 dark:text-gray-300">
                    Información pública del evento para inscripciones.
                </p>
            </div>
        </div>
    );
};
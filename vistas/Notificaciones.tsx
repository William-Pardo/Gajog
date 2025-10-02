// vistas/Notificaciones.tsx - Versión Simplificada
import React from 'react';

const VistaNotificaciones: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white mb-6">
                Sistema de Notificaciones
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Centro de Notificaciones</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Gestión de alertas, mensajes y comunicaciones del club.
                </p>
                <div className="space-y-3">
                    <div className="p-4 border border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-500 text-xl">📧</span>
                            <div className="flex-1">
                                <h3 className="font-semibold">Nuevo estudiante registrado</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">William Roa se ha registrado en el sistema</p>
                                <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-xl">🎉</span>
                            <div className="flex-1">
                                <h3 className="font-semibold">Pago confirmado</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pago mensual de William Pardo confirmado</p>
                                <p className="text-xs text-gray-500 mt-1">Hace 1 día</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-orange-200 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <span className="text-orange-500 text-xl">⚠️</span>
                            <div className="flex-1">
                                <h3 className="font-semibold">Documento pendiente</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Falta firmar contrato de servicios</p>
                                <p className="text-xs text-gray-500 mt-1">Hace 3 días</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaNotificaciones;
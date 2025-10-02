// vistas/Configuracion.tsx - Versión Simplificada
import React from 'react';

const VistaConfiguracion: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white mb-6">
                Panel de Configuración
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Configuraciones del Sistema</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Gestión de configuraciones generales del club Taekwondo Ga Jog.
                </p>

                <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
                        <h3 className="text-lg font-semibold mb-3">Información del Club</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nombre del Club
                                </label>
                                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                                    Taekwondo Ga Jog
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Ubicación
                                </label>
                                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                                    Bogotá, Colombia
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
                        <h3 className="text-lg font-semibold mb-3">Configuraciones de Notificaciones</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Notificaciones por Email</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Enviar recordatorios por correo electrónico</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Activado</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Notificaciones Push</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Enviar notificaciones push a estudiantes</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pendiente</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Usuarios del Sistema</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <h4 className="font-medium">Administrador</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Acceso completo al sistema</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Admin</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <h4 className="font-medium">Instructor</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Acceso limitado a funciones específicas</p>
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Usuario</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaConfiguracion;
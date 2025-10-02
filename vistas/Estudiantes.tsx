// vistas/Estudiantes.tsx - Versión Simplificada
import React from 'react';

export const VistaEstudiantes: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white mb-6">
                Gestión de Estudiantes
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Lista de Estudiantes</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Gestión completa de estudiantes del club Taekwondo Ga Jog.
                </p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <h3 className="font-semibold">William Roa</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cinturón Negro</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Activo</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <h3 className="font-semibold">William Pardo</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cinturón Azul</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Activo</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <h3 className="font-semibold">Fee Dudo</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cinturón Blanco</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pendiente</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <h3 className="font-semibold">Don Coso</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cinturón Verde</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Activo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
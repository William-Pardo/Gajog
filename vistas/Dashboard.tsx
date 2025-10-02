// vistas/Dashboard.tsx - Versión Simplificada
import React from 'react';

const VistaDashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white mb-6">
                Dashboard
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Panel de Control</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Bienvenido al sistema de gestión Taekwondo Ga Jog.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Estudiantes</h3>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Eventos</h3>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">2</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200">Productos</h3>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaDashboard;
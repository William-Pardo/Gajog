// components/dashboard/ResumenPagos.tsx

import React, { useMemo } from 'react';
import type { Estudiante } from '../../tipos';
import { EstadoPago } from '../../tipos';

interface Props {
  estudiantes: Estudiante[];
}

const ResumenPagos: React.FC<Props> = ({ estudiantes }) => {

  const distribucionPagos = useMemo(() => ({
    'Al día': estudiantes.filter(e => e.estadoPago === EstadoPago.AlDia).length,
    'Pendiente': estudiantes.filter(e => e.estadoPago === EstadoPago.Pendiente).length,
    'Vencido': estudiantes.filter(e => e.estadoPago === EstadoPago.Vencido).length,
  }), [estudiantes]);
  
  const totalEstudiantes = estudiantes.length;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-tkd-blue mb-4">Distribución de Estudiantes</h2>
      <ul className="space-y-3">
        {Object.entries(distribucionPagos).map(([estado, cantidad]) => {
          const colors = {
            'Al día': 'bg-green-500',
            'Pendiente': 'bg-yellow-500',
            'Vencido': 'bg-red-500',
          };
          const total = totalEstudiantes > 0 ? totalEstudiantes : 1;
          const percentage = ((cantidad / total) * 100).toFixed(1);
          return (
            <li key={estado}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {estado} ({cantidad})
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${colors[estado as keyof typeof colors]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ResumenPagos;
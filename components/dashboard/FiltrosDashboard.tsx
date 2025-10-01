// components/dashboard/FiltrosDashboard.tsx

import React from 'react';
import { GrupoEdad } from '../../tipos';
import type { GrupoEdad as GrupoEdadType } from '../../tipos';

interface Props {
  filtros: {
    fechaInicio: string;
    fechaFin: string;
    grupo: GrupoEdadType | 'todos';
  };
  onFiltroChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onLimpiarFiltros: () => void;
}

const FiltrosDashboard: React.FC<Props> = ({ filtros, onFiltroChange, onLimpiarFiltros }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-tkd-blue mb-4">Filtros Personalizados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Desde (fecha ingreso)
          </label>
          <input
            type="date"
            name="fechaInicio"
            id="fechaInicio"
            value={filtros.fechaInicio}
            onChange={onFiltroChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasta (fecha ingreso)
          </label>
          <input
            type="date"
            name="fechaFin"
            id="fechaFin"
            value={filtros.fechaFin}
            onChange={onFiltroChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Grupo de Edad
          </label>
          <select
            name="grupo"
            id="grupo"
            value={filtros.grupo}
            onChange={onFiltroChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="todos">Todos los grupos</option>
            {Object.values(GrupoEdad).map(g => (
              g !== GrupoEdad.NoAsignado && <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={onLimpiarFiltros}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrosDashboard;
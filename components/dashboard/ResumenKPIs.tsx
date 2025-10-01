// components/dashboard/ResumenKPIs.tsx

import React, { useMemo } from 'react';
import type { Estudiante } from '../../tipos';
import { EstadoPago } from '../../tipos';
import { IconoEstudiantes } from '../Iconos';
import { formatearPrecio } from '../../utils/formatters';

const CardKPI: React.FC<{ titulo: string; valor: string | number; icono: React.ReactNode; color: string }> = ({ titulo, valor, icono, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icono}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{titulo}</p>
            <p className="text-2xl font-bold text-tkd-dark dark:text-white">{valor}</p>
        </div>
    </div>
);

interface Props {
  estudiantes: Estudiante[];
}

const ResumenKPIs: React.FC<Props> = ({ estudiantes }) => {
  const kpis = useMemo(() => {
    const totalEstudiantes = estudiantes.length;
    const pendientes = estudiantes.filter(e => e.estadoPago === EstadoPago.Pendiente).length;
    const vencidos = estudiantes.filter(e => e.estadoPago === EstadoPago.Vencido).length;
    const saldoDeudor = estudiantes.reduce((acc, e) => acc + e.saldoDeudor, 0);

    return { totalEstudiantes, pendientes, vencidos, saldoDeudor };
  }, [estudiantes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardKPI
        titulo="Total de Estudiantes"
        valor={kpis.totalEstudiantes}
        icono={<IconoEstudiantes className="w-6 h-6 text-blue-600" />}
        color="bg-blue-100 dark:bg-blue-900/50"
      />
      <CardKPI
        titulo="Pagos Pendientes"
        valor={kpis.pendientes}
        icono={<IconoEstudiantes className="w-6 h-6 text-yellow-600" />}
        color="bg-yellow-100 dark:bg-yellow-900/50"
      />
      <CardKPI
        titulo="Pagos Vencidos"
        valor={kpis.vencidos}
        icono={<IconoEstudiantes className="w-6 h-6 text-red-600" />}
        color="bg-red-100 dark:bg-red-900/50"
      />
      <CardKPI
        titulo="Saldo Deudor Total"
        valor={formatearPrecio(kpis.saldoDeudor)}
        icono={<span className="text-2xl font-bold text-green-600">$</span>}
        color="bg-green-100 dark:bg-green-900/50"
      />
    </div>
  );
};

export default ResumenKPIs;
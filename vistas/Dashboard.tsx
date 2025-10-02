// vistas/Dashboard.tsx
import React from 'react';
import { useDashboard } from '../hooks/useDashboard';

// Componentes
import SolicitudesCompraPendientes from '../components/dashboard/SolicitudesCompraPendientes';
import FiltrosDashboard from '../components/dashboard/FiltrosDashboard';
import ResumenKPIs from '../components/dashboard/ResumenKPIs';
import ProximosEventos from '../components/dashboard/ProximosEventos';
import ResumenPagos from '../components/dashboard/ResumenPagos';
import AccesosDirectos from '../components/dashboard/AccesosDirectos';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

const VistaDashboard: React.FC = () => {
    const {
        cargando,
        error,
        solicitudesCompra,
        filtros,
        filtrosActivos,
        datosFiltrados,
        cargandoAccion,
        recargarTodo,
        manejarGestionCompra,
        handleFiltroChange,
        limpiarFiltros,
    } = useDashboard();

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <Loader texto="Cargando dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                  <ErrorState mensaje={error} onReintentar={recargarTodo} />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white">
                Dashboard
                {filtrosActivos && (
                    <span className="text-xl text-tkd-red ml-0 sm:ml-3 mt-1 sm:mt-0 block sm:inline relative group cursor-help">
                        (Filtros Aplicados)
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            Los datos que se muestran (KPIs, eventos, etc.) están siendo filtrados por las opciones seleccionadas.
                        </span>
                    </span>
                )}
            </h1>

            <SolicitudesCompraPendientes
                solicitudes={solicitudesCompra}
                onGestionar={manejarGestionCompra}
                cargandoAccion={cargandoAccion}
            />

            <FiltrosDashboard
                filtros={filtros}
                onFiltroChange={handleFiltroChange}
                onLimpiarFiltros={limpiarFiltros}
            />

            <ResumenKPIs estudiantes={datosFiltrados.estudiantesFiltrados} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ProximosEventos eventos={datosFiltrados.eventosParaMostrar} />
                </div>

                <div className="space-y-8">
                    <ResumenPagos estudiantes={datosFiltrados.estudiantesFiltrados} />
                    <AccesosDirectos />
                </div>
            </div>
        </div>
    );
};

export default VistaDashboard;
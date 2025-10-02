// vistas/Estudiantes.tsx
import React from 'react';
import { useGestionEstudiantes } from '../hooks/useGestionEstudiantes';

// Componentes
import { IconoAgregar, IconoEstudiantes, IconoExportar } from '../components/Iconos';
import ModalConfirmacion from '../components/ModalConfirmacion';
import FormularioEstudiante from '../components/FormularioEstudiante';
import ModalVerFirma from '../components/ModalVerFirma';
import FiltrosEstudiantes from '../components/FiltrosEstudiantes';
import TablaEstudiantes from '../components/TablaEstudiantes';
import { TablaEstudiantesSkeleton } from '../components/skeletons/TablaEstudiantesSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';


export const VistaEstudiantes: React.FC = () => {
    const {
        estudiantes,
        estudiantesFiltrados,
        estudiantesPaginados,
        cargando,
        error,
        cargarEstudiantes,
        filtroNombre,
        setFiltroNombre,
        filtroGrupo,
        setFiltroGrupo,
        filtroEstado,
        setFiltroEstado,
        modalFormularioAbierto,
        estudianteEnEdicion,
        abrirFormulario,
        cerrarFormulario,
        guardarEstudiante,
        cargandoAccion,
        modalConfirmacionAbierto,
        estudianteAEliminar,
        abrirConfirmacionEliminar,
        cerrarConfirmacion,
        confirmarEliminacion,
        modalFirmaAbierto,
        firmaParaVer,
        abrirModalFirma,
        cerrarModalFirma,
        handleShareLink,
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        goToNextPage,
        goToPreviousPage,
        exportarCSV,
    } = useGestionEstudiantes();

    const renderContent = () => {
        if (cargando) return <TablaEstudiantesSkeleton />;
        if (error) return <ErrorState mensaje={error} onReintentar={cargarEstudiantes} />;

        const tieneEstudiantes = estudiantes.length > 0;
        const filtrosSinResultados = tieneEstudiantes && estudiantesFiltrados.length === 0;

        if (filtrosSinResultados) {
            return <EmptyState Icono={IconoEstudiantes} titulo="Sin resultados" mensaje="Ningún estudiante coincide con los filtros actuales. Prueba a cambiarlos o limpiarlos." />;
        }
        if (tieneEstudiantes) {
            return <TablaEstudiantes estudiantes={estudiantesPaginados} onEditar={abrirFormulario} onEliminar={abrirConfirmacionEliminar} onVerFirma={abrirModalFirma} onCompartirLink={handleShareLink} />;
        }
        return (
              <EmptyState Icono={IconoEstudiantes} titulo="Aún no hay estudiantes" mensaje="Empieza a gestionar tu escuela agregando tu primer estudiante.">
                <button onClick={() => abrirFormulario()} className="bg-tkd-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg">
                    <IconoAgregar className="w-5 h-5" /><span>Agregar Estudiante</span>
                </button>
            </EmptyState>
        );
    }

    const renderPaginacion = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                    Anterior
                </button>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        );
    };

    return (
        <div className="p-8">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-tkd-dark dark:text-white">Gestión de Estudiantes</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={exportarCSV}
                        disabled={estudiantesFiltrados.length === 0}
                        className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <IconoExportar className="w-5 h-5" />
                        <span>Exportar CSV</span>
                    </button>
                    <button onClick={() => abrirFormulario()} className="bg-tkd-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg">
                        <IconoAgregar className="w-5 h-5" /><span>Agregar Estudiante</span>
                    </button>
                </div>
            </div>

            <FiltrosEstudiantes filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre} filtroGrupo={filtroGrupo} setFiltroGrupo={setFiltroGrupo} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} />
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {estudiantesFiltrados.length > 0 ? (
                    <>
                    Mostrando <span className="font-bold text-tkd-dark dark:text-white">{startIndex + 1}</span>
                    -
                    <span className="font-bold text-tkd-dark dark:text-white">{Math.min(endIndex, estudiantesFiltrados.length)}</span> de <span className="font-bold text-tkd-dark dark:text-white">{estudiantesFiltrados.length}</span> estudiantes.
                    </>
                ) : (
                    <>
                    Mostrando <span className="font-bold text-tkd-dark dark:text-white">0</span> de <span className="font-bold text-tkd-dark dark:text-white">{estudiantes.length}</span> estudiantes.
                    </>
                )}
            </div>

            {renderContent()}
            {renderPaginacion()}

            {modalFormularioAbierto && <FormularioEstudiante abierto={modalFormularioAbierto} onCerrar={cerrarFormulario} onGuardar={guardarEstudiante} estudianteActual={estudianteEnEdicion} cargando={cargandoAccion} />}
            {modalConfirmacionAbierto && estudianteAEliminar && <ModalConfirmacion abierto={modalConfirmacionAbierto} titulo="Confirmar Eliminación" mensaje={`¿Estás seguro de que quieres dar de baja a ${estudianteAEliminar.nombres} ${estudianteAEliminar.apellidos}?`} onCerrar={cerrarConfirmacion} onConfirmar={confirmarEliminacion} cargando={cargandoAccion} />}
            {modalFirmaAbierto && firmaParaVer && <ModalVerFirma abierto={modalFirmaAbierto} onCerrar={cerrarModalFirma} firmaDigital={firmaParaVer.firma} nombreTutor={firmaParaVer.tutor} />}
        </div>
    );
};
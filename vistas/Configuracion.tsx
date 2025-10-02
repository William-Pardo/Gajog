// vistas/Configuracion.tsx
import React from 'react';
import { useGestionConfiguracion } from '../hooks/useGestionConfiguracion';

// Componentes
import { IconoAgregar, IconoEditar, IconoEliminar, IconoGuardar } from '../components/Iconos';
import ModalConfirmacion from '../components/ModalConfirmacion';
import FormularioUsuario from '../components/FormularioUsuario';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

const VistaConfiguracion: React.FC = () => {
    const {
        cargando,
        error,
        cargarConfiguracion,
        usuarios,
        usuariosFiltrados,
        localConfigClub,
        localConfigNotificaciones,
        cargandoAccion,
        filtroUsuario,
        setFiltroUsuario,
        modalUsuarioAbierto,
        usuarioEnEdicion,
        abrirFormularioUsuario,
        cerrarFormularioUsuario,
        guardarUsuarioHandler,
        modalConfirmacionAbierto,
        usuarioAEliminar,
        abrirConfirmacionEliminar,
        cerrarConfirmacion,
        confirmarEliminacion,
        handleConfigChange,
        guardarConfiguracionesHandler,
        setLocalConfigClub,
        setLocalConfigNotificaciones,
    } = useGestionConfiguracion();

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <Loader texto="Cargando configuraciones..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <ErrorState mensaje={error} onReintentar={cargarConfiguracion} />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-tkd-dark dark:text-white">
                Panel de Configuración
            </h1>

            {/* Configuraciones del Club */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-tkd-dark dark:text-white">Información del Club</h2>
                <form onSubmit={guardarConfiguracionesHandler} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombreClub" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre del Club
                            </label>
                            <input
                                type="text"
                                id="nombreClub"
                                name="nombreClub"
                                value={localConfigClub.nombreClub}
                                onChange={(e) => handleConfigChange(e, setLocalConfigClub)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ubicación
                            </label>
                            <input
                                type="text"
                                id="ubicacion"
                                name="ubicacion"
                                value={localConfigClub.ubicacion}
                                onChange={(e) => handleConfigChange(e, setLocalConfigClub)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                value={localConfigClub.telefono}
                                onChange={(e) => handleConfigChange(e, setLocalConfigClub)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={localConfigClub.email}
                                onChange={(e) => handleConfigChange(e, setLocalConfigClub)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Configuraciones de Notificaciones */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-tkd-dark dark:text-white">Configuraciones de Notificaciones</h2>
                <form onSubmit={guardarConfiguracionesHandler} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="diasRecordatorioPago" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Días para recordatorio de pago
                            </label>
                            <input
                                type="number"
                                id="diasRecordatorioPago"
                                name="diasRecordatorioPago"
                                value={localConfigNotificaciones.diasRecordatorioPago}
                                onChange={(e) => handleConfigChange(e, setLocalConfigNotificaciones)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="diasAvisoVencimiento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Días para aviso de vencimiento
                            </label>
                            <input
                                type="number"
                                id="diasAvisoVencimiento"
                                name="diasAvisoVencimiento"
                                value={localConfigNotificaciones.diasAvisoVencimiento}
                                onChange={(e) => handleConfigChange(e, setLocalConfigNotificaciones)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Gestión de Usuarios */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-tkd-dark dark:text-white">Gestión de Usuarios</h2>
                    <button
                        onClick={() => abrirFormularioUsuario()}
                        className="bg-tkd-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                        <IconoAgregar className="w-5 h-5" />
                        <span>Agregar Usuario</span>
                    </button>
                </div>

                {/* Filtro de usuarios */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre o email..."
                        value={filtroUsuario}
                        onChange={(e) => setFiltroUsuario(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Lista de usuarios */}
                <div className="space-y-3">
                    {usuariosFiltrados.map((usuario) => (
                        <div key={usuario.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-tkd-dark dark:text-white">{usuario.nombreUsuario}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{usuario.email}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{usuario.rol}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => abrirFormularioUsuario(usuario)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md transition-colors"
                                    title="Editar usuario"
                                >
                                    <IconoEditar className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => abrirConfirmacionEliminar(usuario)}
                                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
                                    title="Eliminar usuario"
                                >
                                    <IconoEliminar className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botón de guardar */}
            <div className="flex justify-end">
                <button
                    onClick={guardarConfiguracionesHandler}
                    disabled={cargandoAccion}
                    className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                    <IconoGuardar className="w-5 h-5" />
                    <span>{cargandoAccion ? 'Guardando...' : 'Guardar Configuraciones'}</span>
                </button>
            </div>

            {/* Modales */}
            {modalUsuarioAbierto && (
                <FormularioUsuario
                    abierto={modalUsuarioAbierto}
                    onCerrar={cerrarFormularioUsuario}
                    onGuardar={guardarUsuarioHandler}
                    usuarioActual={usuarioEnEdicion}
                    cargando={cargandoAccion}
                />
            )}

            {modalConfirmacionAbierto && usuarioAEliminar && (
                <ModalConfirmacion
                    abierto={modalConfirmacionAbierto}
                    titulo="Confirmar Eliminación"
                    mensaje={`¿Estás seguro de que quieres eliminar al usuario "${usuarioAEliminar.nombreUsuario}"?`}
                    onCerrar={cerrarConfirmacion}
                    onConfirmar={confirmarEliminacion}
                    cargando={cargandoAccion}
                />
            )}
        </div>
    );
};

export default VistaConfiguracion;
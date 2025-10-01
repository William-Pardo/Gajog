// vistas/Configuracion.tsx
import React from 'react';
import { useGestionConfiguracion } from '../hooks/useGestionConfiguracion';

// Componentes
import FormularioUsuario from '../components/FormularioUsuario';
import ModalConfirmacion from '../components/ModalConfirmacion';
import GestionNotificacionesPush from '../components/GestionNotificacionesPush';
import TablaUsuarios from '../components/TablaUsuarios'; // Importar el nuevo componente
import { IconoAgregar, IconoGuardar, IconoEstudiantes } from '../components/Iconos';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const VistaConfiguracion: React.FC = () => {
    const {
        cargando, error, cargarConfiguracion, usuarios, usuariosFiltrados,
        localConfigClub, localConfigNotificaciones, cargandoAccion, filtroUsuario, setFiltroUsuario,
        modalUsuarioAbierto, usuarioEnEdicion, abrirFormularioUsuario, cerrarFormularioUsuario, guardarUsuarioHandler,
        modalConfirmacionAbierto, usuarioAEliminar, abrirConfirmacionEliminar, cerrarConfirmacion, confirmarEliminacion,
        handleConfigChange, guardarConfiguracionesHandler, setLocalConfigClub, setLocalConfigNotificaciones,
    } = useGestionConfiguracion();

    const renderGestionUsuarios = () => {
        if (usuarios.length === 0 && !filtroUsuario) {
            return (
                <EmptyState Icono={IconoEstudiantes} titulo="No hay otros usuarios" mensaje="Puedes crear cuentas para otros miembros del equipo.">
                     <button onClick={() => abrirFormularioUsuario()} className="bg-tkd-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg">
                        <IconoAgregar className="w-5 h-5"/><span>Nuevo Usuario</span>
                    </button>
                </EmptyState>
            );
        }
        return (
            <>
                <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <input type="text" placeholder="Buscar por nombre o email..." value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 shadow-sm focus:ring-tkd-blue focus:border-tkd-blue transition-colors" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Mostrando <span className="font-bold text-tkd-dark dark:text-white">{usuariosFiltrados.length}</span> de <span className="font-bold text-tkd-dark dark:text-white">{usuarios.length}</span> usuarios.</div>
                </div>
                 <TablaUsuarios 
                    usuarios={usuariosFiltrados}
                    onEditar={abrirFormularioUsuario}
                    onEliminar={abrirConfirmacionEliminar}
                />
            </>
        );
    }

    if (cargando) return <div className="flex justify-center items-center h-full p-8"><Loader texto="Cargando configuración..." /></div>;
    if (error) return <div className="p-8"><ErrorState mensaje={error} onReintentar={cargarConfiguracion} /></div>;

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-tkd-dark dark:text-white">Configuración</h1>
                <button onClick={guardarConfiguracionesHandler} disabled={cargandoAccion} className="bg-tkd-red text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 inline-flex items-center justify-center space-x-2 shadow-md">
                    <IconoGuardar className="w-5 h-5" /><span>{cargandoAccion ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
                    <h2 className="text-xl font-bold text-tkd-blue">Gestión de Usuarios</h2>
                    <button onClick={() => abrirFormularioUsuario()} className="bg-tkd-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 inline-flex items-center space-x-2 shadow-sm">
                        <IconoAgregar className="w-5 h-5"/><span>Nuevo Usuario</span>
                    </button>
                </div>
                <div className="p-6 pt-4">{renderGestionUsuarios()}</div>
            </div>

            <GestionNotificacionesPush />

            <form onSubmit={guardarConfiguracionesHandler}>
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-tkd-blue p-6 pb-4 border-b dark:border-gray-700">Datos del Club y Contrato</h2>
                        <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="nit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">NIT</label>
                                <input type="text" name="nit" id="nit" value={localConfigClub.nit} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div>
                                <label htmlFor="representanteLegal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Representante Legal</label>
                                <input type="text" name="representanteLegal" id="representanteLegal" value={localConfigClub.representanteLegal} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="ccRepresentante" className="block text-sm font-medium text-gray-700 dark:text-gray-300">C.C. del Representante</label>
                                <input type="text" name="ccRepresentante" id="ccRepresentante" value={localConfigClub.ccRepresentante} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="lugarFirma" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lugar de Firma de Contratos</label>
                                <input type="text" name="lugarFirma" id="lugarFirma" value={localConfigClub.lugarFirma} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div>
                                <label htmlFor="duracionContratoMeses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duración Contrato (Meses)</label>
                                <input type="number" name="duracionContratoMeses" id="duracionContratoMeses" value={localConfigClub.duracionContratoMeses} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="valorMensualidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Mensualidad (COP)</label>
                                <input type="number" name="valorMensualidad" id="valorMensualidad" value={localConfigClub.valorMensualidad} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago (descripción)</label>
                                <input type="text" name="metodoPago" id="metodoPago" value={localConfigClub.metodoPago} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ej: Transferencia a Nequi 123..."/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="direccionClub" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección del Club</label>
                                <input type="text" name="direccionClub" id="direccionClub" value={localConfigClub.direccionClub} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div>
                                <label htmlFor="diasSuspension" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Días para Suspensión (Contrato)</label>
                                <input type="number" name="diasSuspension" id="diasSuspension" value={localConfigClub.diasSuspension} onChange={(e) => handleConfigChange(e, setLocalConfigClub)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-tkd-blue p-6 pb-4 border-b dark:border-gray-700">Notificaciones</h2>
                        <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="diaCobroMensual" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Día de cobro mensual</label>
                                <input type="number" name="diaCobroMensual" id="diaCobroMensual" min="1" max="28" value={localConfigNotificaciones.diaCobroMensual} onChange={(e) => handleConfigChange(e, setLocalConfigNotificaciones)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="diasAnticipoRecordatorio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anticipo para recordatorio (días)</label>
                                <input type="number" name="diasAnticipoRecordatorio" id="diasAnticipoRecordatorio" min="0" value={localConfigNotificaciones.diasAnticipoRecordatorio} onChange={(e) => handleConfigChange(e, setLocalConfigNotificaciones)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="diasGraciaSuspension" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Días de gracia para aviso</label>
                                <input type="number" name="diasGraciaSuspension" id="diasGraciaSuspension" min="0" value={localConfigNotificaciones.diasGraciaSuspension} onChange={(e) => handleConfigChange(e, setLocalConfigNotificaciones)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            
            {modalUsuarioAbierto && <FormularioUsuario abierto={modalUsuarioAbierto} onCerrar={cerrarFormularioUsuario} onGuardar={guardarUsuarioHandler} usuarioActual={usuarioEnEdicion} cargando={cargandoAccion} />}
            {modalConfirmacionAbierto && usuarioAEliminar && <ModalConfirmacion abierto={modalConfirmacionAbierto} titulo="Confirmar Eliminación" mensaje={`¿Eliminar al usuario "${usuarioAEliminar.nombreUsuario}"?`} onCerrar={cerrarConfirmacion} onConfirmar={confirmarEliminacion} cargando={cargandoAccion} />}
        </div>
    );
};

export default VistaConfiguracion;
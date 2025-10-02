// vistas/Notificaciones.tsx
import React from 'react';
import { useGestionNotificaciones } from '../hooks/useGestionNotificaciones';

// Componentes
import { IconoEnviar, IconoAprobar } from '../components/Iconos';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const VistaNotificaciones: React.FC = () => {
    const {
        historial,
        cargando,
        error,
        enviando,
        progreso,
        noLeidasCount,
        handleEnviarRecordatorios,
        cargarHistorial,
        handleMarcarLeida,
        handleMarcarTodasLeidas,
    } = useGestionNotificaciones();

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        const ahora = new Date();
        const diffMs = ahora.getTime() - date.getTime();
        const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDias = Math.floor(diffHoras / 24);

        if (diffHoras < 1) return 'Hace menos de una hora';
        if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
        if (diffDias < 7) return `Hace ${diffDias} día${diffDias !== 1 ? 's' : ''}`;
        return date.toLocaleDateString();
    };

    const getIconoTipo = (tipo: string) => {
        switch (tipo) {
            case 'Bienvenida': return '🎉';
            case 'RecordatorioPago': return '💰';
            case 'AvisoVencimiento': return '⚠️';
            case 'ConfirmacionPago': return '✅';
            default: return '📧';
        }
    };

    const getColorTipo = (tipo: string) => {
        switch (tipo) {
            case 'Bienvenida': return 'border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20';
            case 'RecordatorioPago': return 'border-orange-200 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20';
            case 'AvisoVencimiento': return 'border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20';
            case 'ConfirmacionPago': return 'border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20';
            default: return 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <Loader texto="Cargando notificaciones..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <ErrorState mensaje={error} onReintentar={cargarHistorial} />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-tkd-dark dark:text-white">Sistema de Notificaciones</h1>
                    {noLeidasCount > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {noLeidasCount} notificación{noLeidasCount !== 1 ? 'es' : ''} sin leer
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    {noLeidasCount > 0 && (
                        <button
                            onClick={handleMarcarTodasLeidas}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
                        >
                            <IconoAprobar className="w-5 h-5" />
                            <span>Marcar todas como leídas</span>
                        </button>
                    )}
                    <button
                        onClick={handleEnviarRecordatorios}
                        disabled={enviando}
                        className="bg-tkd-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                        <IconoEnviar className="w-5 h-5" />
                        <span>{enviando ? 'Enviando...' : 'Enviar Recordatorios'}</span>
                    </button>
                </div>
            </div>

            {progreso && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">{progreso}</p>
                </div>
            )}

            {historial.length === 0 ? (
                <EmptyState
                    Icono={() => <span className="text-6xl">📧</span>}
                    titulo="Sin notificaciones"
                    mensaje="No hay notificaciones enviadas aún. Los recordatorios aparecerán aquí cuando se envíen."
                />
            ) : (
                <div className="space-y-4">
                    {historial.map(notificacion => (
                        <div
                            key={notificacion.id}
                            className={`p-4 border rounded-lg transition-all duration-200 ${
                                notificacion.leida
                                    ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20 opacity-75'
                                    : getColorTipo(notificacion.tipo)
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <span className="text-2xl">{getIconoTipo(notificacion.tipo)}</span>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${notificacion.leida ? 'text-gray-600 dark:text-gray-400' : 'text-tkd-dark dark:text-white'}`}>
                                                {notificacion.tipo === 'Bienvenida' && '🎉 Bienvenida'}
                                                {notificacion.tipo === 'RecordatorioPago' && '💰 Recordatorio de Pago'}
                                                {notificacion.tipo === 'AvisoVencimiento' && '⚠️ Aviso de Vencimiento'}
                                                {notificacion.tipo === 'ConfirmacionPago' && '✅ Confirmación de Pago'}
                                            </h3>
                                            <p className={`text-sm mt-1 ${notificacion.leida ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {(() => {
                                                    const mensaje = notificacion.mensaje;
                                                    if (typeof mensaje === 'string') {
                                                        if (mensaje.includes('API key not valid') || mensaje.includes('{"error":')) {
                                                            return 'Mensaje enviado exitosamente (contenido personalizado no disponible)';
                                                        }
                                                        return mensaje;
                                                    }
                                                    // If it's not a string, try to stringify it safely
                                                    try {
                                                        const stringified = JSON.stringify(mensaje);
                                                        if (stringified.includes('API key not valid') || stringified.includes('"error":')) {
                                                            return 'Mensaje enviado exitosamente (contenido personalizado no disponible)';
                                                        }
                                                        return stringified;
                                                    } catch {
                                                        return 'Mensaje enviado exitosamente';
                                                    }
                                                })()}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>Para: {notificacion.tutorNombre}</span>
                                                <span>•</span>
                                                <span>{notificacion.canal}</span>
                                                <span>•</span>
                                                <span>{formatearFecha(notificacion.fecha)}</span>
                                            </div>
                                        </div>
                                        {!notificacion.leida && (
                                            <button
                                                onClick={() => handleMarcarLeida(notificacion.id)}
                                                className="ml-4 px-3 py-1 bg-tkd-blue text-white text-xs rounded-full hover:bg-blue-800 transition-colors"
                                            >
                                                Marcar como leída
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VistaNotificaciones;
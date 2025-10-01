// components/FilaEstudiante.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { Estudiante } from '../tipos';
import EstadoPagoBadge from './EstadoPagoBadge';
import { formatearPrecio } from '../utils/formatters';
import { IconoContrato, IconoImagen, IconoEnlace, IconoEditar, IconoEliminar, IconoOjoAbierto, IconoFirma } from './Iconos';

interface Props {
  estudiante: Estudiante;
  onEditar: (estudiante: Estudiante) => void;
  onEliminar: (estudiante: Estudiante) => void;
  onVerFirma: (firma: string, tutor: Estudiante['tutor']) => void;
  onCompartirLink: (tipo: 'firma' | 'contrato' | 'imagen', idEstudiante: string) => void;
  isCard: boolean;
}

export const FilaEstudiante: React.FC<Props> = ({
  estudiante,
  onEditar,
  onEliminar,
  onVerFirma,
  onCompartirLink,
  isCard,
}) => {
    const tutorNombreCompleto = estudiante.tutor ? `${estudiante.tutor.nombres} ${estudiante.tutor.apellidos}` : 'Tutor';

    const contenidoDocumentos = (
        <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
            {/* Grupo de iconos para Consentimiento de Riesgos */}
            <div className="flex items-center px-1.5 first:pl-0 last:pr-0">
                {estudiante.consentimientoInformado && estudiante.tutor?.firmaDigital ? (
                    <button onClick={() => onVerFirma(estudiante.tutor!.firmaDigital!, estudiante.tutor)} className="p-2 text-green-600 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-transform hover:scale-110" title={`Ver firma del consentimiento de riesgos`}>
                        <IconoOjoAbierto className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="p-2 w-9 h-9 flex items-center justify-center cursor-not-allowed" title="Consentimiento de riesgos pendiente">
                        <IconoFirma className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    </div>
                )}
                <button onClick={() => onCompartirLink('firma', estudiante.id)} className="p-2 text-gray-500 hover:text-tkd-blue dark:text-gray-400 dark:hover:text-blue-400 rounded-full transition-transform hover:scale-110" title="Compartir enlace de Consentimiento de Riesgos">
                    <IconoEnlace className="w-5 h-5" />
                </button>
            </div>

            {/* Grupo de iconos para Contrato de Servicios */}
            <div className="flex items-center px-1.5 first:pl-0 last:pr-0">
                {estudiante.contratoServiciosFirmado && estudiante.tutor?.firmaContratoDigital ? (
                    <button onClick={() => onVerFirma(estudiante.tutor!.firmaContratoDigital!, estudiante.tutor)} className="p-2 text-green-600 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-transform hover:scale-110" title={`Ver firma del contrato de servicios`}>
                        <IconoOjoAbierto className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="p-2 w-9 h-9 flex items-center justify-center cursor-not-allowed" title="Contrato de servicios pendiente">
                        <IconoContrato className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    </div>
                )}
                <button onClick={() => onCompartirLink('contrato', estudiante.id)} className="p-2 text-gray-500 hover:text-tkd-blue dark:text-gray-400 dark:hover:text-blue-400 rounded-full transition-transform hover:scale-110" title="Compartir enlace de Contrato de Servicios">
                    <IconoEnlace className="w-5 h-5" />
                </button>
            </div>
            
            {/* Grupo de iconos para Consentimiento de Imagen */}
            <div className="flex items-center px-1.5 first:pl-0 last:pr-0">
                 {estudiante.consentimientoImagenFirmado && estudiante.tutor?.firmaImagenDigital ? (
                    <button onClick={() => onVerFirma(estudiante.tutor!.firmaImagenDigital!, estudiante.tutor)} className="p-2 text-green-600 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-transform hover:scale-110" title={`Ver firma de autorización de imagen. Autoriza fotos: ${estudiante.consentimientoFotosVideos ? 'Sí' : 'No'}`}>
                       <IconoOjoAbierto className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="p-2 w-9 h-9 flex items-center justify-center cursor-not-allowed" title="Autorización de uso de imagen pendiente">
                       <IconoImagen className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    </div>
                )}
                <button onClick={() => onCompartirLink('imagen', estudiante.id)} className="p-2 text-gray-500 hover:text-tkd-blue dark:text-gray-400 dark:hover:text-blue-400 rounded-full transition-transform hover:scale-110" title="Compartir enlace de Autorización de Uso de Imagen">
                    <IconoEnlace className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const contenidoAcciones = (
        <div className="flex items-center space-x-1 justify-end">
            <button onClick={() => onEditar(estudiante)} className="p-2 text-tkd-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full transition-transform hover:scale-110" title="Editar"><IconoEditar className="w-5 h-5" /></button>
            <button onClick={() => onEliminar(estudiante)} className="p-2 text-tkd-red hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 rounded-full transition-transform hover:scale-110" title="Eliminar"><IconoEliminar className="w-5 h-5" /></button>
        </div>
    );

    if (isCard) {
      return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-4 space-y-3"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-tkd-dark dark:text-white">{estudiante.nombres} {estudiante.apellidos}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{estudiante.correo}</p>
                </div>
                {contenidoAcciones}
            </div>

            <div className="border-t dark:border-gray-700 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                    <strong className="text-gray-600 dark:text-gray-300">Grupo:</strong>
                    <span className="text-gray-800 dark:text-gray-100">{estudiante.grupo}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <strong className="text-gray-600 dark:text-gray-300">Pago:</strong>
                     <div>
                        <EstadoPagoBadge estado={estudiante.estadoPago} />
                        {estudiante.saldoDeudor > 0 && (
                            <span className="text-red-500 dark:text-red-400 ml-2 font-semibold">{formatearPrecio(estudiante.saldoDeudor)}</span>
                        )}
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <strong className="text-gray-600 dark:text-gray-300">Documentos:</strong>
                    {contenidoDocumentos}
                </div>
            </div>
        </motion.div>
      );
    }
    
    return (
    <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="dark:hover:bg-gray-700/50"
    >
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-tkd-dark dark:text-white">{estudiante.nombres} {estudiante.apellidos}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{estudiante.correo}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{estudiante.grupo}</td>
        <td className="px-6 py-4 whitespace-nowrap">
            <EstadoPagoBadge estado={estudiante.estadoPago} />
            {estudiante.saldoDeudor > 0 && (
                <div className="text-sm text-red-500 dark:text-red-400 mt-1">{formatearPrecio(estudiante.saldoDeudor)}</div>
            )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            {contenidoDocumentos}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
            {contenidoAcciones}
        </td>
    </motion.tr>
    );
};

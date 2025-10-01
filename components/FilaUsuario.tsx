// components/FilaUsuario.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { Usuario } from '../tipos';
import { IconoEditar, IconoEliminar } from './Iconos';

interface Props {
  usuario: Usuario;
  onEditar: (usuario: Usuario) => void;
  onEliminar: (usuario: Usuario) => void;
  isCard: boolean;
}

export const FilaUsuario: React.FC<Props> = ({ usuario, onEditar, onEliminar, isCard }) => {

  const contenidoAcciones = (
     <div className="flex items-center space-x-1 justify-end">
        <button onClick={() => onEditar(usuario)} className="p-2 text-tkd-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full transition-transform hover:scale-110" title="Editar"><IconoEditar className="w-5 h-5" /></button>
        <button onClick={() => onEliminar(usuario)} className="p-2 text-tkd-red hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 rounded-full transition-transform hover:scale-110" title="Eliminar"><IconoEliminar className="w-5 h-5" /></button>
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
                <p className="text-lg font-bold text-tkd-dark dark:text-white">{usuario.nombreUsuario}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</p>
            </div>
            {contenidoAcciones}
        </div>
        <div className="border-t dark:border-gray-700 pt-3 space-y-2 text-sm">
             <div className="flex justify-between">
                <strong className="text-gray-600 dark:text-gray-300">Rol:</strong>
                <span className="text-gray-800 dark:text-gray-100">{usuario.rol}</span>
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="dark:hover:bg-gray-700/50"
    >
        <td className="px-6 py-4 whitespace-nowrap font-medium text-tkd-dark dark:text-white">{usuario.nombreUsuario}</td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{usuario.email}</td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{usuario.rol}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
           {contenidoAcciones}
        </td>
    </motion.tr>
  );
};
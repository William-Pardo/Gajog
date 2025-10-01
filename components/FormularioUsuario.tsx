// components/FormularioUsuario.tsx
// Este componente es un formulario modal para que el administrador pueda crear y editar usuarios.

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Usuario } from '../tipos';
import { IconoCerrar, IconoCandado, IconoUsuario, IconoGuardar, IconoEmail } from './Iconos';
import FormInputError from './FormInputError';


interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (datos: { nombreUsuario: string, email: string, contrasena: string }, id?: string) => void;
  usuarioActual: Usuario | null;
  cargando: boolean;
}

const crearEsquemaValidacion = (esEdicion: boolean) => {
    return yup.object({
        nombreUsuario: yup.string().trim().required('El nombre de usuario es obligatorio.'),
        email: yup.string().email('Debe ser un correo válido.').required('El correo electrónico es obligatorio.'),
        contrasena: yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres.')
            .when([], {
                is: () => !esEdicion,
                then: (schema) => schema.required('La contraseña es obligatoria para nuevos usuarios.'),
                otherwise: (schema) => schema.optional(),
            }),
    }).required();
};

type FormData = {
    nombreUsuario: string;
    email: string;
    contrasena?: string;
};


const FormularioUsuario: React.FC<Props> = ({ abierto, onCerrar, onGuardar, usuarioActual, cargando }) => {
  const [visible, setVisible] = useState(false);

  const esEdicion = !!usuarioActual;
  const schema = crearEsquemaValidacion(esEdicion);
  
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormData>({
    // FIX: Removed the explicit generic type argument from yupResolver to fix type compatibility issues with recent versions of react-hook-form and @hookform/resolvers.
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (abierto) {
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [abierto]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
        reset();
        onCerrar();
    }, 200);
  };

  useEffect(() => {
    if (abierto) {
      if (usuarioActual) {
        reset({ nombreUsuario: usuarioActual.nombreUsuario, email: usuarioActual.email, contrasena: '' });
      } else {
        reset({ nombreUsuario: '', email: '', contrasena: '' });
      }
    }
  }, [abierto, usuarioActual, reset]);

  // FIX: Removed explicit parameter type to let TypeScript infer from `useForm<FormData>`, resolving handleSubmit compatibility errors.
  const onSubmit = (data: FormData) => {
    // Asegurarse de que no se envíe una cadena vacía como contraseña
    const datosParaGuardar = {
        nombreUsuario: data.nombreUsuario,
        email: data.email,
        contrasena: data.contrasena || '',
    };
    onGuardar(datosParaGuardar, usuarioActual?.id);
  };

  if (!abierto) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-200 ease-out ${visible ? 'bg-opacity-60' : 'bg-opacity-0'}`} aria-modal="true" role="dialog" onClick={handleClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col transform transition-all duration-200 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-tkd-dark dark:text-white">
            {usuarioActual ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 transition-transform hover:scale-110 active:scale-100">
            <IconoCerrar className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Solo se pueden crear o editar usuarios con el rol de "Usuario". La creación de administradores no está permitida desde esta interfaz.
            </p>
          <div>
            <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de usuario (para mostrar)</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconoUsuario className="w-5 h-5 text-gray-400" />
                </div>
                <input
                type="text"
                id="nombreUsuario"
                {...register('nombreUsuario')}
                className={`block w-full pl-10 pr-4 py-2 border rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white transition-colors ${errors.nombreUsuario ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-tkd-blue focus:border-tkd-blue'}`}
                />
            </div>
             <FormInputError mensaje={errors.nombreUsuario?.message} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico (para iniciar sesión)</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconoEmail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                type="email"
                id="email"
                {...register('email')}
                disabled={esEdicion}
                className={`block w-full pl-10 pr-4 py-2 border rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white transition-colors ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-tkd-blue focus:border-tkd-blue'} ${esEdicion ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
                />
            </div>
             <FormInputError mensaje={errors.email?.message} />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconoCandado className="w-5 h-5 text-gray-400" />
                </div>
                <input
                type="password"
                id="contrasena"
                {...register('contrasena')}
                placeholder={usuarioActual ? 'Dejar en blanco para no cambiar' : ''}
                className={`block w-full pl-10 pr-4 py-2 border rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors ${errors.contrasena ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-tkd-blue focus:border-tkd-blue'}`}
                />
            </div>
            <FormInputError mensaje={errors.contrasena?.message} />
          </div>
        </form>

        <footer className="p-4 border-t flex justify-end space-x-3 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || cargando}
            className="px-4 py-2 bg-tkd-red text-white rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <IconoGuardar className="w-5 h-5" />
            <span>{cargando ? 'Guardando...' : 'Guardar Usuario'}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FormularioUsuario;
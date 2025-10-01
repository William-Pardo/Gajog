// vistas/Login.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { IconoCandado, IconoOjoAbierto, IconoOjoCerrado, IconoEmail, IconoLogoOficial, IconoLogin } from '../components/Iconos';
import FormInputError from '../components/FormInputError';
import ModalRecuperarContrasena from '../components/ModalRecuperarContrasena';

const schema = yup.object({
    email: yup.string().email('Debe ser un correo válido.').required('El correo electrónico es obligatorio.'),
    contrasena: yup.string().required('La contraseña es obligatoria.'),
}).required();

type FormData = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const { login, error: errorLogin, isSubmitting } = useAuth();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [modalRecuperarAbierto, setModalRecuperarAbierto] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    // FIX: Removed the explicit generic type argument from yupResolver to fix type compatibility issues with recent versions of react-hook-form and @hookform/resolvers.
    resolver: yupResolver(schema),
    defaultValues: {
        email: '',
        contrasena: '',
    }
  });

  const manejarSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.contrasena);
    } catch (e) {
      // El error ya es manejado y almacenado en el AuthContext.
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-tkd-blue">
        <div className="w-full max-w-md p-8 space-y-8 bg-tkd-dark rounded-lg shadow-2xl">
          <div className="text-center">
              <IconoLogoOficial aria-label="Logo TaekwondoGa Jog" className="w-24 h-24 mx-auto" />
              <h2 className="mt-6 text-3xl font-bold text-white">
                  Bienvenido
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                  Inicia sesión en el Módulo de Gestión
              </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(manejarSubmit)}>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IconoEmail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full py-3 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 border rounded-md shadow-sm appearance-none focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600 focus:ring-tkd-blue focus:border-tkd-blue'}`}
                  placeholder="Correo Electrónico"
                  {...register('email')}
                />
              </div>
              <FormInputError mensaje={errors.email?.message} />
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconoCandado className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full py-3 pl-10 pr-10 text-white placeholder-gray-400 bg-gray-700 border rounded-md shadow-sm appearance-none focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 ${errors.contrasena ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600 focus:ring-tkd-blue focus:border-tkd-blue'}`}
                  placeholder="Contraseña"
                  {...register('contrasena')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {mostrarContrasena ? <IconoOjoCerrado className="w-5 h-5"/> : <IconoOjoAbierto className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <FormInputError mensaje={errors.contrasena?.message} />
            </div>

            <div className="text-right -mt-4">
              <button
                type="button"
                onClick={() => setModalRecuperarAbierto(true)}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:underline"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
            
            {errorLogin && <p className="text-sm text-center text-tkd-red">{errorLogin}</p>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative flex justify-center w-full px-4 py-3 text-sm font-semibold text-white border border-transparent rounded-md group bg-tkd-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tkd-red transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <IconoLogin className="w-5 h-5" />
                <span>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ModalRecuperarContrasena 
        abierto={modalRecuperarAbierto}
        onCerrar={() => setModalRecuperarAbierto(false)}
      />
    </>
  );
};

export default Login;
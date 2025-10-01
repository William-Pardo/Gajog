// components/FormularioEstudiante.tsx
// Este es un formulario modal completo para crear y editar estudiantes.

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Estudiante } from '../tipos';
import { GrupoEdad, EstadoPago } from '../tipos';
import { IconoCerrar, IconoGuardar, IconoInformacion } from './Iconos';
import FormInputError from './FormInputError';
import { useAutosave } from '../hooks/useAutosave';
import AutosavePrompt from './AutosavePrompt';


interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (estudiante: Estudiante) => Promise<void>;
  estudianteActual: Estudiante | null;
  cargando: boolean;
}

const calcularEdadYGrupo = (fechaNacimiento: string): { edad: number, grupo: GrupoEdad } => {
    if (!fechaNacimiento) return { edad: 0, grupo: GrupoEdad.NoAsignado };
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    if (isNaN(nacimiento.getTime())) return { edad: 0, grupo: GrupoEdad.NoAsignado };

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    if (edad >= 3 && edad <= 6) return { edad, grupo: GrupoEdad.Infantil };
    if (edad >= 7 && edad <= 12) return { edad, grupo: GrupoEdad.Precadetes };
    if (edad >= 13) return { edad, grupo: GrupoEdad.Cadetes };
    
    return { edad, grupo: GrupoEdad.NoAsignado };
};

const checkEsMenor = (fechaNacimiento: string): boolean => {
    if (!fechaNacimiento) return false;
    const { edad } = calcularEdadYGrupo(fechaNacimiento);
    return edad > 0 && edad < 18;
};

const schema = yup.object({
    nombres: yup.string().trim().required('Los nombres son obligatorios.'),
    apellidos: yup.string().trim().required('Los apellidos son obligatorios.'),
    numeroIdentificacion: yup.string().trim().required('El número de identificación es obligatorio.'),
    fechaNacimiento: yup.string().required('La fecha de nacimiento es obligatoria.'),
    grupo: yup.string().oneOf(Object.values(GrupoEdad)).required(),
    telefono: yup.string().trim().optional().default(''),
    correo: yup.string().trim().email('Debe ser un correo electrónico válido.')
        .when('fechaNacimiento', {
            is: (fecha: string) => !checkEsMenor(fecha),
            then: (schema) => schema.required('El correo es obligatorio para mayores de edad.'),
            otherwise: (schema) => schema.optional().default(''),
        }),
    fechaIngreso: yup.string().required(),
    estadoPago: yup.string().oneOf(Object.values(EstadoPago)).required(),
    saldoDeudor: yup.number().optional().default(0),
    
    // --- Consentimientos ---
    consentimientoInformado: yup.boolean().optional().default(false),
    contratoServiciosFirmado: yup.boolean().optional().default(false),
    consentimientoFotosVideos: yup.boolean().optional().default(false),
    consentimientoImagenFirmado: yup.boolean().optional().default(false)
        .when('consentimientoFotosVideos', {
            is: true,
            then: (schema) => schema.oneOf([true], 'Si se autoriza el uso de fotos, el documento de imagen debe marcarse como firmado.'),
            otherwise: (schema) => schema.oneOf([false], 'No se puede marcar el documento como firmado si no se autoriza el uso de fotos.'),
        }),

    alergias: yup.string().optional().default(''),
    lesiones: yup.string().optional().default(''),
    tutor: yup.object().when('fechaNacimiento', {
        is: (fecha: string) => checkEsMenor(fecha),
        then: (schema) => schema.shape({
            nombres: yup.string().trim().required('Los nombres del tutor son obligatorios.'),
            apellidos: yup.string().trim().required('Los apellidos del tutor son obligatorios.'),
            numeroIdentificacion: yup.string().trim().required('La identificación del tutor es obligatoria.'),
            telefono: yup.string().trim().required('El teléfono del tutor es obligatorio.'),
            correo: yup.string().trim().email('Debe ser un correo válido.').required('El correo del tutor es obligatorio.'),
        }).required(),
        otherwise: (schema) => schema.optional().nullable(),
    }),
    // Propiedades que no están en el formulario pero sí en el tipo `Estudiante`
    id: yup.string().optional(),
    historialPagos: yup.array().optional(),
}).required();

const FormularioEstudiante: React.FC<Props> = ({ abierto, onCerrar, onGuardar, estudianteActual, cargando }) => {
  const [visible, setVisible] = useState(false);

  const defaultValues: Estudiante = useMemo(() => {
    const estadoInicialEstudiante: Estudiante = {
        id: '',
        historialPagos: [],
        nombres: '',
        apellidos: '',
        numeroIdentificacion: '',
        fechaNacimiento: '',
        grupo: GrupoEdad.NoAsignado,
        telefono: '',
        correo: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        estadoPago: EstadoPago.AlDia,
        saldoDeudor: 0,
        consentimientoInformado: false,
        contratoServiciosFirmado: false,
        consentimientoImagenFirmado: false,
        consentimientoFotosVideos: false,
        tutor: {
            nombres: '',
            apellidos: '',
            numeroIdentificacion: '',
            telefono: '',
            correo: '',
        },
        alergias: '',
        lesiones: ''
    };
    return estudianteActual || estadoInicialEstudiante;
  }, [estudianteActual]);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, reset } = useForm<Estudiante>({
    // FIX: Removed generic type argument from yupResolver.
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues
  });
  
  const watchedFechaNacimiento = watch('fechaNacimiento');
  const esMenorDeEdad = useMemo(() => {
      const { edad } = calcularEdadYGrupo(watchedFechaNacimiento);
      return edad > 0 && edad < 18;
  }, [watchedFechaNacimiento]);

  const formKey = `draft-estudiante-${estudianteActual?.id || 'nuevo'}`;
  const { status: autosaveStatus, hasDraft, restoreDraft, clearDraft } = useAutosave({
    formKey,
    watch,
    reset
  });

  useEffect(() => {
    if (abierto) {
      if (!hasDraft) {
        reset(defaultValues);
      }
    }
  }, [abierto, defaultValues, reset, hasDraft]);

  useEffect(() => {
    if (abierto) {
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [abierto]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onCerrar(), 200);
  };

  useEffect(() => {
    const { grupo: grupoSugerido } = calcularEdadYGrupo(watchedFechaNacimiento);
    if(grupoSugerido !== watch('grupo')) {
        setValue('grupo', grupoSugerido, { shouldValidate: true });
    }
  }, [watchedFechaNacimiento, setValue, watch]);

  // FIX: Removed explicit type annotation to let TypeScript infer from `useForm<Estudiante>`, resolving handleSubmit compatibility errors.
  const onSubmit = async (data: Estudiante) => {
    const estudianteCompleto: Estudiante = {
        ...(estudianteActual || { id: '', historialPagos: [] }),
        ...data,
        tutor: esMenorDeEdad ? data.tutor : undefined,
    };
    try {
        await onGuardar(estudianteCompleto);
        clearDraft(); // Limpiar borrador solo si se guarda exitosamente
    } catch (error) {
        console.error("Fallo al guardar, el borrador se mantendrá.", error);
    }
  };

  const AutosaveStatusIndicator = () => {
    if (autosaveStatus === 'saving') return <span className="text-xs text-gray-500 dark:text-gray-400">Guardando borrador...</span>;
    if (autosaveStatus === 'saved') return <span className="text-xs text-green-600 dark:text-green-400">Borrador guardado ✓</span>;
    if (autosaveStatus === 'error') return <span className="text-xs text-red-500">Error al guardar borrador</span>;
    return null;
  };

  if (!abierto) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-200 ease-out ${visible ? 'bg-opacity-60' : 'bg-opacity-0'}`} aria-modal="true" role="dialog" onClick={handleClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[95vh] flex flex-col transform transition-all duration-200 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-tkd-dark dark:text-white">
            {estudianteActual ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 transition-transform hover:scale-110 active:scale-100">
            <IconoCerrar className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6">
            {hasDraft && <AutosavePrompt onRestore={restoreDraft} onDiscard={clearDraft} />}
            <fieldset className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <legend className="text-lg font-semibold text-tkd-blue px-2">Datos del Estudiante</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombres</label>
                        <input id="nombres" type="text" {...register('nombres')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.nombres ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.nombres?.message} />
                    </div>
                     <div>
                        <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellidos</label>
                        <input id="apellidos" type="text" {...register('apellidos')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.apellidos ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.apellidos?.message} />
                    </div>
                     <div>
                        <label htmlFor="numeroIdentificacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Identificación</label>
                        <input id="numeroIdentificacion" type="text" {...register('numeroIdentificacion')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.numeroIdentificacion ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.numeroIdentificacion?.message} />
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Nacimiento</label>
                        <input id="fechaNacimiento" type="date" {...register('fechaNacimiento')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.fechaNacimiento?.message} />
                    </div>
                    <div>
                        <div className="flex items-center space-x-1">
                            <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grupo (Edad: {calcularEdadYGrupo(watchedFechaNacimiento).edad || 'N/A'})</label>
                            <div className="relative group">
                                <IconoInformacion className="w-4 h-4 text-gray-400 cursor-help" />
                                <span className="absolute bottom-full mb-2 w-60 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                    El grupo se asigna automáticamente según la fecha de nacimiento.
                                </span>
                            </div>
                        </div>
                        <select {...register('grupo')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" disabled>
                            {Object.values(GrupoEdad).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                        <input type="tel" {...register('telefono')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"/>
                    </div>
                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                        <input id="correo" type="email" {...register('correo')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.correo ? 'border-red-500' : 'border-gray-300'}`}/>
                         <FormInputError mensaje={errors.correo?.message} />
                    </div>
                </div>
            </fieldset>

            {esMenorDeEdad && (
              <fieldset className="p-4 border border-blue-200 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <legend className="text-lg font-semibold text-tkd-blue px-2">Datos del Tutor (Obligatorio)</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label htmlFor="tutorNombres" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombres del Tutor</label>
                        <input id="tutorNombres" type="text" {...register('tutor.nombres')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.tutor?.nombres ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.tutor?.nombres?.message} />
                    </div>
                    <div>
                        <label htmlFor="tutorApellidos" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellidos del Tutor</label>
                        <input type="text" {...register('tutor.apellidos')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.tutor?.apellidos ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.tutor?.apellidos?.message} />
                    </div>
                    <div>
                        <label htmlFor="tutorNumeroIdentificacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Identificación del Tutor</label>
                        <input type="text" {...register('tutor.numeroIdentificacion')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.tutor?.numeroIdentificacion ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.tutor?.numeroIdentificacion?.message} />
                    </div>
                    <div>
                        <label htmlFor="tutorTelefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono del Tutor</label>
                        <input type="tel" {...register('tutor.telefono')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.tutor?.telefono ? 'border-red-500' : 'border-gray-300'}`}/>
                         <FormInputError mensaje={errors.tutor?.telefono?.message} />
                    </div>
                    <div>
                        <label htmlFor="tutorCorreo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo del Tutor</label>
                        <input type="email" {...register('tutor.correo')} className={`mt-1 block w-full border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.tutor?.correo ? 'border-red-500' : 'border-gray-300'}`}/>
                        <FormInputError mensaje={errors.tutor?.correo?.message} />
                    </div>
                </div>
              </fieldset>
            )}

            <fieldset className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <legend className="text-lg font-semibold text-tkd-blue px-2">Estado Administrativo y Consentimientos</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="consentimientoInformado" {...register('consentimientoInformado')} type="checkbox" className="focus:ring-tkd-blue h-4 w-4 text-tkd-blue border-gray-300 rounded"/>
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="consentimientoInformado" className="font-medium text-gray-700 dark:text-gray-300">Firmó Consentimiento de Riesgos</label>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="contratoServiciosFirmado" {...register('contratoServiciosFirmado')} type="checkbox" className="focus:ring-tkd-blue h-4 w-4 text-tkd-blue border-gray-300 rounded"/>
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="contratoServiciosFirmado" className="font-medium text-gray-700 dark:text-gray-300">Firmó Contrato de Servicios</label>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="consentimientoFotosVideos" {...register('consentimientoFotosVideos')} type="checkbox" className="focus:ring-tkd-blue h-4 w-4 text-tkd-blue border-gray-300 rounded"/>
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="consentimientoFotosVideos" className="font-medium text-gray-700 dark:text-gray-300">Autoriza Uso de Fotos/Videos</label>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Indica si el tutor autorizó el uso de imágenes.</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="consentimientoImagenFirmado" {...register('consentimientoImagenFirmado')} type="checkbox" className="focus:ring-tkd-blue h-4 w-4 text-tkd-blue border-gray-300 rounded"/>
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="consentimientoImagenFirmado" className="font-medium text-gray-700 dark:text-gray-300">Firmó Doc. de Imagen</label>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Indica si el documento de uso de imagen fue firmado.</p>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2">
                        <FormInputError mensaje={errors.consentimientoImagenFirmado?.message} />
                    </div>
                </div>
            </fieldset>

             <fieldset className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <legend className="text-lg font-semibold text-tkd-blue px-2">Datos Adicionales</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label htmlFor="alergias" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alergias</label>
                        <input type="text" {...register('alergias')} placeholder="Ej: Maní, Penicilina" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"/>
                    </div>
                     <div>
                        <label htmlFor="lesiones" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lesiones o condiciones médicas</label>
                        <input type="text" {...register('lesiones')} placeholder="Ej: Asma, lesión de rodilla" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"/>
                    </div>
                 </div>
            </fieldset>

        </form>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 sticky bottom-0 z-10">
          <div className="flex-grow">
            <AutosaveStatusIndicator />
          </div>
          <div className="flex space-x-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm">
              Cancelar
            </button>
            <button type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid || cargando} className="px-4 py-2 bg-tkd-red text-white rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
              <IconoGuardar className="w-5 h-5"/>
              <span>{cargando ? 'Guardando...' : 'Guardar Estudiante'}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FormularioEstudiante;
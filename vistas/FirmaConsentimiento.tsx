// vistas/FirmaConsentimiento.tsx
import React from 'react';
// FIX: Changed to namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { usePaginaFirma } from '../hooks/usePaginaFirma';
import { IconoLogoOficial, IconoFirma, IconoExitoAnimado } from '../components/Iconos';
import Loader from '@/components/Loader';

const VistaFirmaConsentimiento: React.FC = () => {
    const { idEstudiante } = ReactRouterDOM.useParams<{ idEstudiante: string }>();
    const {
        estudiante,
        cargando,
        error,
        enviando,
        enviadoConExito,
        firmaRealizada,
        canvasRef,
        textoDocumento,
        limpiarFirma,
        enviarFirma,
    } = usePaginaFirma({ idEstudiante, tipo: 'consentimiento' });


    const renderContent = () => {
        if (cargando) {
            return <Loader texto="Cargando datos del estudiante..." />;
        }
        if (error) {
            return <p className="text-center text-lg text-tkd-red">{error}</p>;
        }
        if (enviadoConExito) {
             return (
                <div className="text-center">
                    <IconoExitoAnimado className="mx-auto text-green-500" />
                    <h2 className="text-2xl font-bold text-green-600 mt-4">¡Gracias!</h2>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">El consentimiento informado para el estudiante <span className="font-semibold">{estudiante?.nombres} {estudiante?.apellidos}</span> ya ha sido registrado.</p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Ya puede cerrar esta ventana.</p>
                </div>
             );
        }
        if (!estudiante) {
            return <p className="text-center text-lg text-tkd-red">No se pudieron cargar los datos del estudiante.</p>;
        }

        return (
            <>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-tkd-dark dark:text-white">Consentimiento Informado de Riesgos</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Para la práctica de Taekwondo en la escuela TaekwondoGa Jog</p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-tkd-blue">¿Cómo firmar?</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-1">
                        <li>Lea atentamente el documento completo.</li>
                        <li>Realice su firma en el recuadro designado.</li>
                        <li>Haga clic en el botón "Acepto y Firmo" para enviar.</li>
                    </ol>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{textoDocumento}</p>
                </div>

                <div>
                    <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Firma del Tutor:</label>
                    <canvas
                        ref={canvasRef}
                        width="500"
                        height="200"
                        className="w-full border-2 border-dashed rounded-md bg-white cursor-crosshair hover:border-tkd-blue dark:hover:border-blue-400 transition-colors shadow-inner"
                        aria-label="Área de firma digital"
                    ></canvas>
                    <div className="mt-2 flex justify-end">
                        <button onClick={limpiarFirma} className="text-sm text-tkd-blue hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            Limpiar Firma
                        </button>
                    </div>
                </div>

                 <div>
                    <button
                        onClick={() => enviarFirma()}
                        disabled={!firmaRealizada || enviando}
                        className="w-full bg-tkd-red text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                    >
                        <IconoFirma className="w-6 h-6"/>
                        <span>{enviando ? 'Enviando...' : 'Acepto y Firmo el Consentimiento'}</span>
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-tkd-gray dark:bg-tkd-dark p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
                <div className="text-center mb-4">
                     <IconoLogoOficial aria-label="Logo TaekwondoGa Jog" className="w-24 h-24 mx-auto" />
                </div>
               {renderContent()}
            </div>
        </div>
    );
};

export default VistaFirmaConsentimiento;
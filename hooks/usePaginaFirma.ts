// hooks/usePaginaFirma.ts
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Estudiante, ConfiguracionClub } from '../tipos';
import * as api from '../servicios/api';
import { useNotificacion } from '../context/NotificacionContext';
import * as plantillas from '../servicios/plantillas';

type TipoFirma = 'consentimiento' | 'contrato' | 'imagen';

interface UsePaginaFirmaProps {
    idEstudiante: string | undefined;
    tipo: TipoFirma;
}

export const usePaginaFirma = ({ idEstudiante, tipo }: UsePaginaFirmaProps) => {
    const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
    const [configClub, setConfigClub] = useState<ConfiguracionClub | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [enviadoConExito, setEnviadoConExito] = useState(false);
    const { mostrarNotificacion } = useNotificacion();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [firmaRealizada, setFirmaRealizada] = useState(false);
    
    const cargarDatos = useCallback(async () => {
        if (!idEstudiante) {
            setError("No se proporcionó un ID de estudiante.");
            setCargando(false);
            return;
        }
        try {
            const [estudianteData, configData] = await Promise.all([
                api.obtenerEstudiantePorId(idEstudiante),
                api.obtenerConfiguracionClub()
            ]);
            
            // --- INICIO DE LA VALIDACIÓN ---
            if (!estudianteData.tutor) {
                setError("Este estudiante no es menor de edad o no tiene un tutor asignado. No se puede proceder con la firma.");
                setEstudiante(estudianteData);
                setConfigClub(configData);
                setCargando(false);
                return;
            }

            const { nombres, apellidos, numeroIdentificacion, telefono, correo } = estudianteData.tutor;
            // Refinamiento: se usa .trim() para asegurar que los campos no contengan solo espacios en blanco.
            if (!nombres?.trim() || !apellidos?.trim() || !numeroIdentificacion?.trim() || !telefono?.trim() || !correo?.trim()) {
                setError("Los datos del tutor están incompletos en nuestro sistema. Por favor, contacte a la administración de la escuela para actualizarlos antes de poder firmar este documento.");
                setEstudiante(estudianteData);
                setConfigClub(configData);
                setCargando(false);
                return;
            }
            // --- FIN DE LA VALIDACIÓN ---

            const yaFirmado = {
                consentimiento: estudianteData.consentimientoInformado && estudianteData.tutor?.firmaDigital,
                contrato: estudianteData.contratoServiciosFirmado && estudianteData.tutor?.firmaContratoDigital,
                imagen: estudianteData.consentimientoImagenFirmado && estudianteData.tutor?.firmaImagenDigital,
            };

            if (yaFirmado[tipo]) {
                setEnviadoConExito(true);
            }
            setEstudiante(estudianteData);
            setConfigClub(configData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido al cargar los datos.");
        } finally {
            setCargando(false);
        }
    }, [idEstudiante, tipo]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Lógica del lienzo de firma
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || enviadoConExito) return;

        const context = canvas.getContext('2d');
        if(!context) return;

        // Function to setup canvas size and scaling
        const setupCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const devicePixelRatio = window.devicePixelRatio || 1;

            // Set canvas size to match CSS display size
            canvas.width = rect.width;
            canvas.height = rect.height;

            // Reset transformation matrix
            context.setTransform(1, 0, 0, 1, 0, 0);

            // Scale for crisp rendering on high-DPI displays
            context.scale(devicePixelRatio, devicePixelRatio);

            // Set drawing properties with DPI-adjusted line width
            context.lineCap = 'round';
            context.strokeStyle = '#110e0f';
            context.lineWidth = 3 * devicePixelRatio;

            // Fill background with white (scaled)
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, rect.width, rect.height);
        };

        // Setup canvas initially
        setupCanvas();

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const getCoords = (e: PointerEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();

            // Get coordinates from pointer or first touch
            let clientX: number, clientY: number;
            if (e instanceof PointerEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else {
                // Touch event
                const touch = e.touches[0] || e.changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            }

            // Return coordinates relative to canvas display size
            // Context scaling handles the DPI adjustment
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const startDrawing = (e: PointerEvent | TouchEvent) => {
            e.preventDefault();
            isDrawing = true;
            setFirmaRealizada(true);
            const { x, y } = getCoords(e);
            [lastX, lastY] = [x, y];
        };

        const draw = (e: PointerEvent | TouchEvent) => {
            if (!isDrawing) return;
            e.preventDefault();
            const { x, y } = getCoords(e);
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.stroke();
            [lastX, lastY] = [x, y];
        };

        const stopDrawing = (e: PointerEvent | TouchEvent) => {
            isDrawing = false;
        };

        // Handle window resize to maintain proper canvas sizing
        const handleResize = () => {
            setupCanvas();
        };

        window.addEventListener('resize', handleResize);

        // Pointer events for desktop and some mobile devices
        canvas.addEventListener('pointerdown', startDrawing);
        canvas.addEventListener('pointermove', draw);
        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointerleave', stopDrawing);
        canvas.addEventListener('pointercancel', stopDrawing);

        // Touch events for mobile devices (fallback)
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing, { passive: false });

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('pointerdown', startDrawing);
            canvas.removeEventListener('pointermove', draw);
            canvas.removeEventListener('pointerup', stopDrawing);
            canvas.removeEventListener('pointerleave', stopDrawing);
            canvas.removeEventListener('pointercancel', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [cargando, enviadoConExito]);

    // Reinitialize canvas when theme changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const canvas = canvasRef.current;
            if (!canvas || enviadoConExito) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            // Re-setup canvas size and clear when theme changes
            const rect = canvas.getBoundingClientRect();
            const devicePixelRatio = window.devicePixelRatio || 1;

            canvas.width = rect.width;
            canvas.height = rect.height;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(devicePixelRatio, devicePixelRatio);
            context.lineCap = 'round';
            context.strokeStyle = '#110e0f';
            context.lineWidth = 3 * devicePixelRatio;

            // Fill background with white
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, rect.width, rect.height);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, [enviadoConExito]);

    const limpiarFirma = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (canvas && context) {
            // Get current display size
            const rect = canvas.getBoundingClientRect();
            const devicePixelRatio = window.devicePixelRatio || 1;

            // Reset canvas size and transformation
            canvas.width = rect.width;
            canvas.height = rect.height;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(devicePixelRatio, devicePixelRatio);

            // Reinitialize canvas settings
            context.lineCap = 'round';
            context.strokeStyle = '#110e0f';
            context.lineWidth = 3 * devicePixelRatio;

            // Fill background with white
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, rect.width, rect.height);

            setFirmaRealizada(false);
        }
    };
    
    const textoDocumento = useMemo(() => {
        if (!estudiante || !configClub) return "Cargando documento...";
        switch(tipo) {
            case 'consentimiento': return plantillas.generarTextoConsentimientoImagen(estudiante, configClub);
            case 'contrato': return plantillas.generarTextoContrato(estudiante, configClub);
            case 'imagen': return plantillas.generarTextoConsentimientoImagen(estudiante, configClub);
            default: return "";
        }
    }, [estudiante, configClub, tipo]);

    const isCanvasEmpty = (): boolean => {
        const canvas = canvasRef.current;
        if (!canvas) return true;
        const blankCanvas = document.createElement('canvas');
        blankCanvas.width = canvas.width;
        blankCanvas.height = canvas.height;
        return canvas.toDataURL() === blankCanvas.toDataURL();
    };

    const enviarFirma = async (autorizacionFotos?: boolean) => {
        if (isCanvasEmpty()) {
            mostrarNotificacion('La firma es requerida para poder enviar el documento.', 'error');
            return;
        }
        if (!canvasRef.current || !firmaRealizada || !idEstudiante) return;

        setEnviando(true);
        try {
            const firmaBase64 = canvasRef.current.toDataURL('image/png');
            let notificacionMsg = "";

            switch(tipo) {
                case 'consentimiento':
                    await api.guardarFirmaConsentimiento(idEstudiante, firmaBase64);
                    notificacionMsg = "Consentimiento enviado con éxito.";
                    break;
                case 'contrato':
                    await api.guardarFirmaContrato(idEstudiante, firmaBase64);
                    notificacionMsg = "Contrato firmado y enviado exitosamente.";
                    break;
                case 'imagen':
                    if (autorizacionFotos === undefined) throw new Error("Se requiere una elección de autorización.");
                    await api.guardarFirmaImagen(idEstudiante, firmaBase64, autorizacionFotos);
                    notificacionMsg = "Autorización de imagen guardada exitosamente.";
                    break;
            }
            
            setEnviadoConExito(true);
            mostrarNotificacion(notificacionMsg, "success");
        } catch (err) {
            const mensajeError = err instanceof Error ? err.message : `Error desconocido al guardar la ${tipo}.`;
            setError(mensajeError);
            mostrarNotificacion(mensajeError, "error");
        } finally {
            setEnviando(false);
        }
    };
    
    return {
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
    };
};
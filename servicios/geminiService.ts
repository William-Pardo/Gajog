// servicios/geminiService.ts
// Este servicio encapsula la lógica para comunicarse con la API de Google Gemini.
// Se utiliza para generar textos personalizados para las notificaciones.

import { GoogleGenAI } from "@google/genai";
import { TipoNotificacion, type Estudiante } from "../tipos";

// La clave API debe ser configurada como una variable de entorno.
// NO ALMACENAR LA CLAVE DIRECTAMENTE EN EL CÓDIGO.
// Se asume que `process.env.API_KEY` está disponible en el entorno de ejecución.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("La clave API de Gemini no está configurada. Las funciones de IA estarán deshabilitadas.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Genera un mensaje personalizado utilizando la IA de Gemini.
 * @param tipo - El tipo de notificación a generar.
 * @param estudiante - El objeto del estudiante para personalizar el mensaje.
 * @param datosAdicionales - Información extra como montos, conceptos o enlaces.
 * @returns El mensaje generado por la IA.
 */
export const generarMensajePersonalizado = async (
  tipo: TipoNotificacion,
  estudiante: Estudiante,
  datosAdicionales?: { monto?: number; concepto?: string; links?: { nombre: string; url: string }[] }
): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Modo de demostración: La función de IA está deshabilitada. Este es un mensaje de ejemplo.");
  }

  // Se construye el "prompt" (la instrucción) para la IA.
  const construirPrompt = (): string => {
    const nombreCompleto = `${estudiante.nombres} ${estudiante.apellidos}`;
    const nombreTutor = estudiante.tutor ? `${estudiante.tutor.nombres} ${estudiante.tutor.apellidos}` : 'Tutor';

    switch (tipo) {
      case TipoNotificacion.Bienvenida:
        let textoBaseBienvenida = `Escribe un mensaje de bienvenida cálido y motivador para un nuevo estudiante de Taekwondo llamado ${nombreCompleto}. El mensaje debe ser enviado a su tutor, ${nombreTutor}. Menciona el nombre de la escuela "TaekwondoGa Jog". Sé breve y amigable.`;
        
        if (datosAdicionales?.links && datosAdicionales.links.length > 0) {
            textoBaseBienvenida += "\n\nPara completar la inscripción, por favor, ayúdanos a firmar los siguientes documentos pendientes:";
            datosAdicionales.links.forEach(link => {
                textoBaseBienvenida += `\n- ${link.nombre}: ${link.url}`;
            });
        }
        return textoBaseBienvenida;
      case TipoNotificacion.AgradecimientoPago:
        return `Redacta un mensaje de agradecimiento para ${nombreTutor} por realizar un pago de ${datosAdicionales?.monto || 'un pago'} para el estudiante ${nombreCompleto}. El concepto del pago es "${datosAdicionales?.concepto || 'mensualidad'}". Agradece su compromiso con la escuela TaekwondoGa Jog.`;
      case TipoNotificacion.RecordatorioPago:
        return `Crea un recordatorio amigable para ${nombreTutor} sobre el pago pendiente de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datosAdicionales?.monto || 0)} para el estudiante ${nombreCompleto}. El mensaje debe ser cortés y mencionar que la fecha de pago se acerca. Firma como "Equipo TaekwondoGa Jog".`;
      case TipoNotificacion.AvisoVencimiento:
        return `Elabora un aviso formal pero comprensivo para ${nombreTutor} informando que el pago de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datosAdicionales?.monto || 0)} para el estudiante ${nombreCompleto} ha vencido. Menciona la importancia de regularizar la situación para continuar con las clases en TaekwondoGa Jog.`;
       case TipoNotificacion.ConfirmacionCompra:
        return `Redacta una notificación para ${nombreTutor} confirmando la compra de "${datosAdicionales?.concepto}" por un valor de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datosAdicionales?.monto || 0)} para el estudiante ${nombreCompleto}. Informa que el valor ha sido añadido a su saldo pendiente en la escuela TaekwondoGa Jog. Solicita amablemente que, una vez realizado el pago, envíe el comprobante a este mismo número de WhatsApp para validarlo. Agradece su inversión en el equipo para la práctica segura.`;
      case TipoNotificacion.ConfirmacionInscripcionEvento:
        return `Elabora un mensaje para ${nombreTutor} confirmando la inscripción del estudiante ${nombreCompleto} al evento "${datosAdicionales?.concepto}". Indica que el costo de inscripción de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datosAdicionales?.monto || 0)} ha sido cargado a su cuenta. Deséale éxito en la competencia. Firma como "Equipo TaekwondoGa Jog".`;
      case TipoNotificacion.SolicitudCompraAdmin:
        return `Redacta una notificación para el administrador de TaekwondoGa Jog. Informa que hay una NUEVA SOLICITUD DE COMPRA. El estudiante ${nombreCompleto} (tutor: ${nombreTutor}) ha solicitado el siguiente artículo: "${datosAdicionales?.concepto}". Pide al administrador que revise y apruebe la solicitud en el módulo de gestión.`;
      default:
        return "Escribe un mensaje genérico para la escuela TaekwondoGa Jog.";
    }
  };

  const prompt = construirPrompt();

  try {
    const response = await ai.models.generateContent({
      // FIX: Use the recommended model 'gemini-2.5-flash' as per the guidelines.
      model: "gemini-2.5-flash",
      contents: prompt,
       config: {
        systemInstruction: "Eres un asistente administrativo amigable y profesional para una escuela de Taekwondo llamada TaekwondoGa Jog. Tus mensajes son para los padres o tutores de los estudiantes. Deben ser claros, concisos y mantener un tono positivo y respetuoso.",
        temperature: 0.7,
      },
    });

    // FIX: Access the 'text' property directly on the response object, as per the documentation.
    return response.text;
  } catch (error) {
    console.error("Error al generar mensaje con Gemini:", error);
    return `Error: No se pudo generar el mensaje. Por favor, revise la configuración de la API. Detalles: ${error instanceof Error ? error.message : String(error)}`;
  }
};
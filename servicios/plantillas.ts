// servicios/plantillas.ts
// Este archivo centraliza las plantillas de texto para documentos como contratos.
// Modificar el texto aquí no requerirá cambios en la lógica de los componentes.

import type { Estudiante, ConfiguracionClub } from '../tipos';
import { formatearPrecio } from '../utils/formatters';


/**
 * Genera el texto completo para el contrato de prestación de servicios.
 * @param estudiante - El objeto del estudiante para el cual se genera el contrato.
 * @param configClub - La configuración del club con los datos dinámicos.
 * @returns El texto del contrato con los datos interpolados.
 */
export const generarTextoContrato = (estudiante: Estudiante, configClub: ConfiguracionClub): string => {
    if (!estudiante.tutor) return "Error: No se puede generar el contrato sin datos del tutor.";

    const fechaFirma = new Date();
    const dia = fechaFirma.getDate();
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mes = meses[fechaFirma.getMonth()];
    const anio = fechaFirma.getFullYear();

    const plantilla = `
🥋 CONTRATO DE PRESTACIÓN DE SERVICIOS DE FORMACIÓN DEPORTIVA
CLUB DEPORTIVO DE TAEKWONDO GA JOG

Entre los suscritos a saber:

El CLUB DEPORTIVO DE TAEKWONDO GA JOG, identificado con NIT ${configClub.nit}, representado legalmente por ${configClub.representanteLegal}, mayor de edad, identificado con cédula de ciudadanía No. ${configClub.ccRepresentante}, domiciliado en la ciudad de Bogotá D.C., quien en adelante se denominará EL PRESTADOR.

Y por otra parte, ${estudiante.tutor.nombres} ${estudiante.tutor.apellidos}, identificado(a) con C.C. No. ${estudiante.tutor.numeroIdentificacion}, en calidad de acudiente del(la) menor de edad ${estudiante.nombres} ${estudiante.apellidos}, identificado(a) con T.I./R.C. No. ${estudiante.numeroIdentificacion}, domiciliado(a) en ${configClub.direccionClub}, quien para efectos del presente contrato se denominará EL USUARIO.

Se ha convenido celebrar el presente contrato de prestación de servicios de formación deportiva, el cual se regirá por las siguientes cláusulas:

PRIMERA - Objeto:
El PRESTADOR se compromete a brindar al USUARIO el servicio de formación deportiva en la disciplina del Taekwondo estilo WT, bajo los principios y valores institucionales del Club Ga Jog, mediante clases dirigidas presenciales y/o virtuales según lo establecido en la programación del Club.

SEGUNDA - Duración:
El presente contrato tendrá una duración de ${configClub.duracionContratoMeses} meses, contados a partir de la fecha de firma, pudiendo renovarse previo acuerdo de las partes.

TERCERA - Valor y forma de pago:
El USUARIO pagará al PRESTADOR la suma mensual de ${formatearPrecio(configClub.valorMensualidad)}, dentro de los primeros cinco (5) días calendario de cada mes.
Los pagos se realizarán mediante ${configClub.metodoPago}. En caso de retraso, se aplicarán las medidas internas de notificación y suspensión temporales conforme al reglamento del Club.

CUARTA - Obligaciones del PRESTADOR:
Prestar el servicio en los horarios establecidos.
Contar con entrenadores calificados.
Promover una formación basada en valores y principios éticos.
Tomar medidas preventivas ante cualquier eventualidad, sin asumir responsabilidad por accidentes derivados de enfermedades o condiciones no informadas oportunamente.

QUINTA - Obligaciones del USUARIO y ACUDIENTE:
Cumplir con los horarios y reglamentos del Club.
Reportar al inicio del semestre información médica relevante: alergias, medicamentos, fracturas u otras condiciones que afecten la práctica.
Entregar copia del carné o certificado de afiliación a EPS, SISBÉN, medicina prepagada o póliza vigente, como respaldo para la atención en caso de emergencia.
Cancelar puntualmente los valores correspondientes.

SEXTA - Consentimiento informado:
El ACUDIENTE declara que ha sido informado de los riesgos inherentes a la práctica deportiva y que autoriza de manera voluntaria la participación del estudiante en las clases y actividades del Club. Así mismo, autoriza el uso de su imagen y la del estudiante para fines pedagógicos, institucionales y promocionales, siempre que no se vulnere su integridad o dignidad.

SÉPTIMA - Causales de suspensión o terminación:
El PRESTADOR podrá suspender o dar por terminado este contrato por:
Incumplimiento en el pago de más de ${configClub.diasSuspension} días calendario.
Comportamientos inapropiados del estudiante o acudiente.
Información falsa o no suministrada que ponga en riesgo la integridad del estudiante u otros miembros.

OCTAVA - Protección de datos personales:
En cumplimiento de la Ley 1581 de 2012, el ACUDIENTE y el ESTUDIANTE autorizan el tratamiento de los datos personales suministrados, únicamente para los fines propios del Club y su actividad formativa.

NOVENA - Cláusula compromisoria:
Las diferencias que se presenten entre las partes con ocasión del presente contrato serán resueltas amigablemente. En caso contrario, acudirán a los mecanismos de conciliación legalmente establecidos antes de iniciar cualquier acción judicial.

DÉCIMA - Domicilio contractual:
Las partes fijan como domicilio contractual la ciudad de Bogotá D.C.

En constancia de lo anterior, se firma en ${configClub.lugarFirma}, a los ${dia} días del mes de ${mes} del año ${anio}.

Atentamente,

_________________________
Firma de EL USUARIO (Acudiente)
${estudiante.tutor.nombres} ${estudiante.tutor.apellidos}
C.C. No. ${estudiante.tutor.numeroIdentificacion}
    `;
    
    return plantilla.trim();
};


/**
 * Genera el texto completo para el consentimiento de uso de imagen y datos.
 * @param estudiante - El objeto del estudiante para el cual se genera el consentimiento.
 * @param configClub - La configuración del club con los datos dinámicos.
 * @returns El texto del consentimiento con los datos interpolados.
 */
export const generarTextoConsentimientoImagen = (estudiante: Estudiante, configClub: ConfiguracionClub): string => {
    if (!estudiante.tutor) return "Error: No se puede generar el consentimiento sin datos del tutor.";

    const fechaFirma = new Date();
    const dia = fechaFirma.getDate();
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mes = meses[fechaFirma.getMonth()];
    const anio = fechaFirma.getFullYear();

    const plantilla = `
CONSENTIMIENTO INFORMADO PARA USO DE IMAGEN Y DATOS PERSONALES
(Menores de edad)

Yo, ${estudiante.tutor.nombres} ${estudiante.tutor.apellidos}, identificado(a) con C.C. No. ${estudiante.tutor.numeroIdentificacion}, en calidad de madre, padre o acudiente legal del (de la) menor ${estudiante.nombres} ${estudiante.apellidos}, identificado(a) con T.I./R.C. No. ${estudiante.numeroIdentificacion}, autorizo expresamente al Club Deportivo de Taekwondo Ga Jog, en adelante el Club, para:

1. Permitir la participación del menor en las actividades académicas, deportivas, recreativas y culturales desarrolladas por el Club, en sus sedes, espacios externos como parques o centros deportivos, y demás escenarios donde se lleven a cabo actividades formativas relacionadas con el objeto social del Club.

2. Hacer uso de la imagen del menor (fotografías, videos o grabaciones), captadas durante las actividades institucionales del Club, con fines de promoción, divulgación en medios digitales (redes sociales, página web), audiovisuales e impresos, y material institucional, con fines pedagógicos, formativos y promocionales, sin fines comerciales ni de lucro directo.

3. Usar los datos personales aquí registrados con fines informativos, administrativos y logísticos relacionados exclusivamente con la formación deportiva del menor, en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013, y demás normas concordantes de protección de datos personales.

Declaro haber leído y comprendido este consentimiento, y manifiesto que he recibido información clara, precisa y suficiente sobre su contenido, así como sobre el uso y tratamiento que se dará a la información del menor.

Se firma en ${configClub.lugarFirma}, a los ${dia} días del mes de ${mes} del año ${anio}.

Atentamente,

${estudiante.tutor.nombres} ${estudiante.tutor.apellidos}
C.C. No. ${estudiante.tutor.numeroIdentificacion}
    `;
    
    return plantilla.trim();
};
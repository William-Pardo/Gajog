// tipos.ts
// Este archivo contiene todas las definiciones de tipos e interfaces de TypeScript para la aplicación.
// Mantener los tipos centralizados mejora la mantenibilidad y la coherencia del código.

/**
 * Representa los roles de usuario dentro del sistema.
 */
export enum RolUsuario {
  Admin = 'Admin',
  Usuario = 'Usuario',
}

/**
 * Define la estructura de un objeto de usuario autenticado.
 */
export interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  rol: RolUsuario;
  fcmTokens?: string[];
}

/**
 * Grupos de edad para la clasificación de estudiantes.
 */
export enum GrupoEdad {
  Infantil = 'Infantil (3-6 años)',
  Precadetes = 'Precadetes (7-12 años)',
  Cadetes = 'Cadetes (≥ 13 años)',
  NoAsignado = 'No Asignado'
}

/**
 * Estado del pago de un estudiante.
 */
export enum EstadoPago {
  AlDia = 'Al día',
  Pendiente = 'Pendiente',
  Vencido = 'Vencido',
}

/**
 * Define la estructura para un pago registrado.
 */
export interface Pago {
  id: string;
  fecha: string; // formato YYYY-MM-DD
  monto: number;
  concepto: string; // Ej: "Mensualidad", "Uniforme", "Torneo"
}

/**
 * Define la estructura para los datos del tutor de un estudiante menor de edad.
 */
export interface DatosTutor {
  nombres: string;
  apellidos: string;
  numeroIdentificacion: string;
  telefono: string;
  correo: string;
  firmaDigital?: string; // URL de la imagen de la firma de consentimiento
  firmaContratoDigital?: string; // URL de la imagen de la firma de contrato
  firmaImagenDigital?: string; // URL de la imagen de la firma de uso de imagen
}

/**
 * Estructura principal para un estudiante de Taekwondo.
 */
export interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  numeroIdentificacion: string;
  fechaNacimiento: string; // formato YYYY-MM-DD
  grupo: GrupoEdad;
  telefono: string;
  correo: string;
  fechaIngreso: string; // formato YYYY-MM-DD
  estadoPago: EstadoPago;
  historialPagos: Pago[];
  saldoDeudor: number;
  consentimientoInformado: boolean;
  contratoServiciosFirmado: boolean;
  consentimientoImagenFirmado: boolean; // Nuevo campo para el nuevo consentimiento
  tutor?: DatosTutor;
  alergias?: string;
  lesiones?: string;
  consentimientoFotosVideos: boolean;
}

/**
 * Configuración de notificaciones y alertas.
 */
export interface ConfiguracionNotificaciones {
  diaCobroMensual: number;
  diasAnticipoRecordatorio: number;
  diasGraciaSuspension: number;
}

/**
 * Configuración de los datos del club para documentos.
 */
export interface ConfiguracionClub {
  nit: string;
  representanteLegal: string;
  ccRepresentante: string;
  lugarFirma: string;
  duracionContratoMeses: number;
  valorMensualidad: number;
  metodoPago: string;
  diasSuspension: number;
  direccionClub: string;
}

/**
 * Tipos de notificaciones que se pueden generar.
 */
export enum TipoNotificacion {
    Bienvenida,
    AgradecimientoPago,
    RecordatorioPago,
    AvisoVencimiento,
    ConfirmacionCompra,
    ConfirmacionInscripcionEvento,
    SolicitudCompraAdmin,
}

/**
 * Representa una variación de un implemento (ej: talla, color).
 */
export interface VariacionImplemento {
  id: string;
  descripcion: string; // "Talla M", "Con careta"
  precio: number;
}

/**
 * Categorías para los implementos de la tienda.
 */
export enum CategoriaImplemento {
  Uniformes = 'Uniformes',
  ProteccionTorso = 'Protección de Torso',
  ProteccionCabeza = 'Protección de Cabeza',
  ProteccionExtremidades = 'Protección de Extremidades',
  Accesorios = 'Accesorios',
}

/**
 * Representa un artículo de la tienda.
 */
export interface Implemento {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  variaciones: VariacionImplemento[];
  categoria: CategoriaImplemento;
}

/**
 * Representa un evento o torneo.
 */
export interface Evento {
  id: string;
  nombre: string;
  descripcion?: string;
  lugar: string;
  fechaInicioInscripcion: string; // YYYY-MM-DD
  fechaFinInscripcion: string; // YYYY-MM-DD
  fechaEvento: string; // YYYY-MM-DD
  valor: number;
  requisitos?: string;
  imagenUrl?: string;
  solicitudesPendientes?: number;
}

/**
 * Estado de una solicitud de inscripción a un evento.
 */
export enum EstadoSolicitud {
    Pendiente = 'Pendiente',
    Aprobada = 'Aprobada',
    Rechazada = 'Rechazada',
}

/**
 * Representa una solicitud de un estudiante para inscribirse a un evento.
 */
export interface SolicitudInscripcion {
  id: string;
  eventoId: string;
  estudiante: Estudiante; // Se desnormaliza para mostrar en el admin
  fechaSolicitud: string; // formato YYYY-MM-DD
  estado: EstadoSolicitud;
}

/**
 * Estado de una solicitud de compra de la tienda.
 */
export enum EstadoSolicitudCompra {
    Pendiente = 'Pendiente',
    Aprobada = 'Aprobada',
    Rechazada = 'Rechazada',
}

/**
 * Representa una solicitud de compra de un implemento por parte de un tutor.
 */
export interface SolicitudCompra {
    id: string;
    estudiante: Estudiante; // Se desnormaliza para mostrar en el admin
    implemento: Implemento;
    variacion: VariacionImplemento;
    fechaSolicitud: string; // formato YYYY-MM-DD
    estado: EstadoSolicitudCompra;
}

/**
 * Representa una notificación guardada en el historial.
 */
export interface NotificacionHistorial {
  id: string;
  fecha: string; // ISO string de la fecha de envío
  estudianteId: string;
  estudianteNombre: string; // Desnormalizado para fácil visualización
  tutorNombre: string; // Desnormalizado
  destinatario: string; // Teléfono o email
  canal: 'WhatsApp' | 'Email';
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
}
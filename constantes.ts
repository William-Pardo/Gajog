

// constantes.ts
// Este archivo almacena valores constantes que se utilizan en múltiples lugares de la aplicación.

import type { ConfiguracionNotificaciones, ConfiguracionClub } from './tipos';

export const CONFIGURACION_POR_DEFECTO: ConfiguracionNotificaciones = {
  diaCobroMensual: 1,
  diasAnticipoRecordatorio: 5,
  diasGraciaSuspension: 10,
};

export const CONFIGURACION_CLUB_POR_DEFECTO: ConfiguracionClub = {
  nit: '[NIT DEL CLUB PENDIENTE]',
  representanteLegal: '[NOMBRE REPRESENTANTE LEGAL PENDIENTE]',
  ccRepresentante: '[CC REPRESENTANTE PENDIENTE]',
  lugarFirma: 'Bogotá D.C.',
  duracionContratoMeses: 12,
  valorMensualidad: 180000,
  metodoPago: '[MÉTODO DE PAGO PENDIENTE]',
  diasSuspension: 30,
  direccionClub: '[DIRECCIÓN COMPLETA PENDIENTE]',
};


export const ADMIN_WHATSAPP = "3001112233";
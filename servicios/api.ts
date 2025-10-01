// servicios/api.ts
// Este archivo actúa como un "archivo barril" (barrel file) para la API.
// Re-exporta todas las funciones de los módulos de API específicos por dominio.
// Esto permite que el resto de la aplicación siga importando desde 'servicios/api'
// sin necesidad de cambiar las rutas de importación, encapsulando la estructura interna.

export * from './usuariosApi';
export * from './estudiantesApi';
export * from './tiendaApi';
export * from './eventosApi';
export * from './configuracionApi';
export * from './notificacionesApi';

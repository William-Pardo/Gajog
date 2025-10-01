// hooks/useDashboard.ts
import { useState, useMemo, useCallback } from 'react';
import type { SolicitudCompra, GrupoEdad } from '../tipos';
import { EstadoSolicitudCompra } from '../tipos';

import { useEstudiantes, useEventos, useTienda } from '../context/DataContext';
import { useNotificacion } from '../context/NotificacionContext';

export const useDashboard = () => {
    // Consumir datos de los contextos
    const { estudiantes, cargando: cargandoEstudiantes, error: errorEstudiantes, cargarEstudiantes } = useEstudiantes();
    const { eventos, cargando: cargandoEventos, error: errorEventos, cargarEventos } = useEventos();
    const { solicitudesCompra, cargando: cargandoTienda, error: errorTienda, gestionarSolicitudCompra, cargarDatosTienda } = useTienda();
    
    const { mostrarNotificacion } = useNotificacion();
    const [cargandoAccion, setCargandoAccion] = useState<Record<string, boolean>>({});
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        grupo: 'todos' as GrupoEdad | 'todos',
    });

    // Combinar estados de carga y error
    const cargando = cargandoEstudiantes || cargandoEventos || cargandoTienda;
    const error = errorEstudiantes || errorEventos || errorTienda;

    const recargarTodo = useCallback(() => {
        cargarEstudiantes();
        cargarEventos();
        cargarDatosTienda();
    }, [cargarEstudiantes, cargarEventos, cargarDatosTienda]);
    
    const datosFiltrados = useMemo(() => {
        let estudiantesFiltrados = [...estudiantes];
        let eventosFiltrados = [...eventos];
        
        if (filtros.grupo !== 'todos') {
            estudiantesFiltrados = estudiantesFiltrados.filter(e => e.grupo === filtros.grupo);
        }
        if (filtros.fechaInicio) {
            estudiantesFiltrados = estudiantesFiltrados.filter(e => e.fechaIngreso >= filtros.fechaInicio);
        }
        if (filtros.fechaFin) {
            estudiantesFiltrados = estudiantesFiltrados.filter(e => e.fechaIngreso <= filtros.fechaFin);
        }

        const hoy = new Date().toISOString().split('T')[0];
        let eventosParaMostrar = eventosFiltrados.filter(e => e.fechaEvento >= hoy);

        if(filtros.fechaInicio) {
            eventosParaMostrar = eventosParaMostrar.filter(e => e.fechaEvento >= filtros.fechaInicio);
        }
        if(filtros.fechaFin) {
            eventosParaMostrar = eventosParaMostrar.filter(e => e.fechaEvento <= filtros.fechaFin);
        }

        return {
            estudiantesFiltrados,
            eventosParaMostrar,
        };
    }, [estudiantes, eventos, filtros]);

    const manejarGestionCompra = async (solicitud: SolicitudCompra, nuevoEstado: EstadoSolicitudCompra) => {
        setCargandoAccion(prev => ({ ...prev, [solicitud.id]: true }));
        try {
          const estudianteActualizado = await gestionarSolicitudCompra(solicitud.id, nuevoEstado);
          if (estudianteActualizado) {
              await cargarEstudiantes(); // Recargar estudiantes para reflejar el cambio de saldo
          }
          mostrarNotificacion("Solicitud de compra gestionada.", "success");
        } catch (error) {
          mostrarNotificacion(`No se pudo procesar la solicitud: ${error instanceof Error ? error.message : "Error desconocido"}`, "error");
        } finally {
          setCargandoAccion(prev => ({ ...prev, [solicitud.id]: false }));
        }
    };

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            grupo: 'todos',
        });
    };
    
    const filtrosActivos = filtros.fechaInicio !== '' || filtros.fechaFin !== '' || filtros.grupo !== 'todos';

    return {
        cargando,
        error,
        solicitudesCompra,
        filtros,
        filtrosActivos,
        datosFiltrados,
        cargandoAccion,
        recargarTodo,
        manejarGestionCompra,
        handleFiltroChange,
        limpiarFiltros,
    };
};
// context/DataContext.tsx
import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import * as api from '../servicios/api';
import type { Estudiante, Evento, Implemento, SolicitudCompra, Usuario, ConfiguracionNotificaciones, ConfiguracionClub, VariacionImplemento } from '../tipos';
import { CONFIGURACION_POR_DEFECTO, CONFIGURACION_CLUB_POR_DEFECTO } from '../constantes';
import { useAuth } from './AuthContext';

// --- Helper para crear contextos ---
function createDataContext<T>(defaultValue: T) {
    return createContext<T | undefined>(defaultValue);
}

// --- Estudiantes Context ---
interface EstudiantesContextType {
    estudiantes: Estudiante[];
    cargando: boolean;
    error: string | null;
    cargarEstudiantes: () => Promise<void>;
    agregarEstudiante: (data: Estudiante) => Promise<Estudiante>;
    actualizarEstudiante: (data: Estudiante) => Promise<Estudiante>;
    eliminarEstudiante: (id: string) => Promise<void>;
}

const EstudiantesContext = createDataContext<EstudiantesContextType>({} as EstudiantesContextType);

export const EstudiantesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarEstudiantes = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await api.obtenerEstudiantes();
            setEstudiantes(data);
        } catch (err) {
            setError("No se pudieron cargar los estudiantes.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarEstudiantes();
    }, [cargarEstudiantes]);
    
    const agregarEstudiante = async (data: Estudiante) => {
        const nuevoEstudiante = await api.agregarEstudiante(data);
        await cargarEstudiantes(); // Recargar para mantener consistencia
        return nuevoEstudiante;
    };
    
    const actualizarEstudiante = async (data: Estudiante) => {
        const estudianteActualizado = await api.actualizarEstudiante(data);
        await cargarEstudiantes(); // Recargar para mantener consistencia
        return estudianteActualizado;
    };

    const eliminarEstudiante = async (id: string) => {
        await api.eliminarEstudiante(id);
        setEstudiantes(prev => prev.filter(e => e.id !== id));
    };

    return (
        <EstudiantesContext.Provider value={{ estudiantes, cargando, error, cargarEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante }}>
            {children}
        </EstudiantesContext.Provider>
    );
};
export const useEstudiantes = () => useContext(EstudiantesContext)!;

// --- Eventos Context ---
interface EventosContextType {
    eventos: Evento[];
    cargando: boolean;
    error: string | null;
    cargarEventos: () => Promise<void>;
    agregarEvento: (data: Omit<Evento, 'id'>) => Promise<Evento>;
    actualizarEvento: (data: Evento) => Promise<Evento>;
    eliminarEvento: (id: string) => Promise<void>;
}

const EventosContext = createDataContext<EventosContextType>({} as EventosContextType);

export const EventosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarEventos = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await api.obtenerEventos();
            setEventos(data.sort((a, b) => new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime()));
        } catch (err) {
            setError("No se pudieron cargar los eventos.");
        } finally {
            setCargando(false);
        }
    }, []);
    
    useEffect(() => {
        cargarEventos();
    }, [cargarEventos]);

    const agregarEvento = async (data: Omit<Evento, 'id'>) => {
        const nuevoEvento = await api.agregarEvento(data);
        await cargarEventos();
        return nuevoEvento;
    };
    
    const actualizarEvento = async (data: Evento) => {
        const eventoActualizado = await api.actualizarEvento(data);
        setEventos(prevEventos => 
            prevEventos.map(e => e.id === eventoActualizado.id ? eventoActualizado : e)
        );
        return eventoActualizado;
    };

    const eliminarEvento = async (id: string) => {
        await api.eliminarEvento(id);
        setEventos(prev => prev.filter(e => e.id !== id));
    };

    return (
        <EventosContext.Provider value={{ eventos, cargando, error, cargarEventos, agregarEvento, actualizarEvento, eliminarEvento }}>
            {children}
        </EventosContext.Provider>
    );
};
export const useEventos = () => useContext(EventosContext)!;

// --- Tienda Context ---
interface TiendaContextType {
    implementos: Implemento[];
    solicitudesCompra: SolicitudCompra[];
    cargando: boolean;
    error: string | null;
    cargarDatosTienda: () => Promise<void>;
    gestionarSolicitudCompra: (idSolicitud: string, nuevoEstado: any) => Promise<Estudiante | null>;
    registrarCompra: (idEstudiante: string, implemento: Implemento, variacion: VariacionImplemento) => Promise<Estudiante>;
}
const TiendaContext = createDataContext<TiendaContextType>({} as TiendaContextType);

export const TiendaProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [implementos, setImplementos] = useState<Implemento[]>([]);
    const [solicitudesCompra, setSolicitudesCompra] = useState<SolicitudCompra[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const cargarDatosTienda = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const [imp, sol] = await Promise.all([api.obtenerImplementos(), api.obtenerSolicitudesCompra()]);
            setImplementos(imp);
            setSolicitudesCompra(sol);
        } catch(err) {
            setError("Error al cargar datos de la tienda.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatosTienda();
    }, [cargarDatosTienda]);
    
    const gestionarSolicitudCompra = async (id: string, estado: any) => {
        const estudianteActualizado = await api.gestionarSolicitudCompra(id, estado);
        await cargarDatosTienda(); // recargar
        return estudianteActualizado;
    };

    const registrarCompra = async (id: string, implemento: Implemento, variacion: VariacionImplemento) => {
        return await api.registrarCompra(id, implemento, variacion);
    };
    
    return <TiendaContext.Provider value={{implementos, solicitudesCompra, cargando, error, cargarDatosTienda, gestionarSolicitudCompra, registrarCompra}}>
        {children}
    </TiendaContext.Provider>
}
export const useTienda = () => useContext(TiendaContext)!;

// --- Configuracion Context ---
interface ConfiguracionContextType {
    usuarios: Usuario[];
    configNotificaciones: ConfiguracionNotificaciones;
    configClub: ConfiguracionClub;
    cargando: boolean;
    error: string | null;
    guardarConfiguraciones: (confNotif: ConfiguracionNotificaciones, confClub: ConfiguracionClub) => Promise<void>;
    agregarUsuario: (datos: any) => Promise<void>;
    actualizarUsuario: (datos: any, id: string) => Promise<void>;
    eliminarUsuario: (id: string) => Promise<void>;
    cargarConfiguracion: () => Promise<void>;
}

const ConfiguracionContext = createDataContext<ConfiguracionContextType>({} as ConfiguracionContextType);

export const ConfiguracionProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [configNotificaciones, setConfigNotificaciones] = useState(CONFIGURACION_POR_DEFECTO);
    const [configClub, setConfigClub] = useState(CONFIGURACION_CLUB_POR_DEFECTO);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const { usuario: usuarioActual } = useAuth();

    const cargarConfiguracion = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const [users, confNotif, confClub] = await Promise.all([
                api.obtenerUsuarios(),
                api.obtenerConfiguracionNotificaciones(),
                api.obtenerConfiguracionClub(),
            ]);
            setUsuarios(users.filter(u => u.id !== usuarioActual?.id));
            setConfigNotificaciones(confNotif);
            setConfigClub(confClub);
        } catch(err) {
            setError("Error al cargar configuraciones.");
        } finally {
            setCargando(false);
        }
    }, [usuarioActual?.id]);

    useEffect(() => {
        cargarConfiguracion();
    }, [cargarConfiguracion]);

    const guardarConfiguraciones = async (confNotif: any, confClub: any) => {
        await Promise.all([
            api.guardarConfiguracionNotificaciones(confNotif),
            api.guardarConfiguracionClub(confClub)
        ]);
        setConfigNotificaciones(confNotif);
        setConfigClub(confClub);
    };

    const agregarUsuario = async (datos: any) => {
        await api.agregarUsuario(datos);
        await cargarConfiguracion();
    };
    const actualizarUsuario = async (datos: any, id: string) => {
        await api.actualizarUsuario(datos, id);
        await cargarConfiguracion();
    };
    const eliminarUsuario = async (id: string) => {
        await api.eliminarUsuario(id);
        await cargarConfiguracion();
    };

    return <ConfiguracionContext.Provider value={{usuarios, configNotificaciones, configClub, cargando, error, guardarConfiguraciones, agregarUsuario, actualizarUsuario, eliminarUsuario, cargarConfiguracion}}>
        {children}
    </ConfiguracionContext.Provider>
}
export const useConfiguracion = () => useContext(ConfiguracionContext)!;

// --- Provider Composer ---
const composeProviders = (...providers: React.ElementType[]): React.FC<{ children: ReactNode }> => {
    return ({ children }) => {
        return providers.reduceRight(
            (acc, Provider) => <Provider>{acc}</Provider>,
            children
        );
    };
};

export const DataProvider = composeProviders(
    EstudiantesProvider,
    EventosProvider,
    TiendaProvider,
    ConfiguracionProvider
);
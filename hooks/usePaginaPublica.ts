// hooks/usePaginaPublica.ts
import { useState, useEffect, useCallback } from 'react';

type Fetcher<T> = () => Promise<T>;

export const usePaginaPublica = <T>(fetcher: Fetcher<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudieron cargar los datos.");
        } finally {
            setCargando(false);
        }
    }, []); // Remove fetcher from dependencies to prevent infinite loops

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    return { data, cargando, error, cargarDatos };
};

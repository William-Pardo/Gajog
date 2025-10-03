// servicios/eventosApi.ts
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    writeBatch,
    orderBy
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, isFirebaseConfigured } from '../firebase/config';
import { EstadoPago, EstadoSolicitud } from '../tipos';
import type { Estudiante, Evento, SolicitudInscripcion } from '../tipos';
import { obtenerEstudiantePorId, obtenerEstudiantePorNumIdentificacion } from './estudiantesApi';

const eventosCollection = collection(db, 'eventos');
const solicitudesCollection = collection(db, 'solicitudesInscripcion');
const storage = getStorage();

const procesarImagenEvento = async (imagenUrl: string | undefined, eventoId: string): Promise<string> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Saltando subida de imagen de evento.");
        return imagenUrl || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }

    // Si no hay imagen, devolver string vacío
    if (!imagenUrl) {
        return '';
    }

    // Si la imagen ya es una URL de Firebase Storage, devolverla tal cual (no subir de nuevo)
    if (imagenUrl.startsWith('https://firebasestorage.googleapis.com')) {
        return imagenUrl;
    }

    // Si es una data URL, intentar subir a Storage con timeout para evitar demoras
    if (imagenUrl.startsWith('data:image')) {
        try {
            // Crear promesa con timeout de 5 segundos para evitar esperas largas
            const uploadPromise = (async () => {
                const storageRef = ref(storage, `eventos/${eventoId}/imagen_${Date.now()}`);
                const snapshot = await uploadString(storageRef, imagenUrl, 'data_url');
                return await getDownloadURL(snapshot.ref);
            })();

            const timeoutPromise = new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error('Upload timeout')), 5000)
            );

            return await Promise.race([uploadPromise, timeoutPromise]);
        } catch (error) {
            console.warn("Error al subir imagen del evento, usando data URL original:", error instanceof Error ? error.message : String(error));
            // Si falla la subida, devolver la data URL original para que el evento se guarde rápido
            return imagenUrl;
        }
    }

    return imagenUrl || '';
};

export const obtenerEventos = async (): Promise<Evento[]> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo lista de eventos vacía.");
        return [];
    }
    const q = query(eventosCollection, orderBy('fechaEvento', 'desc'));
    const [eventosSnap, solicitudesSnap] = await Promise.all([
        getDocs(q),
        getDocs(query(solicitudesCollection, where('estado', '==', EstadoSolicitud.Pendiente)))
    ]);
    
    const solicitudesPendientesMap = new Map<string, number>();
    solicitudesSnap.forEach(doc => {
        const solicitud = doc.data() as SolicitudInscripcion;
        solicitudesPendientesMap.set(solicitud.eventoId, (solicitudesPendientesMap.get(solicitud.eventoId) || 0) + 1);
    });

    return eventosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        solicitudesPendientes: solicitudesPendientesMap.get(doc.id) || 0,
    } as Evento));
};

export const obtenerEventoPorId = async (idEvento: string): Promise<Evento> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo evento mock.");
        return {
            id: idEvento,
            nombre: 'Evento Simulado',
            lugar: 'Lugar Simulado',
            fechaEvento: '2099-12-31',
            fechaInicioInscripcion: '2099-12-01',
            fechaFinInscripcion: '2099-12-15',
            valor: 50000,
            solicitudesPendientes: 0,
            descripcion: 'Esta es una descripción de un evento simulado porque la aplicación no está conectada a Firebase.',
            requisitos: 'Ser un usuario de prueba.',
        };
    }
    const docRef = doc(db, 'eventos', idEvento);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Evento;
    } else {
        throw new Error("Evento no encontrado.");
    }
};

export const agregarEvento = async (nuevoEventoData: Omit<Evento, 'id'>): Promise<Evento> => {
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Agregando evento.");
        return { id: `mock-evt-${Date.now()}`, ...nuevoEventoData };
    }
    const dataToSave = { ...nuevoEventoData, imagenUrl: '' };
    const docRef = await addDoc(eventosCollection, dataToSave);

    // Intentar procesar la imagen, pero no fallar si no se puede
    let imageUrl = '';
    try {
        imageUrl = await procesarImagenEvento(nuevoEventoData.imagenUrl, docRef.id);
        if (imageUrl !== nuevoEventoData.imagenUrl) {
            // Solo actualizar si la URL cambió (se subió exitosamente)
            await updateDoc(docRef, { imagenUrl: imageUrl });
        }
    } catch (error) {
        console.warn("No se pudo procesar la imagen del evento, guardando sin imagen:", error);
        imageUrl = nuevoEventoData.imagenUrl || '';
    }

    return { id: docRef.id, ...nuevoEventoData, imagenUrl: imageUrl };
};

export const actualizarEvento = async (eventoActualizado: Evento): Promise<Evento> => {
     console.log('DEBUG: actualizarEvento called with:', eventoActualizado);
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Actualizando evento.");
        return eventoActualizado;
    }
    const { id, ...data } = eventoActualizado;
    console.log('DEBUG: Extracted id:', id, 'data:', data);
    const docRef = doc(db, 'eventos', id);

    // Intentar procesar la imagen, pero no fallar si no se puede
    let imageUrl = data.imagenUrl || '';
    try {
        const processedUrl = await procesarImagenEvento(data.imagenUrl, id);
        if (processedUrl !== data.imagenUrl) {
            // Solo actualizar si la URL cambió (se subió exitosamente)
            imageUrl = processedUrl;
        }
    } catch (error) {
        console.warn("No se pudo procesar la imagen del evento, manteniendo imagen actual:", error);
        // Mantener la imagen actual
    }

    const dataToUpdate = { ...data, imagenUrl: imageUrl };
    console.log('DEBUG: Data to update:', dataToUpdate);
    try {
        await updateDoc(docRef, dataToUpdate);
        console.log('DEBUG: updateDoc successful');
        return { id, ...dataToUpdate };
    } catch (error) {
        console.error('DEBUG: updateDoc failed:', error);
        throw error;
    }
};

export const eliminarEvento = async (idEvento: string): Promise<void> => {
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Eliminando evento.");
        return;
    }
    const docRef = doc(db, 'eventos', idEvento);
    await deleteDoc(docRef);
};

export const crearSolicitudInscripcion = async (idEvento: string, numIdentificacion: string): Promise<SolicitudInscripcion> => {
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Creando solicitud de inscripción.");
        const estudiante = await obtenerEstudiantePorNumIdentificacion(numIdentificacion);
        return {
            id: `mock-si-${Date.now()}`,
            eventoId: idEvento,
            estudiante,
            fechaSolicitud: new Date().toISOString(),
            estado: EstadoSolicitud.Pendiente
        };
    }
    const estudiante = await obtenerEstudiantePorNumIdentificacion(numIdentificacion);
    
    const q = query(solicitudesCollection, where("eventoId", "==", idEvento), where("estudiante.id", "==", estudiante.id));
    const existing = await getDocs(q);
    if (!existing.empty) {
        throw new Error("Ya existe una solicitud para este estudiante en este evento.");
    }

    const nuevaSolicitudData = {
        eventoId: idEvento,
        estudiante: {
            id: estudiante.id,
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
        },
        fechaSolicitud: new Date().toISOString(),
        estado: EstadoSolicitud.Pendiente,
    };
    
    const docRef = await addDoc(solicitudesCollection, nuevaSolicitudData);
    return { id: docRef.id, ...nuevaSolicitudData } as unknown as SolicitudInscripcion;
};

export const obtenerSolicitudesPorEvento = async (idEvento: string): Promise<SolicitudInscripcion[]> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo lista de solicitudes vacía.");
        return [];
    }
    const q = query(solicitudesCollection, where("eventoId", "==", idEvento), where("estado", "==", EstadoSolicitud.Pendiente));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SolicitudInscripcion));
};

export const gestionarSolicitud = async (idSolicitud: string, nuevoEstado: EstadoSolicitud): Promise<Estudiante | null> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Gestionando solicitud de inscripción.");
        if (nuevoEstado === EstadoSolicitud.Aprobada) {
            return await obtenerEstudiantePorId('mock-id');
        }
        return null;
    }
    const solicitudDocRef = doc(db, 'solicitudesInscripcion', idSolicitud);
    const solicitudSnap = await getDoc(solicitudDocRef);
    if (!solicitudSnap.exists()) {
        throw new Error("Solicitud no encontrada.");
    }

    const solicitud = solicitudSnap.data() as SolicitudInscripcion;
    
    const batch = writeBatch(db);
    batch.update(solicitudDocRef, { estado: nuevoEstado });

    if (nuevoEstado === EstadoSolicitud.Aprobada) {
        const [evento, estudiante] = await Promise.all([
            obtenerEventoPorId(solicitud.eventoId),
            obtenerEstudiantePorId(solicitud.estudiante.id)
        ]);
        
        const estudianteDocRef = doc(db, 'estudiantes', solicitud.estudiante.id);
        const nuevoSaldo = estudiante.saldoDeudor + evento.valor;
        const nuevoEstadoPago = (estudiante.estadoPago === EstadoPago.AlDia && evento.valor > 0)
            ? EstadoPago.Pendiente
            : estudiante.estadoPago;

        batch.update(estudianteDocRef, {
            saldoDeudor: nuevoSaldo,
            estadoPago: nuevoEstadoPago,
        });

        await batch.commit();
        return { ...estudiante, saldoDeudor: nuevoSaldo, estadoPago: nuevoEstadoPago };
    } else {
        await batch.commit();
        return null;
    }
};

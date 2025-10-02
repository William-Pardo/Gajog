// servicios/estudiantesApi.ts
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { Estudiante } from '../tipos';
import { GrupoEdad, EstadoPago } from '../tipos';

const estudiantesCollection = collection(db, 'estudiantes');
const storage = getStorage();

const uploadFirma = async (idEstudiante: string, firmaBase64: string, tipo: 'consentimiento' | 'contrato' | 'imagen'): Promise<string> => {
    if (!isFirebaseConfigured) {
      console.warn("MODO SIMULADO: Saltando subida de firma a Firebase Storage.");
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
    const storageRef = ref(storage, `firmas/${idEstudiante}/${tipo}_${Date.now()}.png`);
    const finalBase64 = firmaBase64.startsWith('data:') ? firmaBase64 : `data:image/png;base64,${firmaBase64}`;
    const snapshot = await uploadString(storageRef, finalBase64, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

export const obtenerEstudiantes = async (): Promise<Estudiante[]> => {
    console.log(`obtenerEstudiantes - isFirebaseConfigured: ${isFirebaseConfigured}`);
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo lista de estudiantes vacía.");
        return [];
    }
    console.log("obtenerEstudiantes - Ejecutando consulta a Firestore...");
    const snapshot = await getDocs(estudiantesCollection);
    console.log(`obtenerEstudiantes - Snapshot obtenido con ${snapshot.docs.length} documentos`);
    const estudiantes = snapshot.docs.map(doc => {
        const data = doc.data();
        // Eliminar el campo id de los datos si existe para evitar sobrescribir el ID real del documento
        delete data.id;
        const estudiante = { id: doc.id, ...data } as Estudiante;
        console.log(`Estudiante mapeado - ID: ${doc.id}, Nombres: ${estudiante.nombres} ${estudiante.apellidos}, ID final: ${estudiante.id}`);
        return estudiante;
    });
    console.log(`Total estudiantes obtenidos: ${estudiantes.length}, IDs finales:`, estudiantes.map(e => e.id));
    return estudiantes;
};

export const obtenerEstudiantePorId = async (idEstudiante: string): Promise<Estudiante> => {
     if (!isFirebaseConfigured) {
        console.warn(`MODO SIMULADO: Devolviendo estudiante mock para ID: ${idEstudiante}`);
         const mockEstudiante: Estudiante = {
            id: idEstudiante,
            historialPagos: [],
            nombres: 'Estudiante',
            apellidos: 'Simulado',
            numeroIdentificacion: '00000',
            fechaNacimiento: '2010-01-01',
            grupo: GrupoEdad.Precadetes,
            telefono: '3001234567',
            correo: 'simulado@test.com',
            fechaIngreso: new Date().toISOString().split('T')[0],
            estadoPago: EstadoPago.AlDia,
            saldoDeudor: 0,
            consentimientoInformado: false,
            contratoServiciosFirmado: false,
            consentimientoImagenFirmado: false,
            consentimientoFotosVideos: false,
            tutor: {
                nombres: 'Tutor',
                apellidos: 'Simulado',
                numeroIdentificacion: '111111',
                telefono: '3001234568',
                correo: 'tutor.simulado@test.com',
            },
            alergias: '',
            lesiones: '',
        };
        return mockEstudiante;
    }
    const docRef = doc(db, 'estudiantes', idEstudiante);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Estudiante;
    } else {
        throw new Error("Estudiante no encontrado.");
    }
};

export const obtenerEstudiantePorNumIdentificacion = async (numIdentificacion: string): Promise<Estudiante> => {
     if (!isFirebaseConfigured) {
        console.warn(`MODO SIMULADO: Devolviendo estudiante mock para ID Nro: ${numIdentificacion}`);
        return obtenerEstudiantePorId('mock-id');
    }
    const q = query(estudiantesCollection, where("numeroIdentificacion", "==", numIdentificacion.trim()));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("No se encontró un estudiante con ese número de identificación.");
    }
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Estudiante;
};

export const agregarEstudiante = async (nuevoEstudiante: Omit<Estudiante, 'id' | 'historialPagos'>): Promise<Estudiante> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Agregando estudiante.");
        return { ...nuevoEstudiante, id: `mock-${Date.now()}`, historialPagos: [] };
    }
    const estudianteParaGuardar = {
        ...nuevoEstudiante,
        historialPagos: [],
    };
    const docRef = await addDoc(estudiantesCollection, estudianteParaGuardar);
    return { id: docRef.id, ...estudianteParaGuardar };
};

export const actualizarEstudiante = async (estudianteActualizado: Estudiante): Promise<Estudiante> => {
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Actualizando estudiante.");
        return estudianteActualizado;
    }
    const { id, ...data } = estudianteActualizado;
    const docRef = doc(db, 'estudiantes', id);
    await updateDoc(docRef, data);
    return estudianteActualizado;
};

export const eliminarEstudiante = async (idEstudiante: string): Promise<void> => {
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Eliminando estudiante.");
        return;
    }
    const docRef = doc(db, 'estudiantes', idEstudiante);
    await deleteDoc(docRef);
};

export const guardarFirmaConsentimiento = async (idEstudiante: string, firmaDigital: string): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Guardando firma de consentimiento.");
        return;
    }
    const estudiante = await obtenerEstudiantePorId(idEstudiante);
    if (!estudiante.tutor) throw new Error("El estudiante no tiene un tutor asignado para firmar.");
    
    const urlFirma = await uploadFirma(idEstudiante, firmaDigital, 'consentimiento');

    const docRef = doc(db, 'estudiantes', idEstudiante);
    await updateDoc(docRef, {
        consentimientoInformado: true,
        'tutor.firmaDigital': urlFirma
    });
};

export const guardarFirmaContrato = async (idEstudiante: string, firmaDigital: string): Promise<void> => {
     if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Guardando firma de contrato.");
        return;
    }
    const estudiante = await obtenerEstudiantePorId(idEstudiante);
    if (!estudiante.tutor) throw new Error("El estudiante no tiene un tutor asignado para firmar.");

    const urlFirma = await uploadFirma(idEstudiante, firmaDigital, 'contrato');

    const docRef = doc(db, 'estudiantes', idEstudiante);
    await updateDoc(docRef, {
        contratoServiciosFirmado: true,
        'tutor.firmaContratoDigital': urlFirma
    });
};

export const guardarFirmaImagen = async (idEstudiante: string, firmaDigital: string, autorizaFotos: boolean): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Guardando firma de imagen.");
        return;
    }
    const estudiante = await obtenerEstudiantePorId(idEstudiante);
    if (!estudiante.tutor) throw new Error("El estudiante no tiene un tutor asignado para firmar.");

    const urlFirma = await uploadFirma(idEstudiante, firmaDigital, 'imagen');

    const docRef = doc(db, 'estudiantes', idEstudiante);
    await updateDoc(docRef, {
        consentimientoImagenFirmado: true,
        consentimientoFotosVideos: autorizaFotos,
        'tutor.firmaImagenDigital': urlFirma
    });
};

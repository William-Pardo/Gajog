// servicios/configuracionApi.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { ConfiguracionNotificaciones, ConfiguracionClub } from '../tipos';
import { CONFIGURACION_POR_DEFECTO, CONFIGURACION_CLUB_POR_DEFECTO } from '../constantes';

const configNotificacionesRef = doc(db, 'configuracion', 'notificaciones');
const configClubRef = doc(db, 'configuracion', 'club');

export const obtenerConfiguracionNotificaciones = async (): Promise<ConfiguracionNotificaciones> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo configuración de notificaciones por defecto.");
        return CONFIGURACION_POR_DEFECTO;
    }
    const docSnap = await getDoc(configNotificacionesRef);
    if (docSnap.exists()) {
        return docSnap.data() as ConfiguracionNotificaciones;
    } else {
        await setDoc(configNotificacionesRef, CONFIGURACION_POR_DEFECTO);
        return CONFIGURACION_POR_DEFECTO;
    }
};

export const guardarConfiguracionNotificaciones = async (config: ConfiguracionNotificaciones): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Guardando configuración de notificaciones.");
        return;
    }
    await setDoc(configNotificacionesRef, config, { merge: true });
};

export const obtenerConfiguracionClub = async (): Promise<ConfiguracionClub> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo configuración de club por defecto.");
        return CONFIGURACION_CLUB_POR_DEFECTO;
    }
    const docSnap = await getDoc(configClubRef);
    if (docSnap.exists()) {
        return docSnap.data() as ConfiguracionClub;
    } else {
        await setDoc(configClubRef, CONFIGURACION_CLUB_POR_DEFECTO);
        return CONFIGURACION_CLUB_POR_DEFECTO;
    }
};

export const guardarConfiguracionClub = async (config: ConfiguracionClub): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Guardando configuración de club.");
        return;
    }
    await setDoc(configClubRef, config, { merge: true });
};

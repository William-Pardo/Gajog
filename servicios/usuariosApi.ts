// servicios/usuariosApi.ts
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword,
    updatePassword,
    deleteUser,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    setDoc,
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    where,
    arrayUnion
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { Usuario } from '../tipos';
import { RolUsuario } from '../tipos';

export const autenticarUsuario = async (email: string, contrasena: string): Promise<Usuario> => {
  if (!isFirebaseConfigured) {
    console.warn("MODO SIMULADO: Autenticando usuario sin Firebase.");
    if (email === 'admin@test.com' && contrasena === 'admin123') {
      return {
        id: 'mock-admin-id',
        email: 'admin@test.com',
        nombreUsuario: 'Admin (Simulado)',
        rol: RolUsuario.Admin,
      };
    }
    if (email === 'usuario@test.com' && contrasena === 'user123') {
      return {
        id: 'mock-user-id',
        email: 'usuario@test.com',
        nombreUsuario: 'Usuario (Simulado)',
        rol: RolUsuario.Usuario,
      };
    }
    throw new Error("Correo electrónico o contraseña incorrectos.");
  }
  
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, contrasena);
    const user = userCredential.user;
    
    const userDocRef = doc(db, 'usuarios', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return {
        id: user.uid,
        email: user.email!,
        nombreUsuario: userData.nombreUsuario,
        rol: userData.rol,
        fcmTokens: userData.fcmTokens || [],
      };
    } else {
      await signOut(auth);
      throw new Error("El perfil del usuario no está configurado correctamente.");
    }
  } catch (error: any) {
    console.error("Error de autenticación en Firebase:", error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      throw new Error("Correo electrónico o contraseña incorrectos.");
    }
    throw new Error("Ocurrió un error al intentar iniciar sesión.");
  }
};


export const cerrarSesion = async (): Promise<void> => {
  if (!isFirebaseConfigured) {
    console.warn("MODO SIMULADO: Cerrando sesión.");
    return;
  }
  const auth = getAuth();
  await signOut(auth);
};


export const obtenerUsuarios = async (): Promise<Usuario[]> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Devolviendo lista de usuarios vacía.");
        return [];
    }
    const usersCollection = collection(db, "usuarios");
    const userSnapshot = await getDocs(usersCollection);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Usuario));
};


export const agregarUsuario = async (datos: { email: string, nombreUsuario: string, contrasena: string }): Promise<Usuario> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Agregando usuario.");
        return { id: `mock-${Date.now()}`, rol: RolUsuario.Usuario, ...datos };
    }

    const auth = getAuth();
    const q = query(collection(db, "usuarios"), where("nombreUsuario", "==", datos.nombreUsuario));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("El nombre de usuario ya existe.");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, datos.email, datos.contrasena);
        const newUser = userCredential.user;
        
        const nuevoUsuarioData = {
            nombreUsuario: datos.nombreUsuario,
            email: datos.email,
            rol: RolUsuario.Usuario,
            fcmTokens: [],
        };
        
        await setDoc(doc(db, "usuarios", newUser.uid), nuevoUsuarioData);
        
        return { id: newUser.uid, ...nuevoUsuarioData };
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('El correo electrónico ya está en uso.');
        }
        console.error("Error al crear usuario en Firebase:", error);
        throw new Error('No se pudo crear el usuario. Revise la consola para más detalles.');
    }
};

export const actualizarUsuario = async (datos: { nombreUsuario: string, contrasena?: string }, id: string): Promise<Usuario> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Actualizando usuario.");
        const mockUser: Usuario = { id, nombreUsuario: datos.nombreUsuario, email: 'mock@email.com', rol: RolUsuario.Usuario };
        return mockUser;
    }

    const userDocRef = doc(db, "usuarios", id);
    await updateDoc(userDocRef, {
      nombreUsuario: datos.nombreUsuario
    });
    
    const updatedDoc = await getDoc(userDocRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Usuario;
};

export const eliminarUsuario = async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Eliminando usuario.");
        return;
    }
    
    console.warn("La eliminación de usuarios de Auth desde el cliente no es segura y está simulada. Solo se eliminará el documento de Firestore.");
    
    const userDocRef = doc(db, "usuarios", id);
    await deleteDoc(userDocRef);
};

export const enviarCorreoRecuperacion = async (email: string): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn(`MODO SIMULADO: "Enviando" correo de recuperación a ${email}.`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
    }
    const auth = getAuth();
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error("Error al enviar correo de recuperación:", error);
        throw new Error("Ocurrió un error al intentar enviar el correo de recuperación.");
    }
};

export const guardarTokenNotificacionUsuario = async (idUsuario: string, token: string): Promise<void> => {
    if (!isFirebaseConfigured) {
        console.warn("MODO SIMULADO: Guardando token de notificación.");
        return;
    }
    const userDocRef = doc(db, "usuarios", idUsuario);
    await updateDoc(userDocRef, {
        fcmTokens: arrayUnion(token)
    });
};
// scripts/cambiarRolAdmin.js
// Script para cambiar el rol de un usuario a Admin

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const userId = '17oqYGnKASSog5Y3EPSvmGj3AnB2'; // ID del usuario gajogcolombia@gmail.com

async function cambiarRolAdmin() {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      rol: 'Admin'
    });
    console.log('✅ Rol del usuario actualizado a Admin exitosamente');
    console.log('🔄 Recarga la página para ver los cambios');
  } catch (error) {
    console.error('❌ Error al actualizar el rol:', error);
  }
}

// Ejecutar el script
cambiarRolAdmin();
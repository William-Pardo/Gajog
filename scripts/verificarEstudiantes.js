// scripts/verificarEstudiantes.js
// Script para verificar estudiantes en Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBzBgJuCh9t3oakYOHA8jTa4y9Acdkj_8M",
  authDomain: "gajog-app.firebaseapp.com",
  projectId: "gajog-app",
  storageBucket: "gajog-app.firebasestorage.app",
  messagingSenderId: "721398615307",
  appId: "1:721398615307:web:2e16f249c6b17f3a78a60e",
  measurementId: "G-CX862REES3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verificarEstudiantes() {
  console.log('Verificando estudiantes en Firestore...');

  try {
    const estudiantesCollection = collection(db, 'estudiantes');
    const snapshot = await getDocs(estudiantesCollection);

    console.log(`Encontrados ${snapshot.docs.length} estudiantes:`);

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ID: ${doc.id}`);
      console.log(`   Nombres: ${data.nombres} ${data.apellidos}`);
      console.log(`   Número ID: ${data.numeroIdentificacion}`);
      console.log(`   Saldo: ${data.saldoDeudor || 0}`);
      console.log('---');
    });

    if (snapshot.docs.length === 0) {
      console.log('❌ No hay estudiantes en la base de datos.');
      console.log('💡 Necesitas crear estudiantes primero antes de poder asignar compras.');
    }

  } catch (error) {
    console.error('❌ Error al verificar estudiantes:', error);
  }
}

// Ejecutar el script
verificarEstudiantes();
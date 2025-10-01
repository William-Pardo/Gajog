// scripts/poblarTienda.js
// Script para poblar la colección 'implementos' en Firestore con los productos de la tienda

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase (usa las mismas variables de entorno)
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

// Datos de los productos
const productos = [
  {
    nombre: 'Dobok (Uniforme) Nacional',
    descripcion: 'Uniforme oficial para la práctica de Taekwondo. Ligero y resistente, ideal para entrenamiento y competencia.',
    imagenUrl: '/imagenes/dobok-nacional.png',
    categoria: 'Uniformes',
    variaciones: [
      { descripcion: 'Talla 0 (120 cm)', precio: 120000 },
      { descripcion: 'Talla 1 (130 cm)', precio: 130000 },
      { descripcion: 'Talla 2 (140 cm)', precio: 140000 },
      { descripcion: 'Talla 3 (150 cm)', precio: 150000 },
      { descripcion: 'Talla 4 (160 cm)', precio: 160000 },
    ],
  },
  {
    nombre: 'Pechera (Hogu) Reversible',
    descripcion: 'Protector de torso reversible (azul/rojo) aprobado para competencia. Absorbe impactos y ofrece gran movilidad.',
    imagenUrl: '/imagenes/pechera.png',
    categoria: 'ProteccionTorso',
    variaciones: [
      { descripcion: 'Talla 1', precio: 95000 },
      { descripcion: 'Talla 2', precio: 105000 },
      { descripcion: 'Talla 3', precio: 115000 },
      { descripcion: 'Talla 4', precio: 125000 },
    ],
  },
  {
    nombre: 'Casco de Combate',
    descripcion: 'Casco de protección para la cabeza, esencial para el combate seguro. Disponible con y sin careta protectora facial.',
    imagenUrl: '/imagenes/casco.png',
    categoria: 'ProteccionCabeza',
    variaciones: [
      { descripcion: 'Talla S - Sin careta', precio: 80000 },
      { descripcion: 'Talla M - Sin careta', precio: 85000 },
      { descripcion: 'Talla L - Sin careta', precio: 90000 },
      { descripcion: 'Talla M - Con careta', precio: 130000 },
      { descripcion: 'Talla L - Con careta', precio: 140000 },
    ],
  },
  {
    nombre: 'Guantines de Combate',
    descripcion: 'Guantes de protección para manos y nudillos, obligatorios para la competencia.',
    imagenUrl: '/imagenes/guantines.png',
    categoria: 'ProteccionExtremidades',
    variaciones: [
      { descripcion: 'Talla S', precio: 45000 },
      { descripcion: 'Talla M', precio: 50000 },
      { descripcion: 'Talla L', precio: 55000 },
    ],
  },
  {
    nombre: 'Empeineras (Protector de Pie)',
    descripcion: 'Protector de empeine con sensores electrónicos o sin ellos, para entrenamiento y competencia.',
    imagenUrl: '/imagenes/empeineras.png',
    categoria: 'ProteccionExtremidades',
    variaciones: [
      { descripcion: 'Talla S', precio: 60000 },
      { descripcion: 'Talla M', precio: 65000 },
      { descripcion: 'Talla L', precio: 70000 },
    ],
  },
  {
    nombre: 'Braceras (Protector de Antebrazo)',
    descripcion: 'Protección esencial para los antebrazos durante los bloqueos y el combate.',
    imagenUrl: '/imagenes/braceras.png',
    categoria: 'ProteccionExtremidades',
    variaciones: [
      { descripcion: 'Talla S', precio: 50000 },
      { descripcion: 'Talla M', precio: 55000 },
      { descripcion: 'Talla L', precio: 60000 },
    ],
  },
  {
    nombre: 'Canilleras (Protector Tibial)',
    descripcion: 'Protección rígida para las tibias, vital para evitar lesiones en combate.',
    imagenUrl: '/imagenes/canilleras.png',
    categoria: 'ProteccionExtremidades',
    variaciones: [
      { descripcion: 'Talla S', precio: 55000 },
      { descripcion: 'Talla M', precio: 60000 },
      { descripcion: 'Talla L', precio: 65000 },
    ],
  },
  {
    nombre: 'Copa Masculina (Protector inguinal)',
    descripcion: 'Protector inguinal para hombres, de uso obligatorio en combate.',
    imagenUrl: '/imagenes/copa-masculina.png',
    categoria: 'Accesorios',
    variaciones: [
      { descripcion: 'Talla M', precio: 40000 },
      { descripcion: 'Talla L', precio: 45000 },
    ],
  },
  {
    nombre: 'Copa Femenina (Protector inguinal)',
    descripcion: 'Protector inguinal para mujeres, de uso obligatorio en combate.',
    imagenUrl: '/imagenes/copa-femenina.png',
    categoria: 'Accesorios',
    variaciones: [
      { descripcion: 'Talla S', precio: 40000 },
      { descripcion: 'Talla M', precio: 45000 },
    ],
  },
  {
    nombre: 'Dobok (Uniforme) Importado',
    descripcion: 'Uniforme de alta gama para competencia, con tecnología de ventilación y tejido ultraligero.',
    imagenUrl: '/imagenes/dobok-importado.png',
    categoria: 'Uniformes',
    variaciones: [
      { descripcion: 'Talla 2 (140 cm)', precio: 250000 },
      { descripcion: 'Talla 3 (150 cm)', precio: 270000 },
      { descripcion: 'Talla 4 (160 cm)', precio: 290000 },
    ],
  },
];

async function poblarTienda() {
  console.log('Iniciando población de la tienda...');

  try {
    const implementosCollection = collection(db, 'implementos');

    for (const producto of productos) {
      // Agregar IDs únicos a las variaciones
      const variacionesConId = producto.variaciones.map((variacion, index) => ({
        id: `v-${Date.now()}-${index}`,
        ...variacion
      }));

      const productoConId = {
        ...producto,
        variaciones: variacionesConId
      };

      const docRef = await addDoc(implementosCollection, productoConId);
      console.log(`✅ Producto agregado: ${producto.nombre} (ID: ${docRef.id})`);
    }

    console.log('🎉 ¡Tienda poblada exitosamente!');
    console.log(`Se agregaron ${productos.length} productos con sus variaciones.`);

  } catch (error) {
    console.error('❌ Error al poblar la tienda:', error);
  }
}

// Ejecutar el script
poblarTienda();
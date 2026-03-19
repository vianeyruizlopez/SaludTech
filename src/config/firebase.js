const admin = require('firebase-admin');
require('dotenv').config();

const initFirebase = () => {
  if (!admin.apps.length) {
    try {
      // Limpiamos la llave privada para asegurar que Firebase la reconozca
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
          privateKey: privateKey, // Usamos la variable ya limpia
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          clientId: process.env.FIREBASE_CLIENT_ID,
        }),
      });
      console.log('✅ Firebase Admin SDK inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Firebase:', error.message);
      // Opcional: Si Firebase falla pero quieres que el resto del back funcione,
      // puedes no cerrar el proceso, pero aquí lo ideal es saber qué pasó.
    }
  }
  return admin;
};

module.exports = { initFirebase, admin };
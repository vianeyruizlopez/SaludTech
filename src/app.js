require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { initFirebase } = require('./config/firebase');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares Globales ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: ' Enfermería al Día API', version: '1.0.0', status: 'running' });
});

// ─── Rutas Versionadas ────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Manejo de rutas no encontradas ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ─── Manejo global de errores ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ─── Inicialización ───────────────────────────────────────────────────────────
const start = async () => {
  await testConnection();
  initFirebase();
  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api/v1`);
  });
};

start();

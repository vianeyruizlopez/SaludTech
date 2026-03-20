require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { initFirebase } = require('./config/firebase');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: '🏥 SaludTech API - Enfermería al Día', 
    version: '1.0.0', 
    status: 'online' 
  });
});

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'La ruta solicitada no existe' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error detectado:', err.stack);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({ 
    error: true,
    message: message 
  });
});

const start = async () => {
  try {
    await testConnection();
    
    initFirebase();
    
    app.listen(PORT, () => {
      console.log(` Servidor SaludTech corriendo en puerto ${PORT}`);
      console.log(` Endpoints disponibles en: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error(' Error crítico al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

start();
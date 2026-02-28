const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const usuarioController = require('../controllers/usuario.controller');
const habitacionController = require('../controllers/habitacion.controller');
const pacienteController = require('../controllers/paciente.controller');
const notaController = require('../controllers/nota.controller');
const tareaController = require('../controllers/tarea.controller');
const turnoController = require('../controllers/turno.controller');

const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// ─── AUTH ─────────────────────────────────────────────────────────────────────
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/firebase', authController.loginFirebase);

// ─── USUARIOS ─────────────────────────────────────────────────────────────────
router.get('/usuarios', verifyToken, authorizeRoles('Supervisor'), usuarioController.getAll);
router.get('/usuarios/:id', verifyToken, usuarioController.getById);
router.put('/usuarios/:id', verifyToken, authorizeRoles('Supervisor'), usuarioController.update);
router.delete('/usuarios/:id', verifyToken, authorizeRoles('Supervisor'), usuarioController.remove);

// ─── HABITACIONES ─────────────────────────────────────────────────────────────
router.post('/habitaciones', verifyToken, authorizeRoles('Supervisor'), habitacionController.create);
router.get('/habitaciones', verifyToken, habitacionController.getAll);
router.get('/habitaciones/:id', verifyToken, habitacionController.getById);
router.put('/habitaciones/:id', verifyToken, authorizeRoles('Supervisor'), habitacionController.update);
router.patch('/habitaciones/:id/estado', verifyToken, habitacionController.updateEstado);
router.get('/habitaciones/:id/pacientes', verifyToken, habitacionController.getPacientesByHabitacion);

// ─── PACIENTES ────────────────────────────────────────────────────────────────
router.post('/pacientes', verifyToken, pacienteController.create);
router.get('/pacientes', verifyToken, pacienteController.getAll);
router.get('/pacientes/:id', verifyToken, pacienteController.getById);
router.put('/pacientes/:id', verifyToken, pacienteController.update);
router.delete('/pacientes/:id', verifyToken, authorizeRoles('Supervisor'), pacienteController.remove);
router.get('/pacientes/:id/handoff', verifyToken, pacienteController.getHandoff);

// ─── NOTAS ────────────────────────────────────────────────────────────────────
router.post('/notas', verifyToken, notaController.create);
router.get('/notas', verifyToken, notaController.getAll);
router.get('/notas/:id', verifyToken, notaController.getById);

// ─── TAREAS ───────────────────────────────────────────────────────────────────
router.post('/tareas', verifyToken, tareaController.create);
router.get('/tareas', verifyToken, tareaController.getAll);
router.get('/tareas/:id', verifyToken, tareaController.getById);
router.patch('/tareas/:id/estado', verifyToken, tareaController.updateEstado);
router.delete('/tareas/:id', verifyToken, tareaController.remove);

// ─── TURNOS ───────────────────────────────────────────────────────────────────
router.post('/turnos/iniciar', verifyToken, turnoController.iniciar);
router.patch('/turnos/:id/finalizar', verifyToken, turnoController.finalizar);
router.get('/turnos', verifyToken, turnoController.getAll);
router.get('/usuarios/:id/turnos', verifyToken, turnoController.getByUsuario);

module.exports = router;

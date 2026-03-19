const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepo = require('../repositories/usuario.repository');
const { admin } = require('../config/firebase');

const SALT_ROUNDS = 10;

const generateJWT = (user) => {
  return jwt.sign(
    { id_usuario: user.id_usuario, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

// ─── Registro con email/password (Actualizado para RH) ────────────────────────
const register = async ({ nombre_completo, email, password, telefono, rol, curp, turno_asignado }) => {
  const existing = await usuarioRepo.findByEmail(email);
  if (existing) throw { status: 409, message: 'El email ya está registrado' };

  // Encriptamos la contraseña
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Pasamos el CURP (en mayúsculas) y el Turno al repositorio
  const newUser = await usuarioRepo.create({ 
    nombre_completo, 
    email, 
    password_hash, 
    telefono, 
    rol,
    curp: curp ? curp.toUpperCase() : null,
    turno_asignado 
  });

  const token = generateJWT(newUser);
  return { user: newUser, token };
};

// ─── Login con email/password (Se queda igual, funciona perfecto) ──────────────
const login = async ({ email, password }) => {
  const user = await usuarioRepo.findByEmail(email);
  if (!user) throw { status: 401, message: 'Credenciales inválidas' };
  if (!user.activo) throw { status: 403, message: 'Cuenta desactivada' };

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw { status: 401, message: 'Credenciales inválidas' };

  const token = generateJWT(user);
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token };
};

// ─── Login con Firebase (OAuth 2.0) ──────────────────────────────────────────
const loginWithFirebase = async (idToken) => {
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch {
    throw { status: 401, message: 'Firebase token inválido' };
  }

  const { email, name: nombre_completo, uid } = decoded;
  let user = await usuarioRepo.findByEmail(email);

  if (!user) {
    const password_hash = await bcrypt.hash(uid + Date.now(), SALT_ROUNDS);
    // Para usuarios de Firebase, el CURP y Turno se pueden editar después en el panel de RH
    user = await usuarioRepo.create({ 
        nombre_completo: nombre_completo || email, 
        email, 
        password_hash 
    });
  }

  if (!user.activo) throw { status: 403, message: 'Cuenta desactivada' };

  const token = generateJWT(user);
  return { user, token };
};

module.exports = { register, login, loginWithFirebase };
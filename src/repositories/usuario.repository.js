const { pool } = require('../config/database');

const findAll = async () => {
  const result = await pool.query(
    // Agregamos curp y turno_asignado para que RH los vea en la lista
    'SELECT id_usuario, nombre_completo, email, telefono, rol, activo, curp, turno_asignado, fecha_creacion FROM usuarios'
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT id_usuario, nombre_completo, email, telefono, rol, activo, curp, turno_asignado, fecha_creacion FROM usuarios WHERE id_usuario = $1',
    [id]
  );
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const create = async ({ nombre_completo, email, password_hash, telefono, rol, curp, turno_asignado }) => {
  // Ahora insertamos también el CURP y el Turno
  const result = await pool.query(
    'INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol, curp, turno_asignado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_usuario',
    [nombre_completo, email, password_hash, telefono || null, rol || 'Enfermero', curp || null, turno_asignado || null]
  );
  return findById(result.rows[0].id_usuario);
};

const update = async (id, { nombre_completo, telefono, rol, activo, curp, turno_asignado }) => {
  // Permitimos actualizar el CURP y el Turno si RH se equivocó al capturar
  await pool.query(
    'UPDATE usuarios SET nombre_completo = $1, telefono = $2, rol = $3, activo = $4, curp = $5, turno_asignado = $6 WHERE id_usuario = $7',
    [nombre_completo, telefono, rol, activo, curp, turno_asignado, id]
  );
  return findById(id);
};

const remove = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
};

module.exports = { findAll, findById, findByEmail, create, update, remove };
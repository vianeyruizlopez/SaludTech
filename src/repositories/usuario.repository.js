const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.query(
    'SELECT id_usuario, nombre_completo, email, telefono, rol, activo, fecha_creacion FROM usuarios'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id_usuario, nombre_completo, email, telefono, rol, activo, fecha_creacion FROM usuarios WHERE id_usuario = ?',
    [id]
  );
  return rows[0];
};

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0];
};

const create = async ({ nombre_completo, email, password_hash, telefono, rol }) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre_completo, email, password_hash, telefono || null, rol || 'Enfermero']
  );
  return findById(result.insertId);
};

const update = async (id, { nombre_completo, telefono, rol, activo }) => {
  await pool.query(
    'UPDATE usuarios SET nombre_completo = ?, telefono = ?, rol = ?, activo = ? WHERE id_usuario = ?',
    [nombre_completo, telefono, rol, activo, id]
  );
  return findById(id);
};

const remove = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
};

module.exports = { findAll, findById, findByEmail, create, update, remove };

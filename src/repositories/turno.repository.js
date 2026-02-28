const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT t.*, u.nombre_completo FROM historial_turnos t
     JOIN usuarios u ON t.id_usuario = u.id_usuario
     ORDER BY t.inicio_turno DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM historial_turnos WHERE id_turno = ?', [id]);
  return rows[0];
};

const findByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT * FROM historial_turnos WHERE id_usuario = ? ORDER BY inicio_turno DESC', [id_usuario]
  );
  return rows;
};

const iniciar = async (id_usuario) => {
  const [result] = await pool.query(
    'INSERT INTO historial_turnos (id_usuario) VALUES (?)', [id_usuario]
  );
  return findById(result.insertId);
};

const finalizar = async (id) => {
  await pool.query(
    'UPDATE historial_turnos SET fin_turno = NOW() WHERE id_turno = ?', [id]
  );
  return findById(id);
};

module.exports = { findAll, findById, findByUsuario, iniciar, finalizar };

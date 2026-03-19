const { pool } = require('../config/database');

const findAll = async () => {
  const result = await pool.query(
    `SELECT t.*, u.nombre_completo FROM historial_turnos t
     JOIN usuarios u ON t.id_usuario = u.id_usuario
     ORDER BY t.inicio_turno DESC`
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM historial_turnos WHERE id_turno = $1', [id]);
  return result.rows[0];
};

const findByUsuario = async (id_usuario) => {
  const result = await pool.query(
    'SELECT * FROM historial_turnos WHERE id_usuario = $1 ORDER BY inicio_turno DESC', 
    [id_usuario]
  );
  return result.rows;
};

const iniciar = async (id_usuario) => {
  const result = await pool.query(
    'INSERT INTO historial_turnos (id_usuario) VALUES ($1) RETURNING id_turno', 
    [id_usuario]
  );
  return findById(result.rows[0].id_turno);
};

const finalizar = async (id) => {
  await pool.query(
    'UPDATE historial_turnos SET fin_turno = NOW() WHERE id_turno = $1', 
    [id]
  );
  return findById(id);
};

module.exports = { findAll, findById, findByUsuario, iniciar, finalizar };
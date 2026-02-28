// ─── Repository ──────────────────────────────────────────────────────────────
const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT n.*, u.nombre_completo as enfermero, p.nombre_completo as paciente
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     JOIN pacientes p ON n.id_paciente = p.id_paciente
     ORDER BY n.fecha_hora DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT n.*, u.nombre_completo as enfermero, p.nombre_completo as paciente
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     JOIN pacientes p ON n.id_paciente = p.id_paciente
     WHERE n.id_nota = ?`, [id]
  );
  return rows[0];
};

const create = async ({ id_paciente, id_usuario, tipo_evento, descripcion }) => {
  const [result] = await pool.query(
    'INSERT INTO notas_enfermeria (id_paciente, id_usuario, tipo_evento, descripcion) VALUES (?, ?, ?, ?)',
    [id_paciente, id_usuario, tipo_evento, descripcion]
  );
  return findById(result.insertId);
};

module.exports = { findAll, findById, create };

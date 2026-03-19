// ─── Repository (PostgreSQL Version) ─────────────────────────────────────────
const { pool } = require('../config/database');

const findAll = async () => {
  // Cambio: result.rows y quitamos [rows]
  const result = await pool.query(
    `SELECT n.*, u.nombre_completo as enfermero, p.nombre_completo as paciente
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     JOIN pacientes p ON n.id_paciente = p.id_paciente
     ORDER BY n.fecha_hora DESC`
  );
  return result.rows;
};

const findById = async (id) => {
  // Cambio: $1 en lugar de ? y result.rows
  const result = await pool.query(
    `SELECT n.*, u.nombre_completo as enfermero, p.nombre_completo as paciente
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     JOIN pacientes p ON n.id_paciente = p.id_paciente
     WHERE n.id_nota = $1`, [id]
  );
  return result.rows[0];
};

const create = async ({ id_paciente, id_usuario, tipo_evento, descripcion }) => {
  // Cambio: RETURNING para obtener el ID generado en Postgres
  const result = await pool.query(
    'INSERT INTO notas_enfermeria (id_paciente, id_usuario, tipo_evento, descripcion) VALUES ($1, $2, $3, $4) RETURNING id_nota',
    [id_paciente, id_usuario, tipo_evento, descripcion]
  );
  return findById(result.rows[0].id_nota);
};

module.exports = { findAll, findById, create };
const { pool } = require('../config/database');

const findAll = async () => {
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
  const result = await pool.query(
    `SELECT n.*, u.nombre_completo as enfermero, p.nombre_completo as paciente
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     JOIN pacientes p ON n.id_paciente = p.id_paciente
     WHERE n.id_nota = $1`, [id]
  );
  return result.rows[0];
};

// ─── AGREGAMOS EL CAMPO URGENCIA ───
const create = async ({ id_paciente, id_usuario, tipo_evento, descripcion, urgencia }) => {
  const result = await pool.query(
    'INSERT INTO notas_enfermeria (id_paciente, id_usuario, tipo_evento, descripcion, urgencia) VALUES ($1, $2, $3, $4, $5) RETURNING id_nota',
    [id_paciente, id_usuario, tipo_evento, descripcion, urgencia || false]
  );
  return findById(result.rows[0].id_nota);
};

// ─── NUEVA FUNCIÓN PARA LA AUDITORÍA DE RH ───
const findIncidentes = async () => {
  const result = await pool.query(
    `SELECT n.*, u.nombre_completo as enfermero, p.nombre_completo as paciente
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     JOIN pacientes p ON n.id_paciente = p.id_paciente
     WHERE n.urgencia = true OR n.tipo_evento IN ('Incidencia', 'Urgencia')
     ORDER BY n.fecha_hora DESC`
  );
  return result.rows;
};

module.exports = { findAll, findById, create, findIncidentes };
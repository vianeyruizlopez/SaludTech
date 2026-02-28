const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM pacientes');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM pacientes WHERE id_paciente = ?', [id]);
  return rows[0];
};

const create = async ({ nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual }) => {
  const [result] = await pool.query(
    'INSERT INTO pacientes (nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre_completo, fecha_nacimiento || null, id_habitacion || null, diagnostico_ingreso || null, alergias || null, estado_actual || 'Estable']
  );
  return findById(result.insertId);
};

const update = async (id, { nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual }) => {
  await pool.query(
    'UPDATE pacientes SET nombre_completo=?, fecha_nacimiento=?, id_habitacion=?, diagnostico_ingreso=?, alergias=?, estado_actual=? WHERE id_paciente=?',
    [nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual, id]
  );
  return findById(id);
};

const remove = async (id) => {
  await pool.query('DELETE FROM pacientes WHERE id_paciente = ?', [id]);
};

const getHandoff = async (id, horas = 12) => {
  const [rows] = await pool.query(
    `SELECT n.fecha_hora, u.nombre_completo as enfermero, n.tipo_evento, n.descripcion
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     WHERE n.id_paciente = ?
     AND n.fecha_hora > NOW() - INTERVAL ? HOUR
     ORDER BY n.fecha_hora DESC`,
    [id, horas]
  );
  return rows;
};

module.exports = { findAll, findById, create, update, remove, getHandoff };

const { pool } = require('../config/database');

const PRIORITY_ORDER = `CASE t.prioridad WHEN 'Urgente' THEN 1 WHEN 'Alta' THEN 2 WHEN 'Media' THEN 3 ELSE 4 END`;

const findAll = async (estado) => {
  let query = `SELECT t.*, p.nombre_completo as paciente, h.numero_habitacion
               FROM tareas t
               JOIN pacientes p ON t.id_paciente = p.id_paciente
               JOIN habitaciones h ON p.id_habitacion = h.id_habitacion`;
  const params = [];
  if (estado) { query += ' WHERE t.estado = ?'; params.push(estado); }
  query += ` ORDER BY ${PRIORITY_ORDER}`;
  const [rows] = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id]);
  return rows[0];
};

const create = async ({ id_paciente, id_usuario_asignado, descripcion_tarea, prioridad, fecha_limite }, creatorId) => {
  const [result] = await pool.query(
    'INSERT INTO tareas (id_paciente, id_usuario_creador, id_usuario_asignado, descripcion_tarea, prioridad, fecha_limite) VALUES (?, ?, ?, ?, ?, ?)',
    [id_paciente, creatorId, id_usuario_asignado || null, descripcion_tarea, prioridad || 'Media', fecha_limite || null]
  );
  return findById(result.insertId);
};

const updateEstado = async (id, estado) => {
  await pool.query('UPDATE tareas SET estado = ? WHERE id_tarea = ?', [estado, id]);
  return findById(id);
};

const remove = async (id) => {
  await pool.query('DELETE FROM tareas WHERE id_tarea = ?', [id]);
};

module.exports = { findAll, findById, create, updateEstado, remove };

const { pool } = require('../config/database');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM pacientes');
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM pacientes WHERE id_paciente = $1', [id]);
  return result.rows[0];
};

const create = async ({ nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual }) => {
  const query = `
    INSERT INTO pacientes 
    (nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING id_paciente`;
  
  const values = [
    nombre_completo, 
    fecha_nacimiento || null, 
    id_habitacion || null, 
    diagnostico_ingreso || null, 
    alergias || null, 
    estado_actual || 'Estable'
  ];

  const result = await pool.query(query, values);
  return findById(result.rows[0].id_paciente);
};

const update = async (id, { nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual }) => {
  await pool.query(
    'UPDATE pacientes SET nombre_completo=$1, fecha_nacimiento=$2, id_habitacion=$3, diagnostico_ingreso=$4, alergias=$5, estado_actual=$6 WHERE id_paciente=$7',
    [nombre_completo, fecha_nacimiento, id_habitacion, diagnostico_ingreso, alergias, estado_actual, id]
  );
  return findById(id);
};

const remove = async (id) => {
  await pool.query('DELETE FROM pacientes WHERE id_paciente = $1', [id]);
};

const getHandoff = async (id, horas = 12) => {
  const result = await pool.query(
    `SELECT n.fecha_hora, u.nombre_completo as enfermero, n.tipo_evento, n.descripcion
     FROM notas_enfermeria n
     JOIN usuarios u ON n.id_usuario = u.id_usuario
     WHERE n.id_paciente = $1
     AND n.fecha_hora > NOW() - ($2 || ' hours')::interval
     ORDER BY n.fecha_hora DESC`,
    [id, horas]
  );
  return result.rows;
};

module.exports = { findAll, findById, create, update, remove, getHandoff };
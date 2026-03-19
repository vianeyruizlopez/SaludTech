const { pool } = require('../config/database');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM habitaciones');
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM habitaciones WHERE id_habitacion = $1', [id]);
  return result.rows[0];
};

const create = async ({ numero_habitacion, piso, estado }) => {
  const result = await pool.query(
    'INSERT INTO habitaciones (numero_habitacion, piso, estado) VALUES ($1, $2, $3) RETURNING id_habitacion',
    [numero_habitacion, piso || null, estado || 'Disponible']
  );
  return findById(result.rows[0].id_habitacion);
};

const update = async (id, { numero_habitacion, piso, estado }) => {
  await pool.query(
    'UPDATE habitaciones SET numero_habitacion = $1, piso = $2, estado = $3 WHERE id_habitacion = $4',
    [numero_habitacion, piso, estado, id]
  );
  return findById(id);
};

const updateEstado = async (id, estado) => {
  await pool.query('UPDATE habitaciones SET estado = $1 WHERE id_habitacion = $2', [estado, id]);
  return findById(id);
};

const findPacientesByHabitacion = async (id) => {
  const result = await pool.query(
    'SELECT * FROM pacientes WHERE id_habitacion = $1', [id]
  );
  return result.rows;
};

module.exports = { findAll, findById, create, update, updateEstado, findPacientesByHabitacion };
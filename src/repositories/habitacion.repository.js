const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM habitaciones');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM habitaciones WHERE id_habitacion = ?', [id]);
  return rows[0];
};

const create = async ({ numero_habitacion, piso, estado }) => {
  const [result] = await pool.query(
    'INSERT INTO habitaciones (numero_habitacion, piso, estado) VALUES (?, ?, ?)',
    [numero_habitacion, piso || null, estado || 'Disponible']
  );
  return findById(result.insertId);
};

const update = async (id, { numero_habitacion, piso, estado }) => {
  await pool.query(
    'UPDATE habitaciones SET numero_habitacion = ?, piso = ?, estado = ? WHERE id_habitacion = ?',
    [numero_habitacion, piso, estado, id]
  );
  return findById(id);
};

const updateEstado = async (id, estado) => {
  await pool.query('UPDATE habitaciones SET estado = ? WHERE id_habitacion = ?', [estado, id]);
  return findById(id);
};

const findPacientesByHabitacion = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM pacientes WHERE id_habitacion = ?', [id]
  );
  return rows;
};

module.exports = { findAll, findById, create, update, updateEstado, findPacientesByHabitacion };

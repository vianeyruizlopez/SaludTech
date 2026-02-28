const habitacionService = require('../services/habitacion.service');

const getAll = async (req, res) => {
  try { res.json(await habitacionService.getAll()); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getById = async (req, res) => {
  try { res.json(await habitacionService.getById(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const create = async (req, res) => {
  try { res.status(201).json(await habitacionService.create(req.body)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const update = async (req, res) => {
  try { res.json(await habitacionService.update(req.params.id, req.body)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const updateEstado = async (req, res) => {
  try { res.json(await habitacionService.updateEstado(req.params.id, req.body.estado)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getPacientesByHabitacion = async (req, res) => {
  try { res.json(await habitacionService.getPacientesByHabitacion(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

module.exports = { getAll, getById, create, update, updateEstado, getPacientesByHabitacion };

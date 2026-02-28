const pacienteService = require('../services/paciente.service');

const getAll = async (req, res) => {
  try { res.json(await pacienteService.getAll()); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getById = async (req, res) => {
  try { res.json(await pacienteService.getById(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const create = async (req, res) => {
  try { res.status(201).json(await pacienteService.create(req.body)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const update = async (req, res) => {
  try { res.json(await pacienteService.update(req.params.id, req.body)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const remove = async (req, res) => {
  try {
    await pacienteService.remove(req.params.id);
    res.json({ message: 'Paciente eliminado' });
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getHandoff = async (req, res) => {
  try {
    const horas = parseInt(req.query.horas) || 12;
    const data = await pacienteService.getHandoff(req.params.id, horas);
    res.json({ paciente_id: req.params.id, horas, notas: data });
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

module.exports = { getAll, getById, create, update, remove, getHandoff };

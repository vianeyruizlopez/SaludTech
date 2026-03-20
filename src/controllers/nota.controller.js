const notaService = require('../services/nota.service');

const getAll = async (req, res) => {
  try { res.json(await notaService.getAll()); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getById = async (req, res) => {
  try { res.json(await notaService.getById(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const create = async (req, res) => {
  try {
    const nota = await notaService.create(req.body, req.user.id_usuario);
    res.status(201).json(nota);
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

// --- Nueva función para Auditoría de RH ---
const getIncidentes = async (req, res) => {
  try {
    const incidentes = await notaService.getIncidentes();
    res.json(incidentes);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, getIncidentes };
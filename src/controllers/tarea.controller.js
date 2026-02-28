const tareaService = require('../services/tarea.service');

const getAll = async (req, res) => {
  try { res.json(await tareaService.getAll(req.query.estado)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getById = async (req, res) => {
  try { res.json(await tareaService.getById(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const create = async (req, res) => {
  try {
    const tarea = await tareaService.create(req.body, req.user.id_usuario);
    res.status(201).json(tarea);
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const updateEstado = async (req, res) => {
  try { res.json(await tareaService.updateEstado(req.params.id, req.body.estado)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const remove = async (req, res) => {
  try {
    await tareaService.remove(req.params.id);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

module.exports = { getAll, getById, create, updateEstado, remove };

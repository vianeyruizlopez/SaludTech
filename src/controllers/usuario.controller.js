const usuarioService = require('../services/usuario.service');

const getAll = async (req, res) => {
  try {
    const users = await usuarioService.getAll();
    res.json(users);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await usuarioService.getById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await usuarioService.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await usuarioService.remove(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getAll, getById, update, remove };

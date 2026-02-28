const turnoService = require('../services/turno.service');

const getAll = async (req, res) => {
  try { res.json(await turnoService.getAll()); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const iniciar = async (req, res) => {
  try {
    const turno = await turnoService.iniciar(req.user.id_usuario);
    res.status(201).json(turno);
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const finalizar = async (req, res) => {
  try { res.json(await turnoService.finalizar(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

const getByUsuario = async (req, res) => {
  try { res.json(await turnoService.getByUsuario(req.params.id)); }
  catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

module.exports = { getAll, iniciar, finalizar, getByUsuario };

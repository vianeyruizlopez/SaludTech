const turnoRepo = require('../repositories/turno.repository');

const getAll = async () => turnoRepo.findAll();

const getByUsuario = async (id) => turnoRepo.findByUsuario(id);

const iniciar = async (id_usuario) => turnoRepo.iniciar(id_usuario);

const finalizar = async (id) => {
  const turno = await turnoRepo.findById(id);
  if (!turno) throw { status: 404, message: 'Turno no encontrado' };
  if (turno.fin_turno) throw { status: 400, message: 'El turno ya fue finalizado' };
  return turnoRepo.finalizar(id);
};

module.exports = { getAll, getByUsuario, iniciar, finalizar };

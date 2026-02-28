const notaRepo = require('../repositories/nota.repository');

const getAll = async () => notaRepo.findAll();

const getById = async (id) => {
  const n = await notaRepo.findById(id);
  if (!n) throw { status: 404, message: 'Nota no encontrada' };
  return n;
};

const create = async (data, userId) => {
  const { id_paciente, tipo_evento, descripcion } = data;
  if (!id_paciente || !tipo_evento || !descripcion) {
    throw { status: 400, message: 'Campos requeridos: id_paciente, tipo_evento, descripcion' };
  }
  return notaRepo.create({ id_paciente, id_usuario: userId, tipo_evento, descripcion });
};

module.exports = { getAll, getById, create };

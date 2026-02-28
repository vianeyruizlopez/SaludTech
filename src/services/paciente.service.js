const pacienteRepo = require('../repositories/paciente.repository');

const getAll = async () => pacienteRepo.findAll();

const getById = async (id) => {
  const p = await pacienteRepo.findById(id);
  if (!p) throw { status: 404, message: 'Paciente no encontrado' };
  return p;
};

const create = async (data) => pacienteRepo.create(data);

const update = async (id, data) => {
  await getById(id);
  return pacienteRepo.update(id, data);
};

const remove = async (id) => {
  await getById(id);
  await pacienteRepo.remove(id);
};

const getHandoff = async (id, horas) => {
  await getById(id);
  return pacienteRepo.getHandoff(id, horas || 12);
};

module.exports = { getAll, getById, create, update, remove, getHandoff };

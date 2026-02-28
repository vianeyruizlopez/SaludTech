const habitacionRepo = require('../repositories/habitacion.repository');

const getAll = async () => habitacionRepo.findAll();

const getById = async (id) => {
  const h = await habitacionRepo.findById(id);
  if (!h) throw { status: 404, message: 'Habitación no encontrada' };
  return h;
};

const create = async (data) => habitacionRepo.create(data);

const update = async (id, data) => {
  await getById(id);
  return habitacionRepo.update(id, data);
};

const updateEstado = async (id, estado) => {
  await getById(id);
  const validEstados = ['Disponible', 'Ocupada', 'Mantenimiento'];
  if (!validEstados.includes(estado)) throw { status: 400, message: 'Estado inválido' };
  return habitacionRepo.updateEstado(id, estado);
};

const getPacientesByHabitacion = async (id) => {
  await getById(id);
  return habitacionRepo.findPacientesByHabitacion(id);
};

module.exports = { getAll, getById, create, update, updateEstado, getPacientesByHabitacion };

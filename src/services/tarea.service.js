const tareaRepo = require('../repositories/tarea.repository');

const VALID_ESTADOS = ['Pendiente', 'En Progreso', 'Completada'];

const getAll = async (estado) => tareaRepo.findAll(estado);

const getById = async (id) => {
  const t = await tareaRepo.findById(id);
  if (!t) throw { status: 404, message: 'Tarea no encontrada' };
  return t;
};

const create = async (data, creatorId) => {
  if (!data.id_paciente || !data.descripcion_tarea) {
    throw { status: 400, message: 'Campos requeridos: id_paciente, descripcion_tarea' };
  }
  return tareaRepo.create(data, creatorId);
};

const updateEstado = async (id, estado) => {
  await getById(id);
  if (!VALID_ESTADOS.includes(estado)) throw { status: 400, message: 'Estado inválido' };
  return tareaRepo.updateEstado(id, estado);
};

const remove = async (id) => {
  await getById(id);
  await tareaRepo.remove(id);
};

// Función para el botón rápido del enfermero
const toggleEstado = async (id) => {
  const tarea = await getById(id);
  // Si está completada la pasamos a Pendiente, si no, a Completada
  const nuevoEstado = tarea.estado === 'Completada' ? 'Pendiente' : 'Completada';
  return tareaRepo.updateEstado(id, nuevoEstado);
};

module.exports = { 
  getAll, 
  getById, 
  create, 
  updateEstado, 
  remove, 
  toggleEstado 
};
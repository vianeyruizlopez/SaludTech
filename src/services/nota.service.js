const notaRepo = require('../repositories/nota.repository');

const getAll = async () => notaRepo.findAll();

const getById = async (id) => {
  const n = await notaRepo.findById(id);
  if (!n) throw { status: 404, message: 'Nota no encontrada' };
  return n;
};

const create = async (data, userId) => {
  const { id_paciente, tipo_evento, descripcion, urgencia } = data; // Agregamos urgencia
  if (!id_paciente || !tipo_evento || !descripcion) {
    throw { status: 400, message: 'Campos requeridos: id_paciente, tipo_evento, descripcion' };
  }
  return notaRepo.create({ 
    id_paciente, 
    id_usuario: userId, 
    tipo_evento, 
    descripcion, 
    urgencia: urgencia || false // Guardamos si es urgente
  });
};

// --- ESTA FUNCIÓN ES NUEVA PARA RH ---
const getIncidentes = async () => {
  // Llamamos al repo para buscar solo las notas tipo 'Incidencia' o 'Urgencia'
  return notaRepo.findIncidentes(); 
};

module.exports = { getAll, getById, create, getIncidentes };